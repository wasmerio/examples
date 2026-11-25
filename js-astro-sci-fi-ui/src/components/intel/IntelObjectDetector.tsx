import { useCallback, useEffect, useRef, useState } from "react";
import type { DetectedObject, ObjectDetection } from "@tensorflow-models/coco-ssd";

type Source = "off" | "webcam" | "file";

function getVideoContentRect(v: HTMLVideoElement) {
  const rw = v.clientWidth;
  const rh = v.clientHeight;
  const vw = v.videoWidth;
  const vh = v.videoHeight;
  if (!vw || !vh || !rw || !rh) {
    return { scale: 1, ox: 0, oy: 0, vw: vw || 1, vh: vh || 1 };
  }
  const scale = Math.min(rw / vw, rh / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const ox = (rw - dw) / 2;
  const oy = (rh - dh) / 2;
  return { scale, ox, oy, vw, vh };
}

function drawDetections(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  preds: DetectedObject[],
  primary: string,
  secondary: string,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { scale, ox, oy } = getVideoContentRect(video);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.font = "12px Share Tech Mono, ui-monospace, monospace";

  preds.forEach((p, i) => {
    const [x, y, w, h] = p.bbox;
    const sx = ox + x * scale;
    const sy = oy + y * scale;
    const sw = w * scale;
    const sh = h * scale;
    ctx.strokeStyle = i % 2 === 0 ? primary : secondary;
    ctx.fillStyle = i % 2 === 0 ? primary : secondary;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.globalAlpha = 1;
    ctx.strokeRect(sx, sy, sw, sh);
    const label = `${p.class} ${(p.score * 100).toFixed(0)}%`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(3, 6, 10, 0.82)";
    ctx.fillRect(sx, sy - 18, tw + 8, 18);
    ctx.fillStyle = "#e8f4ff";
    ctx.fillText(label, sx + 4, sy - 5);
  });
}

export default function IntelObjectDetector() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<ObjectDetection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const lastDetectRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [source, setSource] = useState<Source>("off");
  const [modelStatus, setModelStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [modelError, setModelError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<{ class: string; score: number }[]>([]);
  const [statusLine, setStatusLine] = useState("Model not loaded");

  const syncCanvasSize = useCallback(() => {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    if (!wrap || !c) return;
    const r = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    c.width = w;
    c.height = h;
  }, []);

  const stopAll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    }
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.srcObject = null;
      v.removeAttribute("src");
      v.load();
    }
    const c = canvasRef.current;
    if (c) {
      const ctx = c.getContext("2d");
      ctx?.clearRect(0, 0, c.width, c.height);
    }
    setSource("off");
    setPredictions([]);
    setStatusLine("Stopped");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setModelStatus("loading");
      setStatusLine("Loading TensorFlow.js + COCO-SSD…");
      try {
        const tf = await import("@tensorflow/tfjs");
        const cocoSsd = await import("@tensorflow-models/coco-ssd");
        if (cancelled) return;

        try {
          await tf.setBackend("webgl");
          await tf.ready();
        } catch {
          await tf.setBackend("cpu");
          await tf.ready();
        }
        if (cancelled) return;

        const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (cancelled) {
          model.dispose();
          return;
        }
        modelRef.current = model;
        setModelStatus("ready");
        setStatusLine(`Ready (${tf.getBackend()}) · pick webcam or file`);
      } catch (e) {
        if (!cancelled) {
          setModelStatus("error");
          setModelError(e instanceof Error ? e.message : "Model failed to load");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      const stream = streamRef.current;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const u = fileUrlRef.current;
      if (u) URL.revokeObjectURL(u);
      fileUrlRef.current = null;
      const m = modelRef.current;
      if (m) {
        m.dispose();
        modelRef.current = null;
      }
    };
  }, []);

  const tick = useCallback(
    async (time: number) => {
      const model = modelRef.current;
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!model || !v || !c || source === "off") return;

      if (time - lastDetectRef.current >= 280) {
        lastDetectRef.current = time;
        if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && v.videoWidth > 0) {
          try {
            const preds = await model.detect(v, 12, 0.45);
            setPredictions(preds.map((p) => ({ class: p.class, score: p.score })));
            const root = document.documentElement;
            const primary = getComputedStyle(root).getPropertyValue("--sf-color-primary").trim() || "#22d3ee";
            const secondary = getComputedStyle(root).getPropertyValue("--sf-color-secondary").trim() || "#d946ef";
            drawDetections(c, v, preds, primary, secondary);
          } catch {
            /* frame drop */
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [source],
  );

  useEffect(() => {
    if (source === "off" || modelStatus !== "ready") {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    syncCanvasSize();
    lastDetectRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    const onResize = () => syncCanvasSize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [source, modelStatus, tick, syncCanvasSize]);

  const startWebcam = async () => {
    if (modelStatus !== "ready") return;
    stopAll();
    setStatusLine("Requesting camera…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      const v = videoRef.current;
      if (!v) return;
      v.setAttribute("playsinline", "true");
      v.srcObject = stream;
      streamRef.current = stream;
      await v.play();
      setSource("webcam");
      setStatusLine("Webcam · COCO-SSD running locally");
    } catch (e) {
      setStatusLine(e instanceof Error ? e.message : "Camera permission denied");
    }
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || modelStatus !== "ready") return;
    stopAll();
    setStatusLine("Loading file…");
    const url = URL.createObjectURL(file);
    fileUrlRef.current = url;
    const v = videoRef.current;
    if (!v) return;
    v.src = url;
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    try {
      await v.play();
      setSource("file");
      setStatusLine(`File: ${file.name.slice(0, 40)}${file.name.length > 40 ? "…" : ""}`);
    } catch (err) {
      setStatusLine(err instanceof Error ? err.message : "Could not play video");
      URL.revokeObjectURL(url);
      fileUrlRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-[var(--sf-text-muted)]">
        Browsers cannot read pixels from a cross-origin <strong className="text-[var(--sf-text-primary)]">YouTube</strong>{" "}
        iframe, so detection cannot run on that stream. Use your <strong className="text-[var(--sf-text-primary)]">webcam</strong> or an{" "}
        <strong className="text-[var(--sf-text-primary)]">uploaded video</strong> — inference runs entirely in this tab
        with TensorFlow.js COCO-SSD (lite MobileNet).
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={modelStatus !== "ready"}
          onClick={() => void startWebcam()}
          data-sf-sound-hover
          data-sf-sound-click
          className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_90%,transparent)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-sf-muted transition hover:border-[var(--sf-border-strong)] hover:text-sf-text disabled:opacity-40"
        >
          Webcam
        </button>
        <button
          type="button"
          disabled={modelStatus !== "ready"}
          onClick={() => fileInputRef.current?.click()}
          data-sf-sound-hover
          data-sf-sound-click
          className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_90%,transparent)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-sf-muted transition hover:border-[var(--sf-border-strong)] hover:text-sf-text disabled:opacity-40"
        >
          Upload video
        </button>
        <button
          type="button"
          disabled={source === "off"}
          onClick={stopAll}
          data-sf-sound-hover
          data-sf-sound-click
          className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_90%,transparent)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-sf-muted transition hover:border-[var(--sf-border-strong)] hover:text-sf-text disabled:opacity-40"
        >
          Stop
        </button>
        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => void onPickFile(e)} />
      </div>

      <p className="font-sf-mono text-[0.7rem] text-[var(--sf-color-primary)]">{statusLine}</p>
      {modelError ? <p className="text-xs text-red-400">{modelError}</p> : null}

      <div
        ref={wrapRef}
        className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-sm border border-[var(--sf-border-subtle)] bg-black"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          muted
          playsInline
          autoPlay
        />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      </div>

      <div className="max-w-3xl rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-deep)_75%,transparent)] p-3">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-dim)]">Detections (latest frame)</p>
        {predictions.length === 0 ? (
          <p className="mt-2 font-sf-mono text-xs text-[var(--sf-text-muted)]">—</p>
        ) : (
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto font-sf-mono text-xs text-[var(--sf-text-muted)]">
            {predictions.map((p, i) => (
              <li
                key={`${p.class}-${i}`}
                style={
                  {
                    color: i % 2 === 0 ? "var(--sf-color-primary)" : "var(--sf-color-secondary)",
                  } as React.CSSProperties
                }
              >
                {p.class} · {(p.score * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
