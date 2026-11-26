import ramon from "@/assets/images/people/ramon-villanueva.jpg";

/** Fictional companies. Each has a logo in `src/assets/logos`, named in lowercase. */
export const companies = ["Meridian", "Kestrel", "Ostra", "Halcyon", "Nimbus", "Bramble"] as const;

export type CompanyName = (typeof companies)[number];

export const hero = {
  title: "Payroll that runs on time, everywhere",
  lead: "Pay employees and contractors in 140 countries, file every tax automatically, and run time off and benefits from the same place.",
};

/** The tabbed section. Each tab shows its own product panel, in the same order as the panels in Product.astro. */
export const product = {
  title: "Everything payroll, in one place",
  subtitle: "Four clicks from hours to payday.",
  tabs: [
    {
      icon: "banknote",
      title: "Run payroll",
      body: "Hours, overtime and bonuses pulled in for you. Review the totals, then submit in one click.",
    },
    {
      icon: "landmark",
      title: "Taxes and filings",
      body: "Payday calculates, pays and files payroll taxes in every country you hire in, on time.",
    },
    {
      icon: "calendar-check",
      title: "Time off",
      body: "Requests, approvals and balances that flow straight into the next pay run.",
    },
    {
      icon: "heart",
      title: "Benefits",
      body: "Health, pension and wellbeing plans, with deductions handled on every payslip.",
    },
  ],
};

export const global = {
  title: "Pay your team in 140 countries",
  body: "Local currencies, local payslips and local compliance, all from one pay run.",
};

export const stats = [
  { value: "$4.2B", label: "Paid out every year" },
  { value: "140", label: "Countries" },
  { value: "99.9%", label: "Pay runs on time" },
];

export const quote = {
  text: "We pay 180 people across nine countries. Payroll used to take our finance team three days a month. With Payday it takes one morning, and nobody has been paid late since.",
  name: "Ramon Villanueva",
  role: "VP Finance, Meridian",
  photo: ramon,
};

export const bento = {
  title: "Built for finance, loved by the team",
  subtitle: "Everyone gets what they need, nobody waits for an email.",
  cards: [
    {
      id: "payslips",
      title: "Payslips",
      body: "Every employee gets a clear payslip in their own language and currency.",
    },
    {
      id: "contractors",
      title: "Contractor payments",
      body: "Pay contractors in their local currency and collect tax forms automatically.",
    },
    {
      id: "onboarding",
      title: "Onboarding",
      body: "Contracts, bank details and tax forms collected before day one.",
    },
    {
      id: "expenses",
      title: "Expenses",
      body: "Snap a receipt, get it approved, and see it paid back on the next payday.",
    },
    {
      id: "reports",
      title: "Reports",
      body: "Payroll cost by team, country and month, ready to export.",
    },
    {
      id: "integrations",
      title: "Integrations",
      body: "Sync journals to QuickBooks and Xero, and people to Slack and Okta.",
    },
  ],
} as const;

export interface Plan {
  name: string;
  /** Per person per month. `null` shows "Custom". */
  monthly: number | null;
  yearly: number | null;
  body: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export const pricing = {
  title: "Simple pricing",
  subtitle: "Per person, per month. No setup fees.",
  plans: [
    {
      name: "Starter",
      monthly: 10,
      yearly: 8,
      body: "For small teams in one country.",
      features: [
        "Unlimited pay runs",
        "Automatic tax filings",
        "Payslips and pay stubs",
        "Contractor payments",
      ],
      cta: { label: "Get started", href: "#" },
    },
    {
      name: "Growth",
      monthly: 18,
      yearly: 14,
      body: "For teams hiring across borders.",
      features: [
        "Everything in Starter",
        "Payroll in 140 countries",
        "Time off and approvals",
        "Benefits administration",
        "Accounting sync",
      ],
      cta: { label: "Get started", href: "#" },
      featured: true,
    },
    {
      name: "Enterprise",
      monthly: null,
      yearly: null,
      body: "For larger companies with custom needs.",
      features: [
        "Everything in Growth",
        "SSO and SCIM",
        "Custom approval chains",
        "Audit log",
        "A dedicated payroll specialist",
      ],
      cta: { label: "Contact sales", href: "/contact/" },
    },
  ] satisfies Plan[],
};

export const stories = {
  title: "Customer stories",
  subtitle: "Teams that stopped dreading payday.",
  items: [
    {
      company: "Kestrel",
      metric: "3 days",
      text: "saved on every month-end close",
      tone: "dusk",
    },
    { company: "Halcyon", metric: "12", text: "countries paid from one pay run", tone: "sea" },
    {
      company: "Nimbus",
      metric: "0",
      text: "late payments since switching to Payday",
      tone: "ember",
    },
  ],
} as const;

export const faq = {
  title: "Questions",
  items: [
    {
      question: "How long does it take to switch to Payday?",
      answer:
        "Most teams run their first payroll within a week. We import your employees, past pay runs and year-to-date totals, and check them with you before the first run.",
    },
    {
      question: "Do you file payroll taxes for us?",
      answer:
        "Yes. Payday calculates, pays and files payroll taxes in every country you hire in, and keeps a copy of every filing in your account.",
    },
    {
      question: "Can we pay contractors and employees together?",
      answer:
        "Yes. Contractors and employees can be paid in the same run, each in their own currency, with the right forms collected for both.",
    },
    {
      question: "Which accounting tools do you integrate with?",
      answer:
        "QuickBooks, Xero and NetSuite. Each pay run posts a journal entry with the costs split by team and country.",
    },
    {
      question: "What happens if a payment is late?",
      answer:
        "Payments are sent two working days before payday. If one is ever late because of us, we cover the fees and any penalties.",
    },
  ],
};

export const security = {
  title: "Safe and secure",
  body: "Payday is audited for SOC 2 Type II, encrypts bank and tax details at rest, and requires two-factor sign-in for anyone who can approve a pay run.",
  points: ["SSO and SCIM", "EU or US data residency", "Audit log", "Two-factor approvals"],
};

export const closing = {
  title: "Your next payday, already handled",
};
