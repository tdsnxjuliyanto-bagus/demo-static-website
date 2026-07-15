// GET  /api/views        -> { count }              (baca saja)
// POST /api/views         -> { count } (increment)  (hitung 1 kunjungan)
const { json } = require('../shared/util');
const { getTable } = require('../shared/tableClient');

module.exports = async function (context, req) {
  const table = await getTable('Stats');
  if (!table) return json(context, 200, { count: null }); // tanpa storage: diam-diam nonaktif

  const pk = 'site', rk = 'views';
  let count = 0;
  try { const e = await table.getEntity(pk, rk); count = e.count || 0; } catch (e) { /* belum ada */ }

  if (req.method === 'POST') {
    count += 1;
    try { await table.upsertEntity({ partitionKey: pk, rowKey: rk, count }, 'Replace'); } catch (e) { /* abaikan */ }
  }
  return json(context, 200, { count }, { 'Cache-Control': 'no-store' });
};
