import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT, seeded } from "./primitives";

// Every receipt line is a product capability; the side note explains it in plain words.
const LINES = [
  {
    label: "Tickets read",
    value: "47",
    title: "It reads before it types.",
    body: "The full thread, linked docs and the code paths involved, so the fix answers the ticket that was actually written.",
  },
  {
    label: "Duplicates linked",
    value: "4",
    title: "Your board shrinks overnight.",
    body: "Similar reports are merged with a short note on why, so the backlog gets smaller while you sleep instead of bigger.",
  },
  {
    label: "Bugs reproduced",
    value: "9",
    title: "Proof before a patch.",
    body: "Every bug gets a failing test or a recorded reproduction before a single line of product code changes.",
  },
  {
    label: "Branches, tests first",
    value: "11",
    title: "One ticket, one branch.",
    body: "The smallest change that makes the new test pass. No sprawling refactor you never asked for.",
  },
  {
    label: "Checks passed",
    value: "214/214",
    title: "Checked twice, your way.",
    body: "Full suite, type check, lint, then a second review against your own style guide and code owners file.",
  },
  {
    label: "Pull requests opened",
    value: "8",
    title: "Diffs a human can read.",
    body: "Each description explains the why, links the ticket and is assigned to whoever owns that part of the code.",
  },
  {
    label: "Parked for you",
    value: "3",
    title: "It asks instead of guessing.",
    body: "When a ticket is unclear it writes down the exact question and leaves the code alone. Those sit at the top of the report.",
  },
];

function Barcode() {
  const bars = useMemo(() => {
    const rand = seeded(77);
    return Array.from({ length: 46 }, (_, i) => ({ id: i, w: 1 + Math.floor(rand() * 3.4), gap: 1 + Math.floor(rand() * 2.2) }));
  }, []);
  return (
    <div className="flex h-12 items-stretch justify-center" aria-hidden="true">
      {bars.map((bar) => (
        <span key={bar.id} className="bg-(--ink)" style={{ width: bar.w, marginRight: bar.gap }} />
      ))}
    </div>
  );
}

export function Receipt() {
  const reduced = useReducedMotion();
  const slotRef = useRef<HTMLDivElement>(null);
  const printed = useInView(slotRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const note = LINES[active];

  return (
    <section id="report" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_430px] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start lg:pt-16">
          <h2 className="font-display text-[clamp(3.4rem,7.4vw,7rem)] leading-[0.86] font-black tracking-[-0.015em] uppercase">
            Every morning, one receipt.
          </h2>
          <p className="mt-6 max-w-[33rem] text-[clamp(1.05rem,1.4vw,1.22rem)] leading-[1.55] text-(--ink)/80">
            No dashboard to log into. At 07:00 Nightshift prints the night into one short report, in Slack or your inbox. Every line on it is
            something it did for you. Point at a line to see how.
          </p>

          <div className="relative mt-12 hidden min-h-[13rem] border-t-2 border-(--ink) pt-7 lg:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <p className="font-mono text-[13px] text-(--ink)/70">
                  {note.label}: {note.value}
                </p>
                <h3 className="font-display mt-3 text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[0.92] font-extrabold uppercase">{note.title}</h3>
                <p className="mt-4 max-w-[30rem] text-[17px] leading-[1.55] text-(--ink)/80">{note.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="relative z-10 h-7 rounded-[10px] bg-(--ink) px-5 pt-3" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-(--night)" />
          </div>

          <div ref={slotRef} className="relative -mt-2.5 overflow-hidden px-3 pb-8">
            <motion.div
              className="relative"
              initial={reduced ? false : { y: "-101%" }}
              animate={printed || reduced ? { y: "0%" } : undefined}
              // A slow start and steady feed reads as a printer pushing paper, not a UI panel sliding in.
              transition={{ duration: 2.6, ease: [0.5, 0, 0.25, 1] }}
            >
              <motion.div
                className="ns-zigzag relative origin-top bg-(--thermal) px-6 pt-9 pb-12 shadow-[0_24px_40px_-28px_rgba(15,20,66,0.55)] sm:px-8"
                animate={{ rotate: sent ? -1.6 : 0.8 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              >
                <div className="text-center">
                  <p className="font-display text-[34px] leading-none font-black uppercase">Nightshift</p>
                  <p className="mt-3 font-mono text-[12px] leading-[1.7] text-(--ink)/75">
                    halden/web
                    <br />
                    Shift 22:00 to 07:00, Thu 6 Nov
                    <br />
                    Report no. 0312
                  </p>
                </div>

                <div className="my-6 border-t-2 border-dashed border-(--ink)/35" />

                <ul className="space-y-1">
                  {LINES.map((line, index) => {
                    const on = index === active;
                    return (
                      <li key={line.label}>
                        <button
                          type="button"
                          aria-expanded={on}
                          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(index)}
                          onFocus={() => setActive(index)}
                          onClick={() => setActive(index)}
                          className="relative flex w-full items-baseline gap-2 rounded-[3px] px-2 py-2 text-left font-mono text-[13px] sm:text-[14px]"
                        >
                          {on && (
                            <motion.span
                              layoutId="ns-highlighter"
                              aria-hidden="true"
                              className="ns-multiply absolute inset-0 -skew-x-6 rounded-[3px] bg-(--orange)/80"
                              transition={{ type: "spring", stiffness: 460, damping: 38 }}
                            />
                          )}
                          <span className="relative">{line.label}</span>
                          <span className="relative mb-1 flex-1 border-b-2 border-dotted border-(--ink)/35" aria-hidden="true" />
                          <span className="relative font-semibold">{line.value}</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.p
                              className="overflow-hidden px-2 text-[14px] leading-[1.5] text-(--ink)/80 lg:hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: EASE_OUT }}
                            >
                              <span className="block pt-1 pb-3">
                                <strong className="font-semibold text-(--ink)">{line.title}</strong> {line.body}
                              </span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                <div className="my-6 border-t-2 border-dashed border-(--ink)/35" />

                <div className="flex items-baseline justify-between px-2">
                  <span className="font-display text-[26px] font-extrabold uppercase">Your review time</span>
                  <span className="font-display text-[26px] font-extrabold">40 min</span>
                </div>
                <p className="mt-3 px-2 font-mono text-[12px] leading-[1.7] text-(--ink)/75">
                  Nothing was merged. Nothing touched production. Questions are waiting in Linear.
                </p>

                <div className="mt-7">
                  <Barcode />
                  <p className="mt-2 text-center font-mono text-[11px] text-(--ink)/60">Sleep well. See you at 22:00.</p>
                </div>

                <AnimatePresence>
                  {sent && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-[38%] right-4 rotate-[-11deg] rounded-[10px] border-[3px] border-(--orange) px-4 py-2 text-(--orange) ns-multiply"
                      initial={{ opacity: 0, scale: 1.7 }}
                      animate={{ opacity: 0.92, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
                    >
                      <p className="font-display text-[30px] leading-none font-black uppercase">Sent 07:00</p>
                      <p className="mt-1 font-mono text-[11px]">#eng-morning</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setSent((s) => !s)}
              aria-pressed={sent}
              className="ns-btn inline-flex h-12 items-center rounded-full px-6 text-[16px] font-semibold"
            >
              {sent ? "Sent to #eng-morning" : "Send to #eng-morning"}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {sent ? "Report sent to the eng-morning channel." : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
