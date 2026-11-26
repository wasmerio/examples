import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { PHONE_STEPS, type PhoneScreenId } from "./data";
import { Reveal, SectionKicker } from "./ui";

const enter = { initial: { opacity: 0, y: "18%", scale: 0.96 }, animate: { opacity: 1, y: "0%", scale: 1 }, exit: { opacity: 0, y: "-10%", scale: 0.94 } };
const screenTransition = { type: "spring", stiffness: 210, damping: 24 } as const;

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-[8cqw] pt-[5cqw] text-[5cqw] font-extrabold ${dark ? "text-(--paper)" : ""}`}>
      <span>9:41</span>
      <span className="h-[6.5cqw] w-[28cqw] rounded-full bg-(--ink)" />
      <span className="flex gap-[1.5cqw]">
        <span className="h-[3cqw] w-[6cqw] rounded-[1cqw] border-[0.6cqw] border-current" />
      </span>
    </div>
  );
}

function HomeScreen() {
  const bars = [38, 62, 44, 80, 56, 92, 70];
  return (
    <div className="flex h-full flex-col bg-(--paper)">
      <StatusBar />
      <div className="px-[7cqw] pt-[6cqw]">
        <p className="text-[5.2cqw] font-bold opacity-60">Hi Mara, total balance</p>
        <p className="kt-display mt-[1cqw] text-[14cqw] leading-none">$18,240</p>
        <div className="mt-[4cqw] flex gap-[2cqw]">
          {["USD", "EUR", "GBP"].map((c, i) => (
            <span key={c} className={`rounded-full border-[0.6cqw] border-(--ink) px-[3cqw] py-[1cqw] text-[4.4cqw] font-extrabold ${i === 0 ? "bg-(--ink) text-(--paper)" : ""}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-[6cqw] flex h-[26cqw] items-end gap-[2.4cqw] rounded-[5cqw] border-[0.6cqw] border-(--ink) bg-(--lilac-soft) p-[3cqw]">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 origin-bottom rounded-[1.5cqw] border-[0.5cqw] border-(--ink)"
              style={{ height: `${h}%`, background: i === 5 ? "var(--tang)" : "var(--lilac)" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + i * 0.05 }}
            />
          ))}
        </div>
      </div>
      <div className="mt-[5cqw] flex flex-col gap-[2.5cqw] px-[7cqw]">
        {[
          ["Studio Nord", "+€2,400", "var(--mint)"],
          ["Pebble & Co", "+$1,850", "var(--butter)"],
          ["Figma", "-$15", "var(--pink)"],
        ].map(([name, amt, c], i) => (
          <motion.div
            key={name}
            className="flex items-center gap-[3cqw]"
            initial={{ opacity: 0, x: "12cqw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
          >
            <span className="grid h-[9cqw] w-[9cqw] place-items-center rounded-[3cqw] border-[0.6cqw] border-(--ink) text-[4.4cqw] font-black" style={{ background: c }}>
              {name[0]}
            </span>
            <span className="flex-1 text-[5cqw] font-bold">{name}</span>
            <span className="text-[5cqw] font-black">{amt}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InvoiceScreen() {
  return (
    <div className="flex h-full flex-col bg-(--lilac)">
      <StatusBar />
      <div className="px-[7cqw] pt-[6cqw]">
        <p className="text-[5.2cqw] font-bold opacity-70">Invoice #0142</p>
        <p className="mt-[1cqw] text-[6cqw] font-black">Studio Nord</p>
      </div>
      <div className="relative mx-[6cqw] mt-[5cqw] rounded-[6cqw] border-[0.7cqw] border-(--ink) bg-(--paper) p-[5cqw]">
        <p className="text-[4.4cqw] font-bold opacity-60">Amount</p>
        <p className="kt-display text-[13cqw] leading-none">€2,400</p>
        <div className="mt-[4cqw] space-y-[2cqw] border-t-[0.5cqw] border-dashed border-(--ink)/30 pt-[3cqw] text-[4.4cqw] font-bold">
          <p className="flex justify-between"><span className="opacity-60">Motion kit</span><span>€2,000</span></p>
          <p className="flex justify-between"><span className="opacity-60">Rush fee</span><span>€400</span></p>
        </div>
        <motion.span
          className="absolute top-[4cqw] right-[3cqw] rounded-[3cqw] border-[0.8cqw] border-(--ink) bg-(--mint) px-[3cqw] py-[1cqw] text-[6cqw] font-black"
          initial={{ scale: 2.4, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: -12, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.45 }}
        >
          PAID
        </motion.span>
      </div>
      <div className="mt-[6cqw] space-y-[3cqw] px-[8cqw]">
        {["Sent Tue 9:02", "Opened Tue 9:04", "Paid Tue 11:30"].map((t, i) => (
          <motion.p
            key={t}
            className="flex items-center gap-[3cqw] text-[4.8cqw] font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.12 }}
          >
            <span className="h-[3.5cqw] w-[3.5cqw] rounded-full border-[0.6cqw] border-(--ink) bg-(--ink)" />
            {t}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

function TaxScreen() {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-full flex-col bg-(--mint)">
      <StatusBar />
      <p className="px-[7cqw] pt-[6cqw] text-[6cqw] font-black">Tax pot</p>
      <div className="relative mx-auto mt-[4cqw] w-[66cqw]">
        <svg viewBox="0 0 80 80" className="w-full -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth="9" />
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--paper)" strokeWidth="5.5" />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--tang)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - 0.72) }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="kt-display text-[11cqw] leading-none">$3,412</p>
            <p className="text-[4.2cqw] font-bold opacity-70">72% of April</p>
          </div>
        </div>
      </div>
      <div className="mx-[6cqw] mt-[6cqw] rounded-[5cqw] border-[0.7cqw] border-(--ink) bg-(--paper) p-[4cqw] text-[4.6cqw] font-bold">
        <p className="flex justify-between"><span>Auto-save rate</span><span className="font-black">28%</span></p>
        <p className="mt-[2cqw] flex justify-between"><span>Next estimate</span><span className="font-black">Apr 15</span></p>
      </div>
    </div>
  );
}

function CardScreen() {
  const [frozen, setFrozen] = useState(false);
  return (
    <div className="flex h-full flex-col bg-(--ink) text-(--paper)">
      <StatusBar dark />
      <p className="px-[7cqw] pt-[6cqw] text-[6cqw] font-black">Your card</p>
      <motion.div
        className="relative mx-[7cqw] mt-[5cqw] aspect-[1.586] overflow-hidden rounded-[5cqw] bg-[url(/images/kite/card.webp)] bg-[length:300%_auto] bg-[position:55%_40%] text-(--ink)"
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0, filter: frozen ? "grayscale(1) brightness(0.9)" : "grayscale(0) brightness(1)" }}
        transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.15 }}
      >
        <span className="kt-display absolute top-[4cqw] left-[5cqw] text-[8cqw] leading-none">kite</span>
        <span className="absolute bottom-[4cqw] left-[5cqw] text-[4cqw] font-bold tracking-[0.15em]">•••• 4021</span>
        <AnimatePresence>
          {frozen && (
            <motion.span
              className="absolute inset-0 grid place-items-center bg-white/40 text-[7cqw] font-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Frozen
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <button
        type="button"
        onClick={() => setFrozen((f) => !f)}
        aria-pressed={frozen}
        className="mx-[7cqw] mt-[6cqw] flex items-center justify-between rounded-[5cqw] border-[0.7cqw] border-(--paper)/30 px-[4cqw] py-[3cqw] text-[5cqw] font-bold"
      >
        Freeze card
        <span className={`relative h-[7cqw] w-[12cqw] rounded-full transition-colors ${frozen ? "bg-(--mint)" : "bg-(--paper)/25"}`}>
          <motion.span className="absolute top-[1cqw] left-[1cqw] h-[5cqw] w-[5cqw] rounded-full bg-(--paper)" animate={{ x: frozen ? "5cqw" : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
        </span>
      </button>
      <div className="mx-[7cqw] mt-[4cqw] flex flex-wrap gap-[2cqw]">
        {["Fonts", "Travel", "Software"].map((t, i) => (
          <span key={t} className="rounded-full px-[3cqw] py-[1.2cqw] text-[4.2cqw] font-extrabold text-(--ink)" style={{ background: ["var(--butter)", "var(--lilac)", "var(--pink)"][i] }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const SCREENS: Record<PhoneScreenId, () => React.JSX.Element> = {
  home: HomeScreen,
  invoice: InvoiceScreen,
  tax: TaxScreen,
  card: CardScreen,
};

function Phone({ active }: { active: PhoneScreenId }) {
  const Screen = SCREENS[active];
  return (
    <div className="kt-sticker relative mx-auto aspect-[1122/1402] w-full overflow-hidden rounded-[40px] bg-(--tang)">
      <img src="/images/kite/hand.webp" alt="A hand with lilac nails holding a phone running the Kite app" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      {/* Screen area of the photo, measured in % of the image. */}
      <div className="kt-screen absolute top-[8.9%] left-[34.2%] h-[66.4%] w-[39.9%]">
        <div className="relative h-full w-full overflow-hidden rounded-[13cqw] bg-(--paper) text-(--ink)">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={active} className="absolute inset-0" {...enter} transition={screenTransition}>
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function PhoneTour() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<PhoneScreenId>("home");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rail = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Below lg the section is not a scroll stage, the tabs drive the screen instead.
    if (window.innerWidth < 1024) return;
    const i = Math.min(PHONE_STEPS.length - 1, Math.floor(v * PHONE_STEPS.length));
    const id = PHONE_STEPS[Math.max(0, i)].id;
    if (id !== active) setActive(id);
  });

  const step = PHONE_STEPS.find((s) => s.id === active)!;

  return (
    <section id="kt-app" ref={ref} className="relative bg-(--paper) px-5 sm:px-8 lg:h-[400vh] lg:px-12">
      {/* Desktop: sticky stage, the scroll position picks the screen. */}
      <div className="sticky top-0 mx-auto hidden h-[100svh] max-w-6xl grid-cols-[1fr_0.85fr] items-center gap-16 lg:grid">
        <div>
          <SectionKicker>The app</SectionKicker>
          <div className="mt-8 flex gap-8">
            <div className="relative w-[3px] shrink-0 rounded-full bg-(--ink)/15">
              <motion.div className="absolute inset-x-0 top-0 rounded-full bg-(--ink)" style={{ height: rail }} />
            </div>
            <ol className="flex flex-col gap-7">
              {PHONE_STEPS.map((s) => {
                const on = s.id === active;
                return (
                  <li key={s.id}>
                    <motion.div animate={{ opacity: on ? 1 : 0.32, x: on ? 0 : -6 }} transition={{ duration: 0.4 }}>
                      <p className="text-sm font-extrabold tracking-[0.12em] uppercase">{s.kicker}</p>
                      <h3 className="kt-display mt-1 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[0.95]">{s.title}</h3>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            className="max-w-md overflow-hidden text-lg leading-snug font-medium opacity-80"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 0.8, marginTop: 10 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {s.body}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="relative max-h-[86svh] w-full max-w-[460px] justify-self-center">
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: ["home", "tax"].includes(active) ? -2.5 : 2.5 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
            <Phone active={active} />
          </motion.div>
        </div>
      </div>

      {/* Mobile and tablet: tabs pick the screen. */}
      <div className="mx-auto max-w-xl py-24 lg:hidden">
        <Reveal>
          <SectionKicker>The app</SectionKicker>
          <h2 className="kt-display mt-5 text-[clamp(2.4rem,9vw,3.6rem)] leading-[0.92]">{step.title}</h2>
          <p className="mt-4 text-lg leading-snug font-medium opacity-80">{step.body}</p>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="App screens">
          {PHONE_STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active}
              onClick={() => setActive(s.id)}
              className={`rounded-full border-2 border-(--ink) px-4 py-2 text-sm font-extrabold transition-colors ${s.id === active ? "bg-(--ink) text-(--paper)" : "bg-(--paper)"}`}
            >
              {s.kicker.split(" / ")[1]}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-[360px]">
          <Phone active={active} />
        </div>
      </div>
    </section>
  );
}
