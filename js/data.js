// Portfolio content — all copy verified against source documents (academic
// certificates, project READMEs). Edit here to update site content; the
// per-page render*.js files read from this file, nothing is hardcoded in HTML.

export const profile = {
  name: "Nahid Hasan Lipu",
  title: "Data Analytics Graduate",
  location: "Auckland, New Zealand",
  tagline:
    "Master of Applied Technologies (Data Analytics), Unitec Institute of Technology, Auckland — with a Computer Science & Engineering background and two and a half years of hands-on data work inside a live US healthcare EHR system.",
  about:
    "I turn messy, real-world data into decisions. My background bridges Computer Science & Engineering with two and a half years working hands-on inside a live US healthcare EHR system at Augmedix, followed by a Master's in Data Analytics at Unitec in Auckland, where my thesis on procedural fairness in HR machine learning was awarded a Grade A. Every project on this site uses real public or official datasets, cleaned and analysed end-to-end in Python, with interactive dashboards in Streamlit and Power BI. I'm open to data analytics roles across any domain — business, financial, or healthcare — in New Zealand.",
  email: "lipunahidhasan@gmail.com",
  phone: "+64 22 456 1172",
  github: "https://github.com/nahid-hasan-lipu",
  linkedin: "https://www.linkedin.com/in/nahid-hasan-lipu-922447355/",
};

export const personalInfo = {
  nationality: "Bangladeshi",
  workRights: "Post-Study Work Visa (3 years, open work permit) — full NZ work rights, no employer sponsorship required",
  location: "Auckland, New Zealand",
  languages: ["Bengali (native)", "English (fluent)", "Hindi"],
  interests: ["Badminton", "Chess & strategy puzzles", "Photography", "Exploring New Zealand's outdoors"],
};

export const education = [
  {
    period: "Feb 2025 — Jul 2026",
    degree: "Master of Applied Technologies (Data Analytics)",
    institution: "Unitec Institute of Technology, Auckland, New Zealand",
    detail: "Thesis: \"Procedural Fairness in HR Machine Learning\" — awarded Grade A.",
  },
  {
    period: "Graduated 2021",
    degree: "Bachelor of Science, Computer Science & Engineering",
    institution: "Daffodil International University, Dhaka, Bangladesh",
    detail: "CGPA 3.43 / 4.0, Faculty of Science and Information Technology.",
  },
  {
    period: "2016",
    degree: "Higher Secondary Certificate (HSC), Science",
    institution: "Savar Cantonment Public School and College, Dhaka, Bangladesh",
    detail: "GPA 5.00 / 5.00",
  },
  {
    period: "2014",
    degree: "Secondary School Certificate (SSC), Science",
    institution: "Biralia High School, Dhaka, Bangladesh",
    detail: "GPA 5.00 / 5.00",
  },
];

// Base-skill categories, each with a description and the specific tools
// underneath it — mirrors the full 33-skill LinkedIn Skills section,
// merged with the hands-on project tooling used across this site.
export const skillGroups = [
  {
    category: "Programming & Data Engineering",
    description: "Core languages and data-handling foundations used across every project on this site.",
    items: ["Python", "SQL", "pandas", "NumPy", "Database Management (DBMS)", "Data Warehousing", "Big Data", "Cloud Computing", "Data Cleaning", "Data Mining", "Git / GitHub"],
  },
  {
    category: "Machine Learning & AI",
    description: "Building and explaining predictive models — from classical ML to deep learning and the fairness auditing that's the focus of my Master's thesis.",
    items: ["Machine Learning", "scikit-learn", "XGBoost", "PyTorch", "Deep Learning", "Artificial Intelligence (AI)", "Explainable AI", "SHAP (SHapley Additive exPlanations)", "AIF360"],
  },
  {
    category: "Statistical Analysis & Research",
    description: "Rigorous testing behind every headline finding on this site, not just eyeballing a chart.",
    items: ["Statistical Analysis", "Hypothesis Testing", "Data Analytics"],
  },
  {
    category: "BI & Visualization",
    description: "Turning analysis into a dashboard a non-technical stakeholder can act on.",
    items: ["Microsoft Power BI", "Streamlit", "Matplotlib", "Plotly", "Data Visualization"],
  },
  {
    category: "Healthcare Data & Compliance",
    description: "Two and a half years working inside a live US healthcare EHR system, with the compliance discipline that requires.",
    items: ["Electronic Health Records (EHR)", "Medical Scribing", "HIPAA", "Process Quality Improvement", "Process Automation"],
  },
  {
    category: "Workplace & Operations",
    description: "Process discipline, accuracy, and customer-facing skills carried over from retail, tech support, and healthcare documentation roles.",
    items: ["Attention to Detail", "Stock Control", "Process Compliance", "Team Collaboration", "Customer Service", "Troubleshooting", "Technical Support"],
  },
];

export const skills = skillGroups.flatMap((g) => g.items);

export const projects = [
  {
    number: "00",
    id: "thesis",
    title: "Procedural Fairness in HR Machine Learning",
    tag: "Master's Thesis · ML Fairness",
    summary:
      "A fairness-audit framework for HR machine-learning models. Turns three organisational-justice constructs — process consistency, voice, transparency — into measurable ML metrics, and benchmarks four bias-mitigation methods head-to-head with statistically rigorous testing across four real HR datasets.",
    stat: "Awarded Grade A · 4 datasets, 4 bias-mitigation methods compared",
    tech: ["Python", "scikit-learn", "SHAP", "AIF360", "Statistical Testing"],
    repo: "https://github.com/nahid-hasan-lipu/procedural-fair-hr-decisions",
    powerbi: false,
  },
  {
    number: "01",
    id: "nz-property",
    title: "NZ Property Market Analytics",
    tag: "Real Estate · New Zealand",
    summary:
      "Residential price trends and rental yield across 67 NZ districts spanning 33 years of official government data. Precisely quantified the COVID-era housing boom and correction — Auckland's crash turned out to be triple the severity the national average suggests.",
    stat: "Auckland: −22.1% from its Dec 2021 peak",
    tech: ["Python", "Power BI"],
    repo: "https://github.com/nahid-hasan-lipu/nz-property-market-analytics",
    powerbi: true,
  },
  {
    number: "02",
    id: "nz-road-safety",
    title: "NZ Road Safety Analytics",
    tag: "Public Safety · New Zealand",
    summary:
      "Crash severity risk factors across 34,866 real NZ crashes from Waka Kotahi NZTA. Motorcycle involvement is the single strongest risk factor found — with a genuinely counter-intuitive twist: fine weather crashes turn out more severe than rain.",
    stat: "Motorcycle involvement = 5.3x severe-crash risk",
    tech: ["Python", "Power BI"],
    repo: "https://github.com/nahid-hasan-lipu/nz-road-safety-analytics",
    powerbi: true,
  },
  {
    number: "03",
    id: "patient-readmission",
    title: "Patient Readmission Risk",
    tag: "Healthcare",
    summary:
      "30-day hospital readmission risk across 70,436 validated diabetic patient encounters. Prior hospitalization more than triples readmission risk — by far the strongest factor, dwarfing age, diagnosis, and length of stay.",
    stat: "Prior admissions: 8.1% → 26.4% readmission risk",
    tech: ["Python", "Power BI"],
    repo: "https://github.com/nahid-hasan-lipu/patient-readmission-risk",
    powerbi: true,
  },
  {
    number: "04",
    id: "hospital-los",
    title: "Hospital Length-of-Stay & Resource Utilization",
    tag: "Healthcare Operations",
    summary:
      "Length-of-stay drivers and bed-day resource utilization across 100,000 hospital encounters and 5 facilities. Found one facility running 58% longer stays than the two largest — a real operational gap, not a volume effect.",
    stat: "3x longer stays with 5+ prior readmissions",
    tech: ["Python"],
    repo: "https://github.com/nahid-hasan-lipu/hospital-los-resource-utilization",
    powerbi: false,
  },
  {
    number: "05",
    id: "retail-segmentation",
    title: "Retail Sales & Customer Segmentation",
    tag: "Business / Retail",
    summary:
      "RFM customer segmentation and cohort retention across 794,667 real transactions for a UK online retailer. 22% of customers generate 68% of revenue — and first-month retention of just 21% points to an onboarding problem, not a loyalty one.",
    stat: "22% of customers generate 68% of revenue",
    tech: ["Python", "Power BI"],
    repo: "https://github.com/nahid-hasan-lipu/retail-sales-customer-segmentation",
    powerbi: true,
  },
  {
    number: "06",
    id: "bank-churn",
    title: "Bank Customer Churn & Value Analytics",
    tag: "Financial Services",
    summary:
      "Churn risk and value segmentation across 10,000 bank customers. Number of products is a spectacular non-monotonic churn predictor — 2 products is the safest position a customer can hold, 4 products is a near-certain departure signal.",
    stat: "4 products held = 100% churn rate",
    tech: ["Python", "Power BI"],
    repo: "https://github.com/nahid-hasan-lipu/bank-customer-churn-value",
    powerbi: true,
  },
  {
    number: "07",
    id: "supply-chain",
    title: "Supply Chain & Delivery Risk Analytics",
    tag: "Operations",
    summary:
      "Delivery risk and profitability across 180,519 real order line items for a global retailer. Late delivery isn't a geography problem — it's a shipping-mode problem, ranging from 38% to 95% late by mode alone.",
    stat: "54.8% of all orders delivered late",
    tech: ["Python"],
    repo: "https://github.com/nahid-hasan-lipu/supply-chain-inventory-risk-analytics",
    powerbi: false,
  },
  {
    number: "08",
    id: "online-shopper",
    title: "Online Shopper Purchase Intent",
    tag: "Marketing / Digital",
    summary:
      "What actually drives purchase conversion across 12,205 real e-commerce sessions. Conversion swings from 1.7% in February to 25.5% in November, and new visitors convert nearly twice as often as returning ones.",
    stat: "Feb 1.7% → Nov 25.5% conversion rate",
    tech: ["Python"],
    repo: "https://github.com/nahid-hasan-lipu/online-shopper-purchase-intent",
    powerbi: false,
  },
];

// Certificates — ordered by relevance to a Data Analyst role, not by date.
// Each `verify` link points to a genuine public credential page (Credly /
// Google Skills) where one exists; where the issuing platform doesn't
// generate a public verification page, `verify` instead points to the
// original certificate document hosted directly on this site, so it's
// still independently viewable rather than just asserted.
export const certifications = [
  {
    id: "aws-academy-cloud-foundations",
    title: "AWS Academy Graduate — AWS Academy Cloud Foundations",
    issuer: "AWS Academy",
    date: "June 2025",
    meta: "20-hour course",
    thumb: "assets/images/certs/aws-academy-cloud-foundations.jpg",
    verify: "https://www.credly.com/go/4GPbwp1j",
    verifyLabel: "View credential",
  },
  {
    id: "kaggle-advanced-sql",
    title: "Advanced SQL",
    issuer: "Kaggle",
    date: "July 2026",
    meta: "Kaggle Learn",
    thumb: "assets/images/certs/kaggle-advanced-sql.jpg",
    verify: "https://www.kaggle.com/learn/certification/nahidhasanlipu/advanced-sql",
    verifyLabel: "View credential",
  },
  {
    id: "kaggle-data-cleaning",
    title: "Data Cleaning",
    issuer: "Kaggle",
    date: "July 2026",
    meta: "Kaggle Learn",
    thumb: "assets/images/certs/kaggle-data-cleaning.jpg",
    verify: "https://www.kaggle.com/learn/certification/nahidhasanlipu/data-cleaning",
    verifyLabel: "View credential",
  },
  {
    id: "kaggle-feature-engineering",
    title: "Feature Engineering",
    issuer: "Kaggle",
    date: "July 2026",
    meta: "Kaggle Learn",
    thumb: "assets/images/certs/kaggle-feature-engineering.jpg",
    verify: "https://www.kaggle.com/learn/certification/nahidhasanlipu/feature-engineering",
    verifyLabel: "View credential",
  },
  {
    id: "kaggle-data-visualization",
    title: "Data Visualization",
    issuer: "Kaggle",
    date: "July 2026",
    meta: "Kaggle Learn",
    thumb: "assets/images/certs/kaggle-data-visualization.jpg",
    verify: "https://www.kaggle.com/learn/certification/nahidhasanlipu/data-visualization",
    verifyLabel: "View credential",
  },
  {
    id: "kaggle-time-series",
    title: "Time Series",
    issuer: "Kaggle",
    date: "July 2026",
    meta: "Kaggle Learn",
    thumb: "assets/images/certs/kaggle-time-series.jpg",
    verify: "https://www.kaggle.com/learn/certification/nahidhasanlipu/time-series",
    verifyLabel: "View credential",
  },
  {
    id: "aws-data-engineering",
    title: "Data Engineering on AWS — Foundations",
    issuer: "AWS Training & Certification",
    date: "July 2026",
    meta: "AWS Skill Builder",
    thumb: "assets/images/certs/aws-data-engineering.jpg",
    verify: "assets/documents/certs/aws-data-engineering-on-aws-foundations.pdf",
    verifyLabel: "View certificate (PDF)",
  },
  {
    id: "aws-serverless-analytics",
    title: "Serverless Analytics",
    issuer: "AWS Training & Certification",
    date: "July 2026",
    meta: "AWS Skill Builder",
    thumb: "assets/images/certs/aws-serverless-analytics.jpg",
    verify: "assets/documents/certs/aws-serverless-analytics.pdf",
    verifyLabel: "View certificate (PDF)",
  },
  {
    id: "google-genai",
    title: "Introduction to Generative AI",
    issuer: "Google Skills",
    date: "July 2026",
    meta: "Google Skills",
    thumb: null,
    verify: "https://www.skills.google/public_profiles/34a901db-6a8f-4fea-914a-54136db175a3/badges/25887712",
    verifyLabel: "View credential",
  },
  {
    id: "google-llms",
    title: "Introduction to Large Language Models",
    issuer: "Google Skills",
    date: "July 2026",
    meta: "Google Skills",
    thumb: null,
    verify: "https://www.skills.google/public_profiles/34a901db-6a8f-4fea-914a-54136db175a3/badges/25888160",
    verifyLabel: "View credential",
  },
  {
    id: "aws-finops-genai",
    title: "Cloud Financial Management: FinOps for GenAI",
    issuer: "AWS Training & Certification",
    date: "July 2026",
    meta: "AWS Skill Builder",
    thumb: "assets/images/certs/aws-finops-genai.jpg",
    verify: "assets/documents/certs/aws-finops-for-genai.pdf",
    verifyLabel: "View certificate (PDF)",
  },
];

export const pages = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "personal", label: "Personal Info", href: "personal.html" },
  { id: "education", label: "Education", href: "education.html" },
  { id: "skills", label: "Skills", href: "skills.html" },
  { id: "certifications", label: "Certifications", href: "certifications.html" },
  { id: "projects", label: "Projects", href: "projects.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];
