import { json, validEmail, clean, sendEmail, esc } from './_lib.js';
import { site } from '../data/site.mjs';
// Contact + corporate-training enquiries. Delivered to OWNER_EMAIL if set, otherwise hello@learntern.co (site.email).
// Needs: RESEND_API_KEY, EMAIL_FROM.
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = req.body || {};
  if (b.hp_extra) return json(res, 200, { message: 'Thank you.' });
  const name = clean(b.name, 120), email = clean(b.email, 254), message = clean(b.message, 4000);
  if (!name || !validEmail(email) || !message) return json(res, 400, { error: 'Please complete your name, a valid email and your message.' });
  const to = process.env.OWNER_EMAIL || site.email;
  const rows = Object.entries({ Topic: b.topic, Organisation: b.organisation, 'Team size': b.teamSize, Source: b.source })
    .filter(([, v]) => v).map(([k, v]) => `<p><b>${k}:</b> ${esc(clean(v, 200))}</p>`).join('');
  const ok = await sendEmail({ to, replyTo: email, subject: `LearnTern ${clean(b.topic, 60) || 'enquiry'}: ${name}`,
    html: `<p><b>${esc(name)}</b> (${esc(email)})</p>${rows}<p>${esc(message).replace(/\n/g, '<br>')}</p>` });
  if (!ok) console.error('contact: email to', to, 'was not sent');
  if (!ok) return json(res, 502, { error: 'We could not send your message. Please try again.' });
  return json(res, 200, { message: 'Thank you. Your message has been sent and we will reply soon.' });
}
