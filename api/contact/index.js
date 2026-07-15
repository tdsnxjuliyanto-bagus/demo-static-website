// POST /api/contact  —  validasi + honeypot + rate-limit + store-then-send.
// Table Storage = sumber kebenaran; email = best-effort (boleh gagal).
const { json, ipHash, isEmail, hasCRLF, clampStr, hourWindow, dayKey } = require('../shared/util');
const { getTable, isRateLimited } = require('../shared/tableClient');

const RATE_LIMIT = 5; // maks submit per IP per jam

// Kirim email best-effort via Resend (jika RESEND_API_KEY diset). Tanpa dep.
async function sendEmail(payload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;         // EDIT (env): email tujuan Anda
  const from = process.env.CONTACT_FROM;     // EDIT (env): sender terverifikasi di domain Anda
  if (!key || !to || !from) return { sent: false, error: 'email not configured' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        reply_to: payload.email,
        subject: `[Portfolio] ${payload.subject || 'New message'}`,
        text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
      }),
    });
    if (!res.ok) return { sent: false, error: 'resend ' + res.status };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e.message };
  }
}

module.exports = async function (context, req) {
  const body = req.body || {};

  // 1. Honeypot: jika terisi -> balas 200 palsu (jangan beri tahu bot)
  if (body.company_website) { return json(context, 200, { ok: true }); }

  // 2. Validasi (server-side otoritatif)
  const name = clampStr(body.name, 100).trim();
  const email = String(body.email || '').trim();
  const subject = clampStr(body.subject, 150).replace(/[\r\n]/g, ' ').trim();
  const message = clampStr(body.message, 3000).trim();
  const errors = [];
  if (!name) errors.push({ field: 'name', msg: 'required' });
  if (!isEmail(email)) errors.push({ field: 'email', msg: 'invalid' });
  if (hasCRLF(email)) errors.push({ field: 'email', msg: 'invalid' });
  if (message.length < 5) errors.push({ field: 'message', msg: 'too short' });
  if (errors.length) return json(context, 400, { ok: false, errors });

  // 3. Rate-limit
  const iph = ipHash(req);
  if (await isRateLimited(iph, hourWindow(), RATE_LIMIT)) {
    return json(context, 429, { ok: false, msg: 'rate_limited' });
  }

  // 4. Store-then-send: tulis dulu (sumber kebenaran)
  const now = new Date();
  const ticks = 9999999999999 - now.getTime();
  const rowKey = `${ticks}-${Math.random().toString(36).slice(2, 8)}`;
  const table = await getTable('Submissions');

  if (table) {
    try {
      await table.createEntity({
        partitionKey: dayKey(now),
        rowKey,
        name, email, subject, message,
        receivedAt: now.toISOString(),
        sourceIpHash: iph,
        emailStatus: 'pending',
        attempts: 0,
        clientToken: clampStr(body.clientToken, 64),
      });
    } catch (e) {
      context.log.error('store failed', e.message);
      return json(context, 500, { ok: false }); // satu-satunya kegagalan yang perlu fallback client
    }
  }

  // 5. Email best-effort; hasil apa pun -> 200 karena pesan sudah tersimpan
  const mail = await sendEmail({ name, email, subject, message });
  if (table) {
    try {
      await table.updateEntity({
        partitionKey: dayKey(now), rowKey,
        emailStatus: mail.sent ? 'sent' : 'failed',
        emailError: mail.error || '',
      }, 'Merge');
    } catch (e) { /* abaikan */ }
  }

  // Jika tidak ada storage DAN email gagal, beri sinyal 500 supaya client fallback mailto
  if (!table && !mail.sent) return json(context, 500, { ok: false });

  return json(context, 200, { ok: true });
};
