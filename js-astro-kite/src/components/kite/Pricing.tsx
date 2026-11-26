import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { PLANS } from "./data";
import { Magnetic, Reveal, RollingNumber, StickerIn } from "./ui";

const TONES: Record<string, string> = { paper: "var(--paper)", tang: "var(--tang)", lilac: "var(--lilac)" };
const TILTS = [-1.5, 0, 1.5];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="kt-pricing" className="relative bg-(--paper) px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="kt-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">Pick your altitude.</h2>
          <p className="mt-4 max-w-md text-lg font-medium opacity-80">Start free. Upgrade when the clients pile up. Cancel in two taps.</p>

          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((y) => !y)}
            className="mt-8 inline-flex items-center gap-4 text-lg font-extrabold"
          >
            <span className={yearly ? "opacity-50" : ""}>Monthly</span>
            <span className="relative h-11 w-20 rounded-full border-[2.5px] border-(--ink) bg-(--mint) shadow-[0_4px_0_var(--ink)]">
              <motion.span
                className="absolute top-1 left-1 grid h-7 w-7 place-items-center rounded-full border-[2.5px] border-(--ink) bg-(--paper)"
                animate={{ x: yearly ? 36 : 0, rotate: yearly ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-(--ink)" />
              </motion.span>
            </span>
            <span className={yearly ? "" : "opacity-50"}>
              Yearly <span className="ml-1 rounded-full bg-(--ink) px-2 py-0.5 text-sm text-(--butter)">2 months free</span>
            </span>
          </button>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const hot = plan.tone === "tang";
            return (
              <StickerIn key={plan.name} rotate={TILTS[i]} delay={i * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -8, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`kt-sticker relative flex h-full flex-col rounded-[32px] p-7 ${hot ? "md:-mt-4 md:pb-11" : ""}`}
                  style={{ background: TONES[plan.tone] }}
                >
                  {hot && (
                    <span className="kt-sticker-sm absolute -top-4 right-6 rotate-[6deg] rounded-full bg-(--butter) px-3 py-1 text-sm font-black">
                      Most loved
                    </span>
                  )}
                  <p className="kt-display text-4xl leading-none">{plan.name}</p>
                  <p className="mt-2 font-semibold opacity-80">{plan.pitch}</p>
                  <p className="mt-6 flex items-end gap-1">
                    <span className="kt-display text-7xl leading-[0.85]">
                      $<RollingNumber value={String(price)} />
                    </span>
                    <span className="pb-1 font-bold opacity-70">/ month</span>
                  </p>
                  <p className="mt-1 h-5 text-sm font-bold opacity-60">{price > 0 && yearly ? `billed $${price * 12} a year` : price > 0 ? "billed monthly" : "free forever"}</p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 font-semibold">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-(--ink) bg-(--paper)">
                          <Check className="h-3 w-3" strokeWidth={4} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Magnetic className="mt-8 w-full">
                    <a
                      href="#top"
                      className={`kt-btn block w-full rounded-full px-6 py-3.5 text-center text-lg font-extrabold ${hot ? "bg-(--ink) text-(--paper)" : "bg-(--paper)"}`}
                    >
                      {plan.cta}
                    </a>
                  </Magnetic>
                </motion.div>
              </StickerIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
