// ============================================================================
//  stats.mjs  —  menghitung angka statistik OTOMATIS saat build.
//
//  Tujuannya: angka di Scene 1 (About) tidak pernah basi dan tidak pernah
//  bertentangan dengan isi halaman lain. "Years" bertambah sendiri seiring
//  waktu; "Certifications" mengikuti jumlah sertifikat yang benar-benar
//  ditampilkan di Scene 5.
//
//  Membaca format yang SUDAH dipakai di experience.js (mis. "Jul 2021 - Aug
//  2023" / "May 2025 - Present"), jadi tidak perlu mengubah data yang ada.
// ============================================================================

// Ambil semua tahun 4 digit dari sebuah string periode.
const yearsIn = (s) => (String(s || '').match(/\b(19|20)\d{2}\b/g) || []).map(Number);

/**
 * Lama pengalaman (tahun penuh) dihitung dari tahun MULAI paling awal di
 * experience[] sampai tahun sekarang.
 *
 * Sengaja memakai tahun, bukan tanggal presisi: kartu pipeline hanya memuat
 * bulan+tahun, dan mengklaim "5 tahun 3 bulan" dari data sekasar itu justru
 * terkesan dibuat-buat.
 */
export function yearsOfExperience(experience = []) {
  const all = experience.flatMap((e) => yearsIn(e.period));
  if (!all.length) return 0;
  const earliest = Math.min(...all);
  return Math.max(0, new Date().getFullYear() - earliest);
}

/**
 * Jumlah sertifikasi = seluruh isi kelompok Certifications (Credly + Microsoft
 * Learn), memakai `total` agar yang tersembunyi di balik tombol tetap terhitung.
 */
export function certCount(certs = {}) {
  return certs?.certifications?.total ?? 0;
}

/** Jumlah Applied Skills. */
export function appliedSkillCount(certs = {}) {
  return certs?.appliedSkills?.total ?? 0;
}

/** Jumlah proyek/studi kasus yang tampil. */
export function projectCount(projects = []) {
  return Array.isArray(projects) ? projects.length : 0;
}

/**
 * Isi nilai stats yang bertanda `auto`.
 *
 * Di profile.js, sebuah stat boleh menulis:
 *    { auto: 'years',    label: 'Years in cloud & infra', suffix: '+' }
 * atau tetap manual:
 *    { value: '5+',      label: 'Industries served' }
 *
 * Stat manual dibiarkan apa adanya — sebagian angka (mis. jumlah industri)
 * memang tidak bisa diturunkan dari data.
 */
export function resolveStats(stats = [], { experience = [], certs = {}, projects = [] } = {}) {
  const compute = {
    years: () => yearsOfExperience(experience),
    certs: () => certCount(certs),
    'applied-skills': () => appliedSkillCount(certs),
    projects: () => projectCount(projects),
  };

  return stats.map((s) => {
    if (!s.auto || !compute[s.auto]) return s;
    const n = compute[s.auto]();
    // Angka 0 biasanya berarti data belum siap (mis. fetch gagal) — lebih baik
    // tidak menampilkan "0+" yang menyesatkan.
    if (!n) return { ...s, value: '—' };
    return { ...s, value: `${n}${s.suffix ?? ''}` };
  });
}
