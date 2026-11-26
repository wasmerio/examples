import teamPhoto from "@/assets/images/about.jpg";
import amira from "@/assets/images/people/amira-haddad.jpg";
import bao from "@/assets/images/people/bao-nguyen.jpg";
import clara from "@/assets/images/people/clara-novak.jpg";
import theo from "@/assets/images/people/theo-marchetti.jpg";

export const about = {
  title: "We make payday the calmest day of the month",
  lead: "Payday started when our founders spent a Friday night paying a team in nine countries by hand. Today more than 9,000 companies pay their people with Payday.",
  photo: teamPhoto,
  photoAlt: "Colleagues working together around a desk in a bright office",
  story: {
    title: "Why we started",
    subtitle: "Nobody should dread payday.",
    paragraphs: [
      "Before Payday, Theo ran finance at a startup with people in nine countries, and Clara built payment systems at a bank. Every payday meant spreadsheets, bank portals, exchange rates and a different tax calendar for every country.",
      "The tools they tried handled one country well and the rest badly. So they built one that treats every country the same way: local pay, local taxes and local payslips, all from a single pay run.",
      "That is still the whole company. Everything we ship has to get people paid correctly and on time, or make it easier for a finance team to prove it.",
    ],
  },
  facts: [
    { value: "2022", label: "Founded in Lisbon" },
    { value: "9,000+", label: "Companies paid monthly" },
    { value: "140", label: "Countries supported" },
    { value: "210", label: "People in 24 countries" },
  ],
  principles: {
    title: "What we believe",
    subtitle: "Three rules we don't bend.",
    items: [
      {
        icon: "shield-check",
        title: "Payday is sacred",
        body: "People plan their lives around getting paid. A late or wrong payment is never a small bug.",
      },
      {
        icon: "eye",
        title: "Show every number",
        body: "Every amount on a payslip can be traced back to the rule, rate or hour that produced it.",
      },
      {
        icon: "users",
        title: "Local by default",
        body: "Each country gets its own experts, its own payslips and its own filings, not a translation.",
      },
    ],
  },
  milestones: {
    title: "How we got here",
    items: [
      {
        year: "2022",
        title: "First pay run",
        body: "Twelve people in Portugal, paid from a kitchen table.",
      },
      {
        year: "2023",
        title: "Seed round",
        body: "$14M to build pay runs and tax filings for Europe.",
      },
      {
        year: "2024",
        title: "40 countries",
        body: "Contractor payments and our first teams in Asia.",
      },
      {
        year: "2026",
        title: "Series B",
        body: "$60M to reach 140 countries and open an office in New York.",
      },
    ],
  },
  team: {
    title: "The people behind Payday",
    people: [
      { name: "Theo Marchetti", role: "Co-founder and CEO", photo: theo },
      { name: "Clara Novak", role: "Co-founder and CTO", photo: clara },
      { name: "Amira Haddad", role: "Head of Design", photo: amira },
      { name: "Bao Nguyen", role: "Head of Payroll Operations", photo: bao },
    ],
  },
};
