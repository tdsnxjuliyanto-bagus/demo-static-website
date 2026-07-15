// ============================================================================
//  fetchCerts.mjs  —  dijalankan saat BUILD (bukan runtime).
//  Menarik badge Credly via endpoint publik badges.json (aman dari CORS karena
//  berjalan di Node saat build), mengklasifikasikannya menjadi
//  accreditation / certification / applied-skill, lalu menggabungkan dengan
//  data Microsoft Learn (statis). Selalu graceful: bila fetch gagal, pakai
//  fallback -> situs tetap tampil, hanya mungkin basi.
// ============================================================================

import {
  credlyUser,
  credlyRules,
  credlyOverrides,
  credlyFeatured,
  VISIBLE_LIMITS,
  accreditationsFallback,
  certsFallback,
  msLearnCerts,
  appliedSkills,
} from '../data/certs.js';

const TIMEOUT_MS = 6000;

// Placeholder '[...]' dan string kosong dianggap belum diisi.
const filled = (v) => typeof v === 'string' && v.trim() !== '' && !v.startsWith('[');
const clean = (arr) => (arr || []).filter((c) => c && filled(c.name));

// Normalisasi nama badge untuk pencocokan.
// Nama di Credly kerap memakai karakter tipografis (en-dash "–", em-dash "—",
// non-breaking space) yang mirip tapi TIDAK sama dengan hyphen/spasi biasa.
// Tanpa ini, 'AWS ... – Associate' tidak akan cocok dengan '... - Associate'.
const norm = (s) =>
  String(s || '')
    .replace(/[\u2010-\u2015\u2212]/g, '-') // segala jenis dash -> "-"
    .replace(/[\u00A0\u2007\u202F]/g, ' ')  // non-breaking space -> spasi
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// Urut terbaru dulu; yang tanpa tanggal ditaruh paling akhir.
const byNewest = (a, b) => {
  const x = filled(a.earnedOn) ? a.earnedOn : '';
  const y = filled(b.earnedOn) ? b.earnedOn : '';
  if (!x && !y) return 0;
  if (!x) return 1;
  if (!y) return -1;
  return y.localeCompare(x);
};

// Override manual dicocokkan dengan nama ternormalisasi juga.
const overrideMap = new Map(
  Object.entries(credlyOverrides || {}).map(([k, v]) => [norm(k), v])
);

function classify(name) {
  const hit = overrideMap.get(norm(name));
  if (hit) return hit;
  for (const re of credlyRules.appliedSkill || []) if (re.test(name)) return 'applied-skill';
  for (const re of credlyRules.accreditation || []) if (re.test(name)) return 'accreditation';
  return 'certification';
}

const isoDate = (v) => (typeof v === 'string' ? v.slice(0, 10) : '');

async function fetchCredly() {
  const user = (credlyUser || '').trim();
  if (!filled(user)) return null;

  const url = `https://www.credly.com/users/${encodeURIComponent(user)}/badges.json`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'portfolio-build/1.0' },
    });
    if (!res.ok) throw new Error(`Credly HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const mapped = list
      .map((b) => {
        const name = b?.badge_template?.name || b?.name || '';
        return {
          name,
          issuer:
            b?.issuer?.entities?.[0]?.entity?.name ||
            b?.badge_template?.issuer?.entities?.[0]?.entity?.name ||
            'Credly',
          image: b?.image_url || b?.badge_template?.image_url || '',
          url: b?.id ? `https://www.credly.com/badges/${b.id}` : '',
          earnedOn: isoDate(b?.issued_at_date || b?.issued_at || ''),
          expiresOn: isoDate(b?.expires_at_date || b?.expires_at || ''),
          type: classify(name),
          source: 'Credly',
        };
      })
      .filter((b) => b.name);
    return mapped.length ? mapped : null;
  } catch (err) {
    console.warn('[fetchCerts] Credly fetch gagal, pakai fallback:', err.message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Bagi satu kelompok menjadi {shown, extra}.
//  - Bila credlyFeatured diisi: badge Credly di daftar itu -> shown,
//    sisanya -> extra. Item Microsoft Learn selalu shown.
//  - Bila kosong: pakai VISIBLE_LIMITS (Infinity = semua tampil).
function split(items, type) {
  const featured = new Set(
    (credlyFeatured || []).filter(Boolean).map(norm)
  );

  if (featured.size) {
    const isShown = (c) => c.source !== 'Credly' || featured.has(norm(c.name));
    return {
      shown: items.filter(isShown),
      extra: items.filter((c) => !isShown(c)),
      total: items.length,
    };
  }

  const limit = (VISIBLE_LIMITS || {})[type];
  if (!Number.isFinite(limit)) return { shown: items, extra: [], total: items.length };
  return { shown: items.slice(0, limit), extra: items.slice(limit), total: items.length };
}

// Mengembalikan tiga kelompok siap render.
export async function getCertifications() {
  const live = await fetchCredly();
  const stale = !live;

  const credly = live || [
    ...clean(accreditationsFallback).map((c) => ({ ...c, type: 'accreditation', source: 'Credly' })),
    ...clean(certsFallback).map((c) => ({ ...c, type: 'certification', source: 'Credly' })),
  ];

  // Peringatan saat build bila ada nama di credlyFeatured yang tidak cocok
  // dengan badge mana pun — biasanya karena salah ketik atau beda karakter.
  const names = new Set(credly.map((c) => norm(c.name)));
  (credlyFeatured || []).filter(Boolean).forEach((f) => {
    if (!names.has(norm(f))) {
      console.warn(`[fetchCerts] credlyFeatured tidak cocok dengan badge mana pun: "${f}"`);
    }
  });

  const ofType = (t) => clean(credly.filter((c) => c.type === t));

  // 1) Akreditasi: Credly saja.
  const accreditations = ofType('accreditation').sort(byNewest);

  // 2) Sertifikasi: Credly + Microsoft Learn.
  const certifications = [
    ...ofType('certification'),
    ...clean(msLearnCerts).map((c) => ({ ...c, source: 'Microsoft Learn', type: 'certification' })),
  ].sort(byNewest);

  // 3) Applied Skills: Microsoft Learn (+ Credly bila ada yang terklasifikasi).
  const applied = [
    ...ofType('applied-skill'),
    ...clean(appliedSkills).map((c) => ({ ...c, source: 'Microsoft Learn', type: 'applied-skill' })),
  ].sort(byNewest);

  return {
    accreditations: split(accreditations, 'accreditation'),
    certifications: split(certifications, 'certification'),
    appliedSkills: split(applied, 'applied-skill'),
    stale,
  };
}
