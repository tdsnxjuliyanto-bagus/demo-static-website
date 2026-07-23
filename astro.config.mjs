import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// EDIT: ganti dengan domain final Anda (dipakai untuk sitemap / canonical / OG url).
const SITE_URL = 'https://www.bagusjuliyanto.cloud';

export default defineConfig({
  site: SITE_URL,
  // Menghasilkan sitemap-index.xml + sitemap-0.xml saat build.
  // Wajib ada `site` di atas, kalau tidak integration ini diam saja.
  //
  // PENTING: versi di-pin ~3.5.1 di package.json. @astrojs/sitemap >= 3.6
  // butuh Astro 5 dan MEMATIKAN build di Astro 4 dengan error
  // "Cannot read properties of undefined (reading 'reduce')".
  // Jangan naikkan ke ^3 tanpa ikut menaikkan Astro ke v5.
  integrations: [sitemap()],
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
