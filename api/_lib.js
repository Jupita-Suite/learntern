// Shared helpers for serverless endpoints.
export const json = (res, code, body) => res.status(code).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
export const validEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length < 255;
// Spam check that browser autofill cannot trip (unlike a hidden text field): real browsers send how long the page has been open; simple bots do not.
export const looksAutomated = (b) => !(Number(b?._e) >= 1500);
export const clean = (s, n = 2000) => String(s || '').trim().slice(0, n);

// Sends email through Resend if RESEND_API_KEY is set. Returns true/false.
// Pass { newsletter: true } to send from NEWSLETTER_FROM (e.g. "LearnTern <updates@learntern.co>"); falls back to EMAIL_FROM.
export async function sendEmail({ to, subject, html, replyTo, newsletter }) {
  const key = process.env.RESEND_API_KEY, from = (newsletter && process.env.NEWSLETTER_FROM) || process.env.EMAIL_FROM;
  if (!key || !from) { console.error('sendEmail: RESEND_API_KEY or EMAIL_FROM missing in this deployment'); return false; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo || (newsletter ? 'hello@learntern.co' : undefined) }),
  });
  if (!r.ok) console.error('sendEmail: Resend rejected the email', r.status, (await r.text().catch(() => '')).slice(0, 500));
  return r.ok;
}
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
