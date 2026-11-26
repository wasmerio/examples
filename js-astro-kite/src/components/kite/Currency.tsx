import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { BASE_BALANCE, CURRENCIES, EASE_OUT, formatMoney } from "./data";
import { Reveal, RollingNumber, SectionKicker } from "./ui";

const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", PLN: "zł", BRL: "R$" };
const FLOATERS = [
  { code: "EUR", left: "6%", top: "18%", size: 84, rotate: -12, dur: 4.2 },
  { code: "GBP", left: "86%", top: "14%", size: 72, rotate: 10, dur: 5 },
  { code: "JPY", left: "10%", top: "70%", size: 64, rotate: 8, dur: 4.6 },
  { code: "BRL", left: "84%", top: "66%", size: 90, rotate: -8, dur: 5.4 },
];

export function Currency() {
  const [code, setCode] = useState("USD");
  const touched = useRef(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const cur = CURRENCIES.find((c) => c.code === code)!;

  const pick = (next: string) => {
    touched.current = true;
    setCode(next);
  };

  // Cycles currencies while in view until the visitor picks one.
  useEffect(() => {
    if (!inView || reduced || touched.current) return;
    const id = window.setInterval(() => {
      if (touched.current) return;
      setCode((c) => CURRENCIES[(CURRENCIES.findIndex((x) => x.code === c) + 1) % CURRENCIES.length].code);
    }, 2400);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <section id="kt-currency" ref={ref} className="relative overflow-hidden bg-(--lilac) px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      {FLOATERS.map((f, i) => {
        const c = CURRENCIES.find((x) => x.code === f.code)!;
        return (
          <motion.button
            key={f.code}
            type="button"
            aria-label={`Show balance in ${c.name}`}
            onClick={() => pick(f.code)}
            className="absolute z-10 hidden lg:block"
            style={{ left: f.left, top: f.top }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 14, delay: 0.2 + i * 0.1 }}
          >
            <span
              className="kt-bob kt-sticker grid place-items-center rounded-full font-black"
              style={{
                width: f.size,
                height: f.size,
                fontSize: f.size * 0.36,
                background: c.color,
                ["--dur" as string]: `${f.dur}s`,
                ["--tilt" as string]: `${f.rotate}deg`,
              }}
            >
              {SYMBOLS[f.code]}
            </span>
          </motion.button>
        );
      })}

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <SectionKicker>Currencies</SectionKicker>
          <h2 className="kt-display mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
            Get paid in 38.
            <br />
            Hold 12. Swap in a blink.
          </h2>
        </Reveal>

        <div className="kt-sticker relative mx-auto mt-12 max-w-4xl rounded-[36px] bg-(--paper) px-5 py-10 sm:px-10 sm:py-14">
          <p className="text-sm font-extrabold tracking-[0.14em] uppercase opacity-60">Your balance</p>
          <p className="kt-display mt-3 text-[clamp(2.7rem,9.5vw,7.4rem)] leading-none whitespace-nowrap" aria-live="polite">
            <RollingNumber value={formatMoney(BASE_BALANCE * cur.rate, cur.code, cur.decimals)} />
          </p>

          <div className="mt-8 inline-flex max-w-full flex-wrap justify-center gap-1.5 rounded-[22px] border-[2.5px] border-(--ink) bg-(--lilac-soft) p-1.5" role="radiogroup" aria-label="Currency">
            {CURRENCIES.map((c) => {
              const active = c.code === code;
              return (
                <button
                  key={c.code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => pick(c.code)}
                  className="relative rounded-2xl px-4 py-2.5 text-base font-extrabold sm:px-5"
                >
                  {active && (
                    <motion.span
                      layoutId="kt-currency-pill"
                      className="absolute inset-0 rounded-2xl border-2 border-(--ink)"
                      style={{ background: c.color }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span className="relative">{c.code}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 h-12 overflow-hidden text-base font-bold sm:h-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={code}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 0.75 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                {code === "USD"
                  ? "Mid-market rate, 0.4% flat fee, shown before you swap."
                  : `1 USD = ${cur.rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${cur.code} · mid-market, no markup`}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
          {[
            ["1 day", "Card and bank payments land by the next business day."],
            ["0.4%", "Flat conversion fee. The rate is the real one."],
            ["12", "Currencies you can hold side by side, no swap needed."],
          ].map(([big, small], i) => (
            <Reveal key={big} delay={i * 0.08}>
              <div className="kt-sticker-sm h-full rounded-[24px] bg-(--lilac-soft) px-5 py-5 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg]">
                <p className="kt-display text-4xl leading-none">{big}</p>
                <p className="mt-2 font-semibold opacity-80">{small}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
