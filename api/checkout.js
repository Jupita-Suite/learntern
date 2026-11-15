import { json, validEmail, clean } from './_lib.js';
// Starts a Paystack payment. Needs: PAYSTACK_SECRET_KEY, SITE_URL. Prices are read from data/site.mjs (never trusted from the browser).
import { products } from '../data/site.mjs';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return json(res, 200, { message: 'Thank you.' });
  const p = products.find((x) => x.slug === b.product);
  const email = clean(b.email, 254);
  if (!p) return json(res, 400, { error: 'Unknown product.' });
  if (!validEmail(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (!p.price || !process.env.PAYSTACK_SECRET_KEY)
    return json(res, 503, { error: 'Checkout is not open yet. This product will be available to purchase soon.' });
  const r = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount: Math.round(p.price * 100), currency: 'NGN',
      callback_url: `${process.env.SITE_URL}/books/${p.slug}/`, metadata: { product: p.slug, name: clean(b.name, 120) } }),
  });
  const d = await r.json();
  if (!r.ok || !d.data?.authorization_url) return json(res, 502, { error: 'Could not start checkout. Please try again.' });
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify({ message: 'Redirecting to secure payment…', url: d.data.authorization_url }));
}
