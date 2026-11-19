# LearnTern

Static site (Node build) + Vercel serverless forms/checkout. Deploy: push to GitHub, import repo in Vercel (build `node build.mjs`, output `dist`).

## Edit content
- `data/articles.mjs` – articles. `data/site.mjs` – prices, emails, social links, products, courses.
- `node build.mjs` then open `dist/`.

## Must be configured before launch
| Item | Where |
|---|---|
| Domain + `SITE_URL` | Vercel env |
| Product prices (NGN) | `data/site.mjs` (`price`). Credit Risk 101 is set to 12,500. Others still unpriced |
| Paystack account approval + `PAYSTACK_SECRET_KEY`, webhook -> `https://<your-domain>/api/paystack-webhook` | Vercel env / Paystack dashboard (Settings > API Keys & Webhooks) |
| `DOWNLOAD_SECRET`; `FILE_PATH_CREDIT_RISK_101` = pathname of the PDF in a **private Vercel Blob store connected to this project** (e.g. `Credit_Risk_101.pdf`). Do not paste signed/temporary blob URLs: they expire. `FILE_URL_<SLUG>` still works as a redirect fallback for long-lived URLs | Vercel env |
| Email: `RESEND_API_KEY`, `EMAIL_FROM`, `OWNER_EMAIL`, `RESEND_AUDIENCE_ID`, `FREE_GUIDE_URL` | Vercel env |
| Real emails and social URLs | `data/site.mjs` |
| GA4 `GA4_ID` / GTM `GTM_ID`; Search Console verification | Vercel env |
| Author bio and credentials (verified only) | About page |
| Legal pages (drafts) | legal review |
| Customer accounts / order history | auth provider needed |
| Interview Pack, Bundle covers and files; sample downloads | to produce |
