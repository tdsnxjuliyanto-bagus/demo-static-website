// Wrapper Table Storage. Graceful: kalau connection string belum diset,
// mengembalikan null -> function tetap jalan (skip storage/rate-limit).
let TableClient;
try {
  ({ TableClient } = require('@azure/data-tables'));
} catch (e) {
  TableClient = null;
}

const CONN =
  process.env.TABLES_CONNECTION_STRING ||
  process.env.AZURE_STORAGE_CONNECTION_STRING ||
  '';

const cache = new Map();

async function getTable(name) {
  if (!TableClient || !CONN) return null;
  if (cache.has(name)) return cache.get(name);
  const client = TableClient.fromConnectionString(CONN, name);
  try { await client.createTable(); } catch (e) { /* sudah ada */ }
  cache.set(name, client);
  return client;
}

// Rate-limit sederhana per ipHash per jam. Return true bila DIBLOKIR.
async function isRateLimited(ipHash, windowKey, limit) {
  const table = await getTable('RateLimit');
  if (!table) return false; // tanpa storage, jangan blok (situs CV, low risk)
  const pk = ipHash, rk = windowKey;
  let count = 0;
  try {
    const e = await table.getEntity(pk, rk);
    count = e.count || 0;
  } catch (e) { /* belum ada */ }
  if (count >= limit) return true;
  try {
    await table.upsertEntity({ partitionKey: pk, rowKey: rk, count: count + 1, expiresAt: Date.now() + 3600000 }, 'Replace');
  } catch (e) { /* abaikan */ }
  return false;
}

module.exports = { getTable, isRateLimited };
