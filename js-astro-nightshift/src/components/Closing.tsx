import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT, Mark, Reveal, Skyline, Stars } from "./primitives";

const RULES = [
  { line: "Never merges.", body: "Every pull request waits for a human. Branch protection is checked at the start of each shift, and the shift stops if it is off." },
  { line: "Never touches secrets.", body: "It works in a sandbox with read-only config. Production keys and customer data never reach it." },
  { line: "Never guesses.", body: "If a ticket can be read two ways, it parks the ticket with the question instead of picking one." },
];

export function HouseRules() {
  return (
    <section id="rules" className="relative pb-24 sm:pb-32 lg:pb-40">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-24 lg:self-start lg:pt-3">
          <h2 className="text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.15] font-semibold text-balance">It keeps three house rules, every shift.</h2>
          <p className="mt-4 max-w-[26rem] text-[17px] leading-[1.55] text-(--ink)/80">
            Written into its sandbox, not into a promise on a slide. You can read the policy file in your repo.
          </p>
        </Reveal>
        <ul className="space-y-10 sm:space-y-12">
          {RULES.map((rule, index) => (
            <motion.li
              key={rule.line}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.7 }}
              className="border-t-2 border-(--ink) pt-5"
            >
              <p className="font-display relative inline-block text-[clamp(3.2rem,7.6vw,7.4rem)] leading-[0.86] font-black uppercase">
                <motion.span
                  aria-hidden="true"
                  className="ns-multiply absolute inset-x-[-0.06em] bottom-[0.08em] h-[0.34em] origin-left bg-(--orange)"
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 + index * 0.05 }}
                />
                <span className="relative">{rule.line}</span>
              </p>
              <p className="mt-4 max-w-[34rem] text-[17px] leading-[1.55] text-(--ink)/80">{rule.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Billing = "monthly" | "yearly";

const PLANS = [
  {
    name: "Solo",
    who: "For one person and one repo they care about.",
    monthly: 49,
    yearly: 39,
    admit: "Admit one repo",
    nights: "Mon to Fri nights",
    perks: ["1 repository", "Report in Slack or email", "GitHub or GitLab", "Up to 30 tickets a night"],
    tone: "bg-(--thermal) text-(--ink)",
    cta: "Start tonight's shift",
  },
  {
    name: "Team",
    who: "Most teams pick this one.",
    monthly: 249,
    yearly: 199,
    admit: "Admit ten repos",
    nights: "Every night",
    perks: ["Up to 10 repositories", "Assigns pull requests by code owner", "Parks questions in Linear or Jira", "Weekends included"],
    tone: "bg-(--orange) text-(--ink)",
    cta: "Start tonight's shift",
  },
  {
    name: "Company",
    who: "When the code cannot leave your network.",
    monthly: null,
    yearly: null,
    admit: "Admit all repos",
    nights: "Every night",
    perks: ["Self-hosted runner", "SSO and audit log", "Bring your own model keys", "A named engineer on call"],
    tone: "bg-(--blue) text-(--paper)",
    cta: "Talk to us",
  },
];

function Ticket({ plan, billing, index }: { plan: (typeof PLANS)[number]; billing: Billing; index: number }) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  return (
    <motion.li
      className="group relative"
      initial={{ opacity: 0, y: 40, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.08 }}
    >
      <div
        className={`relative flex flex-col overflow-hidden rounded-[18px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-[0.6deg] md:flex-row ${plan.tone}`}
      >
        <div className="flex-1 p-7 sm:p-9">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h3 className="font-display text-[clamp(3rem,5.4vw,4.6rem)] leading-[0.84] font-black uppercase">{plan.name}</h3>
            <p className="text-[16px] font-medium opacity-80">{plan.who}</p>
          </div>
          <ul className="mt-7 grid gap-x-8 gap-y-2.5 text-[16px] sm:grid-cols-2">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-baseline gap-3">
                <span className="size-2 shrink-0 translate-y-[-2px] rounded-[2px] bg-current opacity-70" aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative md:w-[260px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-0 border-t-2 border-dashed border-current opacity-40 md:inset-x-auto md:inset-y-6 md:left-0 md:border-t-0 md:border-l-2"
          />
          <div className="flex h-full origin-top-left flex-col justify-between gap-6 p-7 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[2.5deg] sm:p-9 md:pl-10">
            <div>
              <p className="font-mono text-[12px] opacity-75">
                {plan.admit}
                <br />
                {plan.nights}
              </p>
              <div className="font-display mt-3 h-[60px] overflow-hidden text-[56px] leading-none font-black">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={price ?? "custom"}
                    className="block"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    {price === null ? "Custom" : `$${price}`}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-1 text-[14px] opacity-75">{price === null ? "Priced per seat" : "a month"}</p>
            </div>
            <a
              href="#start"
              className="inline-flex h-11 items-center justify-center rounded-full border-2 border-current px-5 text-[15px] font-semibold transition-colors duration-300 hover:bg-(--ink) hover:text-(--paper) hover:border-(--ink)"
            >
              {plan.cta}
            </a>
          </div>
        </div>

        <span aria-hidden="true" className="absolute top-[-14px] right-[246px] hidden size-7 rounded-full bg-(--paper) md:block" />
        <span aria-hidden="true" className="absolute right-[246px] bottom-[-14px] hidden size-7 rounded-full bg-(--paper) md:block" />
      </div>
    </motion.li>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <section id="pricing" className="relative pb-24 sm:pb-32 lg:pb-40">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <h2 className="font-display text-[clamp(3.4rem,7.4vw,7rem)] leading-[0.86] font-black uppercase">Pick a shift.</h2>
            <p className="mt-4 max-w-[30rem] text-[17px] leading-[1.55] text-(--ink)/80">
              Billed per workspace, not per ticket. The first seven nights are free on every plan.
            </p>
          </Reveal>
          <div role="radiogroup" aria-label="Billing period" className="relative flex rounded-full border-2 border-(--ink) p-1">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={billing === option}
                onClick={() => setBilling(option)}
                className={`relative h-10 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${billing === option ? "text-(--paper)" : ""}`}
              >
                {billing === option && (
                  <motion.span
                    layoutId="ns-billing"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-(--ink)"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{option === "monthly" ? "Monthly" : "Yearly, save 20%"}</span>
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-14 space-y-5">
          {PLANS.map((plan, index) => (
            <Ticket key={plan.name} plan={plan} billing={billing} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Quote() {
  return (
    <section className="relative pb-24 sm:pb-32 lg:pb-40">
      <Reveal className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <figure className="grid gap-8 border-t-2 border-(--ink) pt-10 md:grid-cols-[auto_1fr] md:gap-14">
          <div className="relative size-20 shrink-0" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-(--orange)" />
            <span className="ns-multiply absolute inset-0 translate-x-2 translate-y-1.5 rounded-full bg-(--blue)" />
            <span className="font-display absolute inset-0 grid place-items-center text-[30px] font-black text-(--paper)">PR</span>
          </div>
          <div>
            <blockquote className="max-w-[24ch] text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.12] font-semibold tracking-[-0.015em] text-balance">
              “I used to start Mondays in the issue tracker. Now I start them in code review, with coffee.”
            </blockquote>
            <figcaption className="mt-6 text-[16px] text-(--ink)/80">
              <span className="font-semibold text-(--ink)">Priya Raman</span>, engineering lead at Halden
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <section id="start" className="px-3 sm:px-5">
      <div className="relative mx-auto min-h-[680px] max-w-[1400px] overflow-hidden rounded-[32px] bg-(--blue) text-(--paper) sm:min-h-[760px]">
        <Stars count={40} seed={14} className="opacity-70" />
        <motion.div
          aria-hidden="true"
          className="absolute top-[14%] right-[10%] hidden size-[clamp(90px,11vw,160px)] sm:block"
          initial={{ y: 80 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.8, ease: EASE_OUT }}
        >
          <span className="absolute inset-0 rounded-full bg-(--orange)" />
          <span className="ns-halftone ns-multiply absolute inset-0 rounded-full text-(--night)/30" />
        </motion.div>

        <div className="relative z-10 px-6 pt-16 sm:px-12 sm:pt-20 lg:px-16">
          <h2 className="font-display max-w-[11ch] text-[clamp(4rem,10.5vw,9.6rem)] leading-[0.84] font-black uppercase">
            Clock out at ten tonight.
          </h2>
          <p className="mt-6 max-w-[32rem] text-[clamp(1.05rem,1.4vw,1.22rem)] leading-[1.55] text-(--paper)/85">
            The first seven nights are free. Connect GitHub and Linear in about four minutes, and Nightshift starts at 22:00 your time.
          </p>
          <form onSubmit={submit} className="mt-9 flex max-w-[34rem] flex-col gap-3 sm:flex-row">
            <label htmlFor="ns-email" className="sr-only">
              Work email
            </label>
            <input
              id="ns-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={done}
              className="h-13 w-full rounded-full border-2 sm:flex-1 border-(--paper)/60 bg-transparent px-6 text-[17px] text-(--paper) placeholder:text-(--paper)/60 focus:border-(--paper) focus:outline-none"
            />
            <button type="submit" disabled={done} className="ns-btn h-13 rounded-full px-7 text-[17px] font-semibold text-(--ink)">
              {done ? "You're on tonight's shift" : "Start tonight's shift"}
            </button>
          </form>
          <p className="mt-4 min-h-6 text-[15px] text-(--paper)/85" aria-live="polite">
            {done ? "Check your inbox for the GitHub link. Your first report arrives at 07:00." : ""}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[27%] min-h-[150px]">
          <Skyline lit={0.5} body="#0f1442" className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { title: "Product", links: ["A night", "The report", "House rules", "Pricing"] },
  { title: "Company", links: ["About", "Security", "Careers", "Changelog"] },
  { title: "Say hi", links: ["hello@example.com", "GitHub", "LinkedIn"] },
];

export function Footer() {
  return (
    <footer className="px-5 pt-20 pb-10 sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex items-start gap-3">
            <Mark className="size-10" />
            <p className="max-w-[18rem] text-[16px] leading-[1.5] text-(--ink)/80">An AI engineer for the hours your team is asleep.</p>
          </div>
          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <p className="text-[15px] font-semibold">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="ns-underline text-[15px] text-(--ink)/80 hover:text-(--ink)">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="group relative mt-20 select-none">
          <p className="font-display absolute inset-0 text-center text-[clamp(4.6rem,19.5vw,19rem)] leading-[0.8] font-black tracking-[-0.02em] text-(--orange) uppercase transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[0.05em] group-hover:translate-y-[0.04em]">
            Nightshift
          </p>
          <p className="font-display ns-multiply relative text-center text-[clamp(4.6rem,19.5vw,19rem)] leading-[0.8] font-black tracking-[-0.02em] uppercase">
            Nightshift
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t-2 border-(--ink) pt-5 text-[14px] text-(--ink)/75">
          <p>© 2026 Nightshift Labs, Oslo.</p>
          <p>Made by people who like sleeping.</p>
        </div>
      </div>
    </footer>
  );
}
