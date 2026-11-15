import crypto from 'node:crypto';
import { json } from './_lib.js';
// Validates the signed token, then redirects to the private file URL stored in env (FILE_URL_<SLUG>).
export default function handler(req, res) {
  const [slug, exp, mac] = String(req.query.token || '').split('.');
  const good = crypto.createHmac('sha256', process.env.DOWNLOAD_SECRET || '').update(`${slug}.${exp}`).digest('hex');
  if (!mac || mac.length !== good.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good)) || Date.now() > Number(exp))
    return json(res, 403, { error: 'This download link is invalid or has expired. Please contact support.' });
  const url = process.env['FILE_URL_' + slug.toUpperCase().replace(/-/g, '_')];
  if (!url) return json(res, 404, { error: 'File not available yet.' });
  res.setHeader('Location', url); return res.status(302).end();
}
