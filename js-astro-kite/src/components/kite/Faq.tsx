import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { EASE_OUT, FAQS } from "./data";
import { Reveal } from "./ui";

const TINTS = ["var(--lilac)", "var(--mint)", "var(--butter)", "var(--pink)", "var(--lilac)"];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="kt-faq" className="bg-(--paper) px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="kt-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.9]">Fair questions.</h2>
          <p className="mt-5 max-w-sm text-lg leading-snug font-medium opacity-80">
            Still curious? Chat with a human in the app, usually in under four minutes.
          </p>
        </Reveal>

        <ul className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `kt-faq-${i}`;
            return (
              <li key={item.q}>
                <motion.div
                  className="kt-sticker-sm overflow-hidden rounded-[24px]"
                  animate={{ backgroundColor: isOpen ? TINTS[i] : "#FFFFFF" }}
                  transition={{ duration: 0.35 }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-xl leading-tight font-extrabold transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 135 : 0, backgroundColor: isOpen ? "#141217" : "#FFF5EA", color: isOpen ? "#FFF5EA" : "#141217" }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-(--ink)"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: EASE_OUT }}
                      >
                        <p className="max-w-2xl px-6 pb-6 text-lg leading-snug font-medium">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
