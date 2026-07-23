// ============================================================================
//  fetchProjects.mjs  —  menarik repo GitHub saat BUILD untuk Scene 4.
//
//  Kenapa dari GitHub, bukan diketik manual: kartu yang menaut ke repo nyata
//  bisa diverifikasi siapa pun. Deskripsi yang tidak bisa dibuktikan justru
//  melemahkan portfolio seorang arsitek.
//
//  KONSEKUENSINYA (baca ini): kartu hanya sebagus repo aslinya. Repo tanpa
//  description akan tampil kosong, dan repo privat tidak akan muncul sama
//  sekali. Rapikan dulu description + topics di GitHub, baru hasilnya bagus.
// ============================================================================

import {
  githubUser,
  featuredRepos,
  repoTagMap,
  tagFromTopics,
  projects as manualProjects,
} from '../data/projects.js';

const TIMEOUT_MS = 8000;

const filled = (v) => typeof v === 'string' && v.trim() !== '' && !v.startsWith('[');
const norm = (s) => String(s || '').trim().toLowerCase();

/**
 * Tentukan kategori filter (Data/Security/Infra/AI) untuk sebuah repo:
 *   1) repoTagMap  -> pemetaan manual per nama repo (paling kuat)
 *   2) topics repo -> dicocokkan dengan tagFromTopics
 *   3) fallback    -> 'Infra'
 */
function pickTag(repo) {
  const byName = (repoTagMap || {})[repo.name];
  if (byName) return byName;

  const topics = (repo.topics || []).map(norm);
  for (const [tag, keys] of Object.entries(tagFromTopics || {})) {
    if (keys.some((k) => topics.includes(norm(k)))) return tag;
  }
  return 'Infra';
}

async function fetchRepos() {
  const user = (githubUser || '').trim();
  if (!filled(user)) return null;

  const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-build/1.0',
  };
  // Opsional: naikkan rate limit dari 60/jam (anonim) ke 5000/jam.
  // Di GitHub Actions, teruskan secrets.GITHUB_TOKEN sebagai env GITHUB_TOKEN.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn('[fetchProjects] GitHub fetch gagal, pakai daftar manual:', err.message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function getProjects() {
  const repos = await fetchRepos();

  // Fetch gagal -> pakai array manual di projects.js (boleh kosong).
  if (!repos) {
    const manual = (manualProjects || []).filter((p) => filled(p.title));
    return { projects: manual, stale: true };
  }

  const wanted = (featuredRepos || []).filter(Boolean);
  const wantedSet = new Set(wanted.map(norm));

  let picked = repos.filter((r) => !r.fork && !r.archived && !r.private);

  if (wantedSet.size) {
    picked = picked.filter((r) => wantedSet.has(norm(r.name)));
    // Peringatan bila ada nama repo yang salah ketik — tanpa ini, repo yang
    // dimaksud hilang diam-diam dan Anda mengira fetch-nya rusak.
    const found = new Set(picked.map((r) => norm(r.name)));
    wanted.forEach((w) => {
      if (!found.has(norm(w))) {
        console.warn(`[fetchProjects] featuredRepos tidak ditemukan / bukan repo publik: "${w}"`);
      }
    });
    // Urutkan sesuai urutan yang Anda tulis di featuredRepos.
    picked.sort((a, b) => wanted.findIndex((w) => norm(w) === norm(a.name))
                        - wanted.findIndex((w) => norm(w) === norm(b.name)));
  } else {
    // Tanpa kurasi: ambil repo bertopik 'portfolio', terbaru dulu.
    picked = picked.filter((r) => (r.topics || []).map(norm).includes('portfolio'));
  }

  const projects = picked.map((r) => ({
    title: r.name,
    tag: pickTag(r),
    summary: r.description || '',
    // Bahasa utama + topics jadi "stack" di kartu.
    stack: [r.language, ...(r.topics || [])].filter(Boolean).slice(0, 4),
    link: r.html_url,
    stars: r.stargazers_count || 0,
    updatedOn: (r.pushed_at || r.updated_at || '').slice(0, 10),
  }));

  return { projects, stale: false };
}
