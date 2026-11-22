# LearnTern

Static site (Node build) + Vercel serverless forms/checkout. Deploy: push to GitHub, import repo in Vercel (build `node build.mjs`, output `dist`).

## Edit content
- `data/articles.mjs` – articles. `data/site.mjs` – prices, emails, social links, products, courses.
- `node build.mjs` then open `dist/`.

## Blog and ads
- **Publish a post:** add an object to the top of `posts` in `data/blog.mjs` (title, category, region, date, excerpt, body, sources), then merge. Posts appear at `/blog/`, in the sitemap and in `/blog/rss.xml`. Every factual claim should link to a source.
- **Ads:** `data/ads.mjs`. Add the banner to `public/assets/ads/`, add an entry (placements, start/end dates), merge. Ads are always labelled "Sponsored". Slots: `blog-top`, `article-inline`; the end of each post shows a house "Advertise with us" box unless AdSense is on.
- **Google AdSense (optional):** set `ADSENSE_CLIENT` and `ADSENSE_SLOT` in Vercel. Needs an approved AdSense account, a privacy policy page and cookie/consent handling first.
- **Ad clicks:** pushed to `dataLayer` as `ad_click` (with `ad_id`) when GTM is configured.
- **Advertiser enquiries:** the form at `/advertise/` goes to hello@learntern.co via `/api/contact`.

## Must be configured before launch
| Item | Where |
|---|---|
| Domain + `SITE_URL` | Vercel env |
| Product prices (NGN) | `data/site.mjs` (`price`). Credit Risk 101 is 7,500 (promo), shown beside a struck-through `originalPrice` of 12,500; remove `originalPrice` to end the promo display. Others still unpriced |
| Paystack account approval + `PAYSTACK_SECRET_KEY`, webhook -> `https://<your-domain>/api/paystack-webhook/` (trailing slash required: the site redirects without it and Paystack does not follow redirects) | Vercel env / Paystack dashboard (Settings > API Keys & Webhooks) |
| `DOWNLOAD_SECRET`; `FILE_PATH_CREDIT_RISK_101` = pathname of the PDF in a **private Vercel Blob store connected to this project** (e.g. `Credit_Risk_101.pdf`). Do not paste signed/temporary blob URLs: they expire. `FILE_URL_<SLUG>` still works as a redirect fallback for long-lived URLs | Vercel env |
| Email: `RESEND_API_KEY`, `EMAIL_FROM`, `RESEND_AUDIENCE_ID`, `FREE_GUIDE_URL`. `OWNER_EMAIL` is optional: contact and corporate-training enquiries go to hello@learntern.co unless it is set. The hello@ mailbox must exist | Vercel env |
| Real emails and social URLs | `data/site.mjs` |
| GA4 `GA4_ID` / GTM `GTM_ID`; Search Console verification | Vercel env |
| Author bio and credentials (verified only) | About page |
| Legal pages (drafts) | legal review |
| Customer accounts / order history | auth provider needed |
| Interview Pack, Bundle covers and files; sample downloads | to produce |

## Email subscribers and new-post notifications

Subscribe boxes sit on the blog, every blog post, every Learn article and the home page. Sign-ups go to `/api/subscribe`, which saves them in your Resend audience (set `RESEND_AUDIENCE_ID`), sends a welcome email, and also emails the owner a copy if the audience is not configured, so no sign-up is lost.

To notify subscribers about a new post or article (after it is live):

```
RESEND_API_KEY=... RESEND_AUDIENCE_ID=... NEWSLETTER_FROM="LearnTern <updates@learntern.co>" node tools/notify.mjs <slug>          # creates a draft broadcast to review
RESEND_API_KEY=... RESEND_AUDIENCE_ID=... NEWSLETTER_FROM="LearnTern <updates@learntern.co>" node tools/notify.mjs <slug> --send   # sends it
```

Every broadcast carries Resend's one-click unsubscribe link.

Optional `NEWSLETTER_FROM` (e.g. `LearnTern <updates@learntern.co>`) is the sender for the welcome email and post notifications; replies go to hello@learntern.co. Order and contact emails keep using `EMAIL_FROM`. It must be an address on your Resend-verified domain.
