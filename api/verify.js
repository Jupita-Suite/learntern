import { json, clean } from './_lib.js';
import { products } from '../data/site.mjs';
// Called by the product page after Paystack redirects the buyer back, to show an accurate status message.
// It only reports status. The download link is emailed by the webhook (api/paystack-webhook.js).
export default async function handler(req, res) {
  const reference = clean(req.query.reference, 120);
  if (!/^[\w.=-]{6,120}$/.test(reference) || !process.env.PAYSTACK_SECRET_KEY)
    return json(res, 400, { status: 'unknown' });
  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const d = await r.json();
    const t = d.data;
    const p = products.find((x) => x.slug === t?.metadata?.product);
    const ok = r.ok && t?.status === 'success' && p && t.currency === 'NGN' && t.amount >= Math.round(p.price * 100);
    return json(res, 200, { status: ok ? 'success' : t?.status === 'abandoned' || t?.status === 'failed' ? t.status : 'pending' });
  } catch {
    return json(res, 200, { status: 'pending' });
  }
}
