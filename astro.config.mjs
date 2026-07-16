import { defineConfig } from 'astro/config';

// EDIT: ganti dengan domain final Anda (dipakai untuk sitemap / canonical / OG url).
const SITE_URL = 'https://www.bagusjuliyanto.cloud';

export default defineConfig({
  site: SITE_URL,
  // 100% statis: seluruh halaman di-prerender saat build.
  output: 'static',
  build: {
    // asset di-inline kalau kecil; sisanya file terpisah dengan hash.
    assets: 'assets',
  },
  // Astro tidak mem-bundle folder /api — itu domain Azure Static Web Apps (managed functions).
  vite: {
    build: {
      // batasi inline agar font/gambar tetap jadi file (cache-friendly).
      assetsInlineLimit: 2048,
    },
  },
});
