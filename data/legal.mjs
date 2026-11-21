// Privacy Policy, Cookie Policy and Terms and Conditions. build.mjs renders each at its own URL.
// Block types: { p }, { ul: [...] }, { h3 }. The email address in any text is auto-linked.
// This wording describes how the site actually works today. Have a Nigerian lawyer review it, and update it
// whenever you add a new tool (analytics, ads, newsletter provider, etc.).
export const legalUpdated = "2026-11-21";

export const privacyPolicy = [
  { h: "1. Who we are", body: [
    { p: "LearnTern (\"LearnTern\", \"we\", \"us\") publishes credit risk learning resources, articles and digital books at www.learntern.co. This Privacy Policy explains what personal data we collect, why we collect it, how we protect it and the choices you have." },
    { p: "For any privacy question or request, contact us at hello@learntern.co." },
  ] },
  { h: "2. Data we collect", body: [
    { h3: "Information you give us" },
    { ul: [
      "Purchases: your name and email address when you buy a digital product. Payment itself is handled by Paystack, so we never see or store your card or bank details.",
      "Contact and corporate training forms: your name, email, organisation, and the content of your message.",
      "Newsletter, free guide and waitlist sign-ups: your email address and, where asked, your first name.",
    ] },
    { h3: "Information collected automatically" },
    { ul: [
      "Basic technical data such as IP address, browser type, device, pages visited and approximate location, collected by our hosting provider and, if enabled, by analytics tools (see our Cookie Policy).",
      "A short timing signal sent with our forms to help us filter out automated spam. It is not used to identify you.",
      "If you click an advertisement on the Blog, we may record the click (for example as an analytics event) so we can report results to the advertiser.",
    ] },
  ] },
  { h: "3. How we use your data and our legal basis", body: [
    { ul: [
      "To process your order and email your download link (performance of a contract).",
      "To reply to your enquiries and provide corporate training information you asked for (your request / legitimate interest).",
      "To send the newsletter, free guide or updates you signed up for (your consent). You can unsubscribe at any time.",
      "To keep the site secure, prevent spam and fraud, and meet legal and accounting obligations (legitimate interest and legal obligation).",
      "To understand how the site is used and improve it, and to show relevant advertising where enabled (consent, where required).",
    ] },
    { p: "We do not sell your personal data." },
  ] },
  { h: "4. Who we share data with", body: [
    { p: "We use trusted service providers to run LearnTern. They process data on our behalf or under their own privacy terms:" },
    { ul: [
      "Paystack, to process payments.",
      "Resend, to send order, contact and newsletter emails.",
      "Vercel, for website hosting, serverless functions and secure file storage.",
      "Analytics and advertising providers (such as Google Analytics, Google Tag Manager or Google AdSense), only if and when we enable them.",
      "Advertisers do not receive your personal data from us. If you click through to an advertiser's website, their own privacy policy applies.",
    ] },
    { p: "We may also disclose information where required by law, a court order or a regulator, or to protect our rights and users." },
  ] },
  { h: "5. International transfers", body: [
    { p: "Some of our providers store or process data outside Nigeria. Where this happens, we rely on providers that apply appropriate safeguards, as required by the Nigeria Data Protection Act 2023 (NDPA)." },
  ] },
  { h: "6. How long we keep data", body: [
    { ul: [
      "Order records and payment references: as long as needed for accounting, tax and dispute purposes (generally up to six years).",
      "Contact enquiries: up to 24 months after our last communication.",
      "Newsletter subscriptions: until you unsubscribe, after which we keep only a minimal suppression record so you are not re-added.",
    ] },
  ] },
  { h: "7. Your rights", body: [
    { p: "Under the NDPA (and, where it applies to you, other data protection laws), you may ask us to:" },
    { ul: [
      "give you access to the personal data we hold about you;",
      "correct inaccurate or incomplete data;",
      "delete your data, or restrict or object to its use, where the law allows;",
      "withdraw consent at any time (this does not affect processing already done);",
      "provide your data in a portable format.",
    ] },
    { p: "Email hello@learntern.co and we will respond within a reasonable time, normally within 30 days. You also have the right to complain to the Nigeria Data Protection Commission (NDPC)." },
  ] },
  { h: "8. Security", body: [
    { p: "We use HTTPS encryption, signed and time-limited download links, restricted access to private files and well-known providers to protect your data. No online service can be completely secure, so we cannot guarantee absolute security." },
  ] },
  { h: "9. Children", body: [
    { p: "LearnTern is intended for adults and students aged 18 and over. We do not knowingly collect data from children. If you believe a child has given us personal data, contact us and we will delete it." },
  ] },
  { h: "10. Links to other sites", body: [
    { p: "Our articles, blog posts and advertisements may link to third-party websites. We are not responsible for their content or privacy practices." },
  ] },
  { h: "11. Changes to this policy", body: [
    { p: "We may update this policy from time to time. The \"Last updated\" date below shows the latest version. Material changes will be highlighted on this page." },
  ] },
];

export const cookiePolicy = [
  { h: "1. What are cookies?", body: [
    { p: "Cookies are small text files placed on your device when you visit a website. Similar technologies, such as local storage and pixels, work the same way. They help a site function, remember your choices and measure how it is used." },
  ] },
  { h: "2. How LearnTern uses them", body: [
    { h3: "Strictly necessary" },
    { p: "LearnTern is a simple site and does not need to set cookies to browse articles, buy a book or submit a form. Our payment provider, Paystack, may set its own necessary cookies on its secure checkout page to process and protect your payment." },
    { h3: "Analytics (only if enabled)" },
    { p: "If we turn on Google Analytics or Google Tag Manager, they may set cookies that tell us which pages are visited, how long people stay and where visitors come from. This data is aggregated and helps us improve our content." },
    { h3: "Advertising (only if enabled)" },
    { p: "The Blog carries advertisements. If we turn on Google AdSense or similar services, those providers may use cookies or device identifiers to show and measure ads, and to personalise them where permitted. Direct advertiser banners that we place ourselves are labelled as sponsored and do not set cookies on our site." },
  ] },
  { h: "3. Third-party cookies", body: [
    { p: "Some cookies are set by third parties (for example Google or Paystack). We do not control them. See their policies for details:" },
    { ul: [
      "Google: policies.google.com/technologies/cookies",
      "Paystack: paystack.com/privacy",
    ] },
  ] },
  { h: "4. Managing cookies", body: [
    { p: "You can block or delete cookies in your browser settings. Blocking some cookies may affect parts of third-party services such as checkout. You can also opt out of Google's personalised advertising at adssettings.google.com." },
  ] },
  { h: "5. Changes and contact", body: [
    { p: "We will update this policy if we start using new cookies or tools. Questions? Email hello@learntern.co. See also our Privacy Policy." },
  ] },
];

export const terms = [
  { h: "1. Agreement", body: [
    { p: "These Terms and Conditions govern your use of www.learntern.co and any LearnTern product or service. By using the site or buying a product, you agree to these terms, our Privacy Policy, Cookie Policy and Refund Policy. If you do not agree, please do not use the site." },
  ] },
  { h: "2. Educational content only", body: [
    { p: "All articles, books, blog posts and resources are for general education and information. They are not financial, investment, credit, legal, tax or regulatory advice. Regulations, thresholds and market conditions change, so verify important points with official sources or a qualified professional before relying on them. Nothing on LearnTern guarantees a job, promotion, interview outcome or any particular result." },
  ] },
  { h: "3. Digital products and licence", body: [
    { p: "When you buy a digital product, we grant you a personal, non-exclusive, non-transferable licence to use it for your own learning. You may not:" },
    { ul: [
      "copy, resell, redistribute, upload or share the file or your download link;",
      "remove copyright notices or watermarks;",
      "use the material to create competing products or training courses without our written permission.",
    ] },
    { p: "Corporate or team use requires a suitable licence. Contact hello@learntern.co." },
  ] },
  { h: "4. Orders, pricing and delivery", body: [
    { ul: [
      "Prices are shown in Nigerian naira (NGN). Promotional prices may change or end without notice, but the price displayed at checkout is the price you pay.",
      "Payments are processed by Paystack. We may refuse or cancel an order if we suspect fraud, an error or misuse.",
      "After successful payment, a secure download link is emailed to the address you provide. Links expire after 72 hours. Please enter your email correctly and check your spam folder. If you have trouble, contact us and we will help.",
      "Refunds are governed by our Refund Policy.",
    ] },
  ] },
  { h: "5. Intellectual property", body: [
    { p: "All content on LearnTern, including text, books, graphics, illustrations, logos and layout, is owned by LearnTern or its licensors and protected by copyright and other laws. You may quote short extracts with clear attribution and a link back to the source. Any other use needs our written permission." },
  ] },
  { h: "6. Acceptable use", body: [
    { p: "You agree not to misuse the site. This includes attempting to hack or disrupt it, scraping it at scale, submitting false or unlawful information, sending spam through our forms, or infringing anyone's rights." },
  ] },
  { h: "7. Advertising and third-party links", body: [
    { p: "The Blog may display advertisements and sponsored links, which are marked as such. Advertisers are responsible for their own offers, products and claims. LearnTern does not endorse or guarantee them, and you should do your own research before using any financial product or service, including confirming that the provider is properly registered and licensed in your country." },
  ] },
  { h: "8. Disclaimer and limitation of liability", body: [
    { p: "The site and its content are provided \"as is\" and \"as available\" without warranties of any kind. To the fullest extent permitted by law, LearnTern is not liable for any indirect, incidental or consequential loss, or for loss arising from reliance on our content or third-party services. Our total liability for any claim relating to a product is limited to the amount you paid for it. Nothing in these terms excludes liability that cannot be excluded by law." },
  ] },
  { h: "9. Termination", body: [
    { p: "We may suspend or end your access if you breach these terms, for example by sharing paid files." },
  ] },
  { h: "10. Governing law and disputes", body: [
    { p: "These terms are governed by the laws of the Federal Republic of Nigeria. We encourage you to contact us first so we can try to resolve any concern informally. Any dispute not resolved informally will be subject to the courts of Nigeria." },
  ] },
  { h: "11. Changes and contact", body: [
    { p: "We may update these terms from time to time. Continued use of the site after changes means you accept them. Questions? Email hello@learntern.co." },
  ] },
];
