// Central site settings and placeholder values. Anything marked PLACEHOLDER needs configuring before launch.
export const site = {
  name: "LearnTern",
  tagline: "Practical Knowledge. Better Credit Decisions.",
  url: process.env.SITE_URL || "https://learntern.com", // PLACEHOLDER: set SITE_URL in Vercel once the domain is connected
  email: "hello@learntern.com", // PLACEHOLDER
  trainingEmail: "training@learntern.com", // PLACEHOLDER
  supportEmail: "support@learntern.com", // PLACEHOLDER
  social: { linkedin: "#", x: "#", instagram: "#", youtube: "#" }, // PLACEHOLDER: add real profile URLs
  gaId: process.env.GA4_ID || "", // e.g. G-XXXXXXXXXX
  gtmId: process.env.GTM_ID || "", // e.g. GTM-XXXXXXX
  currency: "NGN",
};

export const products = [
  {
    slug: "credit-risk-101",
    name: "Credit Risk 101",
    subtitle: "Breaking Into Credit Risk Management: A Practical Career and Interview Guide for the Nigerian Lending Market.",
    short: "A practical guide for graduates, aspiring credit analysts, loan officers and professionals looking to build or advance a career in credit risk management.",
    format: "Ebook (PDF)",
    price: null, // PLACEHOLDER: set the price in NGN (number), e.g. 15000
    pricePlaceholder: "₦ — price to be confirmed",
    image: "/assets/credit-risk-101.webp",
    featured: true,
    includes: ["Credit risk fundamentals explained clearly", "Overview of the Nigerian lending market", "Loan underwriting and credit appraisal basics", "Interview preparation guidance", "Practical case studies"],
    topics: ["Credit risk fundamentals", "Loan underwriting", "Bank statement analysis", "Portfolio quality metrics", "Career and interview guidance"],
    audience: ["Graduates targeting credit and risk roles", "Aspiring credit analysts and loan officers", "Professionals moving into lending", "Anyone preparing for credit risk interviews"],
    description: [
      "Credit Risk 101 is written for people who want to understand how lending decisions are actually made, and how to build a career around making them well.",
      "It focuses on the practical side of credit risk: how to assess a borrower, analyse financial information, identify risks, structure a loan and monitor performance, with the Nigerian lending market as the primary context.",
    ],
  },
  {
    slug: "interview-master-pack",
    name: "Credit Risk Interview Master Pack",
    subtitle: "Technical questions, model answers, case studies and assessment exercises for credit analyst recruitment.",
    short: "A focused preparation pack to help you move beyond memorised definitions and perform confidently in technical interviews and assessments.",
    format: "Digital download (PDF + Excel)",
    price: null,
    pricePlaceholder: "₦ — price to be confirmed",
    image: null,
    cover: { title: "Interview Master Pack", kicker: "LearnTern" },
    includes: ["Technical interview questions", "Model answers", "Case study exercises", "Credit analyst assessment questions"],
    topics: ["Technical credit risk questions", "Behavioural questions", "Underwriting case studies", "Excel and bank statement exercises"],
    audience: ["Candidates preparing for credit analyst interviews", "Graduates facing technical assessments", "Loan officers moving into credit analysis"],
    description: [
      "The Interview Master Pack gives you realistic questions and exercises so you can practise explaining your reasoning, not just reciting definitions.",
      "Use it alongside Credit Risk 101 or on its own if you already know the fundamentals.",
    ],
  },
  {
    slug: "credit-risk-career-bundle",
    name: "Credit Risk Career Bundle",
    subtitle: "Everything you need to learn, practise and prepare: the book, the interview pack and practical templates.",
    short: "The complete starter toolkit for building a credit risk career, combining learning, practice and working templates.",
    format: "Bundle (PDF + Excel + templates)",
    price: null,
    pricePlaceholder: "₦ — price to be confirmed",
    image: null,
    cover: { title: "Career Bundle", kicker: "LearnTern" },
    includes: ["Credit Risk 101", "Credit Risk Interview Master Pack", "Credit appraisal templates", "Excel workbook", "Sample credit memo", "Practical exercises"],
    topics: ["Fundamentals and underwriting", "Interview preparation", "Credit appraisal templates", "Sample credit memo"],
    audience: ["Career changers entering lending", "Graduates building a portfolio of practical skills", "New credit analysts who want working templates"],
    description: [
      "The Career Bundle combines learning and practice in one package so you can study the concepts, rehearse for interviews and work with real-style templates.",
    ],
  },
];

export const courses = [
  { title: "Credit Risk Fundamentals", desc: "Core concepts, expected loss, the credit cycle and how lenders think about risk.", status: "In development" },
  { title: "Practical Loan Underwriting", desc: "Borrower assessment, bank statement analysis and credit appraisal from start to finish.", status: "In development" },
  { title: "Financial Analysis for Credit Analysts", desc: "Reading financial statements and cash flow with a lender's mindset.", status: "Upcoming" },
  { title: "Credit Portfolio Monitoring", desc: "PAR, NPL, FPD, vintages and early warning indicators in practice.", status: "Upcoming" },
  { title: "Credit Risk Interview Preparation", desc: "Technical questions, case studies and assessment practice for aspiring analysts.", status: "Upcoming" },
];
