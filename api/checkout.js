import crypto from 'node:crypto';
import { json, validEmail, clean } from './_lib.js';
// Starts a Paystack payment. Needs: PAYSTACK_SECRET_KEY, SITE_URL. Prices are read from data/site.mjs (never trusted from the browser).
import { products } from '../data/site.mjs';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = req.body || {};
  const p = products.find((x) => x.slug === b.product);
  const email = clean(b.email, 254);
  if (!p) return json(res, 400, { error: 'Unknown product.' });
  if (!validEmail(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (!p.price || !process.env.PAYSTACK_SECRET_KEY || !process.env.SITE_URL)
    return json(res, 503, { error: 'Checkout is not open yet. This product will be available to purchase soon.' });
  const siteUrl = process.env.SITE_URL.replace(/\/+$/, '');
  // Paystack amounts are in kobo (1 NGN = 100 kobo): 7,500 NGN -> 750,000.
  const amount = Math.round(p.price * 100);
  const reference = `LT-${p.slug}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  let r, d;
  try {
    r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, currency: 'NGN', reference,
        callback_url: `${siteUrl}/payment-success/?product=${p.slug}`, cancel_action: `${siteUrl}/books/${p.slug}/?checkout=cancelled`, metadata: { product: p.slug, name: clean(b.name, 120) } }),
    });
    d = await r.json();
  } catch {
    return json(res, 502, { error: 'Could not reach the payment provider. Please try again.' });
  }
  if (!r.ok || !d.data?.authorization_url) return json(res, 502, { error: 'Could not start checkout. Please try again.' });
  return json(res, 200, { message: 'Redirecting to secure payment…', url: d.data.authorization_url });
}
