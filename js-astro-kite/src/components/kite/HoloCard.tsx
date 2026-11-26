import { motion, useMotionTemplate, useTransform, type MotionValue } from "motion/react";

/**
 * Holographic card that tilts with the pointer. px/py are normalized (-0.5..0.5) and already sprung.
 * The foil texture is cropped from the render; the glare and rainbow foil layers follow the pointer.
 */
export function HoloCard({ px, py, className = "" }: { px: MotionValue<number>; py: MotionValue<number>; className?: string }) {
  const rotateY = useTransform(px, [-0.5, 0.5], [-24, 24]);
  const rotateX = useTransform(py, [-0.5, 0.5], [18, -18]);
  const glareX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const texX = useTransform(px, [-0.5, 0.5], [44, 66]);
  const texY = useTransform(py, [-0.5, 0.5], [30, 50]);
  const foilPos = useTransform(px, [-0.5, 0.5], [0, 100]);
  const hue = useTransform(px, [-0.5, 0.5], [-40, 40]);
  const shadowX = useTransform(px, [-0.5, 0.5], [30, -30]);

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0) 46%)`;
  const texPos = useMotionTemplate`${texX}% ${texY}%`;
  const foilBgPos = useMotionTemplate`${foilPos}% 50%`;
  const hueFilter = useMotionTemplate`hue-rotate(${hue}deg) saturate(2.1) contrast(1.08)`;

  return (
    <div className={`relative [perspective:1300px] ${className}`}>
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-12 left-[12%] h-10 w-[76%] rounded-[50%] bg-(--ink) opacity-30 blur-xl"
        style={{ x: shadowX }}
      />
      <motion.div
        role="img"
        aria-label="Kite holographic debit card"
        className="relative aspect-[1.586] w-full overflow-hidden rounded-[6%/9.5%] shadow-[0_30px_60px_-20px_rgba(20,18,23,0.55)] [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        <motion.div
          className="absolute inset-0 bg-[url(/images/kite/card.webp)] bg-[length:300%_auto]"
          style={{ backgroundPosition: texPos, filter: hueFilter }}
        />
        <motion.div
          className="absolute inset-0 opacity-55 mix-blend-color-dodge"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #ff9cc5 0%, #ffe15a 7%, #93edc3 14%, #8fd3ff 21%, #c6b0ff 28%, #ff9cc5 35%)",
            backgroundSize: "260% 260%",
            backgroundPosition: foilBgPos,
          }}
        />
        <motion.div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: glare }} />
        <motion.div className="absolute inset-0 mix-blend-overlay opacity-60" style={{ backgroundImage: glare }} />

        {/* Card print. Sizes in % of the card so it scales with the hero. */}
        <div className="absolute inset-0 flex flex-col justify-between p-[6.5%] text-(--ink)">
          <div className="flex items-start justify-between">
            <span className="kt-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none">kite</span>
            <svg viewBox="0 0 24 24" className="mt-1 h-[clamp(18px,2.2vw,28px)] w-auto opacity-80" aria-hidden="true">
              <path
                d="M8 6.5c2 3.2 2 7.8 0 11M12 4.5c3 4.4 3 10.6 0 15M16 2.5c4 5.6 4 13.4 0 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-[4%]">
            <span className="relative block aspect-[1.3] w-[15%] overflow-hidden rounded-[18%] border border-black/25 bg-[linear-gradient(135deg,#f6e7b8,#d4b46a_45%,#f3e2a8_70%,#b8954e)]">
              <span className="absolute inset-x-0 top-1/2 h-px bg-black/25" />
              <span className="absolute inset-y-0 left-1/3 w-px bg-black/25" />
              <span className="absolute inset-y-0 right-1/3 w-px bg-black/25" />
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="leading-tight">
              <p className="text-[clamp(0.7rem,1.15vw,0.95rem)] font-bold tracking-[0.18em]">•••• 4021</p>
              <p className="mt-1 text-[clamp(0.65rem,1vw,0.85rem)] font-extrabold tracking-[0.14em] uppercase">Mara Okafor</p>
            </div>
            <p className="text-[clamp(0.6rem,0.9vw,0.78rem)] font-black tracking-[0.2em] uppercase">Debit</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/60 ring-inset" />
      </motion.div>
    </div>
  );
}
