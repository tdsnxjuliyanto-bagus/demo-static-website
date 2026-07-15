// ============================================================================
//  fetchCerts.mjs  —  dijalankan saat BUILD (bukan runtime).
//  Menarik badge Credly via endpoint publik badges.json (aman dari CORS karena
//  ini berjalan di Node saat build, bukan di browser), lalu menggabungkannya
//  dengan sertifikat Microsoft Learn (statis). Selalu graceful: kalau fetch
//  gagal, pakai certsFallback -> situs tetap tampil, hanya mungkin basi.
// ============================================================================

import { credlyUser, certsFallback, msLearnCerts } from '../data/certs.js';

const TIMEOUT_MS = 6000;

async function fetchCredly() {
  const user = (credlyUser || '').trim();
  if (!user || user.startsWith('[')) return null; // belum diisi -> lewati

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
      .map((b) => ({
        name: b?.badge_template?.name || b?.name || 'Badge',
        issuer: b?.issuer?.entities?.[0]?.entity?.name || b?.issuer?.name || 'Issuer',
        image: b?.image_url || b?.badge_template?.image_url || '',
        url: b?.id ? `https://www.credly.com/badges/${b.id}` : '',
      }))
      .filter((b) => b.name);
    return mapped.length ? mapped : null;
  } catch (err) {
    console.warn('[fetchCerts] Credly fetch gagal, pakai fallback:', err.message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Mengembalikan { credly: [...], msLearn: [...], stale: boolean }
export async function getCertifications() {
  const credlyLive = await fetchCredly();
  const credly = credlyLive || certsFallback.filter((c) => c.name && !c.name.startsWith('['));
  const msLearn = (msLearnCerts || []).filter((c) => c.name && !c.name.startsWith('['));
  return {
    credly,
    msLearn,
    stale: !credlyLive, // true bila memakai fallback statis
  };
}
