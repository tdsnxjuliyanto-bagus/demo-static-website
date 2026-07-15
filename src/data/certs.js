// ============================================================================
//  CERTIFICATIONS  —  Scene 5 "Credentials Minted"
//
//  Tiga kelompok:
//    1) Akreditasi     -> sumber Credly.
//    2) Sertifikasi    -> sumber Credly + Microsoft Learn.
//    3) Applied Skills -> sumber Microsoft Learn.
//
//  Badge Credly yang tampil dikontrol lewat credlyFeatured; sisanya masuk
//  ke balik tombol "Show all" per kelompok.
//
//  Badge Credly di-fetch saat BUILD (src/lib/fetchCerts.mjs), lalu
//  diklasifikasikan otomatis lewat credlyRules di bawah.
// ============================================================================

// EDIT: username Credly Anda (bagian setelah credly.com/users/).
// Kosongkan '' untuk mematikan fetch Credly.
export const credlyUser = 'bagus-juliyanto';

// ---------------------------------------------------------------------------
//  BADGE CREDLY MANA YANG TAMPIL BY DEFAULT
//
//  Isi credlyFeatured dengan NAMA BADGE PERSIS seperti di Credly.
//  -> Hanya badge di daftar ini yang tampil langsung.
//  -> Sisanya disembunyikan di balik tombol "Show all" per kelompok.
//  Kosongkan ([]) untuk memakai VISIBLE_LIMITS di bawah sebagai gantinya.
//
//  Sertifikat Microsoft Learn (msLearnCerts / appliedSkills) SELALU tampil —
//  daftarnya sudah Anda kurasi manual, jadi tidak perlu disaring lagi.
// ---------------------------------------------------------------------------
export const credlyFeatured = [
  'Professional Cloud Architect Certification',
  'AWS Certified Cloud Practitioner',
  'AWS Certified Solutions Architect - Associate'
  // 'Azure Infrastructure Accreditation',
];

export const COLLAPSE_MIN = {
  accreditation: 4,
  certification: 4,
  'applied-skill': 4,
};

// Dipakai HANYA bila credlyFeatured kosong. Infinity = tampilkan semua.
export const VISIBLE_LIMITS = {
  accreditation: 5,           // 5 terbaru
  certification: Infinity,    // semua
  'applied-skill': Infinity,  // semua
};

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
    name: 'Professional Cloud Architect Certification',
    issuer: 'Google Cloud',
    image: 'https://images.credly.com/size/680x680/images/71c579e0-51fd-4247-b493-d2fa8167157a/image.png',                                   // URL badge, atau '/certs/xxx.png'
    url: 'https://www.credly.com/badges/be61f2c1-56ef-4160-a428-3aa16be533e0',
    earnedOn: '2025-12-29',
    expiresOn: '2027-12-29',
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
    name: 'Microsoft Certified: Azure Solutions Architect Expert', // EDIT
    issuer: 'Microsoft',
    image: '/assets/microsoft-certified-azure-solutions-architect-expert-badge.svg', // EDIT (opsional): '/certs/nama.png'
    earnedOn: '2026-05-26',                            // EDIT
    expiresOn: '2027-05-27',                           // EDIT (atau '' bila tidak expire)
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/7EBEF9896EC2B816?sharingId=1A0384713C1DC829',
  },
  {
    name: 'Microsoft Certified: DevOps Engineer Expert',
    issuer: 'Microsoft',
    image: '/assets/microsoft-certified-devops-engineer-expert-badge.svg',
    earnedOn: '2026-05-26',
    expiresOn: '2027-05-27',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/BAC3BAA3CF4A0314?sharingId=1A0384713C1DC829',
  },
  {
    name: 'Microsoft Certified: Azure Administrator Associate', // EDIT
    issuer: 'Microsoft',
    image: '/assets/microsoft-certified-associate-badge.svg', // EDIT (opsional): '/certs/nama.png'
    earnedOn: '2026-03-23',                            // EDIT
    expiresOn: '2027-03-24',                           // EDIT (atau '' bila tidak expire)
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/AD06EE2CDD1F5F98?sharingId=1A0384713C1DC829',
  },
  {
    name: 'Microsoft Certified: Azure Developer Associate', // EDIT
    issuer: 'Microsoft',
    image: '/assets/microsoft-certified-associate-badge.svg', // EDIT (opsional): '/certs/nama.png'
    earnedOn: '2025-05-8',                            // EDIT
    expiresOn: '2027-05-9',                           // EDIT (atau '' bila tidak expire)
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/28B9F435191213AA?sharingId=1A0384713C1DC829',
  },
  {
    name: 'Microsoft Certified: Windows Server Hybrid Administrator Associate', // EDIT
    issuer: 'Microsoft',
    image: '/assets/microsoft-certified-associate-badge.svg', // EDIT (opsional): '/certs/nama.png'
    earnedOn: '2025-11-4',                            // EDIT
    expiresOn: '2027-11-5',                           // EDIT (atau '' bila tidak expire)
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/9D6BC2797433BC1C?sharingId=1A0384713C1DC829',
  },
  {
     name: 'Microsoft Certified: Azure Fundamentals',
     issuer: 'Microsoft',
     image: '/assets/microsoft-certified-fundamentals-badge.svg',
     earnedOn: '2025-01-18',
     expiresOn: '',            // -> "No expiration"
     url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/864F0F9BC5A22009?sharingId=1A0384713C1DC829',
  },
];

// ---------------------------------------------------------------------------
//  APPLIED SKILLS dari Microsoft Learn.
//  Applied Skills TIDAK kedaluwarsa -> cukup earnedOn.
// ---------------------------------------------------------------------------
export const appliedSkills = [
  {
    name: 'Microsoft Applied Skills: Configure secure access to your workloads using Azure networking', // EDIT
    issuer: 'Microsoft Learn',
    image: '/assets/zero-state-applied-skills.svg',                    // EDIT (opsional): '/certs/nama.png'
    earnedOn: '2026-07-2',     // EDIT
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/BagusJuliyanto-0113/E557D17203B0C79D?sharingId=1A0384713C1DC829',     // EDIT
  },
];
