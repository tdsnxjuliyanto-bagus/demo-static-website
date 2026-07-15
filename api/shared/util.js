// Helper bersama untuk semua function.
const crypto = require('crypto');

function json(context, status, body, extraHeaders) {
  context.res = {
    status,
    headers: Object.assign(
      { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      extraHeaders || {}
    ),
    body: JSON.stringify(body),
  };
}

// Hash IP (jangan simpan IP mentah)
function ipHash(req) {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-azure-clientip'] ||
    'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

// Tolak CRLF (cegah email header injection)
function hasCRLF(s) {
  return /[\r\n]/.test(s || '');
}

function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 150 && !hasCRLF(s);
}

function clampStr(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
}

function hourWindow(d) {
  const t = d || new Date();
  return t.toISOString().slice(0, 13).replace(/[:T]/g, '-'); // YYYY-MM-DD-HH
}

function dayKey(d) {
  return (d || new Date()).toISOString().slice(0, 10); // YYYY-MM-DD
}

module.exports = { json, ipHash, hasCRLF, isEmail, clampStr, hourWindow, dayKey };
