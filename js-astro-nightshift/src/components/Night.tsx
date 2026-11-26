import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE_OUT, Skyline, Stars } from "./primitives";

const NIGHT_MINUTES = 9 * 60;

// `at` is minutes after 22:00, so each step lands on the clock exactly when its hour scrolls past.
const STEPS = [
  { at: 0, time: "22:00", title: "You log off.", body: "Nightshift pulls every ticket in its queue and reads the whole thread, not just the title.", tally: "47 tickets in the queue" },
  { at: 70, time: "23:10", title: "Triage.", body: "Duplicates get linked, bugs get a reproduction, and everything gets a label and a priority.", tally: "4 duplicates, 9 repros" },
  { at: 150, time: "00:30", title: "Fixes, one branch each.", body: "Tests come first. Then the smallest change that makes them pass, and nothing it was not asked for.", tally: "11 branches" },
  { at: 340, time: "03:40", title: "Checks, twice.", body: "Full suite, type check and a review against your style guide. Anything it is unsure of is parked, not guessed.", tally: "214 of 214 green" },
  { at: 450, time: "05:30", title: "Pull requests.", body: "Readable diffs with the why in the description, assigned to whoever owns the code.", tally: "8 opened" },
  { at: 540, time: "07:00", title: "Morning report.", body: "One page on your desk: what shipped, what waits for you, and what it could not solve.", tally: "40 minutes of review" },
];

const HOURS = ["22", "23", "00", "01", "02", "03", "04", "05", "06", "07"];

function clock(progress: number) {
  const total = 22 * 60 + Math.round((progress * NIGHT_MINUTES) / 5) * 5;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function Night() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const [cityLit, setCityLit] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // The last 8% holds on 07:00 so the morning reads before the page moves on.
  const p = useTransform(scrollYProgress, [0, 0.92], [0, 1], { clamp: true });

  // Ink changes plate by plate: dusk blue, two hits of night, a crimson dawn, sun yellow, then back to bare paper.
  const sky = useTransform(p, [0, 0.14, 0.72, 0.85, 0.93, 1], ["#2c4be0", "#0f1442", "#0f1442", "#b2374a", "#ffc93c", "#e8ecec"]);
  const text = useTransform(p, [0.86, 0.92], ["#e8ecec", "#151b5b"]);
  const starOpacity = useTransform(p, [0, 0.16, 0.7, 0.84], [0.2, 1, 1, 0]);
  const moonX = useTransform(p, [0, 0.86], ["6%", "56%"]);
  const moonY = useTransform(p, [0, 0.43, 0.86], ["74%", "26%", "80%"]);
  const sunY = useTransform(p, [0.8, 1], ["120%", "44%"]);
  const railScale = useTransform(p, [0, 1], [0, 1]);

  // Writing the clock straight to the DOM keeps React out of the per-frame path; only step changes re-render.
  useMotionValueEvent(p, "change", (value) => {
    if (clockRef.current) clockRef.current.textContent = clock(value);
    const minutes = value * NIGHT_MINUTES;
    let index = 0;
    STEPS.forEach((s, i) => {
      if (minutes >= s.at - 4) index = i;
    });
    setStep((prev) => (prev === index ? prev : index));
    const lit = value < 0.9 ? 0 : Math.round(((value - 0.9) / 0.1) * 10) / 10;
    setCityLit((prev) => (prev === lit ? prev : lit));
  });

  const current = STEPS[step];

  return (
    <section ref={trackRef} id="night" className="relative h-[560vh]" aria-label="One night, from 22:00 to 07:00">
      <motion.div className="sticky top-0 h-svh overflow-hidden" style={{ backgroundColor: sky, color: text }}>
        <motion.div style={{ opacity: starOpacity }}>
          <Stars count={90} seed={21} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute size-[clamp(90px,13vw,190px)] -translate-x-1/2 -translate-y-1/2"
          style={{ left: moonX, top: moonY }}
        >
          <div className="absolute inset-0 rounded-full bg-(--orange)" />
          <div className="ns-halftone ns-multiply absolute inset-0 rounded-full text-(--night)/30" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="absolute right-[5%] size-[clamp(160px,22vw,330px)] rounded-full bg-(--sun)"
          style={{ top: sunY }}
        />

        <div className="relative mx-auto flex h-full max-w-[1320px] flex-col px-5 pt-8 sm:px-8 sm:pt-10">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="max-w-[16ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug font-semibold">
              One night on the Halden web repo.
            </h2>
            <p className="hidden text-[15px] opacity-75 sm:block">Keep scrolling, the clock follows you.</p>
          </div>

          <div className="relative mt-6" aria-hidden="true">
            <div className="flex justify-between font-mono text-[11px] opacity-70 sm:text-[12px]">
              {HOURS.map((h) => (
                <span key={h} className="w-0 text-center">
                  <span className="-ml-[1ch] inline-block">{h}</span>
                </span>
              ))}
            </div>
            <div className="relative mt-2 h-[3px]">
              <div className="absolute inset-0 bg-current opacity-25" />
              <motion.div className="absolute inset-0 origin-left bg-(--orange)" style={{ scaleX: railScale }} />
            </div>
          </div>

          <div className="relative grid flex-1 content-start gap-8 pt-[4vh] lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-12 lg:pt-[7vh]">
            <span
              ref={clockRef}
              aria-hidden="true"
              className="font-display block text-[clamp(7.5rem,24vw,21rem)] leading-[0.78] font-black tracking-[-0.03em] tabular-nums"
            >
              22:00
            </span>

            <div className="relative min-h-[13rem] lg:pt-[2vh]" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.time}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <p className="font-mono text-[13px] opacity-75">{current.time}</p>
                  <h3 className="font-display mt-2 text-[clamp(2.6rem,4.6vw,4.4rem)] leading-[0.9] font-extrabold uppercase">
                    {current.title}
                  </h3>
                  <p className="mt-4 max-w-[30rem] text-[clamp(1rem,1.3vw,1.18rem)] leading-[1.5] opacity-85">{current.body}</p>
                  <p className="mt-5 inline-flex items-center gap-2.5 text-[15px] font-semibold">
                    <span className="size-2.5 rounded-[2px] bg-(--orange)" aria-hidden="true" />
                    {current.tally}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32vh] min-h-[170px]">
          <Skyline lit={cityLit} body="#080b2e" off="#1a2060" className="absolute inset-0 h-full w-full" />
        </div>
      </motion.div>

      <ol className="sr-only">
        {STEPS.map((s) => (
          <li key={s.time}>
            {s.time} {s.title} {s.body} {s.tally}.
          </li>
        ))}
      </ol>
    </section>
  );
}
