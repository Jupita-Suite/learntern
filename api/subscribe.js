import { json, validEmail, clean, sendEmail, esc } from './_lib.js';
// Newsletter + free guide + waitlist. Needs: RESEND_API_KEY, EMAIL_FROM. Optional: RESEND_AUDIENCE_ID, FREE_GUIDE_URL, OWNER_EMAIL.
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = req.body || {};
  if (b.hp_extra) return json(res, 200, { message: 'Thank you.' }); // honeypot
  const email = clean(b.email, 254).toLowerCase(), firstName = clean(b.firstName, 80);
  if (!validEmail(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return json(res, 503, { error: 'Subscriptions are not switched on yet. Please check back soon.' });
  try {
    if (process.env.RESEND_AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, unsubscribed: false }),
      });
    }
    if (b.intent === 'free-guide') {
      if (!process.env.FREE_GUIDE_URL) return json(res, 503, { error: 'The free guide is not available yet. Please check back soon.' });
      const ok = await sendEmail({ to: email, subject: 'Your free guide: 25 credit risk interview questions',
        html: `<p>Hi ${esc(firstName || 'there')},</p><p>Thanks for joining LearnTern. <a href="${esc(process.env.FREE_GUIDE_URL)}">Download your free guide</a>.</p><p>LearnTern</p>` });
      if (!ok) return json(res, 502, { error: 'We could not send the email. Please try again.' });
      return json(res, 200, { message: 'Thank you! Your free guide has been emailed to you.' });
    }
    return json(res, 200, { message: 'You are subscribed. Thank you!' });
  } catch { return json(res, 500, { error: 'Something went wrong. Please try again.' }); }
}
