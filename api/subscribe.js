import { site } from '../data/site.mjs';
import { json, validEmail, clean, sendEmail, esc, looksAutomated } from './_lib.js';
// Newsletter + free guide + waitlist. Needs: RESEND_API_KEY, EMAIL_FROM. Optional: RESEND_AUDIENCE_ID, FREE_GUIDE_URL, OWNER_EMAIL.
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const b = req.body || {};
  if (looksAutomated(b)) return json(res, 200, { message: 'Thank you.' });
  const email = clean(b.email, 254).toLowerCase(), firstName = clean(b.firstName, 80);
  if (!validEmail(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return json(res, 503, { error: 'Subscriptions are not switched on yet. Please check back soon.' });
  try {
    // Save the subscriber in the Resend audience (this is the list we send new-post notifications to).
    let saved = false;
    if (process.env.RESEND_AUDIENCE_ID) {
      const r = await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, unsubscribed: false }),
      });
      saved = r.ok;
      if (!r.ok) console.error('subscribe: Resend audience rejected contact', r.status, (await r.text().catch(() => '')).slice(0, 300));
    } else console.error('subscribe: RESEND_AUDIENCE_ID is not set, so subscribers are only emailed to the owner, not stored in a list');
    // Safety net: always tell the owner, so no sign-up is ever lost even if the list is not configured.
    if (!saved) await sendEmail({ to: process.env.OWNER_EMAIL || site.email, subject: `New subscriber (${clean(b.source, 40) || 'site'}): ${email}`,
      html: `<p>${esc(email)} subscribed (intent: ${esc(clean(b.intent, 40) || 'newsletter')}). Add them to your list.</p>` });
    if (b.intent === 'free-guide') {
      if (!process.env.FREE_GUIDE_URL) return json(res, 503, { error: 'The free guide is not available yet. Please check back soon.' });
      const ok = await sendEmail({ to: email, subject: 'Your free guide: 25 credit risk interview questions',
        html: `<p>Hi ${esc(firstName || 'there')},</p><p>Thanks for joining LearnTern. <a href="${esc(process.env.FREE_GUIDE_URL)}">Download your free guide</a>.</p><p>LearnTern</p>` });
      if (!ok) return json(res, 502, { error: 'We could not send the email. Please try again.' });
      return json(res, 200, { message: 'Thank you! Your free guide has been emailed to you.' });
    }
    if (b.intent !== 'course-waitlist') await sendEmail({ newsletter: true, to: email, subject: 'You are subscribed to LearnTern updates',
      html: `<p>Hi ${esc(firstName || 'there')},</p><p>Thanks for subscribing. We will email you when new credit risk articles and blog posts are published.</p><p>Browse the latest on the <a href="${esc(String(process.env.SITE_URL || site.url).replace(/\/+$/, ''))}/blog/">LearnTern blog</a>.</p><p>LearnTern</p>` });
    return json(res, 200, { message: 'You are subscribed. We will email you new posts and articles.' });
  } catch { return json(res, 500, { error: 'Something went wrong. Please try again.' }); }
}
