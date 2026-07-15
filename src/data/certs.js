// ============================================================================
//  CERTIFICATIONS  —  Scene 5 "Credentials Minted"
//
//  Dua sumber, keduanya di-resolve saat BUILD (statis, tanpa /api runtime):
//   1) Credly  -> di-fetch otomatis saat build (lihat src/lib/fetchCerts.mjs)
//   2) Microsoft Learn -> daftar terkurasi manual di bawah (msLearnCerts)
//
//  "certsFallback" dipakai bila fetch Credly gagal saat build (endpoint tak
//  resmi bisa berubah) -> situs tetap menampilkan daftar, hanya mungkin basi.
// ============================================================================

// EDIT: username Credly Anda (bagian setelah credly.com/users/).
// Kosongkan '' untuk mematikan fetch Credly (hanya pakai msLearnCerts).
export const credlyUser = '[USERNAME_CREDLY]';

// Fallback statis untuk badge Credly (dipakai bila fetch build-time gagal).
// EDIT: isi manual sebagian badge penting sebagai cadangan.
export const certsFallback = [
  {
    name: '[Nama Sertifikat Credly 1]',
    issuer: 'Microsoft',
    image: '',                                   // opsional: URL gambar badge
    url: 'https://www.credly.com/badges/[ID]',   // link verifikasi
  },
];

// Sertifikat yang HANYA ada di Microsoft Learn (tidak jadi badge Credly).
// EDIT: daftar manual; tautkan ke shareable transcript (profile.msLearnTranscript)
// atau ke link share per-sertifikat.
export const msLearnCerts = [
  {
    name: '[AZ-305: Azure Solutions Architect Expert]', // EDIT
    issuer: 'Microsoft Learn',
    date: '[TAHUN]',
    url: '[LINK_VERIFIKASI]',                            // EDIT
  },
  {
    name: '[AZ-400: DevOps Engineer Expert]',
    issuer: 'Microsoft Learn',
    date: '[TAHUN]',
    url: '[LINK_VERIFIKASI]',
  },
];
