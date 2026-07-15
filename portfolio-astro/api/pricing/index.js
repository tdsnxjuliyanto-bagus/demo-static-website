// GET /api/pricing?region=&size=&usage=
// Whitelist ketat + cache Table Storage (24h) + Azure Retail Prices API + stale fallback.
const { json } = require('../shared/util');
const { getTable } = require('../shared/tableClient');

// --- Whitelist (EDIT sesuai kebutuhan; jangan pakai free-text) -------------
const REGIONS = {
  indonesiacentral: 'Indonesia Central',
  southeastasia: 'Southeast Asia',
  eastus: 'East US',
};
const SIZES = {
  Standard_D2s_v5: 'D2s v5 (2 vCPU / 8 GB)',
  Standard_D4s_v5: 'D4s v5 (4 vCPU / 16 GB)',
  Standard_E4s_v5: 'E4s v5 (4 vCPU / 32 GB)',
};
const USAGE = { always_on: 730, business_hours: 180 };
const CACHE_TTL_MS = 24 * 3600 * 1000;
const API = 'https://prices.azure.com/api/retail/prices';

async function retail(region, size, priceType, term) {
  let filter =
    `serviceName eq 'Virtual Machines' and armRegionName eq '${region}' ` +
    `and armSkuName eq '${size}' and priceType eq '${priceType}'`;
  if (term) filter += ` and reservationTerm eq '${term}'`;
  const url = `${API}?$filter=${encodeURIComponent(filter)}&currencyCode='USD'`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const items = (data.Items || []).filter(
      (i) =>
        !/spot|low priority/i.test(i.skuName || '') &&
        !/windows/i.test(i.productName || '')
    );
    if (priceType === 'Consumption') {
      const hour = items.find((i) => /hour/i.test(i.unitOfMeasure));
      return hour ? hour.retailPrice : null;
    }
    // Reservation: retailPrice untuk term penuh
    return items.length ? items[0].retailPrice : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function compute(region, size, usage) {
  const hours = USAGE[usage];
  const payg = await retail(region, size, 'Consumption');
  if (payg == null) return null;
  const paygMonthly = Math.round(payg * hours);

  // Reserved 1yr (opsional) -> monthly = harga term / 12. Jangan diperkirakan.
  const resv1yr = await retail(region, size, 'Reservation', '1 Year');
  const reservedMonthly = resv1yr != null ? Math.round(resv1yr / 12) : null;
  const savingsPct = reservedMonthly != null && paygMonthly > 0
    ? Math.round((1 - reservedMonthly / paygMonthly) * 100)
    : null;

  // Perbandingan region lain (payg saja)
  const compare = [];
  for (const r of Object.keys(REGIONS)) {
    const p = r === region ? payg : await retail(r, size, 'Consumption');
    if (p != null) compare.push({ region: r, label: REGIONS[r], payg_monthly: Math.round(p * hours) });
  }

  const out = {
    region, size, usage,
    size_label: SIZES[size], region_label: REGIONS[region],
    payg_monthly: paygMonthly,
    currency: 'USD',
    compare,
    as_of: new Date().toISOString().slice(0, 10),
    stale: false,
  };
  if (reservedMonthly != null) { out.reserved_1yr_monthly = reservedMonthly; out.savings_pct = savingsPct; }
  return out;
}

module.exports = async function (context, req) {
  const q = req.query || {};
  const region = String(q.region || '').toLowerCase();
  const size = String(q.size || '');
  const usage = String(q.usage || 'always_on');

  if (!REGIONS[region] || !SIZES[size] || !USAGE[usage]) {
    return json(context, 400, { ok: false, msg: 'invalid_params', allowed: { regions: Object.keys(REGIONS), sizes: Object.keys(SIZES), usage: Object.keys(USAGE) } });
  }

  const cacheKey = `${region}|${size}|${usage}`;
  const table = await getTable('PriceCache');

  // Baca cache
  let cached = null;
  if (table) {
    try {
      const e = await table.getEntity('vm', cacheKey);
      cached = JSON.parse(e.payload);
      if (Date.now() - (e.fetchedAt || 0) < CACHE_TTL_MS) {
        return json(context, 200, cached, { 'Cache-Control': 'public, max-age=3600' });
      }
    } catch (e) { /* miss */ }
  }

  // Fetch + hitung
  const fresh = await compute(region, size, usage);
  if (fresh) {
    if (table) {
      try {
        await table.upsertEntity({ partitionKey: 'vm', rowKey: cacheKey, payload: JSON.stringify(fresh), fetchedAt: Date.now() }, 'Replace');
      } catch (e) { /* abaikan */ }
    }
    return json(context, 200, fresh, { 'Cache-Control': 'public, max-age=3600' });
  }

  // Fetch gagal -> cache basi lebih baik daripada error
  if (cached) { cached.stale = true; return json(context, 200, cached); }
  return json(context, 503, { ok: false, msg: 'pricing_unavailable' });
};
