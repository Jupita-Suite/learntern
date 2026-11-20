// Advertising. Direct (sponsored) ads are listed here; Google AdSense is optional.
//
// To add an ad: drop the banner image in public/assets/ads/, add an object below, rebuild.
//   placements: "blog-top" (top of the Blog page) and/or "article-inline" (inside each article).
//   start / end: "YYYY-MM-DD". The site only shows an ad between these dates (checked at build time,
//   so it takes effect on the next deploy). Leave end as null for no end date.
//   Remove an ad by deleting it or setting end to a past date.
// The first ad whose placement and dates match is shown. Every ad is labelled "Sponsored".
export const ads = [
  {
    id: "credmate-salary-loan",
    advertiser: "Credmate",
    href: "https://getcredmate.co/?utm_source=learntern&utm_medium=blog_banner&utm_campaign=salary-loan-access",
    image: "/assets/ads/credmate-salary-loan.webp",
    width: 1672,
    height: 941,
    alt: "Advertisement from Credmate: Salary Loan Access, simple, fast and built for professionals, with disbursement in less than 2 hours. Visit getcredmate.co.",
    placements: ["blog-top", "article-inline"],
    start: "2026-11-20",
    end: null,
  },
];

// Google AdSense (optional, off by default). Set both in Vercel to switch it on:
//   ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX   ADSENSE_SLOT = your ad unit id
// Needs an approved AdSense account, a live privacy policy and cookie/consent handling first.
// When on, AdSense fills the article-end slot; direct ads above always take priority in their own slots.
export const adsense = {
  client: process.env.ADSENSE_CLIENT || "",
  slot: process.env.ADSENSE_SLOT || "",
};
