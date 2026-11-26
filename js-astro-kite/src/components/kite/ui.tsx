import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { EASE_OUT } from "./data";

export function KiteStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Gabarito:wght@400;500;600;700;800;900&display=swap');
.kt-root {
  --paper: #FFF5EA; --ink: #141217; --tang: #FF6A13; --tang-deep: #E2520A;
  --lilac: #C6B0FF; --lilac-soft: #ECE3FF; --mint: #93EDC3; --mint-soft: #DDFAEB;
  --butter: #FFE15A; --pink: #FF9CC5;
  font-family: 'Gabarito', ui-sans-serif, system-ui, sans-serif;
  background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased;
}
.kt-display { font-family: 'Bagel Fat One', 'Gabarito', sans-serif; font-weight: 400; letter-spacing: -0.01em; }
.kt-root ::selection { background: var(--ink); color: var(--butter); }
.kt-root :focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; border-radius: 14px; }
.kt-sticker { border: 2.5px solid var(--ink); box-shadow: 4px 5px 0 var(--ink); }
.kt-sticker-sm { border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); }
.kt-btn {
  border: 2.5px solid var(--ink); box-shadow: 0 5px 0 var(--ink);
  transition: transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s cubic-bezier(.22,1,.36,1), background-color .25s;
}
.kt-btn:hover { transform: translateY(-2px); box-shadow: 0 7px 0 var(--ink); }
.kt-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--ink); }
.kt-wave { animation: kt-wave var(--dur, 6s) linear infinite; will-change: transform; }
@keyframes kt-wave { to { transform: translate3d(-50%, 0, 0); } }
.kt-spin { animation: kt-spin 16s linear infinite; }
@keyframes kt-spin { to { transform: rotate(360deg); } }
.kt-bob { animation: kt-bob var(--dur, 4s) ease-in-out var(--delay, 0s) infinite; }
@keyframes kt-bob { 50% { transform: translate3d(0, -10px, 0) rotate(var(--tilt, 2deg)); } }
.kt-rise { animation: kt-rise var(--dur, 4s) ease-in var(--delay, 0s) infinite; }
@keyframes kt-rise { 0% { transform: translate3d(0, 0, 0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translate3d(0, -220px, 0); opacity: 0; } }
.kt-digit { transition: transform .9s cubic-bezier(.2,.9,.2,1.04); will-change: transform; }
.kt-dots { background-image: radial-gradient(color-mix(in srgb, var(--ink) 18%, transparent) 1.2px, transparent 1.4px); background-size: 22px 22px; }
.kt-screen { container-type: inline-size; }
.kt-range { -webkit-appearance: none; appearance: none; height: 18px; border-radius: 999px; border: 2.5px solid var(--ink); cursor: pointer;
  background: linear-gradient(90deg, var(--ink) var(--pct), var(--paper) var(--pct)); }
.kt-range::-webkit-slider-thumb { -webkit-appearance: none; width: 38px; height: 38px; border-radius: 999px; background: var(--tang);
  border: 3px solid var(--ink); box-shadow: 0 4px 0 var(--ink); transition: transform .2s cubic-bezier(.22,1,.36,1); }
.kt-range::-moz-range-thumb { width: 34px; height: 34px; border-radius: 999px; background: var(--tang); border: 3px solid var(--ink); box-shadow: 0 4px 0 var(--ink); }
.kt-range:hover::-webkit-slider-thumb, .kt-range:active::-webkit-slider-thumb { transform: scale(1.15) rotate(8deg); }
.kt-range:focus-visible { outline: 3px solid var(--ink); outline-offset: 5px; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
@media (prefers-reduced-motion: reduce) {
  .kt-wave, .kt-spin, .kt-bob, .kt-rise { animation: none !important; }
  .kt-digit { transition: none !important; }
}
`}</style>
  );
}

/** Pulls its child toward the cursor and springs back on leave. Mouse only. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 17, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 280, damping: 17, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, delay = 0, className = "", y = 36 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Slaps an element in like a sticker: overshoots in scale and settles on its tilt. */
export function StickerIn({
  children,
  rotate = 0,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  rotate?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 18 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 380, damping: 16, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Odometer text: every digit is a 0-9 column that rolls to its value.
 * Columns are keyed from the right so units stay aligned when the length changes.
 */
export function RollingNumber({ value, className = "" }: { value: string; className?: string }) {
  const chars = value.split("");
  return (
    <span className={`inline-flex items-start leading-none tabular-nums ${className}`} aria-label={value} role="text">
      {chars.map((ch, i) => {
        const fromRight = chars.length - i;
        if (!/\d/.test(ch)) {
          return (
            <span key={`s${fromRight}`} aria-hidden="true" className="inline-block h-[1em] leading-none whitespace-pre">
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        return (
          // The invisible digit sizes the column, so narrow digits like 1 do not leave a gap.
          <span key={`d${fromRight}`} aria-hidden="true" className="relative inline-block h-[1em] leading-none [overflow-x:visible] [overflow-y:clip]">
            <span className="invisible">{ch}</span>
            <span
              className="kt-digit absolute inset-x-[-0.3em] top-0 flex flex-col text-center"
              style={{ transform: `translate3d(0, ${-d * 10}%, 0)`, transitionDelay: `${(fromRight % 8) * 35}ms` }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function KiteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 2 L35 17 L20 38 L5 17 Z" fill="var(--tang)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 2 L20 38 M5 17 L35 17" stroke="var(--ink)" strokeWidth="2" />
      <path d="M20 2 L35 17 L20 17 Z" fill="var(--lilac)" />
      <path d="M5 17 L20 17 L20 38 Z" fill="var(--mint)" />
      <path d="M20 2 L35 17 L20 38 L5 17 Z" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Flying kite with a bow tail; the tail flutters via CSS so it keeps moving while idle. */
export function FlyingKite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden="true">
      <path d="M60 4 L104 50 L60 112 L16 50 Z" fill="var(--tang)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M60 4 L104 50 L60 50 Z" fill="var(--lilac)" />
      <path d="M16 50 L60 50 L60 112 Z" fill="var(--mint)" />
      <path d="M60 4 L104 50 L60 112 L16 50 Z M60 4 V112 M16 50 H104" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M60 112 C 52 128, 70 138, 60 152 S 66 166, 58 170" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 126 L60 131 L52 136 Z M68 126 L60 131 L68 136 Z" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 150 L58 154 L50 158 Z M66 150 L58 154 L66 158 Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function SectionKicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`kt-sticker-sm inline-flex items-center gap-2 rounded-full bg-(--paper) px-3.5 py-1.5 text-sm font-bold ${className}`}>
      <KiteMark className="h-4 w-4" />
      {children}
    </span>
  );
}
