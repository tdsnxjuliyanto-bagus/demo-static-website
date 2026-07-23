// ============================================================================
//  PROJECTS / CASE STUDIES  —  Scene 4 "Services Deployed"
//
//  Kartu diambil OTOMATIS dari repo GitHub publik saat build
//  (lihat src/lib/fetchProjects.mjs), supaya setiap kartu bisa ditelusuri
//  ke kode aslinya — bukan klaim yang tak terverifikasi.
//
//  PRASYARAT agar hasilnya bagus:
//    - Repo harus PUBLIK (repo privat tidak akan muncul).
//    - Isi "About" / description repo dengan 1 kalimat: masalah + hasil.
//      Description inilah yang jadi ringkasan di kartu.
//    - Tambahkan Topics di repo (mis. azure, fabric, security) — dipakai
//      untuk menentukan kategori filter & daftar "stack".
// ============================================================================

// EDIT: username GitHub Anda. Kosongkan '' untuk mematikan fetch.
export const githubUser = 'bagusj06';

// ---------------------------------------------------------------------------
//  Repo mana yang ditampilkan (kurasi manual, urutan = urutan tampil).
//  Kosongkan ([]) untuk memakai semua repo publik bertopik 'portfolio'.
//
//  Tulis nama repo persis seperti di GitHub (huruf besar/kecil bebas).
// ---------------------------------------------------------------------------
export const featuredRepos = [
  // 'fabric-medallion-demo',
  // 'defender-storage-malware-lab',
  // 'powerbi-embedded-rls-demo',
];

// Pemetaan manual: nama repo -> kategori filter. Paling kuat, mengalahkan topics.
export const repoTagMap = {
  // 'fabric-medallion-demo': 'Data',
};

// Kalau repo tidak ada di repoTagMap, kategorinya ditebak dari Topics repo.
// EDIT: sesuaikan dengan topics yang benar-benar Anda pakai di GitHub.
export const tagFromTopics = {
  Data: ['data', 'fabric', 'powerbi', 'power-bi', 'synapse', 'analytics', 'etl'],
  Security: ['security', 'defender', 'entra', 'governance', 'compliance'],
  AI: ['ai', 'openai', 'copilot', 'llm', 'rag'],
  Infra: ['azure', 'terraform', 'bicep', 'kubernetes', 'aks', 'iac', 'devops'],
};

// Chip filter di Scene 4. 'All' harus tetap pertama.
export const projectFilters = ['All', 'Data', 'Security', 'Infra', 'AI'];

// ---------------------------------------------------------------------------
//  Cadangan bila fetch GitHub gagal saat build (rate limit / jaringan).
//  Boleh dibiarkan kosong — kalau kosong dan fetch gagal, Scene 4 otomatis
//  menyembunyikan diri daripada menampilkan kartu placeholder.
// ---------------------------------------------------------------------------
export const projects = [
  // {
  //   title: 'fabric-medallion-demo',
  //   tag: 'Data',
  //   summary: 'End-to-end Fabric demo: Bronze/Silver/Gold + semantic model.',
  //   stack: ['Python', 'fabric', 'powerbi'],
  //   link: 'https://github.com/bagusj06/fabric-medallion-demo',
  // },
];
