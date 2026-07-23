// ============================================================================
//  PROFILE  —  PUSAT SEMUA PLACEHOLDER
//  Cukup edit file ini untuk mengganti identitas Anda. Cari teks "EDIT:".
//  Semua nilai bertanda [ ... ] adalah placeholder yang harus Anda isi.
// ============================================================================

export const profile = {
  // --- Identitas dasar -------------------------------------------------------
  fullName: 'Bagus Juliyanto',            // EDIT: mis. "Bagus Prasetyo"
  role: 'Presales Consultant',      // EDIT: peran utama
  roleSecondary: 'Solution Architect', // EDIT: peran kedua (opsional)
  tagline: 'Designing secure, scalable, and business-driven cloud solutions.', // EDIT
  location: 'Jakarta, Indonesia',          // EDIT: mis. "Jakarta, Indonesia"
  available: true,                        // true = tampilkan badge "available"
  availableText: 'Available for professional collaboration',

  // Ringkasan (dipakai di Scene 1 / About)
  summary:
    'I help organizations design, modernize, secure, and optimize their cloud and hybrid infrastructure — turning technical complexity into measurable business outcomes.', // EDIT

  // Deskripsi khusus untuk SEO & pratinjau share. Idealnya <= 125 karakter —
  // Google memotong di ~155, dan kartu sosial di ~125 (lebih pendek di mobile).
  // Kosongkan '' untuk memakai summary di atas (mungkin akan terpotong).
  metaDescription: 'Azure cloud architect & presales consultant. I turn technical complexity into measurable business outcomes.', // EDIT

  // Nama situs untuk kartu share (Discord/Slack menampilkannya di atas judul).
  siteName: 'Bagus Juliyanto Resume', // EDIT — biasanya nama Anda atau nama brand

  // --- Kontak ----------------------------------------------------------------
  email: 'bagus.juliyanto@outlook.com',                      // EDIT: mis. "you@domain.com"
  phone: '',              // EDIT (opsional; kosongkan '' untuk sembunyikan)
  linkedin: 'bagusjuliyanto',       // EDIT: bagian setelah linkedin.com/in/
  github: 'bagusj06',           // EDIT: username GitHub

  // --- SEO / domain ----------------------------------------------------------
  domain: 'https://www.bagusjuliyanto.cloud',     // EDIT: domain final (tanpa trailing slash)
  ogImage: '/assets/b-cover.png',       // EDIT: taruh gambar 1200x630 di public/assets/
  ogImageWidth: 1200,                    // EDIT bila ukuran file berbeda
  ogImageHeight: 630,                    // EDIT
  cvRequest: true,
  cvRequestSubject: 'CV Request',        // subject yang diisikan ke form kontak

  // --- Verifikasi sertifikat via Microsoft Learn -----------------------------
  // Shareable transcript link (Microsoft Learn > Certifications > Share).
  msLearnTranscript: '[LINK_SHAREABLE_MS_LEARN]', // EDIT (opsional)
};

// ---------------------------------------------------------------------------
//  Statistik ringkas untuk Scene 1 (About).
//
//  Pakai `auto` agar angkanya DIHITUNG SAAT BUILD dan tidak pernah basi:
//    auto: 'years'          -> dari tahun mulai paling awal di experience.js
//    auto: 'certs'          -> jumlah kelompok Certifications di Scene 5
//    auto: 'applied-skills' -> jumlah Applied Skills
//    auto: 'projects'       -> jumlah kartu di Scene 4
//
//  `suffix` opsional ('+' / '' ). Untuk angka yang benar-benar tepat seperti
//  jumlah sertifikat, kosongkan saja — "9" lebih kuat daripada "9+".
//
//  Angka yang tidak bisa diturunkan dari data (mis. jumlah industri) tetap
//  ditulis manual dengan `value`.
// ---------------------------------------------------------------------------
export const stats = [
  { auto: 'years', suffix: '+', label: 'Years in cloud & infra' },
  { auto: 'certs', label: 'Certifications' },
  { auto: 'projects', suffix: '+', label: 'Projects on GitHub' },
  { value: '5+', label: 'Industries served' }, // EDIT: manual
];

// Layanan yang Anda tawarkan (Scene tambahan / footer). EDIT bebas.
export const services = [
  'Cloud architecture & migration',
  'Infrastructure as Code',
  'Security & governance',
  'Cost optimization',
];
