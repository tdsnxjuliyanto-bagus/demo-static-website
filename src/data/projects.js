// ============================================================================
//  PROJECTS / CASE STUDIES  —  Scene 4 "Services Deployed"
//  Untuk profil presales, ini lebih tepat berupa STUDI KASUS/DEMO daripada
//  repo. Field "tags" dipakai untuk filter. EDIT bebas.
// ============================================================================

export const projects = [
  {
    title: '[Judul Studi Kasus 1]',     // EDIT
    tag: 'Data',                          // kategori untuk filter (Data/Security/Infra/AI)
    summary: '[Ringkasan 1–2 kalimat: masalah, solusi, hasil.]', // EDIT
    stack: ['Microsoft Fabric', 'Power BI'], // EDIT: teknologi utama
    link: '',                             // opsional: URL detail; kosong = tanpa link
  },
  {
    title: '[Judul Studi Kasus 2]',
    tag: 'Security',
    summary: '[Ringkasan 1–2 kalimat.]',
    stack: ['Defender for Storage', 'Azure Policy'],
    link: '',
  },
  {
    title: '[Judul Studi Kasus 3]',
    tag: 'Infra',
    summary: '[Ringkasan 1–2 kalimat.]',
    stack: ['AKS', 'Bicep'],
    link: '',
  },
  {
    title: '[Judul Studi Kasus 4]',
    tag: 'AI',
    summary: '[Ringkasan 1–2 kalimat.]',
    stack: ['Copilot Studio', 'Azure OpenAI'],
    link: '',
  },
  {
    title: '[Judul Studi Kasus 5]',
    tag: 'Data',
    summary: '[Ringkasan 1–2 kalimat.]',
    stack: ['Synapse', 'Data Factory'],
    link: '',
  },
  {
    title: '[Judul Studi Kasus 6]',
    tag: 'Infra',
    summary: '[Ringkasan 1–2 kalimat.]',
    stack: ['Azure VM', 'AVD'],
    link: '',
  },
];

// Daftar filter yang tampil sebagai chip (urutan bebas). "All" wajib pertama.
export const projectFilters = ['All', 'Data', 'Security', 'Infra', 'AI'];
