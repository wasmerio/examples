import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT } from "./data";
import { FlyingKite, KiteMark, Magnetic } from "./ui";

const LINKS = [
  { title: "Product", items: ["Invoices", "Currencies", "Tax pot", "Holo card"] },
  { title: "Company", items: ["About", "Careers", "Press kit", "Security"] },
  { title: "Help", items: ["Help centre", "Status", "Fees", "Contact"] },
];

const KITE_W = 110;

export function Footer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ w: 1200, h: 420 });
  const kx = useMotionValue(0);
  const ky = useMotionValue(0);
  const tilt = useMotionValue(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The kite loops across the wordmark; the string is recomputed from its live position each frame.
  useEffect(() => {
    const { w, h } = size;
    if (reduced) {
      kx.set(w * 0.72);
      ky.set(h * 0.08);
      return;
    }
    if (!inView) return;
    const xs = [-0.12, 0.18, 0.42, 0.66, 0.84, 1.08].map((f) => f * w);
    const ys = [0.3, 0.02, 0.2, -0.04, 0.16, 0.0].map((f) => f * h);
    const opts = { duration: 11, ease: "easeInOut" as const, repeat: Infinity };
    const a = animate(kx, xs, opts);
    const b = animate(ky, ys, opts);
    const c = animate(tilt, [12, -10, 8, -12, 6, 0], opts);
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [inView, reduced, size, kx, ky, tilt]);

  const stringPath = useTransform([kx, ky], ([x, y]: number[]) => {
    const ax = size.w * 0.06;
    const ay = size.h + 10;
    const tx = x + KITE_W / 2;
    const ty = y + KITE_W * 0.93;
    const cx = (ax + tx) / 2;
    const cy = Math.max(ay, ty) - 30 + Math.abs(tx - ax) * 0.08;
    return `M ${ax} ${ay} Q ${cx} ${cy} ${tx} ${ty}`;
  });

  return (
    <footer className="relative overflow-hidden rounded-t-[48px] bg-(--ink) px-5 pt-20 text-(--paper) sm:px-8 sm:pt-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 className="kt-display text-[clamp(3rem,8vw,6.6rem)] leading-[0.88]">
              Go fly
              <br />a <span className="text-(--tang)">kite.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg font-medium opacity-75">Open an account in four minutes. Your first invoice can go out before your coffee cools.</p>
            <div className="mt-8">
              <Magnetic>
                <a href="#top" className="kt-btn group inline-flex items-center gap-2 rounded-full bg-(--tang) px-7 py-4 text-lg font-extrabold text-[#141217] [--ink:#FFF5EA]">
                  Get Kite free
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.75} />
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {LINKS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-extrabold tracking-[0.12em] uppercase opacity-50">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a href="#top" className="inline-block font-semibold transition-[transform,color] duration-300 hover:translate-x-1 hover:text-(--mint)">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={stageRef} className="relative mx-auto mt-16 max-w-[1400px] select-none sm:mt-24">
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" aria-hidden="true">
          <motion.path d={stringPath} fill="none" stroke="#FFF5EA" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </svg>
        <motion.div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-20" style={{ x: kx, y: ky, rotate: tilt, width: KITE_W }}>
          <FlyingKite className="w-full" />
        </motion.div>

        <p className="kt-display flex justify-center pt-24 pb-[5vw] text-[clamp(7rem,33vw,28rem)] leading-[0.72] text-(--tang)" aria-label="kite">
          {"kite".split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="inline-block cursor-default"
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE_OUT, delay: i * 0.07 } }}
              viewport={{ once: true }}
              whileHover={{ y: "-10%", rotate: i % 2 ? 6 : -6, color: ["#FF6A13", "#C6B0FF", "#93EDC3", "#FFE15A"][i] }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              {ch}
            </motion.span>
          ))}
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-(--paper)/15 py-6 text-sm font-semibold opacity-70">
        <span className="flex items-center gap-2">
          <KiteMark className="h-5 w-5" /> © 2026 Kite Money Ltd. Kite is not a bank. Banking services by Harbor Trust Bank.
        </span>
        <span>Made for people who bill by the project.</span>
      </div>
    </footer>
  );
}
