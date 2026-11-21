// Dev-only: regenerates the card illustrations in public/assets/cards/<slug>.png (960x540).
// Not part of the site build. Needs Playwright:  npm i --no-save playwright && node tools/card-images.mjs
// To use a real photo for any card instead, just save it as public/assets/cards/<slug>.png (16:9, ~960x540).
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const NAVY = "#142B4D", GOLD = "#D6A94F", SKY = "#8fb0e0", MID = "#2c4a7c", GREEN = "#3fb27f", RED = "#e5645c";
const F = `font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800"`;

const motifs = {
  // balance of value against risk
  scale: () => `<rect x="590" y="540" width="100" height="22" rx="6" fill="${GOLD}"/><rect x="630" y="210" width="20" height="340" fill="#fff" fill-opacity=".92"/><circle cx="640" cy="204" r="24" fill="${GOLD}"/><rect x="400" y="226" width="480" height="16" rx="8" fill="#fff"/>
    <g stroke="#fff" stroke-width="5" stroke-opacity=".8"><path d="M430 242 L372 410 M430 242 L488 410 M850 242 L792 410 M850 242 L908 410"/></g>
    <path d="M352 410 H508 Q498 478 430 478 Q362 478 352 410Z" fill="${GOLD}"/><path d="M772 410 H928 Q918 478 850 478 Q782 478 772 410Z" fill="${SKY}"/>
    <g fill="${GOLD}" stroke="#fff" stroke-width="4"><circle cx="400" cy="384" r="22"/><circle cx="446" cy="372" r="22"/><circle cx="424" cy="338" r="22"/></g>
    <path d="M850 292 l50 18 v44 q0 40 -50 58 q-50 -18 -50 -58 v-44z" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M826 356 l18 18 l34 -38" fill="none" stroke="${GREEN}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  // five Cs
  fiveC: () => [0, 1, 2, 3, 4].map((i) => { const h = 200 + i * 38, x = 150 + i * 200, y = 560 - h; return `<rect x="${x}" y="${y}" width="170" height="${h}" rx="22" fill="${i % 2 ? MID : "#fff"}" fill-opacity="${i % 2 ? 1 : .95}"/><text x="${x + 85}" y="${y + 112}" text-anchor="middle" ${F} font-size="110" fill="${i % 2 ? "#fff" : NAVY}">C</text><circle cx="${x + 85}" cy="${y + 150}" r="9" fill="${GOLD}"/>`; }).join(""),
  // underwriting checklist
  checklist: () => `<rect x="450" y="110" width="380" height="500" rx="28" fill="#fff"/><rect x="490" y="150" width="140" height="18" rx="9" fill="${NAVY}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="496" y="${216 + i * 80}" width="44" height="44" rx="12" fill="${i < 3 ? GREEN : "#dfe5ee"}"/>${i < 3 ? `<path d="M507 ${238 + i * 80} l11 11 l18 -22" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` : ""}<rect x="562" y="${224 + i * 80}" width="${190 - i * 20}" height="14" rx="7" fill="#c9d3e2"/><rect x="562" y="${246 + i * 80}" width="${120 - i * 10}" height="12" rx="6" fill="#e3e8f0"/>`).join("")}
    <circle cx="780" cy="560" r="70" fill="${GOLD}"/><circle cx="780" cy="560" r="54" fill="none" stroke="${NAVY}" stroke-width="5" stroke-dasharray="6 7"/><path d="M752 560 l20 20 l38 -42" fill="none" stroke="${NAVY}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`,
  // financial statements
  statements: () => `<rect x="300" y="150" width="330" height="430" rx="24" fill="#fff"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="336" y="${190 + i * 60}" width="${i % 3 === 2 ? 130 : 180}" height="14" rx="7" fill="${i % 3 === 2 ? NAVY : "#c9d3e2"}"/><rect x="540" y="${190 + i * 60}" width="56" height="14" rx="7" fill="${i % 3 === 2 ? GOLD : "#dfe5ee"}"/>`).join("")}
    <rect x="660" y="210" width="330" height="330" rx="24" fill="${MID}"/>
    ${[0, 1, 2, 3, 4].map((i) => { const h = 70 + [0, 40, 25, 95, 130][i]; return `<rect x="${696 + i * 54}" y="${500 - h}" width="34" height="${h}" rx="8" fill="${i === 4 ? GOLD : "#fff"}" fill-opacity="${i === 4 ? 1 : .9}"/>`; }).join("")}
    <path d="M700 380 L752 340 L806 360 L862 300 L930 262" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  // bank statement
  bankStatement: () => `<rect x="360" y="120" width="560" height="480" rx="28" fill="#fff"/>
    ${[0, 1, 2, 3].map((i) => { const inflow = i % 2 === 0; return `<circle cx="430" cy="${200 + i * 80}" r="28" fill="${inflow ? GREEN : RED}"/><path d="${inflow ? `M430 ${212 + i * 80} V${188 + i * 80} M418 ${200 + i * 80} L430 ${188 + i * 80} L442 ${200 + i * 80}` : `M430 ${188 + i * 80} V${212 + i * 80} M418 ${200 + i * 80} L430 ${212 + i * 80} L442 ${200 + i * 80}`}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="480" y="${186 + i * 80}" width="${220 - i * 14}" height="14" rx="7" fill="#c9d3e2"/><rect x="480" y="${208 + i * 80}" width="120" height="11" rx="5" fill="#e3e8f0"/><rect x="780" y="${190 + i * 80}" width="90" height="16" rx="8" fill="${inflow ? GREEN : RED}" fill-opacity=".85"/>`; }).join("")}
    <path d="M400 560 L480 530 L560 548 L650 500 L740 520 L860 470" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  // credit score gauge
  gauge: () => { const arc = (a0, a1, c) => { const p = (a) => [640 + 280 * Math.cos(Math.PI * (1 - a)), 470 - 280 * Math.sin(Math.PI * (1 - a))]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `<path d="M${x0} ${y0} A280 280 0 0 1 ${x1} ${y1}" fill="none" stroke="${c}" stroke-width="56" stroke-linecap="butt"/>`; };
    return `${arc(0, .25, RED)}${arc(.25, .5, "#e8985c")}${arc(.5, .75, GOLD)}${arc(.75, 1, GREEN)}<g transform="rotate(38 640 470)"><path d="M626 470 L640 230 L654 470Z" fill="#fff"/></g><circle cx="640" cy="470" r="38" fill="#fff"/><circle cx="640" cy="470" r="16" fill="${NAVY}"/><text x="640" y="610" text-anchor="middle" ${F} font-size="96" fill="#fff">720</text>`; },
  // portfolio monitoring
  portfolio: () => `<g transform="translate(400 360) rotate(-90)"><circle r="150" fill="none" stroke="${MID}" stroke-width="62"/><circle r="150" fill="none" stroke="${GOLD}" stroke-width="62" stroke-dasharray="560 943"/><circle r="150" fill="none" stroke="${RED}" stroke-width="62" stroke-dasharray="90 943" stroke-dashoffset="-560"/><circle r="150" fill="none" stroke="${SKY}" stroke-width="62" stroke-dasharray="180 943" stroke-dashoffset="-650"/></g>
    ${[0, 1, 2, 3].map((i) => { const h = [260, 180, 120, 70][i]; return `<rect x="${700 + i * 90}" y="${560 - h}" width="60" height="${h}" rx="12" fill="${[GREEN, GOLD, "#e8985c", RED][i]}"/>`; }).join("")}<rect x="676" y="574" width="380" height="8" rx="4" fill="#fff" fill-opacity=".5"/>`,
  // early warning
  warning: () => `<path d="M220 480 L360 430 L470 460 L590 360 L700 400 L820 260 L1040 200" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 480 L360 430 L470 460 L590 360 L700 400 L820 260 L1040 200 V600 H220Z" fill="${SKY}" fill-opacity=".12"/>
    <path d="M820 130 L920 300 H720Z" fill="${GOLD}" stroke="${GOLD}" stroke-width="14" stroke-linejoin="round"/><rect x="811" y="180" width="18" height="62" rx="9" fill="${NAVY}"/><circle cx="820" cy="268" r="10" fill="${NAVY}"/>
    <g fill="none" stroke="${GOLD}" stroke-width="4" stroke-opacity=".6"><circle cx="820" cy="260" r="110"/><circle cx="820" cy="260" r="160" stroke-opacity=".3"/></g>`,
  // collections and recovery
  recovery: () => `<path d="M880 360 A240 240 0 1 1 760 152" fill="none" stroke="${GOLD}" stroke-width="30" stroke-linecap="round"/><path d="M715 100 L815 150 L735 215Z" fill="${GOLD}"/>
    <circle cx="640" cy="360" r="120" fill="#fff"/><circle cx="640" cy="360" r="96" fill="none" stroke="${NAVY}" stroke-width="6" stroke-dasharray="4 10"/><text x="640" y="398" text-anchor="middle" ${F} font-size="116" fill="${NAVY}">₦</text>
    ${[0, 1, 2].map((i) => `<ellipse cx="1010" cy="${540 - i * 36}" rx="80" ry="26" fill="${i % 2 ? SKY : GOLD}" stroke="${NAVY}" stroke-width="4"/>`).join("")}`,
  // career steps
  career: () => `${[0, 1, 2, 3].map((i) => `<rect x="${280 + i * 170}" y="${470 - i * 90}" width="170" height="${130 + i * 90}" fill="${i === 3 ? GOLD : i % 2 ? MID : "#fff"}" fill-opacity="${i === 3 ? 1 : i % 2 ? 1 : .92}" rx="14"/>`).join("")}
    <circle cx="700" cy="256" r="30" fill="#fff"/><path d="M700 292 q-42 6 -42 60 v36 h84 v-36 q0 -54 -42 -60z" fill="#fff"/>
    <rect x="928" y="150" width="8" height="140" rx="4" fill="#fff"/><path d="M936 154 L1018 184 L936 214Z" fill="${GREEN}"/>`,
  // interview
  interview: () => `<path d="M260 190 h420 a40 40 0 0 1 40 40 v150 a40 40 0 0 1 -40 40 h-250 l-90 76 v-76 h-80 a40 40 0 0 1 -40 -40 v-150 a40 40 0 0 1 40 -40z" fill="#fff"/><text x="470" y="352" text-anchor="middle" ${F} font-size="150" fill="${NAVY}">Q</text>
    <path d="M1020 330 h-380 a40 40 0 0 0 -40 40 v130 a40 40 0 0 0 40 40 h230 l80 66 v-66 h70 a40 40 0 0 0 40 -40 v-130 a40 40 0 0 0 -40 -40z" fill="${GOLD}" transform="translate(-60 40)"/>
    <path d="M770 470 l34 34 l64 -76" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="1010" cy="200" r="52" fill="${RED}"/><path d="M988 178 l44 44 M1032 178 l-44 44" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`,
  // credit bureau report
  bureau: () => `<rect x="380" y="110" width="460" height="500" rx="28" fill="#fff"/><circle cx="470" cy="210" r="42" fill="${MID}"/><circle cx="470" cy="198" r="15" fill="#fff"/><path d="M440 236 q30 -26 60 0 v6 h-60z" fill="#fff"/>
    <rect x="540" y="188" width="200" height="16" rx="8" fill="${NAVY}"/><rect x="540" y="218" width="130" height="12" rx="6" fill="#c9d3e2"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="430" y="${310 + i * 62}" width="${300 - i * 30}" height="14" rx="7" fill="#c9d3e2"/><circle cx="780" cy="${317 + i * 62}" r="12" fill="${i === 3 ? RED : GREEN}"/>`).join("")}
    <circle cx="820" cy="520" r="96" fill="none" stroke="${GOLD}" stroke-width="22"/><path d="M890 592 L970 672" stroke="${GOLD}" stroke-width="30" stroke-linecap="round"/><circle cx="820" cy="520" r="84" fill="${SKY}" fill-opacity=".25"/>`,
  // phone with shield (digital lending rules)
  phoneShield: () => `<rect x="500" y="90" width="280" height="540" rx="44" fill="#0b1830" stroke="#fff" stroke-width="8"/><rect x="522" y="130" width="236" height="460" rx="26" fill="#fff"/><rect x="590" y="106" width="100" height="10" rx="5" fill="#fff" fill-opacity=".5"/>
    <circle cx="640" cy="236" r="52" fill="${GOLD}"/><text x="640" y="274" text-anchor="middle" ${F} font-size="76" fill="${NAVY}">₦</text><rect x="560" y="330" width="160" height="16" rx="8" fill="#c9d3e2"/><rect x="580" y="362" width="120" height="12" rx="6" fill="#e3e8f0"/><rect x="560" y="420" width="160" height="50" rx="25" fill="${NAVY}"/>
    <path d="M800 400 l110 40 v90 q0 90 -110 130 q-110 -40 -110 -130 v-90z" fill="${GREEN}" stroke="${NAVY}" stroke-width="10" stroke-linejoin="round"/><path d="M752 548 l36 36 l70 -80" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  // rating scale (agency ratings)
  rating: () => ["AAA", "AA", "A", "BBB", "BB", "B"].map((g, i) => { const x = 250 + (i % 3) * 270, y = 170 + Math.floor(i / 3) * 210, c = [GREEN, GREEN, "#7cc08a", GOLD, "#e8985c", RED][i]; return `<rect x="${x}" y="${y}" width="240" height="180" rx="26" fill="#fff" fill-opacity=".96"/><rect x="${x}" y="${y + 138}" width="240" height="42" rx="0" fill="${c}"/><rect x="${x}" y="${y + 150}" width="240" height="30" rx="26" fill="${c}"/><text x="${x + 120}" y="${y + 106}" text-anchor="middle" ${F} font-size="${g.length > 2 ? 78 : 96}" fill="${NAVY}">${g}</text>`; }).join("") + `<rect x="796" y="360" width="264" height="204" rx="34" fill="none" stroke="${GOLD}" stroke-width="10" stroke-dasharray="14 12"/><path d="M1000 130 l22 46 l50 7 l-36 35 l9 50 l-45 -24 l-45 24 l9 -50 l-36 -35 l50 -7z" fill="${GOLD}" transform="translate(-20 -40) scale(.9)"/>`,
  // bank
  bank: () => `<path d="M300 280 L640 120 L980 280Z" fill="#fff"/><rect x="320" y="296" width="640" height="24" fill="${GOLD}"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${360 + i * 128}" y="334" width="60" height="206" rx="8" fill="#fff" fill-opacity=".95"/>`).join("")}
    <rect x="290" y="552" width="700" height="28" rx="6" fill="#fff"/><rect x="250" y="590" width="780" height="30" rx="6" fill="${SKY}"/><circle cx="640" cy="224" r="30" fill="${NAVY}"/><text x="640" y="238" text-anchor="middle" ${F} font-size="38" fill="${GOLD}">₦</text>
    <g fill="${GOLD}">${[0, 1, 2].map((i) => `<rect x="${1040 + i * 50}" y="${500 - i * 70}" width="34" height="${120 + i * 70}" rx="8"/>`).join("")}</g>`,
  // globe and markets
  globe: () => `<circle cx="640" cy="360" r="250" fill="${MID}"/><g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4"><ellipse cx="640" cy="360" rx="250" ry="90"/><ellipse cx="640" cy="360" rx="110" ry="250"/><path d="M640 110 V610 M390 360 H890"/><ellipse cx="640" cy="360" rx="190" ry="250"/></g>
    <path d="M250 520 L420 440 L540 480 L700 330 L820 380 L1030 200" fill="none" stroke="${GOLD}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><g fill="#fff" stroke="${GOLD}" stroke-width="6"><circle cx="420" cy="440" r="14"/><circle cx="700" cy="330" r="14"/><circle cx="1030" cy="200" r="14"/></g>`,
};

// slug -> motif. Add new posts/articles here, then re-run.
export const cards = {
  "what-is-credit-risk": "scale",
  "five-cs-of-credit-nigeria": "fiveC",
  "loan-underwriting-process": "checklist",
  "reading-financial-statements-for-credit": "statements",
  "bank-statement-analysis-basics": "bankStatement",
  "introduction-to-credit-scoring": "gauge",
  "portfolio-monitoring-par-npl-fpd": "portfolio",
  "early-warning-indicators": "warning",
  "collections-and-recovery-fundamentals": "recovery",
  "how-to-start-a-credit-risk-career": "career",
  "common-credit-risk-interview-mistakes": "interview",
  "credit-bureau-reports-explained": "bureau",
  "nigeria-digital-lending-rules-back-in-force": "phoneShield",
  "nigerian-banks-recapitalised-who-gets-the-credit": "bank",
  "imf-october-2026-stability-report-credit-risk-takeaways": "globe",
  "africa-credit-rating-agency-afcra-what-it-means": "rating",
};

// Zoom per motif so each fills the card (wide motifs stay at 1).
const scale = { fiveC: 1, bank: 1, warning: 1.05, career: 1.2, globe: 1.25, portfolio: 1.12, recovery: 1.1, statements: 1.12, bankStatement: 1.1, phoneShield: 1.15, bureau: 1.1, rating: 1.05 };
const svg = (slug, motif, i) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d3d6b"/><stop offset="1" stop-color="#0c1c36"/></linearGradient></defs>
<rect width="1280" height="720" fill="url(#bg)"/>
<g stroke="#fff" stroke-opacity=".05" stroke-width="2">${Array.from({ length: 17 }, (_, k) => `<path d="M${k * 80} 0V720"/>`).join("")}${Array.from({ length: 10 }, (_, k) => `<path d="M0 ${k * 80}H1280"/>`).join("")}</g>
<circle cx="${i % 2 ? 1100 : 160}" cy="${i % 3 ? 130 : 600}" r="270" fill="${GOLD}" fill-opacity=".09"/><circle cx="${i % 2 ? 140 : 1140}" cy="${i % 3 ? 640 : 120}" r="200" fill="${SKY}" fill-opacity=".08"/>
<g transform="translate(640 360) scale(${scale[motif] ?? 1.3}) translate(-640 -360)">${motifs[motif]()}</g></svg>`;

if (process.argv[1].endsWith("card-images.mjs")) {
  mkdirSync("public/assets/cards", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 0.75 });
  let i = 0;
  for (const [slug, motif] of Object.entries(cards)) {
    await page.setContent(`<html><body style="margin:0">${svg(slug, motif, i++)}</body></html>`);
    await page.screenshot({ path: `public/assets/cards/${slug}.png`, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log("made", slug);
  }
  await browser.close();
}
