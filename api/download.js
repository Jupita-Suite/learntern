import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { get } from '@vercel/blob';
import { json } from './_lib.js';
// Validates the signed token, then serves the product file.
// Preferred: FILE_PATH_<SLUG> = pathname of the file in a PRIVATE Vercel Blob store (e.g. FILE_PATH_CREDIT_RISK_101=Credit_Risk_101.pdf).
//   The server fetches it with the Blob SDK (OIDC when the store is connected to the project, else BLOB_READ_WRITE_TOKEN),
//   so the file URL is never exposed and never expires.
// Fallback: FILE_URL_<SLUG> = any long-lived private URL, served by redirect.
export default async function handler(req, res) {
  const [slug, exp, mac] = String(req.query.token || '').split('.');
  const good = crypto.createHmac('sha256', process.env.DOWNLOAD_SECRET || '').update(`${slug}.${exp}`).digest('hex');
  if (!slug || !mac || mac.length !== good.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good)) || Date.now() > Number(exp))
    return json(res, 403, { error: 'This download link is invalid or has expired. Please contact support.' });
  const key = slug.toUpperCase().replace(/-/g, '_');
  const pathname = process.env['FILE_PATH_' + key];
  if (pathname) {
    try {
      const result = await get(pathname, { access: 'private' });
      if (!result || result.statusCode !== 200) return json(res, 404, { error: 'File not available yet.' });
      const name = pathname.split('/').pop().replace(/[^\w.\- ]/g, '_');
      res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-store');
      return Readable.fromWeb(result.stream).pipe(res);
    } catch (e) {
      console.error('download failed', e?.message);
      return json(res, 502, { error: 'We could not fetch your file right now. Please try the link again in a minute or contact support.' });
    }
  }
  const url = process.env['FILE_URL_' + key];
  if (!url) return json(res, 404, { error: 'File not available yet.' });
  res.setHeader('Location', url); return res.status(302).end();
}
