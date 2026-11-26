import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Eye, Send } from "lucide-react";
import { EASE_OUT, formatMoney } from "./data";
import { Magnetic, Reveal, RollingNumber, SectionKicker } from "./ui";

const CLIENTS = [
  { id: "nord", name: "Studio Nord", city: "Copenhagen", amount: 2400, code: "EUR", usd: 2608.7, item: "Brand motion kit, 6 loops", tint: "var(--lilac)" },
  { id: "pebble", name: "Pebble & Co", city: "Austin", amount: 1850, code: "USD", usd: 1850, item: "Landing page illustrations", tint: "var(--mint)" },
  { id: "mori", name: "Mori Inc.", city: "Osaka", amount: 240000, code: "JPY", usd: 1586.25, item: "App icon set, 24 icons", tint: "var(--pink)" },
] as const;

type Phase = "draft" | "sending" | "sent" | "opened" | "paid";
const STEPS: { key: Phase; label: string; Icon: typeof Send }[] = [
  { key: "sent", label: "Sent", Icon: Send },
  { key: "opened", label: "Opened", Icon: Eye },
  { key: "paid", label: "Paid", Icon: Check },
];
const ORDER: Phase[] = ["draft", "sending", "sent", "opened", "paid"];

interface Coin {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  delay: number;
  spin: number;
}

export function InvoiceDemo() {
  const [clientId, setClientId] = useState<(typeof CLIENTS)[number]["id"]>("nord");
  const [phase, setPhase] = useState<Phase>("draft");
  const [balance, setBalance] = useState(12480.4);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [balancePop, setBalancePop] = useState(0);
  const timers = useRef<number[]>([]);
  const touched = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(stageRef, { amount: 0.55 });
  const client = CLIENTS.find((c) => c.id === clientId)!;

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 200) : ms));
  };

  const send = () => {
    if (phase !== "draft") return;
    const stage = stageRef.current?.getBoundingClientRect();
    const inv = invoiceRef.current?.getBoundingClientRect();
    const bal = balanceRef.current?.getBoundingClientRect();
    setPhase("sending");
    later(650, () => setPhase("sent"));
    later(1350, () => setPhase("opened"));
    later(2150, () => {
      setPhase("paid");
      if (!reduced && stage && inv && bal) {
        const ox = inv.left - stage.left + inv.width / 2;
        const oy = inv.top - stage.top + inv.height / 2;
        const tx = bal.left - stage.left + bal.width * 0.25;
        const ty = bal.top - stage.top + bal.height / 2;
        setCoins(
          Array.from({ length: 12 }, (_, i) => {
            const x = ox + (Math.random() - 0.5) * 160;
            const y = oy + (Math.random() - 0.5) * 80;
            return { id: Date.now() + i, x, y, dx: tx - x, dy: ty - y, delay: i * 0.05, spin: (Math.random() - 0.5) * 540 };
          }),
        );
      }
      later(reduced ? 0 : 900, () => {
        setBalance((b) => b + client.usd);
        setBalancePop((n) => n + 1);
      });
    });
  };

  const reset = () => {
    touched.current = true;
    setCoins([]);
    setPhase("draft");
    const next = CLIENTS[(CLIENTS.findIndex((c) => c.id === clientId) + 1) % CLIENTS.length];
    setClientId(next.id);
  };

  // Plays once by itself when the stage is in view, so a scroll-through recording shows the payoff.
  useEffect(() => {
    if (!inView || touched.current) return;
    const t = window.setTimeout(() => {
      if (!touched.current) send();
    }, 1400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  return (
    <section id="kt-invoice" className="relative overflow-hidden bg-(--paper) px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionKicker>Invoices</SectionKicker>
            <h2 className="kt-display mt-5 text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
              Invoice to paid
              <br />
              in one tap.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-snug font-medium opacity-80">
              Pick a client, hit send and watch it land. Kite converts at the real rate and drops the money straight into your
              balance. Go on, press the button.
            </p>
          </Reveal>

          <ol className="mt-10 flex flex-col gap-3" aria-label="Invoice status">
            {STEPS.map(({ key, label, Icon }, i) => {
              const on = reached(key);
              return (
                <li key={key} className="flex items-center gap-4">
                  <motion.span
                    className="grid h-12 w-12 place-items-center rounded-2xl border-[2.5px] border-(--ink)"
                    animate={{
                      backgroundColor: on ? (key === "paid" ? "#93EDC3" : "#141217") : "#FFF5EA",
                      color: on && key !== "paid" ? "#FFF5EA" : "#141217",
                      scale: on ? [1, 1.18, 1] : 1,
                      rotate: on ? [0, -8, 0] : 0,
                    }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.75} />
                  </motion.span>
                  <span className="text-xl font-extrabold">{label}</span>
                  <motion.span
                    className="text-sm font-bold opacity-60"
                    initial={false}
                    animate={{ opacity: on ? 0.6 : 0, x: on ? 0 : -8 }}
                    transition={{ duration: 0.4 }}
                  >
                    {["just now", "2 sec later", "landed in your balance"][i]}
                  </motion.span>
                </li>
              );
            })}
          </ol>
        </div>

        <div ref={stageRef} className="relative min-h-[540px] rounded-[36px] border-[2.5px] border-(--ink) bg-(--lilac-soft) p-5 sm:p-8">
          <div aria-hidden="true" className="kt-dots absolute inset-0 rounded-[34px] opacity-70" />

          {/* Balance */}
          <motion.div
            ref={balanceRef}
            key={balancePop}
            initial={balancePop ? { scale: 1.08, rotate: -2 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 12 }}
            className="kt-sticker relative z-10 ml-auto flex w-fit items-center gap-4 rounded-[22px] bg-(--paper) px-5 py-3"
          >
            <span className="text-sm leading-tight font-bold">
              Balance
              <span className="block text-xs opacity-60">USD, all clients</span>
            </span>
            <span className="text-[clamp(1.6rem,3vw,2.2rem)] font-black" aria-live="polite">
              <RollingNumber value={formatMoney(balance, "USD")} />
            </span>
          </motion.div>

          {/* Client chips */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Client">
            {CLIENTS.map((c) => {
              const active = c.id === clientId;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={phase !== "draft"}
                  onClick={() => {
                    touched.current = true;
                    setClientId(c.id);
                  }}
                  className={`relative rounded-full border-2 border-(--ink) px-4 py-2 text-sm font-extrabold transition-colors disabled:cursor-not-allowed ${
                    active ? "text-(--paper)" : "bg-(--paper) hover:bg-(--butter)"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="kt-client-pill" className="absolute inset-0 rounded-full bg-(--ink)" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                  )}
                  <span className="relative">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Invoice */}
          <div className="relative z-10 mt-6 h-[300px]">
            <AnimatePresence mode="popLayout">
              {phase === "draft" || phase === "sending" ? (
                <motion.div
                  ref={invoiceRef}
                  key={clientId}
                  initial={{ opacity: 0, y: 60, rotate: 6, scale: 0.9 }}
                  animate={
                    phase === "sending"
                      ? { opacity: 0, x: 420, y: -260, rotate: 28, scale: 0.4 }
                      : { opacity: 1, x: 0, y: 0, rotate: -2, scale: 1 }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    phase === "sending"
                      ? { duration: 0.65, ease: [0.5, 0, 0.75, 0] }
                      : { type: "spring", stiffness: 260, damping: 20 }
                  }
                  className="kt-sticker mx-auto max-w-[420px] overflow-hidden rounded-[26px] bg-(--paper)"
                >
                  <div className="flex items-center justify-between border-b-[2.5px] border-(--ink) px-5 py-3" style={{ background: client.tint }}>
                    <span className="text-sm font-black tracking-wide uppercase">Invoice #0142</span>
                    <span className="text-sm font-bold">Due in 7 days</span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold opacity-60">Bill to</p>
                    <p className="text-xl font-black">
                      {client.name} <span className="text-base font-bold opacity-60">· {client.city}</span>
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3 border-t-2 border-dashed border-(--ink)/25 pt-3">
                      <p className="text-sm font-semibold opacity-75">{client.item}</p>
                      <p className="kt-display shrink-0 text-[clamp(1.7rem,3.4vw,2.4rem)] leading-none">
                        {formatMoney(client.amount, client.code, client.code === "JPY" ? 0 : 2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="grid h-full place-items-center"
                >
                  <div className="text-center">
                    <motion.div
                      className="mx-auto grid h-28 w-28 place-items-center rounded-full border-[2.5px] border-(--ink)"
                      animate={{ backgroundColor: phase === "paid" ? "#93EDC3" : "#FFF5EA", rotate: phase === "paid" ? 0 : 360 }}
                      transition={phase === "paid" ? { duration: 0.4 } : { rotate: { duration: 1.2, repeat: Infinity, ease: "linear" } }}
                    >
                      {phase === "paid" ? (
                        <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
                          <Check className="h-14 w-14" strokeWidth={3.5} />
                        </motion.span>
                      ) : (
                        <Send className="h-10 w-10" strokeWidth={2.5} />
                      )}
                    </motion.div>
                    <p className="mt-4 text-xl font-black">
                      {phase === "paid" ? `${client.name} paid you` : phase === "opened" ? `${client.name} is looking…` : "Flying to your client…"}
                    </p>
                    {phase === "paid" && (
                      <>
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.7, y: 0 }} className="mt-1 font-bold">
                          landed as {formatMoney(client.usd, "USD")}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 30, rotate: 8, scale: 0.6 }}
                          animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.55 }}
                          className="kt-sticker mt-4 inline-flex items-center gap-3 rounded-[18px] bg-(--butter) px-4 py-2.5 text-left"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-(--ink) bg-(--paper) text-sm font-black">%</span>
                          <span className="text-sm leading-tight font-bold">
                            28% moved to your tax pot
                            <span className="block opacity-70">{formatMoney(client.usd * 0.28, "USD")} set aside</span>
                          </span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-4 flex justify-center">
            <Magnetic>
              {phase === "paid" ? (
                <button type="button" onClick={reset} className="kt-btn rounded-full bg-(--paper) px-7 py-4 text-lg font-extrabold">
                  Send another
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    touched.current = true;
                    send();
                  }}
                  disabled={phase !== "draft"}
                  className="kt-btn inline-flex items-center gap-2 rounded-full bg-(--tang) px-7 py-4 text-lg font-extrabold disabled:opacity-70"
                >
                  <Send className="h-5 w-5" strokeWidth={2.75} />
                  {phase === "draft" ? "Send invoice" : "Sending…"}
                </button>
              )}
            </Magnetic>
          </div>

          {coins.map((c) => (
            <motion.span
              key={c.id}
              aria-hidden="true"
              className="pointer-events-none absolute z-30 grid h-9 w-9 place-items-center rounded-full border-[2.5px] border-(--ink) bg-(--butter) text-sm font-black"
              style={{ left: c.x - 18, top: c.y - 18 }}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{ x: c.dx, y: c.dy, scale: [0, 1.25, 0.6], rotate: c.spin }}
              transition={{
                x: { duration: 0.8, ease: [0.55, 0, 0.75, 0.35], delay: c.delay },
                y: { duration: 0.8, ease: [0.2, 0.85, 0.3, 1], delay: c.delay },
                scale: { duration: 0.8, times: [0, 0.25, 1], delay: c.delay },
                rotate: { duration: 0.8, delay: c.delay },
              }}
              onAnimationComplete={() => setCoins((list) => list.filter((x) => x.id !== c.id))}
            >
              $
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
