// ============================================================================
//  PROFILE  —  PUSAT SEMUA PLACEHOLDER
//  Cukup edit file ini untuk mengganti identitas Anda. Cari teks "EDIT:".
//  Semua nilai bertanda [ ... ] adalah placeholder yang harus Anda isi.
// ============================================================================

export const profile = {
  // --- Identitas dasar -------------------------------------------------------
  fullName: 'Bagus Juliyanto',            // EDIT: mis. "Bagus Prasetyo"
  role: 'Presales Consultant',      // EDIT: peran utama
  //roleSecondary: 'Infrastructure Engineer', // EDIT: peran kedua (opsional)
  tagline: 'Designing secure, scalable, and business-driven cloud solutions.', // EDIT
  location: 'Jakarta, Indonesia',          // EDIT: mis. "Jakarta, Indonesia"
  available: true,                        // true = tampilkan badge "available"
  availableText: 'Available for professional collaboration',

  // Ringkasan (dipakai di Scene 1 / About)
  summary:
    'I help organizations design, modernize, secure, and optimize their cloud and hybrid infrastructure — turning technical complexity into measurable business outcomes.', // EDIT

  // --- Kontak ----------------------------------------------------------------
  email: 'bagus.juliyanto@outlook.com',                      // EDIT: mis. "you@domain.com"
  phone: '',              // EDIT (opsional; kosongkan '' untuk sembunyikan)
  linkedin: 'bagusjuliyanto',       // EDIT: bagian setelah linkedin.com/in/
  github: 'bagusj06',           // EDIT: username GitHub

  // --- SEO / domain ----------------------------------------------------------
  domain: 'https://www.bagusjuliyanto.cloud',     // EDIT: domain final (tanpa trailing slash)
  ogImage: '/assets/b-cover.png',       // EDIT: taruh gambar 1200x630 di public/assets/
  cvFile: '/assets/CV-Bagus-Juliyanto.pdf',       // EDIT: taruh PDF CV di public/assets/

  // --- Verifikasi sertifikat via Microsoft Learn -----------------------------
  // Shareable transcript link (Microsoft Learn > Certifications > Share).
  msLearnTranscript: '[LINK_SHAREABLE_MS_LEARN]', // EDIT (opsional)
};

// Statistik ringkas untuk Scene 1 (About). EDIT angka & label sesuai Anda.
export const stats = [
  { value: '6+', label: 'Years in cloud & infra' },
  { value: '7+', label: 'Certifications' },
  { value: '15+', label: 'Projects delivered' },
  { value: '5+', label: 'Industries served' },
];

// Layanan yang Anda tawarkan (Scene tambahan / footer). EDIT bebas.
export const services = [
  'Cloud architecture & migration',
  'Infrastructure as Code',
  'Security & governance',
  'Cost optimization (FinOps)',
];
