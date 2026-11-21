// Emails everyone on your Resend audience about a new blog post or article.
// Usage: RESEND_API_KEY=... RESEND_AUDIENCE_ID=... EMAIL_FROM="LearnTern <hello@learntern.co>" node tools/notify.mjs <post-slug> [--send]
// Without --send it only creates a DRAFT broadcast in Resend (review it, then send from the dashboard).
import { posts } from "../data/blog.mjs";
import { articles } from "../data/articles.mjs";
import { site } from "../data/site.mjs";
const slug = process.argv[2], send = process.argv.includes("--send");
const { RESEND_API_KEY: key, RESEND_AUDIENCE_ID: audience, EMAIL_FROM: from } = process.env;
if (!slug || !key || !audience || !from) { console.error("Need a slug plus RESEND_API_KEY, RESEND_AUDIENCE_ID and EMAIL_FROM."); process.exit(1); }
const post = posts.find((p) => p.slug === slug), art = articles.find((a) => a.slug === slug);
const item = post || art;
if (!item) { console.error("No post or article with that slug."); process.exit(1); }
const url = `${site.url}${post ? "/blog/" : "/learn/"}${slug}/`;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#142B4D"><p style="color:#B8892B;font-size:12px;letter-spacing:.08em;text-transform:uppercase">${esc(post ? "New on the LearnTern blog" : "New on LearnTern Learn")}</p><h1 style="font-size:24px;line-height:1.25">${esc(item.title)}</h1><p style="font-size:16px;line-height:1.6">${esc(item.excerpt || item.summary || "")}</p><p><a href="${url}" style="background:#C9A24A;color:#142B4D;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Read it now</a></p><hr style="border:none;border-top:1px solid #e3e8f0;margin:28px 0"><p style="font-size:12px;color:#6b7a90">You are receiving this because you subscribed at learntern.co. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p></div>`;
const H = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const r = await fetch("https://api.resend.com/broadcasts", { method: "POST", headers: H, body: JSON.stringify({ audience_id: audience, from, subject: item.title, html, name: `Post: ${slug}` }) });
const d = await r.json(); if (!r.ok) { console.error("Create failed", r.status, d); process.exit(1); }
console.log("Draft broadcast created:", d.id);
if (send) { const s = await fetch(`https://api.resend.com/broadcasts/${d.id}/send`, { method: "POST", headers: H, body: "{}" }); console.log(s.ok ? "Sent." : `Send failed ${s.status} ${await s.text()}`); }
else console.log("Review and send it from resend.com > Broadcasts, or re-run with --send.");
