// ============================================================================
//  CERTIFICATIONS  —  Scene 5 "Credentials Minted"
//
//  Tiga kelompok:
//    1) Akreditasi   -> sumber Credly. Hanya 5 TERBARU yang tampil.
//    2) Sertifikasi  -> sumber Credly + Microsoft Learn. Tampil SEMUA.
//    3) Applied Skills -> sumber Microsoft Learn. Tampil semua.
//
//  Badge Credly di-fetch saat BUILD (src/lib/fetchCerts.mjs), lalu
//  diklasifikasikan otomatis lewat credlyRules di bawah.
// ============================================================================

// EDIT: username Credly Anda (bagian setelah credly.com/users/).
// Kosongkan '' untuk mematikan fetch Credly.
export const credlyUser = '[USERNAME_CREDLY]';

// Berapa akreditasi TERBARU yang ditampilkan (sisanya disembunyikan).
export const ACCREDITATION_LIMIT = 5;

// ---------------------------------------------------------------------------
//  Klasifikasi badge Credly berdasarkan NAMA badge.
//  Dicek berurutan: appliedSkill -> accreditation -> sisanya 'certification'.
//  EDIT: tambah pola bila penamaan badge Anda berbeda.
// ---------------------------------------------------------------------------
export const credlyRules = {
  appliedSkill: [/applied skill/i],
  accreditation: [/accreditation/i, /accredited/i],
};

// Override manual bila pola di atas salah menebak.
// Kunci = nama badge PERSIS seperti di Credly.
// Nilai = 'accreditation' | 'certification' | 'applied-skill'
export const credlyOverrides = {
  // 'Azure Infrastructure Accreditation': 'accreditation',
  // 'Contoh Badge': 'certification',
};

// ---------------------------------------------------------------------------
//  Fallback statis (dipakai HANYA bila fetch Credly gagal saat build).
//  EDIT: isi beberapa yang penting sebagai cadangan.
// ---------------------------------------------------------------------------
export const accreditationsFallback = [
  // {
  //   name: 'Nama Akreditasi',
  //   issuer: 'Microsoft',
  //   image: '',                  // URL badge Credly, atau '/certs/nama.png'
  //   url: 'https://www.credly.com/badges/[ID]',
  //   earnedOn: '2025-01-15',
  //   expiresOn: '',
  // },
];

export const certsFallback = [
  {
    name: '[Nama Sertifikat Credly 1]',
    issuer: 'Microsoft',
    image: '',                                   // URL badge, atau '/certs/xxx.png'
    url: 'https://www.credly.com/badges/[ID]',
    earnedOn: '[YYYY-MM-DD]',
    expiresOn: '[YYYY-MM-DD]',
  },
];

// ---------------------------------------------------------------------------
//  SERTIFIKASI dari Microsoft Learn (yang tidak ada badge Credly-nya).
//
//  Format tanggal: 'YYYY-MM-DD'. Contoh: '2025-03-14'.
//    earnedOn  -> wajib agar tanggal tampil.
//    expiresOn -> OPSIONAL. Kosongkan ('') bila tidak kedaluwarsa
//                 (mis. Fundamentals: AZ-900, AI-900, DP-900) -> "No expiration".
//    image     -> OPSIONAL. Taruh file di public/certs/ lalu tulis '/certs/az-305.png'.
//                 Kalau kosong, otomatis tampil inisial (mis. "AZ").
// ---------------------------------------------------------------------------
export const msLearnCerts = [
  {
    name: '[AZ-305: Azure Solutions Architect Expert]', // EDIT
    issuer: 'Microsoft Learn',
    image: '',                                           // EDIT (opsional)
    earnedOn: '[YYYY-MM-DD]',                            // EDIT
    expiresOn: '[YYYY-MM-DD]',                           // EDIT (atau '')
    url: '[LINK_VERIFIKASI]',                            // EDIT
  },
  {
    name: '[AZ-400: DevOps Engineer Expert]',
    issuer: 'Microsoft Learn',
    image: '',
    earnedOn: '[YYYY-MM-DD]',
    expiresOn: '[YYYY-MM-DD]',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/BAC3BAA3CF4A0314?sharingId=1A0384713C1DC829',
  },
];

// ---------------------------------------------------------------------------
//  APPLIED SKILLS dari Microsoft Learn.
//  Applied Skills TIDAK kedaluwarsa -> cukup earnedOn.
// ---------------------------------------------------------------------------
export const appliedSkills = [
  {
    name: '[Configure secure access to your workloads using Azure networking]', // EDIT
    issuer: 'Microsoft Learn',
    image: '',                    // EDIT (opsional): '/certs/nama.png'
    earnedOn: '[YYYY-MM-DD]',     // EDIT
    url: '[LINK_VERIFIKASI]',     // EDIT
  },
];
