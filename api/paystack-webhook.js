import crypto from 'node:crypto';
import { json, sendEmail, esc } from './_lib.js';
// Paystack webhook: verifies signature, then emails a time-limited signed download link.
// Needs: PAYSTACK_SECRET_KEY, DOWNLOAD_SECRET, SITE_URL, RESEND_API_KEY, EMAIL_FROM, and FILE_URL_<SLUG> per product (e.g. FILE_URL_CREDIT_RISK_101, a private file URL).
export const config = { api: { bodyParser: false } };
const raw = (req) => new Promise((ok) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => ok(d)); });
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const body = await raw(req);
  const sig = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(body).digest('hex');
  if (sig !== req.headers['x-paystack-signature']) return json(res, 401, { error: 'Invalid signature' });
  const ev = JSON.parse(body);
  if (ev.event === 'charge.success') {
    const slug = ev.data?.metadata?.product, email = ev.data?.customer?.email;
    const exp = Date.now() + 72 * 3600 * 1000;
    const token = `${slug}.${exp}.` + crypto.createHmac('sha256', process.env.DOWNLOAD_SECRET).update(`${slug}.${exp}`).digest('hex');
    await sendEmail({ to: email, subject: 'Your LearnTern order', html: `<p>Thank you for your purchase.</p><p><a href="${esc(process.env.SITE_URL)}/api/download?token=${token}">Download your file</a> (link valid for 72 hours).</p>` });
  }
  return json(res, 200, { received: true });
}
