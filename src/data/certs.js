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
export const credlyUser = 'bagus-juliyanto';

// Fallback statis untuk badge Credly (dipakai bila fetch build-time gagal).
// EDIT: isi manual sebagian badge penting sebagai cadangan.
export const certsFallback = [
  {
    name: 'Professional Cloud Architect Certification',
    issuer: 'Google Cloud',
    image: 'https://images.credly.com/size/680x680/images/71c579e0-51fd-4247-b493-d2fa8167157a/image.png',                                   // opsional: URL gambar badge
    url: 'https://www.credly.com/badges/be61f2c1-56ef-4160-a428-3aa16be533e0',   // link verifikasi
  },
];

// Sertifikat yang HANYA ada di Microsoft Learn (tidak jadi badge Credly).
// EDIT: daftar manual; tautkan ke shareable transcript (profile.msLearnTranscript)
// atau ke link share per-sertifikat.
//
// Format tanggal: 'YYYY-MM-DD' (ISO). Contoh: '2025-03-14'.
//   earnedOn  -> wajib diisi agar tanggal tampil.
//   expiresOn -> OPSIONAL. Kosongkan ('') atau hapus barisnya bila sertifikat
//                tidak kedaluwarsa (mis. Fundamentals: AZ-900, AI-900, DP-900)
//                -> otomatis tampil "No expiration".
//                Sertifikat role-based Microsoft berlaku 1 tahun & dapat
//                diperbarui gratis; isi tanggal kedaluwarsa terbaru di sini.
export const msLearnCerts = [
  {
    name: 'Microsoft Certified: Azure Solutions Architect Expert', // EDIT
    issuer: 'Microsoft',
    earnedOn: '2026-05-26',                            // EDIT
    expiresOn: '2027-05-27',                           // EDIT (atau '' bila tidak expire)
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/7EBEF9896EC2B816?sharingId=1A0384713C1DC829',                            // EDIT
  },
  {
    name: 'Microsoft Certified: DevOps Engineer Expert',
    issuer: 'Microsoft',
    earnedOn: '2026-05-26',
    expiresOn: '2027-05-27',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/BAC3BAA3CF4A0314?sharingId=1A0384713C1DC829',
  },
  // Contoh sertifikat tanpa kedaluwarsa:
  {
     name: 'Microsoft Certified: Azure Fundamentals',
     issuer: 'Microsoft',
     earnedOn: '2025-01-18',
     expiresOn: '',            // -> "No expiration"
     url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/864F0F9BC5A22009?sharingId=1A0384713C1DC829',
   },
];
