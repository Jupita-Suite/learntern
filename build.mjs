// LearnTern static site generator. Run: node build.mjs  -> outputs to /dist
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { site, products, courses } from "./data/site.mjs";
import { articles, categories } from "./data/articles.mjs";
import { refundPolicy, refundUpdated } from "./data/refund-policy.mjs";
import { posts, regions, byline } from "./data/blog.mjs";
import { ads, adsense } from "./data/ads.mjs";

const OUT = "dist";
rmSync(OUT, { recursive: true, force: true });
cpSync("public", OUT, { recursive: true });

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const urls = []; // for sitemap

/* ---------- components ---------- */
const logoSvg = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <path d="M19 9.5a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <rect x="16.5" y="10" width="15" height="3.2" rx="1.2" fill="currentColor"/>
  <rect x="18" y="13.2" width="12" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M24 16.2c2.3 2.2 3 3.6 3 5a3 3 0 0 1-6 0c0-1.4.7-2.2 1.4-3 .3.8.9 1.2 1.3 1.2-.3-1.2-.2-2.4.3-3.2z" fill="#D6A94F"/>
  <rect x="16.5" y="28.4" width="15" height="2.8" rx="1.2" fill="currentColor"/>
  <path d="M3 35.5c7-2.4 14-1.4 21 2.2 7-3.6 14-4.6 21-2.2V46c-7-2.4-14-1.4-21 2.2C17 44.6 10 43.6 3 46z" fill="currentColor"/>
  <path d="M24 37.7V48" stroke="#D6A94F" stroke-width="1.6"/>
</svg>`;
const logo = `<a class="logo" href="/" aria-label="LearnTern home">${logoSvg}<span class="logo-word">learn<b>tern</b></span></a>`;

const ico = {
  scale: '<path d="M12 3v18M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zm14 0l-3 7a3.5 3.5 0 0 0 6 0l-3-7z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 15l4-4 3 3 5-6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
  case: '<path d="M4 4h16v16H4zM4 9h16M9 9v11"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2.2.8 3.5 2.8 3.5 5.5"/>',
};
const icon = (k) => `<span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ico[k]}</svg></span>`;

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
function thumb(a) {
  const h = hash(a.slug), v = h % 4;
  const shapes = [
    `<g stroke="#D6A94F" stroke-opacity=".5" fill="none">${[0,1,2,3,4].map(i=>`<circle cx="${250+i*8}" cy="90" r="${20+i*18}"/>`).join("")}</g>`,
    `<g fill="#D6A94F" fill-opacity=".9">${[0,1,2,3,4,5,6].map(i=>`<rect x="${40+i*38}" y="${150-(20+((h>>i)%6)*14)}" width="22" height="${20+((h>>i)%6)*14}"/>`).join("")}</g>`,
    `<path d="M0 140 L60 110 L120 125 L180 70 L240 90 L300 40 L320 50" stroke="#D6A94F" stroke-width="3" fill="none"/><path d="M0 140 L60 110 L120 125 L180 70 L240 90 L300 40 L320 50 V180 H0z" fill="#D6A94F" fill-opacity=".12"/>`,
    `<g stroke="#D6A94F" stroke-opacity=".6" fill="none">${[0,1,2,3,4,5].map(i=>`<path d="M${i*60} 0 L${i*60+60} 180"/>`).join("")}</g><circle cx="230" cy="70" r="34" fill="#D6A94F" fill-opacity=".9"/>`,
  ];
  return `<div class="thumb"><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract editorial graphic for ${esc(a.category)}"><rect width="320" height="180" fill="#142B4D"/><rect width="320" height="180" fill="url(#g${v})"/>${shapes[v]}<text x="18" y="164" fill="#fff" fill-opacity=".85" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="11" letter-spacing="2">${esc(a.category.toUpperCase())}</text><defs><linearGradient id="g${v}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1C3A66"/><stop offset="1" stop-color="#0E1F3A"/></linearGradient></defs></svg></div>`;
}
const articleCard = (a) => `<article class="card" data-title="${esc(a.title)}" data-excerpt="${esc(a.excerpt)}" data-cat="${esc(a.category)}">
  ${thumb(a)}<div class="meta"><span>${esc(a.category)}</span><span>${a.readTime} min read</span></div>
  <h3><a class="card-link" href="/learn/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p><span class="link-arrow">Read Article</span></article>`;

const productMedia = (p, mini = false) =>
  p.image ? `<img class="product-img" src="${p.image}" alt="${esc(p.name)} book cover" width="1000" height="1073" loading="lazy">`
  : `<div class="mini-cover" role="img" aria-label="${esc(p.name)} cover (placeholder design)"><small>${esc(p.cover.kicker)}</small><strong>${esc(p.cover.title)}</strong></div>`;
const priceText = (p) => (p.price ? `₦${p.price.toLocaleString("en-NG")}` : p.pricePlaceholder);

/* ---------- layout ---------- */
const navItems = [["Home", "/"], ["Learn", "/learn/"], ["Blog", "/blog/"], ["Books & Resources", "/books/"], ["Interview Preparation", "/interview-preparation/"], ["Courses", "/courses/"], ["About", "/about/"]];

function layout({ path, title, desc, body, og = "website", schema = [], hero = "", noindex = false, head = "" }) {
  const full = title.includes("LearnTern") ? title : `${title} | LearnTern`;
  const canonical = site.url + path;
  if (!noindex) urls.push(path);
  const cur = (href) => (href === "/" ? path === "/" : path.startsWith(href)) ? ' aria-current="page"' : "";
  const ld = [{ "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, slogan: site.tagline }, ...schema];
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:site_name" content="LearnTern"><meta property="og:type" content="${og}"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.url}/assets/credit-risk-101.webp">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#142B4D">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Jost:wght@600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
${site.gtmId ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script>` : ""}
${!site.gtmId && site.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');</script>` : ""}
${head}</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap"><div class="nav">${logo}
<nav aria-label="Main"><ul class="nav-links">${navItems.map(([l, h]) => `<li><a href="${h}"${cur(h)}>${l}</a></li>`).join("")}</ul></nav>
<div class="nav-cta"><a class="signin" href="/account/">Sign In</a><a class="btn btn-gold btn-sm" href="/books/">Explore Resources</a></div>
<button class="menu-btn" aria-label="Open menu" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div>
<div class="mobile-menu">${navItems.map(([l, h]) => `<a href="${h}">${l}</a>`).join("")}<a href="/account/">Sign In</a><a class="btn btn-gold" href="/books/">Explore Resources</a></div></div></header>
<main id="main">${hero}${body}</main>
<footer class="footer"><div class="wrap"><div class="foot-grid">
<div>${logo}<p style="margin-top:16px;max-width:34ch">${site.tagline}<br>Practical credit risk education for the next generation of credit professionals.</p>
<div class="social" aria-label="Social media">${[["linkedin", "in"], ["x", "X"], ["instagram", "ig"], ["youtube", "yt"]].map(([k, t]) => `<a href="${site.social[k]}" aria-label="LearnTern on ${k}" rel="noopener">${t}</a>`).join("")}</div></div>
<div><h4>Platform</h4><ul><li><a href="/about/">About LearnTern</a></li><li><a href="/learn/">Learn</a></li><li><a href="/blog/">Blog</a></li><li><a href="/books/">Books &amp; Resources</a></li><li><a href="/interview-preparation/">Interview Preparation</a></li><li><a href="/courses/">Courses</a></li></ul></div>
<div><h4>Business</h4><ul><li><a href="/corporate-training/">Corporate Training</a></li><li><a href="/advertise/">Advertise with us</a></li><li><a href="/contact/">Contact</a></li><li><a href="/account/">Customer Account</a></li></ul></div>
<div><h4>Legal</h4><ul><li><a href="/refund-policy/">Refund Policy</a></li>${""/* Privacy Policy and Terms hidden for now: <li><a href="/privacy-policy/">Privacy Policy</a></li><li><a href="/terms/">Terms and Conditions</a></li> */}</ul></div>
</div><div class="foot-bottom"><span>© ${new Date().getFullYear()} LearnTern. All rights reserved.</span><span>Educational content only. Not financial, legal or regulatory advice.</span></div></div></footer>
<script src="/js/main.js" defer></script></body></html>`;
}

const pageHero = (crumb, h1, lead) => `<section class="page-hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / ${crumb}</div><h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></section>`;
const write = (path, html) => {
  const file = join(OUT, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const leadForm = (src, label = "Get the Free Guide") => `<form class="form" data-endpoint="/api/subscribe" data-source="${src}" novalidate>
  <input type="hidden" name="intent" value="free-guide">
  <div class="field"><label for="fn-${src}">First name</label><input id="fn-${src}" name="firstName" required autocomplete="given-name"></div>
  <div class="field"><label for="em-${src}">Email address</label><input id="em-${src}" name="email" type="email" required autocomplete="email"></div>
  <button class="btn btn-gold" type="submit">${label}</button><p class="form-msg" role="status" aria-live="polite"></p>
  <p class="fineprint" style="color:#9fb0c9">We use your details to send the guide and occasional learning updates. Unsubscribe any time.</p></form>`;

/* ---------- HOME ---------- */
const book = products[0];
const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
const home = `
<section class="hero"><div class="wrap hero-grid">
 <div><span class="eyebrow">Credit risk education · Nigeria first</span>
 <h1>Build a Career in Credit Risk. <em>Develop Skills That Matter.</em></h1>
 <p class="lead">Practical learning resources, professional guides and interview preparation materials designed to help you understand credit risk management, master loan underwriting and build a successful career in lending.</p>
 <div class="hero-actions"><a class="btn btn-gold" href="/learn/">Explore Learning Resources</a><a class="btn btn-ghost" href="/books/credit-risk-101/">Explore Credit Risk 101</a></div>
 <div class="hero-meta"><span>Practical case studies</span><span>Nigerian lending context</span><span>Interview-ready skills</span></div></div>
 <div class="desk" role="img" aria-label="Illustrative credit analyst workspace showing sample portfolio indicators and a trend chart">
  <div class="desk-head"><b>Credit review · sample</b><span>Illustrative</span></div>
  <div class="kpis"><div class="kpi"><small>DSCR</small><strong>1.42x</strong></div><div class="kpi"><small>PAR 30</small><strong>4.1%</strong></div><div class="kpi"><small>FPD</small><strong>2.3%</strong></div></div>
  <svg viewBox="0 0 320 130" aria-hidden="true"><g stroke="#E2E7EE"><path d="M0 30H320M0 65H320M0 100H320"/></g>
   <g fill="#142B4D">${[40, 62, 50, 78, 66, 92, 84].map((h, i) => `<rect x="${12 + i * 44}" y="${120 - h}" width="26" height="${h}" rx="2"/>`).join("")}</g>
   <path d="M25 70 L69 52 L113 60 L157 36 L201 44 L245 22 L289 28" stroke="#D6A94F" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
  <p class="desk-note">Sample figures for illustration only. Not real portfolio data.</p>
  <span class="chip-gold">Practical. Not theoretical.</span></div>
</div></section>

<section class="section"><div class="wrap">
 <div class="sec-head"><span class="eyebrow">What you can learn</span><h2>Develop the Skills That Drive Better Credit Decisions</h2></div>
 <div class="grid g4">
  ${[["scale", "Credit Risk Fundamentals", "Understand credit risk, lending principles and risk assessment.", "/learn/?cat=Credit%20Risk%20Fundamentals"],
     ["file", "Loan Underwriting", "Learn borrower assessment, bank statement analysis and credit appraisal.", "/learn/?cat=Loan%20Underwriting"],
     ["chart", "Portfolio Monitoring", "Understand portfolio quality, PAR, NPL, FPD and early warning indicators.", "/learn/?cat=Portfolio%20Monitoring"],
     ["briefcase", "Credit Risk Careers", "Develop the technical knowledge and interview skills required to progress.", "/learn/?cat=Credit%20Risk%20Careers"]]
    .map(([i, t, d, h]) => `<div class="card reveal">${icon(i)}<h3>${t}</h3><p>${d}</p><a class="link-arrow card-link" href="${h}" aria-label="Explore ${t}">Explore</a></div>`).join("")}
 </div></div></section>

<section class="section dark" id="featured-book"><div class="wrap book-grid">
 <div class="book-visual reveal"><img src="${book.image}" alt="Four copies of the Credit Risk 101 book by Williams Adeyemi, green cover with large white and gold title" width="1000" height="1073"></div>
 <div class="book-info reveal"><span class="eyebrow">Featured book</span><h2>Credit Risk 101</h2>
  <p class="sub">${esc(book.subtitle)}</p><p class="by">By Williams Adeyemi</p>
  <p>${esc(book.short)}</p>
  <ul class="tag-list">${book.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
  <p style="font-size:.95rem"><strong style="color:#fff">Who it's for:</strong> ${book.audience.join(" · ")}</p>
  <div class="price-row"><div class="price">${priceText(book)}<small>${book.format}${book.price ? "" : " · placeholder pricing"}</small></div><a class="btn btn-gold" href="/books/credit-risk-101/">Get the Book</a></div></div>
</div></section>

<section class="section"><div class="wrap iv-grid">
 <div><span class="eyebrow">Interview preparation</span><h2>Prepare for Your Next Credit Risk Interview</h2>
 <p class="lead">Go beyond memorising definitions. Understand how to answer technical questions, solve underwriting case studies and demonstrate the practical skills employers expect.</p>
 <a class="btn btn-navy" href="/interview-preparation/">Explore Interview Resources</a></div>
 <div class="stack">${[["quiz", "Credit Risk Technical Interview Questions", "Core concepts with model answers that show your reasoning."], ["case", "Credit Analyst Case Study Exercises", "Realistic borrower scenarios ending in a clear recommendation."], ["table", "Bank Statement Analysis Assessment", "Hands-on practice analysing cash flow and transaction patterns."]]
  .map(([i, t, d]) => `<div class="row-card reveal">${icon(i)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join("")}</div>
</div></section>

<section class="section alt"><div class="wrap">
 <div class="sec-head" style="display:flex;justify-content:space-between;align-items:end;gap:24px;max-width:none;flex-wrap:wrap"><div><span class="eyebrow">Latest learning resources</span><h2 style="margin:0">Practical reading for credit professionals</h2></div><a class="link-arrow" href="/learn/">View all articles</a></div>
 <div class="grid g3">${latest.map(articleCard).join("")}</div></div></section>

<section class="section"><div class="wrap">
 <div class="sec-head center"><span class="eyebrow">Why LearnTern</span><h2>Learn the Practical Side of Credit Risk</h2></div>
 <div class="grid g4">${[["Practical Knowledge", "Learn through real-world lending examples and case studies."], ["Career Focused", "Develop skills relevant to actual credit risk roles."], ["Industry Relevant", "Understand the Nigerian lending ecosystem and its practical challenges."], ["Structured Learning", "Progress from fundamental concepts to practical professional skills."]]
  .map(([t, d], i) => `<div class="card num reveal" data-n="0${i + 1}"><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>

<section class="section alt"><div class="wrap"><div class="lead-box">
 <div><span class="eyebrow">Free learning resource</span><h2>Start Building Your Credit Risk Career Today</h2><p class="lead" style="color:#b9c6da">Download our free guide containing 25 credit risk interview questions every aspiring credit analyst should know.</p></div>
 ${leadForm("home-free-guide")}</div></div></section>

<section class="section"><div class="wrap news">
 <div><span class="eyebrow">Newsletter</span><h2>Stay Ahead in Credit Risk</h2><p class="lead">Receive practical credit risk lessons, interview tips, career opportunities and new learning resources.</p></div>
 <form class="form" data-endpoint="/api/subscribe" data-source="home-newsletter" novalidate>
  <div class="inline"><div class="field" style="flex:1"><label for="nl-email" class="sr" style="position:absolute;left:-999px">Email address</label><input id="nl-email" name="email" type="email" placeholder="Your email address" required autocomplete="email" aria-label="Email address"></div><button class="btn btn-navy" type="submit">Subscribe</button></div>
  <p class="form-msg" role="status" aria-live="polite"></p></form></div></section>`;
write("/", layout({ path: "/", title: "LearnTern | Practical Credit Risk Education", desc: "Practical credit risk education for the next generation of credit professionals. Guides, interview preparation and learning resources focused on the Nigerian lending market.", body: home, schema: [{ "@context": "https://schema.org", "@type": "WebSite", name: "LearnTern", url: site.url }] }));

/* ---------- LEARN ---------- */
const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
write("/learn/", layout({
  path: "/learn/", title: "Learn: Credit Risk Articles and Guides", desc: "Searchable library of practical articles on credit risk, credit analysis, loan underwriting, portfolio monitoring and credit careers.",
  hero: pageHero("Learn", "Credit Risk Learning Library", "Practical articles on credit analysis, underwriting, portfolio monitoring and building a career in lending."),
  body: `<section class="section"><div class="wrap">
  <div class="toolbar"><div class="search"><label for="q" class="sr" style="position:absolute;left:-999px">Search articles</label><input id="q" type="search" placeholder="Search articles, e.g. cash flow, PAR, scorecards" autocomplete="off"></div></div>
  <div class="chips" role="group" aria-label="Filter by category"><button class="chip" data-cat="All" aria-pressed="true">All</button>${categories.map((c) => `<button class="chip" data-cat="${esc(c)}" aria-pressed="false">${c}</button>`).join("")}</div>
  <div id="library" class="grid g3">${sorted.map(articleCard).join("")}</div>
  <div id="empty" class="empty"><h3>No articles match your search</h3><p>Try a different keyword or choose another category. New articles are published regularly.</p></div>
  <div id="pager" class="pager"></div></div></section>`,
}));

/* ---------- ARTICLES ---------- */
for (const a of articles) {
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(articles.filter((x) => x.slug !== a.slug && x.category !== a.category)).slice(0, 3);
  const body = a.body.map((b) => (b.h ? `<h2>${esc(b.h)}</h2>` : b.p ? `<p>${esc(b.p)}</p>` : `<ul>${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`)).join("");
  write(`/learn/${a.slug}/`, layout({
    path: `/learn/${a.slug}/`, title: a.title, desc: a.excerpt, og: "article",
    schema: [{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, datePublished: a.date, author: { "@type": "Person", name: "Williams Adeyemi" }, publisher: { "@type": "Organization", name: "LearnTern" }, mainEntityOfPage: site.url + `/learn/${a.slug}/` }],
    hero: `<section class="page-hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / <a href="/learn/">Learn</a> / ${esc(a.category)}</div><span class="eyebrow">${esc(a.category)}</span><h1 style="max-width:20ch">${esc(a.title)}</h1><div class="article-meta"><span>${fmtDate(a.date)}</span><span>${a.readTime} min read</span><span>By Williams Adeyemi</span></div></div></section>`,
    body: `<section class="section"><div class="wrap"><div class="article">${body}
    <div class="callout"><p><strong>Build on this with the book.</strong> Credit Risk 101 walks through these ideas with practical examples for the Nigerian lending market.</p><a class="btn btn-navy btn-sm" href="/books/credit-risk-101/">Explore Credit Risk 101</a></div>
    <p class="fineprint">This article is for general education and does not constitute financial, legal or regulatory advice. Definitions and regulatory thresholds vary by institution and change over time; always confirm current requirements.</p></div></div></section>
    <section class="section alt"><div class="wrap"><h2>Keep learning</h2><div class="grid g3">${related.map(articleCard).join("")}</div></div></section>`,
  }));
}

/* ---------- BOOKS ---------- */
const productCard = (p) => `<div class="card reveal">${productMedia(p)}<div class="meta"><span>${p.format}</span></div><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p><div class="price-tag">${priceText(p)}</div><a class="btn btn-navy btn-sm card-link" href="/books/${p.slug}/" style="align-self:flex-start">View details</a></div>`;
write("/books/", layout({
  path: "/books/", title: "Books & Resources", desc: "Credit risk books, interview preparation packs and practical templates from LearnTern.",
  hero: pageHero("Books &amp; Resources", "Books &amp; Resources", "Professional guides and practical toolkits to help you learn, practise and prepare."),
  body: `<section class="section"><div class="wrap"><div class="grid g3">${products.filter((p) => !p.comingSoon).map(productCard).join("")}</div>
  <p class="fineprint" style="margin-top:28px">All prices are in Nigerian Naira (NGN). Payments are processed securely by Paystack.</p></div></section>`,
}));
for (const p of products) {
  if (p.comingSoon) {
    write(`/books/${p.slug}/`, layout({
      path: `/books/${p.slug}/`, title: p.name, desc: `${p.name} is coming soon from LearnTern.`, noindex: true,
      hero: pageHero(`<a href="/books/">Books &amp; Resources</a> / ${esc(p.name)}`, esc(p.name), esc(p.subtitle)),
      body: `<section class="section"><div class="wrap prose"><h2>Coming soon</h2><p>${esc(p.name)} is not available yet. We are putting the finishing touches on it.</p><p><a class="btn btn-navy" href="/books/credit-risk-101/">Explore Credit Risk 101</a> <a class="btn btn-outline" href="/contact/">Get in touch</a></p></div></section>`,
    }));
    continue;
  }
  write(`/books/${p.slug}/`, layout({
    path: `/books/${p.slug}/`, title: p.name, desc: p.short, og: "product",
    schema: [{ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.short, brand: { "@type": "Brand", name: "LearnTern" }, ...(p.price ? { offers: { "@type": "Offer", priceCurrency: "NGN", price: p.price, availability: "https://schema.org/InStock", url: site.url + `/books/${p.slug}/` } } : {}) }],
    hero: pageHero(`<a href="/books/">Books &amp; Resources</a> / ${esc(p.name)}`, esc(p.name), esc(p.subtitle)),
    body: `<section class="section"><div class="wrap pd">
    <div class="pd-cover">${p.image ? `<img class="pd-img" src="${p.image}" alt="${esc(p.name)} book cover" width="1000" height="1073">` : `<div class="cover" role="img" aria-label="${esc(p.name)} cover (placeholder design)"><small>${esc(p.cover.kicker)}</small><div><strong>${esc(p.cover.title)}</strong><i></i></div></div>`}</div>
    <div><span class="eyebrow">${p.format}</span>${p.description.map((d) => `<p class="lead">${esc(d)}</p>`).join("")}
     <div class="buy-box"><div class="price-tag" style="font-size:1.6rem">${priceText(p)}</div>
      <form class="form" data-endpoint="/api/checkout" data-source="product-${p.slug}" novalidate><input type="hidden" name="product" value="${p.slug}">
       <div class="row2"><div class="field"><label for="n">Full name</label><input id="n" name="name" required autocomplete="name"></div><div class="field"><label for="e">Email for your download link</label><input id="e" name="email" type="email" required autocomplete="email"></div></div>
       <button class="btn btn-gold" type="submit">Buy Now</button><p class="form-msg" role="status" aria-live="polite"></p></form>
      <p class="fineprint" style="margin-top:12px">${p.price ? "Secure payment in NGN via Paystack (card, bank transfer or USSD). After payment, a secure download link is sent to your email." : "Secure payment in NGN via Paystack once enabled. You receive an order confirmation and a secure download link by email."} See our <a href="/refund-policy/">refund policy</a>.</p>
      ${p.price ? "" : `<div class="notice"><strong>Coming soon:</strong> this product is not yet available to purchase.</div>`}</div>
     <h2>What's included</h2><ul class="checklist">${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
     <h2>Who should buy it</h2><ul class="checklist">${p.audience.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div></div></section>`,
  }));
}

/* ---------- INTERVIEW PREP ---------- */
const qa = [
  ["What is the difference between PAR and NPL?", "PAR (portfolio at risk) measures the share of the outstanding portfolio with any repayment overdue beyond a set number of days, such as PAR 30 or PAR 90, and is an early indicator. NPL is a classification of loans as non-performing under regulatory or internal definitions, usually once they are materially past due or credit-impaired. PAR shows emerging stress; NPL reflects established problems. Always confirm the definition your institution uses."],
  ["A borrower has strong collateral but weak cash flow. Would you approve?", "Not on collateral alone. Repayment should come primarily from cash flow, with collateral as a secondary source. I would look at whether the weakness is temporary, whether the loan can be restructured to match cash flow, how easily the collateral can be valued and realised, and what the likely loss severity would be if repayment fails."],
  ["What does a rising first payment default (FPD) rate tell you?", "It suggests a problem at origination: possible fraud, weak verification, poor targeting or a misconfigured scorecard. I would segment by channel, branch, product and application date to locate where the problem began and tighten controls there."],
  ["How would you assess an SME using only bank statements?", "I would review average and trend of monthly credits, separate genuine business inflows from internal or related-party transfers, check balance behaviour and overdraft usage, identify existing obligations, test whether turnover supports the requested repayment, and verify the statement is authentic."],
];
write("/interview-preparation/", layout({
  path: "/interview-preparation/", title: "Credit Risk Interview Preparation", desc: "Prepare for credit risk and credit analyst interviews with technical questions, case studies, Excel and bank statement exercises.",
  hero: pageHero("Interview Preparation", "Prepare for Credit Risk &amp; Credit Analyst Interviews", "Practise the way employers test: applied questions, case studies and hands-on exercises."),
  body: `<section class="section"><div class="wrap"><div class="sec-head"><span class="eyebrow">What you'll prepare for</span><h2>Everything interviewers look for</h2></div>
  <div class="grid g3">${[["quiz", "Technical questions and answers", "Core credit risk concepts explained with clear model answers."], ["users", "Behavioural questions", "Structure answers about judgement, ethics and pressure."], ["case", "Credit risk case studies", "Borrower scenarios ending in a justified recommendation."], ["table", "Excel assessment exercises", "Ratio analysis, cash flow and repayment capacity in a spreadsheet."], ["file", "Bank statement analysis tests", "Practise spotting patterns, red flags and sustainable cash flow."], ["target", "Credit appraisal exercises", "Complete appraisals and write a credit memo recommendation."]]
   .map(([i, t, d]) => `<div class="card reveal">${icon(i)}<h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
  <section class="section alt"><div class="wrap two-col"><div><span class="eyebrow">Free sample</span><h2>Try some technical questions</h2><p class="lead">A taste of the style of question and answer used in the preparation materials.</p></div>
  <div>${qa.map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>
  <section class="section dark"><div class="wrap book-grid" style="grid-template-columns:1fr 1fr"><div><span class="eyebrow">Featured</span><h2>Credit Risk Interview Master Pack</h2><p class="lead">Technical questions, model answers, case study exercises and credit analyst assessment questions in one focused pack.</p><div class="price-row"><div class="price">Coming soon</div><a class="btn btn-gold" href="/books/interview-master-pack/">Learn more</a></div></div>
  <div><ul class="checklist" style="color:#e8eef7">${products[1].includes.map((i) => `<li>${i}</li>`).join("")}</ul></div></div></section>
  <section class="section"><div class="wrap"><div class="lead-box"><div><span class="eyebrow">Free guide</span><h2>25 credit risk interview questions</h2><p class="lead" style="color:#b9c6da">Get the free guide by email.</p></div>${leadForm("interview-free-guide")}</div></div></section>`,
}));

/* ---------- COURSES ---------- */
write("/courses/", layout({
  path: "/courses/", title: "Courses", desc: "Structured credit risk courses from LearnTern, currently in development.",
  hero: pageHero("Courses", "Structured Credit Risk Courses", "A catalogue of practical courses is being developed. Join the list to hear first."),
  body: `<section class="section"><div class="wrap"><div class="grid g3">${courses.map((c) => `<div class="card reveal"><span class="status">${c.status}</span><h3>${c.title}</h3><p>${c.desc}</p><span class="fineprint">Enrolment not yet open</span></div>`).join("")}</div>
  <div class="lead-box" style="margin-top:56px"><div><h2>Be first to know</h2><p class="lead" style="color:#b9c6da">Course details, launch dates and pricing will be shared by email.</p></div>
  <form class="form" data-endpoint="/api/subscribe" data-source="courses-waitlist" novalidate><input type="hidden" name="intent" value="course-waitlist"><div class="field"><label for="cw">Email address</label><input id="cw" name="email" type="email" required></div><button class="btn btn-gold" type="submit">Join the waitlist</button><p class="form-msg" role="status" aria-live="polite"></p></form></div>
  <p class="fineprint" style="margin-top:20px">Course pages are structured so a learning management system (LMS) can be connected later.</p></div></section>`,
}));

/* ---------- ABOUT ---------- */
write("/about/", layout({
  path: "/about/", title: "About LearnTern", desc: "LearnTern makes practical credit risk knowledge more accessible to aspiring and established professionals.",
  hero: pageHero("About", "Practical credit risk education", "Bridging the gap between academic learning and the skills lenders actually need."),
  body: `<section class="section"><div class="wrap two-col"><div class="prose"><span class="eyebrow">Our mission</span><h2>Making practical credit risk knowledge accessible</h2>
  <p>LearnTern was created to make practical credit risk knowledge more accessible to aspiring and established professionals.</p>
  <p>We believe that good credit decisions require more than theoretical knowledge. They require the ability to understand borrowers, analyse financial information, identify risks, structure loans and monitor credit portfolios.</p>
  <p>Our goal is to bridge the gap between academic learning and the practical skills required in today's lending industry.</p></div>
  <div class="grid g2">${[["Practical", "Real-world lending examples."], ["Credible", "Clear, careful explanations."], ["Career-focused", "Skills employers look for."], ["Market-aware", "Nigeria first, expanding internationally."]].map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>`,
}));

/* ---------- CORPORATE TRAINING ---------- */
write("/corporate-training/", layout({
  path: "/corporate-training/", title: "Corporate Credit Risk Training", desc: "Practical credit risk training for banks, microfinance banks, fintech lenders and credit teams.",
  hero: pageHero("Corporate Training", "Credit Risk Training for Lending Teams", "Practical, scenario-based training for banks, microfinance banks, fintech lenders and credit teams."),
  body: `<section class="section"><div class="wrap"><div class="sec-head"><span class="eyebrow">Who we train</span><h2>Built for lending institutions</h2><p class="lead">Commercial banks · Microfinance banks · Fintech lenders · Lending companies · Credit teams · Financial institutions</p></div>
  <div class="grid g4">${["Credit risk fundamentals", "Loan underwriting", "SME credit assessment", "Credit portfolio monitoring", "Credit analysis", "Collections and recovery", "Credit risk reporting"].map((s, i) => `<div class="card num reveal" data-n="0${i + 1}"><h3>${s}</h3></div>`).join("")}</div></div></section>
  <section class="section alt"><div class="wrap two-col"><div><span class="eyebrow">Enquiry</span><h2>Tell us about your team</h2><p class="lead">Share your goals and team size and we will respond with a proposed approach.</p></div>
  <form class="form" data-endpoint="/api/contact" data-source="corporate-training" novalidate><input type="hidden" name="topic" value="Corporate training">
  <div class="row2"><div class="field"><label for="c1">Your name</label><input id="c1" name="name" required></div><div class="field"><label for="c2">Work email</label><input id="c2" type="email" name="email" required></div></div>
  <div class="row2"><div class="field"><label for="c3">Organisation</label><input id="c3" name="organisation" required></div><div class="field"><label for="c4">Team size</label><select id="c4" name="teamSize"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></div></div>
  <div class="field"><label for="c5">Training needs</label><textarea id="c5" name="message" required></textarea></div><button class="btn btn-navy" type="submit">Send enquiry</button><p class="form-msg" role="status" aria-live="polite"></p></form></div></section>`,
}));

/* ---------- CONTACT ---------- */
write("/contact/", layout({
  path: "/contact/", title: "Contact", desc: "Contact LearnTern for support, training and partnership enquiries.",
  hero: pageHero("Contact", "Get in touch", "Questions, partnerships, training or support. We read every message."),
  body: `<section class="section"><div class="wrap two-col"><div><div class="stack"><div class="row-card"><div><h3>Email us</h3><p><a href="mailto:${site.email}">${site.email}</a></p></div></div><div class="row-card"><div><h3>Partnership enquiries</h3><p>Select "Partnership" in the form.</p></div></div></div></div>
  <form class="form" data-endpoint="/api/contact" data-source="contact" novalidate>
  <div class="row2"><div class="field"><label for="k1">Name</label><input id="k1" name="name" required></div><div class="field"><label for="k2">Email</label><input id="k2" type="email" name="email" required></div></div>
  <div class="field"><label for="k3">Topic</label><select id="k3" name="topic"><option>Customer support</option><option>Partnership</option><option>Training</option><option>General</option></select></div>
  <div class="field"><label for="k4">Message</label><textarea id="k4" name="message" required></textarea></div><button class="btn btn-navy" type="submit">Send message</button><p class="form-msg" role="status" aria-live="polite"></p></form></div></section>`,
}));

/* ---------- ACCOUNT ---------- */
write("/account/", layout({
  path: "/account/", title: "Customer Account", desc: "Access your LearnTern purchases.",
  hero: pageHero("Account", "Customer account", "Access your purchases and downloads."),
  body: `<section class="section"><div class="wrap prose"><h2>Accounts are coming soon</h2><p>Until customer accounts launch, your download link is sent to the email address used at checkout. If you cannot find it, <a href="/contact/">contact support</a> with your order email.</p></div></section>`,
}));

/* ---------- REFUND POLICY ---------- */
const emailLink = (t) => esc(t).replace(site.email, `<a href="mailto:${site.email}">${site.email}</a>`);
const renderBlock = (b) => (b.h3 ? `<h3>${esc(b.h3)}</h3>` : b.ul ? `<ul>${b.ul.map((i) => `<li>${emailLink(i)}</li>`).join("")}</ul>` : `<p>${emailLink(b.p)}</p>`);
write("/refund-policy/", layout({
  path: "/refund-policy/", title: "Refund Policy", desc: "LearnTern's refund policy: eligibility, how to request a refund, review and processing times.",
  hero: pageHero("Refund Policy", "Refund Policy", ""),
  body: `<section class="section"><div class="wrap prose">${refundPolicy.map((sec) => `<h2>${esc(sec.h)}</h2>${sec.body.map(renderBlock).join("")}`).join("")}<p class="fineprint">Last updated ${fmtDate(refundUpdated)}.</p></div></section>`,
}));

/* ---------- LEGAL (Privacy Policy and Terms hidden for now. Remove the "// " prefixes to restore) ---------- */
// const legal = (path, title, paras) => write(path, layout({ path, title, desc: `${title} for LearnTern.`, hero: pageHero(title, title, ""), body: `<section class="section"><div class="wrap prose"><p><span class="pill-note">Draft: requires legal review before launch</span></p>${paras.map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join("")}<p class="fineprint">Last updated ${fmtDate("2026-11-16")}.</p></div></section>` }));
// legal("/privacy-policy/", "Privacy Policy", [["What we collect", "Details you provide through forms (name, email, enquiry content) and standard analytics data if analytics is enabled."], ["How we use it", "To deliver purchases and free resources, respond to enquiries, send updates you request and improve the site. You can unsubscribe at any time."], ["Your rights", "You may request access, correction or deletion of your personal data. Contact us using the details on the Contact page. This policy should be aligned with the Nigeria Data Protection Act and, when expanding, UK/EU GDPR."]]);
// legal("/terms/", "Terms and Conditions", [["Use of the site", "Content is provided for general education and is not financial, legal or regulatory advice."], ["Digital products", "Purchases are licensed for personal use. Redistribution, resale or sharing of download links is not permitted."], ["Liability", "To be completed with legal advice."]]);

/* ---------- ADS ---------- */
const today0 = new Date().toISOString().slice(0, 10);
const adFor = (slot) => ads.find((a) => a.placements.includes(slot) && a.start <= today0 && (!a.end || today0 <= a.end));
const adNote = `<p class="ad-note">Advertiser content. LearnTern does not provide, arrange or endorse loans or other products shown here. Check that any lender is registered before you borrow. <a href="/advertise/">Advertise with us</a></p>`;
function adSlot(slot) {
  const a = adFor(slot);
  if (a) return `<aside class="ad" aria-label="Sponsored advertisement"><span class="ad-label">Sponsored</span><a class="ad-img" href="${esc(a.href)}" target="_blank" rel="sponsored noopener noreferrer" data-ad="${esc(a.id)}"><img src="${esc(a.image)}" alt="${esc(a.alt)}" width="${a.width}" height="${a.height}" loading="lazy"></a>${adNote}</aside>`;
  if (slot === "article-end" && adsense.client && adsense.slot)
    return `<aside class="ad" aria-label="Advertisement"><span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(adsense.client)}" data-ad-slot="${esc(adsense.slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></aside>`;
  if (slot === "article-end")
    return `<aside class="ad ad-house" aria-label="Advertise with LearnTern"><span class="ad-label">Advertise</span><h3>Reach credit, risk and banking professionals</h3><p>Put your brand in front of LearnTern readers.</p><a class="btn btn-navy btn-sm" href="/advertise/">Advertise with LearnTern</a></aside>`;
  return "";
}
const adsenseHead = adsense.client ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(adsense.client)}" crossorigin="anonymous"></script>` : "";

/* ---------- BLOG ---------- */
const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const blogCard = (a) => `<article class="card" data-title="${esc(a.title)}" data-excerpt="${esc(a.excerpt)}" data-cat="${esc(a.region)}">
  ${thumb(a)}<div class="meta"><span>${esc(a.region)} · ${esc(a.category)}</span><span>${fmtDate(a.date)}</span></div>
  <h3><a class="card-link" href="/blog/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p><span class="link-arrow">Read Post</span></article>`;
write("/blog/", layout({
  path: "/blog/", title: "Blog: Credit Risk, Digital Banking and Fintech News", desc: "News, trends and analysis on credit risk, digital banking and fintech in Nigeria, Africa and around the world.",
  head: adsenseHead,
  hero: pageHero("Blog", "Credit Risk and Banking Insights", "News and trends in credit risk, digital banking and fintech across Nigeria, Africa and the world."),
  body: `<section class="section"><div class="wrap">${adSlot("blog-top")}
  <div class="toolbar"><div class="search"><label for="q" class="sr" style="position:absolute;left:-999px">Search posts</label><input id="q" type="search" placeholder="Search posts, e.g. lending rules, recapitalisation" autocomplete="off"></div></div>
  <div class="chips" role="group" aria-label="Filter by region"><button class="chip" data-cat="All" aria-pressed="true">All</button>${regions.map((c) => `<button class="chip" data-cat="${esc(c)}" aria-pressed="false">${c}</button>`).join("")}</div>
  <div id="library" class="grid g3">${sortedPosts.map(blogCard).join("")}</div>
  <div id="empty" class="empty"><h3>No posts match your search</h3><p>Try a different keyword or region. New posts are published regularly.</p></div>
  <div id="pager" class="pager"></div>
  <p class="fineprint" style="margin-top:28px"><a href="/blog/rss.xml">RSS feed</a> · Want to reach our readers? <a href="/advertise/">Advertise with us</a></p></div></section>`,
}));
for (const a of sortedPosts) {
  const related = sortedPosts.filter((x) => x.slug !== a.slug).slice(0, 3);
  const html = a.body.map((b) => (b.h ? `<h2>${esc(b.h)}</h2>` : b.note ? `<p class="post-note">${esc(b.note)}</p>` : b.p ? `<p>${esc(b.p)}</p>` : `<ul>${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`));
  html.splice(Math.min(2, html.length), 0, adSlot("article-inline"));
  write(`/blog/${a.slug}/`, layout({
    path: `/blog/${a.slug}/`, title: a.title, desc: a.excerpt, og: "article", head: adsenseHead,
    schema: [{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, datePublished: a.date, author: { "@type": "Organization", name: byline }, publisher: { "@type": "Organization", name: "LearnTern" }, mainEntityOfPage: site.url + `/blog/${a.slug}/` }],
    hero: `<section class="page-hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / <a href="/blog/">Blog</a> / ${esc(a.region)}</div><span class="eyebrow">${esc(a.region)} · ${esc(a.category)}</span><h1 style="max-width:22ch">${esc(a.title)}</h1><div class="article-meta"><span>${fmtDate(a.date)}</span><span>${a.readTime} min read</span><span>By ${esc(byline)}</span></div></div></section>`,
    body: `<section class="section"><div class="wrap"><div class="article">${html.join("")}
    ${a.sources?.length ? `<h2>Sources</h2><ul class="sources">${a.sources.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a></li>`).join("")}</ul>` : ""}
    ${adSlot("article-end")}
    <div class="callout"><p><strong>Build your fundamentals.</strong> Explore the Learn library for practical guides on credit analysis, underwriting and portfolio monitoring.</p><a class="btn btn-navy btn-sm" href="/learn/">Browse the Learn library</a></div>
    <p class="fineprint">This post is for general information and commentary and is not financial, legal or regulatory advice. News and regulations change quickly; check the original sources and official channels before acting.</p></div>
    <div class="sec-head" style="margin-top:56px"><h2>More from the blog</h2></div><div class="grid g3">${related.map(blogCard).join("")}</div></div></section>`,
  }));
}
writeFileSync(join(OUT, "blog", "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>LearnTern Blog</title><link>${site.url}/blog/</link><description>News and trends in credit risk, digital banking and fintech.</description>${sortedPosts.map((a) => `<item><title>${esc(a.title)}</title><link>${site.url}/blog/${a.slug}/</link><guid>${site.url}/blog/${a.slug}/</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.excerpt)}</description></item>`).join("")}</channel></rss>`);

/* ---------- ADVERTISE ---------- */
write("/advertise/", layout({
  path: "/advertise/", title: "Advertise with LearnTern", desc: "Reach credit, risk and banking professionals with sponsored placements on the LearnTern blog.",
  hero: pageHero("Advertise", "Advertise with LearnTern", "Put your brand in front of people who work in and are learning about lending, risk and banking."),
  body: `<section class="section"><div class="wrap"><div class="sec-head"><span class="eyebrow">Who reads LearnTern</span><h2>Credit, risk and banking professionals</h2><p class="lead">Our readers include credit analysts, loan officers, risk teams and graduates building careers in lending, across Nigeria and the wider region. Ask us for current audience figures.</p></div>
  <div class="grid g3">${[["Blog top banner", "A banner above the post list on the Blog page."], ["In-article banner", "A banner inside every blog post, after the opening section."], ["Article end", "A placement after the post, before related reading."]].map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
  <div class="grid g2" style="margin-top:32px"><div class="card"><h3>Banner specifications</h3><ul><li>Landscape 16:9 image, at least 1200 px wide</li><li>JPG, PNG or WebP, under 500 KB</li><li>The destination link and the dates you want it to run</li></ul></div>
  <div class="card"><h3>Advertising standards</h3><ul><li>Every ad is labelled "Sponsored"</li><li>Claims must be accurate and not misleading</li><li>Lenders and other regulated firms must be able to show their registration or licence on request</li><li>We may decline or remove any ad at our discretion</li></ul></div></div></div></section>
  <section class="section alt"><div class="wrap two-col"><div><span class="eyebrow">Enquiry</span><h2>Tell us about your campaign</h2><p class="lead">Share what you want to promote and when, and we will reply with options and rates.</p></div>
  <form class="form" data-endpoint="/api/contact" data-source="advertise" novalidate><input type="hidden" name="topic" value="Advertising enquiry">
  <div class="row2"><div class="field"><label for="a1">Your name</label><input id="a1" name="name" required></div><div class="field"><label for="a2">Work email</label><input id="a2" type="email" name="email" required></div></div>
  <div class="field"><label for="a3">Company</label><input id="a3" name="organisation" required></div>
  <div class="field"><label for="a4">What would you like to advertise?</label><textarea id="a4" name="message" required></textarea></div><button class="btn btn-navy" type="submit">Send enquiry</button><p class="form-msg" role="status" aria-live="polite"></p></form></div></section>`,
}));

/* ---------- 404 + favicon + SEO files ---------- */
writeFileSync(join(OUT, "404.html"), layout({ path: "/404", title: "Page not found", desc: "Page not found.", noindex: true, hero: pageHero("404", "Page not found", "The page you're looking for doesn't exist or has moved."), body: `<section class="section"><div class="wrap"><a class="btn btn-navy" href="/">Back to homepage</a> <a class="btn btn-outline" href="/learn/">Browse articles</a></div></section>` }));
writeFileSync(join(OUT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="color:#142B4D">${logoSvg.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`.replaceAll("currentColor", "#142B4D"));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(urls)].map((u) => `<url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join("")}</urlset>`);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${urls.length} pages -> ${OUT}/`);
