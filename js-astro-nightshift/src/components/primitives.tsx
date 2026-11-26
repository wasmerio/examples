import { useMemo, type ReactNode } from "react";
import { motion } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Deterministic random so the server render and the hydrated client draw the same city and stars.
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

// Two misregistered discs: the orange moon with a blue plate printed slightly off, which bites the crescent.
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="15" cy="17" r="11" fill="#ff5a1f" />
      <circle cx="21" cy="12" r="9" fill="#2c4be0" className="ns-multiply" />
    </svg>
  );
}

export function PrimaryButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`ns-btn inline-flex h-13 items-center gap-3 rounded-full px-7 text-[17px] font-semibold text-(--ink) ${className ?? ""}`}
    >
      {children}
    </a>
  );
}

export interface Building {
  x: number;
  w: number;
  h: number;
  step: number;
}

export interface CityWindow {
  id: number;
  x: number;
  y: number;
  // Each window switches at its own point, so lights go out (or on) one by one instead of all at once.
  threshold: number;
}

export const CITY_W = 1200;
export const CITY_H = 360;
const WIN_W = 9;
const WIN_H = 12;

function buildCity() {
  const rand = seeded(42);
  const buildings: Building[] = [];
  const windows: CityWindow[] = [];
  let x = -10;
  while (x < CITY_W) {
    const w = 64 + Math.round(rand() * 70);
    const h = 120 + Math.round(rand() * 200);
    buildings.push({ x, w, h, step: rand() > 0.6 ? 14 + Math.round(rand() * 18) : 0 });
    const cols = Math.floor((w - 18) / 20);
    const rows = Math.floor((h - 34) / 26);
    const offset = (w - cols * 20 + 20 - WIN_W) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({ id: windows.length, x: x + offset + c * 20, y: CITY_H - h + 24 + r * 26, threshold: rand() });
      }
    }
    x += w + 6;
  }
  // The agent works from one window on a mid-rise near the centre of the frame.
  const target = buildings[Math.floor(buildings.length * 0.58)];
  const agent = windows
    .filter((win) => win.x > target.x && win.x < target.x + target.w)
    .sort((a, b) => a.y - b.y)[2];
  return { buildings, windows, agent };
}

export const CITY = buildCity();

export function Skyline({
  lit,
  stagger = false,
  body = "#0f1442",
  on = "#ffc93c",
  off = "#1d2466",
  className,
}: {
  lit: number;
  stagger?: boolean;
  body?: string;
  on?: string;
  off?: string;
  className?: string;
}) {
  const { buildings, windows, agent } = CITY;
  const rects = useMemo(
    () =>
      windows.map((win) =>
        win.id === agent.id ? null : (
          <rect
            key={win.id}
            x={win.x}
            y={win.y}
            width={WIN_W}
            height={WIN_H}
            className="ns-window"
            fill={win.threshold < lit ? on : off}
            style={stagger ? { transitionDelay: `${(win.threshold * 1.5).toFixed(2)}s` } : undefined}
          />
        ),
      ),
    [windows, agent.id, lit, stagger, on, off],
  );

  return (
    <svg viewBox={`0 0 ${CITY_W} ${CITY_H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {buildings.map((b) => (
        <g key={b.x} fill={body}>
          <rect x={b.x} y={CITY_H - b.h} width={b.w} height={b.h} />
          {b.step > 0 && <rect x={b.x + b.w * 0.25} y={CITY_H - b.h - b.step} width={b.w * 0.5} height={b.step + 1} />}
        </g>
      ))}
      {rects}
      <rect x={agent.x - 1} y={agent.y - 1} width={WIN_W + 2} height={WIN_H + 2} fill="#ff5a1f" />
    </svg>
  );
}

// Percent position of the agent window inside the skyline box, for HTML overlays pinned to it.
export const AGENT_POS = {
  left: ((CITY.agent.x + WIN_W / 2) / CITY_W) * 100,
  top: ((CITY.agent.y + WIN_H / 2) / CITY_H) * 100,
};

export function Stars({ count = 70, seed = 9, className }: { count?: number; seed?: number; className?: string }) {
  const stars = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 70,
      size: rand() > 0.85 ? 4 : rand() > 0.5 ? 2.5 : 1.5,
    }));
  }, [count, seed]);
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-(--paper)"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
        />
      ))}
    </div>
  );
}
