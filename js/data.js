// Portfolio content — all copy verified against each project's own README.
// Edit here to update card content; index.html and app.js read from this file.

export const profile = {
  name: "Nahid Hasan Lipu",
  title: "Data Analytics Postgraduate",
  location: "Auckland, New Zealand",
  tagline:
    "Master of Applied Technologies (Data Analytics), Unitec Institute of Technology — with a Computer Science & Engineering background and two and a half years of hands-on data work inside a live US healthcare EHR system.",
  about:
    "I turn messy, real-world data into decisions. My background bridges Computer Science & Engineering with two and a half years working hands-on inside a live US healthcare EHR system at Augmedix, followed by a Master's in Data Analytics at Unitec in Auckland. Every project on this site uses real public or official datasets, cleaned and analysed end-to-end in Python, with interactive dashboards in Streamlit and Power BI. I'm open to data analytics roles across any domain — business, financial, or healthcare — in New Zealand.",
  email: "lipunahidhasan@gmail.com",
  github: "https://github.com/nahid-hasan-lipu",
  linkedin: "https://www.linkedin.com/in/nahid-hasan-lipu-922447355/",
};

export const skills = [
  "Python", "pandas", "NumPy", "scikit-learn", "SQL", "Power BI",
  "Streamlit", "Matplotlib", "Plotly", "Statistical Analysis",
  "Machine Learning", "Git / GitHub",
];

export const projects = [
  {
    number: "00",
    id: "thesis",
    title: "Procedural Fairness in HR Machine Learning",
    tag: "Master's Thesis · ML Fairness",
    summary:
      "A fairness-audit framework for HR machine-learning models. Turns three organisational-justice constructs — process consistency, voice, transparency — into measurable ML metrics, and benchmarks four bias-mitigation methods head-to-head with statistically rigorous testing across four real HR datasets.",
    stat: "4 datasets · 4 bias-mitigation methods compared",
    tech: ["Python", "scikit-learn", "SHAP", "Statistical Testing"],
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
