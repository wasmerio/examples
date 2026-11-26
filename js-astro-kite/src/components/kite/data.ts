export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const SPRING_POP = { type: "spring", stiffness: 420, damping: 18, mass: 0.7 } as const;

export const COLORS = {
  paper: "#FFF5EA",
  ink: "#141217",
  tang: "#FF6A13",
  tangDeep: "#E2520A",
  lilac: "#C6B0FF",
  lilacSoft: "#ECE3FF",
  mint: "#93EDC3",
  mintSoft: "#DDFAEB",
  butter: "#FFE15A",
  pink: "#FF9CC5",
};

export const NAV_LINKS = [
  { href: "#kt-invoice", label: "Invoices" },
  { href: "#kt-currency", label: "Currencies" },
  { href: "#kt-tax", label: "Tax pot" },
  { href: "#kt-pricing", label: "Pricing" },
];

export interface Currency {
  code: string;
  name: string;
  rate: number;
  decimals: number;
  color: string;
}

// Balance is stored in USD and converted for display; rates are invented.
export const BASE_BALANCE = 18240.5;
export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US dollar", rate: 1, decimals: 2, color: COLORS.mint },
  { code: "EUR", name: "Euro", rate: 0.92, decimals: 2, color: COLORS.lilac },
  { code: "GBP", name: "Pound", rate: 0.79, decimals: 2, color: COLORS.pink },
  { code: "JPY", name: "Yen", rate: 151.3, decimals: 0, color: COLORS.butter },
  { code: "PLN", name: "Złoty", rate: 3.97, decimals: 2, color: COLORS.tang },
  { code: "BRL", name: "Real", rate: 5.05, decimals: 2, color: COLORS.mint },
];

export function formatMoney(value: number, code: string, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export const PHONE_STEPS = [
  {
    id: "home",
    kicker: "01 / Home",
    title: "Every client, one balance.",
    body: "Payments from twelve countries land in one place. Kite shows what is yours, what is for taxes and what is still on its way.",
  },
  {
    id: "invoice",
    kicker: "02 / Invoices",
    title: "Invoices in 20 seconds.",
    body: "Pick a client, type an amount, hit send. Kite chases late payers politely, so you never have to write “just following up” again.",
  },
  {
    id: "tax",
    kicker: "03 / Tax pot",
    title: "Taxes, set aside on autopilot.",
    body: "A slice of every payment drops into your tax pot the second it lands. In April you just pay, no panic spreadsheet.",
  },
  {
    id: "card",
    kicker: "04 / Card",
    title: "A card that keeps up.",
    body: "Spend in any currency at the real rate. Freeze it, split it, or spin up a virtual card for that one sketchy font website.",
  },
] as const;

export type PhoneScreenId = (typeof PHONE_STEPS)[number]["id"];

export const STICKERS = [
  {
    quote: "I invoiced a client in Tokyo from a train in Lisbon and got paid before my stop.",
    name: "Inès Moreau",
    role: "Motion designer",
    color: "#FFFFFF",
    shape: "rect",
    rotate: -6,
    pos: { left: "3%", top: "6%" },
  },
  {
    quote: "The tax pot is the first money thing that ever made me feel like an adult.",
    name: "Dev Raman",
    role: "iOS developer",
    color: COLORS.lilac,
    shape: "circle",
    rotate: 8,
    pos: { left: "34%", top: "0%" },
  },
  {
    quote: "Clients pay faster. I think the invoices are just too cute to ignore.",
    name: "Hana Kowalczyk",
    role: "Illustrator",
    color: COLORS.mint,
    shape: "rect",
    rotate: 4,
    pos: { left: "67%", top: "8%" },
  },
  {
    quote: "Switched from three banks and a spreadsheet. Now it is one app and zero dread.",
    name: "Tomás Aguilar",
    role: "Copywriter",
    color: COLORS.pink,
    shape: "rect",
    rotate: -3,
    pos: { left: "10%", top: "52%" },
  },
  {
    quote: "Holding euros and dollars at once saved me about $1,900 last year.",
    name: "Priya Shah",
    role: "Brand strategist",
    color: COLORS.paper,
    shape: "rect",
    rotate: 7,
    pos: { left: "44%", top: "50%" },
  },
  {
    quote: "I froze my card mid-panic, found it in my jacket, unfroze it. Ten seconds.",
    name: "Jonah Becker",
    role: "Photographer",
    color: COLORS.tang,
    shape: "circle",
    rotate: -9,
    pos: { left: "74%", top: "50%" },
  },
] as const;

export const PLANS = [
  {
    name: "Glide",
    monthly: 0,
    yearly: 0,
    pitch: "For your first few clients.",
    features: ["Hold 3 currencies", "5 invoices a month", "Tax pot", "Virtual card"],
    cta: "Start free",
    tone: "paper",
  },
  {
    name: "Soar",
    monthly: 9,
    yearly: 7,
    pitch: "For a busy, booked-up year.",
    features: ["Hold 12 currencies", "Unlimited invoices", "Auto late-payment nudges", "Metal holo card", "1.5% back on software"],
    cta: "Try Soar free",
    tone: "tang",
  },
  {
    name: "Stratos",
    monthly: 19,
    yearly: 15,
    pitch: "For studios with a few humans.",
    features: ["Everything in Soar", "Up to 5 team cards", "Accountant access", "Quarterly tax estimates"],
    cta: "Go Stratos",
    tone: "lilac",
  },
] as const;

export const FAQS = [
  {
    q: "Is Kite a bank?",
    a: "Kite is a financial technology company, not a bank. Your money is held by Harbor Trust Bank, member of a deposit insurance scheme, up to $250,000.",
  },
  {
    q: "How fast do clients pay me?",
    a: "Card and bank payments land in your Kite balance within one business day. Kite-to-Kite payments land instantly, even at 3 am on a Sunday.",
  },
  {
    q: "How does the tax pot decide how much to keep?",
    a: "You tell Kite where you live and roughly what you earn. It suggests a percentage, sets it aside from every payment and adjusts as your year changes. You can always change it or move money back.",
  },
  {
    q: "What does it cost to convert currencies?",
    a: "You get the mid-market rate plus a flat 0.4% fee, shown before you confirm. No markup hidden in the rate, ever.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Downgrade to Glide or close your account from settings in two taps. We send your money wherever you want, free.",
  },
];

// Small deterministic RNG so SSR and client render the same decorative layout.
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
