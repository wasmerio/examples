const LABELS = [
  "UNKNOWN CRAFT",
  "DEBRIS FIELD",
  "BIOFORM SIGNATURE",
  "SIGNAL ANOMALY",
  "STRUCTURAL IRREGULARITY",
  "THERMAL BLOOM",
] as const;

type Phase = "IDLE" | "ACQUIRING" | "ANALYSIS" | "COMPLETE";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function appendLog(line: string): void {
  const log = document.getElementById("sf-intel-log");
  if (!log) return;
  const row = document.createElement("div");
  row.className = "border-b border-[color-mix(in_oklab,var(--sf-border-subtle)_50%,transparent)] py-1.5 font-sf-mono text-[0.7rem] text-[var(--sf-text-muted)] last:border-0";
  row.textContent = `[${new Date().toLocaleTimeString()}] ${line}`;
  log.prepend(row);
}

function setState(text: Phase): void {
  const el = document.getElementById("sf-intel-state");
  if (el) el.textContent = text;
}

function setConfidence(pct: number): void {
  const bar = document.getElementById("sf-intel-confidence-bar");
  if (bar instanceof HTMLElement) bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  const label = document.getElementById("sf-intel-confidence-label");
  if (label) label.textContent = `${pct.toFixed(0)}%`;
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function runScan(): Promise<void> {
  const btn = document.getElementById("sf-intel-scan");
  if (btn instanceof HTMLButtonElement) btn.disabled = true;

  setState("ACQUIRING");
  setConfidence(12);
  appendLog("optical feed locked · youtube embed channel");
  await wait(500);

  setState("ANALYSIS");
  for (let p = 28; p <= 94; p += 11) {
    setConfidence(p);
    await wait(220);
  }

  const label = pick(LABELS);
  appendLog(`classification (mock): ${label}`);
  appendLog("confidence synthesized for UI demo only");
  setState("COMPLETE");
  setConfidence(62 + Math.floor(Math.random() * 25));

  const feed = document.getElementById("sf-intel-feed");
  if (feed instanceof HTMLElement) {
    feed.style.outline = "2px solid var(--sf-color-secondary)";
    feed.style.outlineOffset = "2px";
  }
  await wait(800);
  if (feed instanceof HTMLElement) {
    feed.style.outline = "";
    feed.style.outlineOffset = "";
  }

  setState("IDLE");
  setConfidence(0);
  if (btn instanceof HTMLButtonElement) btn.disabled = false;
}

function boot(): void {
  appendLog("optical feed: youtube live embed (autoplay muted)");

  const btn = document.getElementById("sf-intel-scan");
  btn?.addEventListener("click", () => {
    void runScan();
  });
}

boot();
