import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Hand } from "lucide-react";
import { STICKERS } from "./data";
import { Reveal } from "./ui";

export function StickerWall() {
  const boardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Last touched sticker goes on top, like peeling one off and slapping it back down.
  const [order, setOrder] = useState<number[]>(STICKERS.map((_, i) => i));
  // Dragging only on wide screens: on phones the stickers stack and must not trap page scroll.
  const [canDrag, setCanDrag] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setCanDrag(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const raise = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  return (
    <section id="kt-love" className="relative overflow-hidden bg-(--butter) px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div aria-hidden="true" className="kt-dots absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="kt-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
            31,400 freelancers,
            <br />
            zero spreadsheets.
          </h2>
          <p className="kt-sticker-sm hidden items-center gap-2 rounded-full bg-(--paper) px-4 py-2 font-extrabold md:inline-flex">
            <Hand className="h-5 w-5" strokeWidth={2.5} /> Peel them off, move them around
          </p>
        </Reveal>

        <div ref={boardRef} className="relative mt-12 grid gap-5 sm:grid-cols-2 md:block md:h-[620px]">
          {STICKERS.map((s, i) => {
            const circle = s.shape === "circle";
            return (
              <motion.figure
                key={s.name}
                drag={canDrag && !reduced}
                dragConstraints={boardRef}
                dragElastic={0.18}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
                onPointerDown={() => raise(i)}
                whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
                whileDrag={{ scale: 1.1, rotate: s.rotate / 3, boxShadow: "12px 16px 0 #141217", cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0.4, rotate: s.rotate - 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: s.rotate, transition: { type: "spring", stiffness: 340, damping: 15, delay: i * 0.08 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
                style={{ zIndex: order.indexOf(i) + 1, background: s.color, ...s.pos }}
                className={`kt-sticker flex flex-col md:cursor-grab md:touch-none justify-between select-none md:absolute ${
                  circle
                    ? "mx-auto aspect-square w-[min(84vw,290px)] items-center justify-center rounded-full p-10 text-center md:w-[290px]"
                    : "rounded-[30px] p-6 md:w-[330px]"
                }`}
              >
                <blockquote className={`font-bold ${circle ? "text-lg leading-snug" : "text-xl leading-snug"}`}>“{s.quote}”</blockquote>
                <figcaption className={`mt-4 flex items-center gap-3 ${circle ? "flex-col gap-1" : ""}`}>
                  {!circle && (
                    <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-(--ink) bg-(--paper) font-black">{s.name[0]}</span>
                  )}
                  <span className="leading-tight">
                    <span className="block font-black">{s.name}</span>
                    <span className="block text-sm font-bold opacity-70">{s.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
