import crypto from 'node:crypto';
import { json, sendEmail, esc } from './_lib.js';
import { products } from '../data/site.mjs';
// Paystack webhook: verifies signature, confirms the paid amount matches the product price,
// then emails a time-limited signed download link.
// Needs: PAYSTACK_SECRET_KEY, DOWNLOAD_SECRET, SITE_URL, RESEND_API_KEY, EMAIL_FROM, and FILE_URL_<SLUG> per product (e.g. FILE_URL_CREDIT_RISK_101, a private file URL).
export const config = { api: { bodyParser: false } };
const raw = (req) => new Promise((ok) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => ok(d)); });
const safeEqual = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  console.log('webhook: request received');
  if (!process.env.PAYSTACK_SECRET_KEY || !process.env.DOWNLOAD_SECRET) { console.error('webhook: PAYSTACK_SECRET_KEY or DOWNLOAD_SECRET missing in this deployment'); return json(res, 503, { error: 'Not configured' }); }
  const body = await raw(req);
  const sig = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(body).digest('hex');
  if (!safeEqual(sig, String(req.headers['x-paystack-signature'] || ''))) { console.error('webhook: invalid signature (key mismatch between Paystack mode and PAYSTACK_SECRET_KEY, or body altered)'); return json(res, 401, { error: 'Invalid signature' }); }
  let ev;
  try { ev = JSON.parse(body); } catch { return json(res, 400, { error: 'Bad payload' }); }
  console.log('webhook: verified event', ev.event, 'reference', ev.data?.reference);
  if (ev.event === 'charge.success') {
    const d = ev.data || {};
    const p = products.find((x) => x.slug === d.metadata?.product), email = d.customer?.email;
    // Ignore payments that do not match what we sell (wrong product, currency or amount in kobo).
    if (!p || !p.price || !email || d.status !== 'success' || d.currency !== 'NGN' || d.amount !== Math.round(p.price * 100))
    { console.warn('webhook: ignored charge.success', { product: d.metadata?.product, status: d.status, currency: d.currency, amount: d.amount, hasEmail: !!email }); return json(res, 200, { received: true, ignored: true }); }
    const exp = Date.now() + 72 * 3600 * 1000;
    const token = `${p.slug}.${exp}.` + crypto.createHmac('sha256', process.env.DOWNLOAD_SECRET).update(`${p.slug}.${exp}`).digest('hex');
    const sent = await sendEmail({ to: email, subject: `Your LearnTern order: ${p.name}`, html: `<p>Thank you for your purchase of <strong>${esc(p.name)}</strong>.</p><p><a href="${esc(String(process.env.SITE_URL).replace(/\/+$/, ''))}/api/download?token=${token}">Download your file</a> (link valid for 72 hours).</p><p>Payment reference: ${esc(d.reference || '')}. Need help? Reply to this email or contact support.</p>` });
    // A non-200 makes Paystack retry the webhook, so a failed email does not silently lose the order.
    if (!sent) return json(res, 502, { error: 'Email could not be sent' });
    console.log('webhook: download email sent for reference', d.reference);
  }
  return json(res, 200, { received: true });
}
