import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, Star } from "lucide-react";
import { EASE_OUT } from "./data";
import { HoloCard } from "./HoloCard";
import { FlyingKite, Magnetic } from "./ui";

const LINES = ["Invoice it.", "Get paid.", "Go fly."];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pointerActive = useRef(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 16, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 16, mass: 0.6 });

  // Without a pointer the card keeps drifting, so the foil still shimmers on a silent recording.
  useAnimationFrame((t) => {
    if (reduced || pointerActive.current) return;
    px.set(Math.sin(t / 1500) * 0.22);
    py.set(Math.cos(t / 2100) * 0.14);
  });

  const stickerX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const stickerY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const stickerXInv = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const stickerYInv = useTransform(sy, [-0.5, 0.5], [16, -16]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-(--tang) px-5 pt-28 pb-16 sm:px-8 lg:min-h-[100svh] lg:px-12 lg:pt-28"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !sectionRef.current) return;
        pointerActive.current = true;
        const r = sectionRef.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerActive.current = false;
      }}
    >
      <div aria-hidden="true" className="kt-dots pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <motion.div
        aria-hidden="true"
        data-kite-anchor
        className="pointer-events-none absolute top-24 right-[3%] z-10 hidden w-24 lg:block xl:right-[5%]"
        initial={{ opacity: 0, x: 120, rotate: 30 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.5 }}
      >
        <div className="kt-bob" style={{ ["--dur" as string]: "3.4s", ["--tilt" as string]: "-6deg" }}>
          <FlyingKite className="w-full" />
        </div>
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <h1 className="kt-display text-[clamp(3.5rem,9.4vw,7.4rem)] leading-[0.86] text-(--ink)">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pt-[0.06em] pb-[0.1em]">
                <motion.span
                  className="relative inline-block"
                  initial={{ y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 0.95, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                >
                  {i === 1 && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-[-0.12em] top-[0.18em] bottom-[0.02em] -z-10 origin-left rounded-[0.22em] bg-(--butter)"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.05 }}
                    />
                  )}
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-5 max-w-[30rem] text-lg leading-snug font-medium text-(--ink) sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
          >
            The money app for freelancers. Bill clients in 38 currencies, get paid in a day, and let the tax pot quietly keep
            what was never yours.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 }}
          >
            <Magnetic>
              <a href="#kt-pricing" className="kt-btn rounded-full bg-(--ink) px-7 py-4 text-lg font-extrabold text-(--paper)">
                Open a free account
              </a>
            </Magnetic>
            <a href="#kt-invoice" className="kt-btn group inline-flex items-center gap-2 rounded-full bg-(--paper) px-6 py-4 text-lg font-extrabold">
              See it work
              <ArrowDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={2.75} />
            </a>
          </motion.div>

          <motion.div
            className="mt-7 flex items-center gap-3 text-[15px] font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <span className="flex -space-x-2" aria-hidden="true">
              {["var(--lilac)", "var(--mint)", "var(--butter)", "var(--pink)"].map((c, i) => (
                <span key={c} className="grid h-8 w-8 place-items-center rounded-full border-2 border-(--ink) text-xs font-black" style={{ background: c }}>
                  {"IDHT"[i]}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-(--ink)" strokeWidth={0} /> 4.9 from 31,400 freelancers
            </span>
          </motion.div>
        </div>

        <motion.div className="relative mx-auto w-full max-w-[500px] py-10 lg:py-0" style={{ y: reduced ? 0 : stageY }}>
          <motion.div
            initial={{ opacity: 0, rotateY: -100, rotateZ: -24, y: 160, scale: 0.7 }}
            animate={{ opacity: 1, rotateY: 0, rotateZ: -7, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.35 }}
            className="[perspective:1300px]"
          >
            <div className="kt-bob" style={{ ["--dur" as string]: "5s", ["--tilt" as string]: "1deg" }}>
              <HoloCard px={sx} py={sy} />
            </div>
          </motion.div>

          {/* Notification sticker */}
          <motion.div className="absolute -top-6 -left-4 z-20 sm:-left-10 lg:-top-14" style={{ x: stickerXInv, y: stickerYInv }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -24 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 1.25 }}
              className="kt-sticker flex items-center gap-3 rounded-[20px] bg-(--paper) py-2.5 pr-4 pl-2.5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[13px] border-2 border-(--ink) bg-(--mint) text-lg font-black">€</span>
              <span className="leading-tight">
                <span className="block text-xs font-bold opacity-70">Studio Nord paid you</span>
                <span className="block text-lg font-black">+€2,400.00</span>
              </span>
            </motion.div>
          </motion.div>

          {/* Tax pot sticker */}
          <motion.div className="absolute -bottom-4 left-[4%] z-20 lg:-bottom-12" style={{ x: stickerX, y: stickerY }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 1.45 }}
              className="kt-sticker rounded-[20px] bg-(--lilac) px-4 py-3"
            >
              <span className="block text-xs font-bold">Tax pot, auto</span>
              <span className="flex items-baseline gap-2">
                <span className="text-2xl font-black">$3,412</span>
                <span className="rounded-full bg-(--ink) px-2 py-0.5 text-xs font-black text-(--lilac)">28%</span>
              </span>
              <span className="mt-2 block h-2.5 w-40 overflow-hidden rounded-full border-2 border-(--ink) bg-(--paper)">
                <motion.span
                  className="block h-full origin-left bg-(--ink)"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.28 }}
                  transition={{ duration: 1.1, ease: EASE_OUT, delay: 1.8 }}
                />
              </span>
            </motion.div>
          </motion.div>

          {/* Spinning round sticker */}
          <motion.div
            className="absolute -right-2 -bottom-10 z-20 sm:-right-6 lg:-bottom-20"
            style={{ x: stickerXInv, y: stickerY }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.65 }}
          >
            <div className="kt-sticker relative grid h-28 w-28 place-items-center rounded-full bg-(--butter) sm:h-32 sm:w-32">
              <svg viewBox="0 0 120 120" className="kt-spin absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <path id="kt-badge-circle" d="M60 60 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0" />
                </defs>
                <text className="fill-(--ink) text-[11.5px] font-black tracking-[0.12em] uppercase">
                  <textPath href="#kt-badge-circle">0% FX markup • 38 currencies • </textPath>
                </text>
              </svg>
              <span className="kt-display text-3xl leading-none">0%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
