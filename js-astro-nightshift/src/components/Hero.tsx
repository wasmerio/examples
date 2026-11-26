import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { AGENT_POS, EASE_OUT, Mark, PrimaryButton, Skyline, Stars } from "./primitives";

const LINKS = [
  { href: "#night", label: "A night" },
  { href: "#report", label: "The report" },
  { href: "#rules", label: "House rules" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
    >
      <nav className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 sm:px-8" aria-label="Main">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Nightshift home">
          <Mark className="size-8 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-[30deg]" />
          <span className="font-display text-[26px] leading-none font-extrabold tracking-[-0.01em] uppercase">Nightshift</span>
        </a>
        <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
          {LINKS.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                onPointerEnter={() => setHovered(link.href)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                className="relative z-10 block px-4 py-2 text-[15px] font-medium"
              >
                {link.label}
              </a>
              {hovered === link.href && (
                <motion.span
                  layoutId="ns-nav-ink"
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-1 h-[9px] rounded-[2px] bg-(--orange) ns-multiply"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
            </li>
          ))}
        </ul>
        <a href="#start" className="ns-underline hidden text-[15px] font-semibold sm:inline">
          Start tonight's shift
        </a>
      </nav>
    </motion.header>
  );
}

function useCountdown() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const start = new Date(now);
      start.setHours(22, 0, 0, 0);
      const end = new Date(now);
      end.setHours(7, 0, 0, 0);
      const onShift = now >= start || now < end;
      if (onShift) {
        setLabel("Tonight's shift is running right now.");
        return;
      }
      const diff = Math.floor((start.getTime() - now.getTime()) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setLabel(`Tonight's shift starts in ${h}:${m}:${s}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

const HEADLINE = ["It works", "the night", "shift."];

export function Hero() {
  const reduced = useReducedMotion();
  const posterRef = useRef<HTMLDivElement>(null);
  const [lightsOut, setLightsOut] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const countdown = useCountdown();

  // The office empties on load: every window starts lit, then they switch off one by one except the agent's.
  useEffect(() => {
    const id = window.setTimeout(() => setLightsOut(true), reduced ? 0 : 900);
    return () => window.clearTimeout(id);
  }, [reduced]);

  // Cursor nudges the moon plate and the sky plate in opposite directions, like ink layers slipping out of register.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.5 });
  const moonX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const moonY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const biteX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const biteY = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const cityX = useTransform(sx, [-0.5, 0.5], [8, -8]);

  return (
    <section id="top" className="relative overflow-clip pt-24 pb-16 sm:pt-28 lg:pb-24">
      <div className="mx-auto grid max-w-[1320px] items-end gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="relative z-10 lg:pb-6">
          <h1 className="font-display text-[clamp(4.6rem,11.6vw,10.4rem)] leading-[0.84] font-black tracking-[-0.02em] uppercase">
            {HEADLINE.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + index * 0.11 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
          >
            <p className="mt-8 max-w-[34rem] text-[clamp(1.08rem,1.5vw,1.3rem)] leading-[1.5] text-pretty text-(--ink)/80">
              Nightshift is an AI engineer that picks up your backlog when the team logs off. By 07:00 there is a report on your desk:
              fixes with tests, pull requests ready to review, and an honest list of what it left for you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <PrimaryButton href="#start">Start tonight's shift</PrimaryButton>
              <a href="#night" className="ns-underline text-[17px] font-semibold">
                Watch one night
              </a>
            </div>
            <p className="mt-8 min-h-6 font-mono text-[13px] text-(--ink)/70" aria-live="off">
              {countdown ?? " "}
            </p>
          </motion.div>
        </div>

        <motion.div
          ref={posterRef}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-(--blue) max-lg:aspect-[5/6]"
          initial={{ clipPath: "inset(100% 0% 0% 0% round 28px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          onPointerMove={(e) => {
            if (reduced || e.pointerType !== "mouse" || !posterRef.current) return;
            const r = posterRef.current.getBoundingClientRect();
            px.set((e.clientX - r.left) / r.width - 0.5);
            py.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: lightsOut ? 1 : 0 }}
            transition={{ duration: 1.6, delay: 0.6 }}
          >
            <Stars count={46} seed={3} />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute top-[11%] right-[13%] size-[34%]"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.55 }}
          >
            <motion.div className="absolute inset-0 rounded-full bg-(--orange)" style={{ x: moonX, y: moonY }} />
            <motion.div
              className="ns-halftone ns-multiply absolute inset-0 rounded-full text-(--night)/35"
              style={{ x: moonX, y: moonY }}
            />
            <motion.div
              className="absolute top-[-16%] left-[30%] size-[88%] rounded-full bg-(--blue)"
              style={{ x: biteX, y: biteY }}
            />
          </motion.div>

          <motion.div className="absolute bottom-0 left-1/2 aspect-[1200/360] w-[215%] -translate-x-1/2" style={{ x: cityX }}>
            <Skyline lit={lightsOut ? 0 : 1} stagger className="absolute inset-0 h-full w-full" />
            <button
              type="button"
              className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-sm"
              style={{ left: `${AGENT_POS.left}%`, top: `${AGENT_POS.top}%` }}
              aria-label="Floor 7: Nightshift is working"
              aria-expanded={tipOpen}
              onPointerEnter={() => setTipOpen(true)}
              onPointerLeave={() => setTipOpen(false)}
              onFocus={() => setTipOpen(true)}
              onBlur={() => setTipOpen(false)}
              onClick={() => setTipOpen((open) => !open)}
            />
            <AnimatePresence>
              {(tipOpen || lightsOut) && (
                <motion.div
                  key={tipOpen ? "open" : "label"}
                  className="pointer-events-none absolute w-max -translate-x-1/2"
                  style={{ left: `${AGENT_POS.left}%`, bottom: `${100 - AGENT_POS.top + 5}%` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.35, ease: EASE_OUT, delay: tipOpen ? 0 : 2.4 }}
                >
                  <div className="rounded-[10px] bg-(--paper) px-3.5 py-2.5 text-(--ink) shadow-[0_12px_30px_-12px_rgba(15,20,66,0.6)]">
                    <p className="text-[13px] font-semibold">Floor 7, still on</p>
                    {tipOpen && <p className="mt-0.5 font-mono text-[11px] text-(--ink)/70">3 pull requests in progress</p>}
                  </div>
                  <span className="mx-auto block h-3 w-px bg-(--paper)" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
