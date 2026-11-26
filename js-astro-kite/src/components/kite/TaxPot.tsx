import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { formatMoney, seeded } from "./data";
import { Reveal, RollingNumber, SectionKicker, StickerIn } from "./ui";

const MIN = 1000;
const MAX = 20000;

function rateFor(income: number) {
  return 0.18 + ((income - MIN) / (MAX - MIN)) * 0.14;
}

const WAVE = "M0 20 Q 50 0 100 20 T 200 20 T 300 20 T 400 20 V 60 H 0 Z";

export function TaxPot() {
  const [income, setIncome] = useState(9000);
  const reduced = useReducedMotion();
  const rate = rateFor(income);
  const aside = Math.round((income * rate) / 10) * 10;
  const fill = 0.12 + 0.68 * (aside / (MAX * rateFor(MAX)));

  const level = useSpring(fill, { stiffness: 70, damping: 13, mass: 0.9 });
  useEffect(() => level.set(fill), [fill, level]);
  const liquidY = useTransform(level, (v) => `${(1 - v) * 100}%`);
  // Liquid sloshes: a fast drag tilts the surface, then it settles.
  const slosh = useSpring(0, { stiffness: 120, damping: 6 });

  const bubbles = useMemo(() => {
    const rand = seeded(11);
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      style: {
        left: `${8 + rand() * 84}%`,
        width: 6 + rand() * 12,
        height: 6 + rand() * 12,
        "--dur": `${2.6 + rand() * 2.8}s`,
        "--delay": `${-rand() * 4}s`,
      } as CSSProperties,
    }));
  }, []);

  return (
    <section id="kt-tax" className="relative overflow-hidden bg-(--mint) px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionKicker>Tax pot</SectionKicker>
            <h2 className="kt-display mt-5 text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
              Taxes? Already
              <br />
              set aside.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-snug font-medium opacity-80">
              Every payment that lands, Kite skims the tax slice into a pot you cannot accidentally spend. Drag to see what a month
              looks like.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <div className="kt-sticker rounded-[28px] bg-(--mint-soft) p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="kt-income" className="text-sm font-extrabold tracking-[0.12em] uppercase opacity-70">
                  Monthly income
                </label>
                <span className="text-3xl font-black">
                  <RollingNumber value={formatMoney(income, "USD", 0)} />
                </span>
              </div>
              <input
                id="kt-income"
                type="range"
                min={MIN}
                max={MAX}
                step={250}
                value={income}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!reduced) slosh.set(Math.max(-9, Math.min(9, (next - income) / 60)));
                  window.setTimeout(() => slosh.set(0), 60);
                  setIncome(next);
                }}
                className="kt-range mt-5 w-full"
                style={{ ["--pct" as string]: `${((income - MIN) / (MAX - MIN)) * 100}%` }}
              />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[20px] border-2 border-(--ink) bg-(--paper) px-4 py-3">
                  <p className="text-xs font-extrabold tracking-[0.12em] uppercase opacity-60">Into the pot</p>
                  <p className="mt-1 text-2xl font-black">
                    <RollingNumber value={formatMoney(aside, "USD", 0)} />
                  </p>
                </div>
                <div className="rounded-[20px] border-2 border-(--ink) bg-(--ink) px-4 py-3 text-(--paper)">
                  <p className="text-xs font-extrabold tracking-[0.12em] uppercase opacity-70">Yours to spend</p>
                  <p className="mt-1 text-2xl font-black text-(--mint)">
                    <RollingNumber value={formatMoney(income - aside, "USD", 0)} />
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-[400px]">
          {/* Lid */}
          <div className="relative z-10 mx-auto h-9 w-[62%] rounded-t-[18px] rounded-b-[8px] border-[2.5px] border-(--ink) bg-(--tang)" />
          <div className="kt-sticker relative mx-auto -mt-1 aspect-[4/5] w-full overflow-hidden rounded-[56px_56px_64px_64px] bg-(--mint-soft)">
            <div aria-hidden="true" className="kt-dots absolute inset-0 opacity-50" />
            <motion.div className="absolute inset-x-0 top-0 h-full" style={{ y: liquidY }}>
              <motion.div className="absolute inset-x-[-10%] -top-5 h-16" style={{ rotate: slosh }}>
                <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="kt-wave absolute top-0 left-0 h-full w-[200%]" style={{ ["--dur" as string]: "5s" }} aria-hidden="true">
                  <path d={WAVE} fill="#FFB27F" />
                  <path d={WAVE} fill="#FFB27F" transform="translate(400 0)" />
                </svg>
                <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="kt-wave absolute top-2 left-0 h-full w-[200%]" style={{ ["--dur" as string]: "3.2s" }} aria-hidden="true">
                  <path d={WAVE} fill="var(--tang)" />
                  <path d={WAVE} fill="var(--tang)" transform="translate(400 0)" />
                </svg>
              </motion.div>
              <div className="absolute inset-x-0 top-8 bottom-0 bg-(--tang)">
                {bubbles.map((b) => (
                  <span key={b.id} className="kt-rise absolute bottom-2 rounded-full border-2 border-(--ink)/40 bg-(--paper)/50" style={b.style} />
                ))}
              </div>
            </motion.div>

            {/* Level tag rides on the surface */}
            <motion.div className="absolute inset-x-0 top-0 z-10 h-full" style={{ y: liquidY }}>
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <span className="kt-sticker-sm block rotate-[-4deg] rounded-full bg-(--paper) px-4 py-1.5 text-lg font-black whitespace-nowrap">
                  {Math.round(rate * 100)}% kept for taxes
                </span>
              </div>
            </motion.div>

            <p className="kt-display absolute inset-x-0 bottom-6 z-10 text-center text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-(--paper)">
              <RollingNumber value={formatMoney(aside * 12, "USD", 0)} />
              <span className="mt-1 block font-[Gabarito] text-base font-extrabold">a year, already sorted</span>
            </p>
          </div>

          <StickerIn rotate={10} delay={0.3} className="absolute -top-2 -right-4 z-20 sm:-right-8">
            <span className="kt-sticker grid h-24 w-24 place-items-center rounded-full bg-(--butter) text-center text-sm leading-tight font-black">
              No more
              <br />
              April
              <br />
              panic
            </span>
          </StickerIn>
        </div>
      </div>
    </section>
  );
}
