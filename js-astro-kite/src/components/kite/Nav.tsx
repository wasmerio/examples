import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE_OUT, NAV_LINKS } from "./data";
import { KiteMark, Magnetic } from "./ui";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-[22px] px-3 py-2.5 transition-[background-color,box-shadow,border-color] duration-300 sm:px-4 ${
          scrolled ? "kt-sticker bg-(--paper)" : "border-[2.5px] border-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2" aria-label="Kite home">
          <KiteMark className="h-8 w-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-14deg]" />
          <span className="kt-display text-[1.7rem] leading-none">kite</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex" onPointerLeave={() => setHovered(null)}>
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="relative">
              {hovered === link.href && (
                <motion.span
                  layoutId="kt-nav-hover"
                  className="absolute inset-0 rounded-full border-2 border-(--ink) bg-(--butter)"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <a
                href={link.href}
                onPointerEnter={() => setHovered(link.href)}
                className="relative block rounded-full px-4 py-2 text-[15px] font-bold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#kt-pricing" className="hidden rounded-full px-4 py-2 text-[15px] font-bold underline-offset-4 hover:underline sm:block">
            Log in
          </a>
          <Magnetic>
            <a href="#kt-pricing" className="kt-btn rounded-full bg-(--ink) px-5 py-2.5 text-[15px] font-extrabold text-(--paper)">
              Get Kite
            </a>
          </Magnetic>
        </div>
      </nav>
    </motion.header>
  );
}
