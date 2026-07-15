# Portfolio — Static + Serverless (Astro + GSAP di Azure Static Web Apps)

CV/portfolio scrollytelling bertema **"The Blueprint That Builds Itself"** untuk seorang
Cloud Solution Architect. 100% statis (prerendered Astro) dengan sedikit **serverless**
(managed functions) untuk contact form, pricing tool, dan view counter. Sertifikat
di-resolve **saat build** (Credly + Microsoft Learn), bukan runtime. Chatbot "Ask my CV"
sengaja diparkir sebagai **Phase 2** (slot-nya sudah ada di Scene 6).

Arsitektur ini dirancang muat di **Azure Static Web Apps Free plan ($0)** — sudah termasuk
HTTPS + custom domain + security headers + managed functions.

---

## 1. Prasyarat

- Node.js 18+ (disarankan 20+)
- Akun GitHub + Azure (Free plan cukup)

## 2. Jalan lokal

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # hasil ke ./dist
npm run preview    # pratinjau hasil build
```

> Catatan: folder `api/` adalah managed functions Azure — tidak ikut di-bundle Astro.
> Untuk menjalankan functions lokal, gunakan Azure Static Web Apps CLI (opsional):
> `npm i -g @azure/static-web-apps-cli` lalu `swa start dist --api-location api`.

## 3. Yang perlu Anda EDIT (cari teks `EDIT:` di kode)

Semua placeholder dipusatkan agar mudah:

| Apa | Di mana |
|-----|---------|
| Nama, role, kontak, domain, CV, OG image | `src/data/profile.js` (pusat placeholder) |
| Timeline karier (Scene 3 pipeline) | `src/data/experience.js` |
| Expertise (Scene 2) | `src/data/expertise.js` |
| Studi kasus / proyek (Scene 4) | `src/data/projects.js` |
| Username Credly + daftar Microsoft Learn | `src/data/certs.js` |
| Domain (canonical/sitemap) | `astro.config.mjs`, `public/robots.txt`, `profile.domain` |

Placeholder ditandai dengan pola `[ ... ]`. Selama masih diawali `[`, item otomatis
disembunyikan atau menampilkan pesan pemandu.

### Font & aset (wajib untuk tampilan final)
- Taruh 3 font woff2 di `public/fonts/` (lihat `public/fonts/README.txt`). Kalau belum
  ada, browser fallback ke system-ui.
- Taruh `og-cover.jpg` (1200×630) dan `CV-[NAMA].pdf` di `public/assets/`
  (lihat `public/assets/README.txt`). **Scrub metadata** (EXIF/PDF) sebelum publish.
- Ganti `public/favicon.svg` dengan inisial Anda.

## 4. Struktur

```
portfolio/
├── astro.config.mjs
├── staticwebapp.config.json      # security headers, routes, 404
├── package.json
├── src/
│   ├── data/                     # ← semua konten & placeholder
│   ├── lib/fetchCerts.mjs        # build-time fetch Credly (+ MS Learn)
│   ├── layouts/Base.astro        # head, SEO, JSON-LD
│   ├── components/
│   │   ├── Nav.astro, Footer.astro
│   │   └── scenes/Scene0..Scene6 # 7 scene
│   ├── scripts/story.js          # GSAP island (pin/scrub/reveal/form)
│   ├── styles/global.css         # token desain, tema, blueprint
│   └── pages/index.astro, 404.astro
├── api/                          # managed functions
│   ├── contact/  pricing/  views/
│   └── shared/   (util, tableClient)
├── public/                       # fonts, assets, favicon, theme-init.js
└── .github/workflows/deploy.yml  # CI/CD + scheduled rebuild
```

## 5. Deploy ke Azure Static Web Apps (Free)

1. Push repo ini ke GitHub.
2. Azure Portal → **Create resource** → **Static Web App** → pilih **Free** plan.
3. Hubungkan ke repo GitHub Anda; saat ditanya build details isi:
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `dist`
   Azure akan otomatis membuat workflow (atau pakai `deploy.yml` yang sudah ada).
4. Simpan **deployment token** SWA ke GitHub → Settings → Secrets →
   `AZURE_STATIC_WEB_APPS_API_TOKEN`.
5. Setiap `git push` ke `main` → build + deploy otomatis. HTTPS, custom domain, dan
   security headers aktif tanpa layanan tambahan.

### Environment variables (Portal → Static Web App → Environment variables)
Lihat `api/.env.example`. Minimal untuk mengaktifkan fitur serverless:
- `TABLES_CONNECTION_STRING` — Storage Account untuk contact submissions, rate-limit,
  price cache, dan view counter. Tanpa ini, functions tetap jalan tapi fitur storage
  nonaktif (contact akan fallback ke email/mailto).
- `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` — untuk pengiriman email contact form
  (opsional; pakai free-tier provider mana pun yang kompatibel, atau ganti `sendEmail()`
  di `api/contact/index.js` dengan Azure Communication Services).

## 6. Keamanan (sudah ter-set)

- **Security headers** via `staticwebapp.config.json`: CSP ketat (tanpa `unsafe-inline`),
  HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- **Tanpa secret di client** — API key email tinggal di server (App Settings).
- **Contact form**: honeypot + rate-limit (Table Storage) + validasi server-side +
  tolak CRLF (anti header injection) + pola **store-then-send** (pesan tersimpan dulu,
  email best-effort).
- **Pricing**: whitelist region/SKU (bukan free-text) + cache + graceful stale.
- Self-host font → CSP tetap `font-src 'self'`.

> Jika Anda menambah resource eksternal (mis. analytics), perbarui `Content-Security-Policy`
> di `staticwebapp.config.json`.

## 7. Housekeeping & retensi (opsional tapi disarankan)

Table Storage tidak punya TTL bawaan. `Submissions` berisi PII → tetapkan retensi
(mis. hapus > 90 hari) dan bersihkan `RateLimit`. Cara paling lean: buat endpoint
`/api/cleanup` (dilindungi token rahasia) dan panggil dari **scheduled rebuild**
(cron mingguan di `deploy.yml` sudah ada — tinggal tambahkan langkah memanggilnya).
Detail pola ini ada di catatan desain; belum diimplementasikan agar tetap minimal.

## 8. Checklist sebelum publish

- [ ] Semua `[PLACEHOLDER]` sudah diganti (cek `src/data/*`)
- [ ] Font woff2 & `og-cover.jpg` & `CV.pdf` sudah ditaruh, favicon diganti
- [ ] `profile.domain`, `astro.config.mjs` site, dan `robots.txt` pakai domain final
- [ ] `npm run build` sukses tanpa error
- [ ] Uji dark mode, mobile, dan **reduced-motion** (semua konten tetap terbaca)
- [ ] Uji "Skip story" dan navigasi keyboard (focus terlihat)
- [ ] (Jika pakai serverless) env vars sudah diset; contact form terkirim
- [ ] Testimonials tidak disertakan tanpa izin pemberi (scene ini memang tidak ada by default)

## 9. Phase 2 — chatbot "Ask my CV" (diparkir)

Slot sudah ada di Scene 6 (`~/ask-my-cv`). Saat siap, tinggal tambah `api/ask/` yang
memanggil LLM (grounding = CV Anda, tanpa vector DB) dan wire input di Scene 6 ke sana —
tanpa mengubah layout. Bahas terpisah agar tetap fokus.

## 10. Lisensi & kredit

- **GSAP** (termasuk ScrollTrigger) kini gratis untuk komersial — dipakai lewat npm.
- Astro (MIT). Kode ini milik Anda untuk diedit bebas.
