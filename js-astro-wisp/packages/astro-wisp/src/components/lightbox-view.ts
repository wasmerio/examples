export type MediaKind = 'svg' | 'img';

export interface LightboxMetrics {
  vw: number;
  vh: number;
  nw: number;
  nh: number;
  kind: MediaKind;
  initialScale: number;
  minScale: number;
  maxScale: number;
}

export interface ViewState {
  scale: number;
  tx: number;
  ty: number;
}

export type WheelAction =
  { type: 'zoom'; factor: number } | { type: 'pan'; dx: number; dy: number };

export const SVG_MAX_INITIAL_SCALE = 1.65;
export const KEEP_VISIBLE = 120;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeZero = (value: number): number => (value === 0 ? 0 : value);

function panBounds(scale: number, metrics: LightboxMetrics): { maxTx: number; maxTy: number } {
  const rw = metrics.nw * scale;
  const rh = metrics.nh * scale;
  const keepX = Math.min(rw * 0.5, KEEP_VISIBLE);
  const keepY = Math.min(rh * 0.5, KEEP_VISIBLE);
  return {
    maxTx: Math.max(0, (metrics.vw + rw) / 2 - keepX),
    maxTy: Math.max(0, (metrics.vh + rh) / 2 - keepY),
  };
}

/**
 * Compute viewport-comfortable initial scale and zoom bounds for lightbox media.
 */
export function computeLightboxMetrics(
  vw: number,
  vh: number,
  nw: number,
  nh: number,
  kind: MediaKind,
): LightboxMetrics {
  const safeVw = Math.max(1, vw);
  const safeVh = Math.max(1, vh);
  const safeNw = Math.max(1, nw);
  const safeNh = Math.max(1, nh);

  const padX = safeVw <= 640 ? 24 : Math.max(48, safeVw * 0.06);
  const padTop = 56;
  const padBottom = safeVw <= 640 ? 64 : 72;

  const availW = Math.max(120, safeVw - padX * 2);
  const availH = Math.max(120, safeVh - padTop - padBottom);
  const fitScale = Math.min(availW / safeNw, availH / safeNh);

  const initialScale = Math.max(
    0.05,
    kind === 'svg' ? Math.min(fitScale, SVG_MAX_INITIAL_SCALE) : Math.min(fitScale, 1),
  );
  const minScale = Math.min(initialScale * 0.5, 0.5);
  const maxScale = Math.max(fitScale * 3, initialScale * 4, kind === 'svg' ? 6 : 4);

  return {
    vw: safeVw,
    vh: safeVh,
    nw: safeNw,
    nh: safeNh,
    kind,
    initialScale,
    minScale,
    maxScale,
  };
}

/**
 * Clamp pan translation so at least `KEEP_VISIBLE` (or half the media) stays inside the viewport.
 */
export function clampPan(
  tx: number,
  ty: number,
  scale: number,
  metrics: LightboxMetrics,
): { tx: number; ty: number } {
  const { maxTx, maxTy } = panBounds(scale, metrics);

  return {
    tx: normalizeZero(clamp(tx, -maxTx, maxTx)),
    ty: normalizeZero(clamp(ty, -maxTy, maxTy)),
  };
}

/**
 * Determine whether current media can be freely panned along either axis inside safe viewport bounds.
 */
export function canPan(scale: number, metrics: LightboxMetrics): boolean {
  const { maxTx, maxTy } = panBounds(scale, metrics);
  return maxTx > 1 || maxTy > 1;
}

/**
 * Zoom to `nextScale` while keeping the media point under `(anchorX, anchorY)` stationary.
 */
export function zoomAtPoint(
  state: ViewState,
  nextScale: number,
  anchorX: number,
  anchorY: number,
  metrics: LightboxMetrics,
): ViewState {
  const s2 = clamp(nextScale, metrics.minScale, metrics.maxScale);
  const cx = metrics.vw / 2;
  const cy = metrics.vh / 2;
  const ratio = state.scale > 0 ? s2 / state.scale : 1;

  const rawTx = anchorX - cx - ratio * (anchorX - cx - state.tx);
  const rawTy = anchorY - cy - ratio * (anchorY - cy - state.ty);
  const { tx, ty } = clampPan(rawTx, rawTy, s2, metrics);

  return { scale: s2, tx, ty };
}

/**
 * Resolve double-click/double-tap target scale, or `null` to reset to initial state.
 */
export function doubleClickTargetScale(state: ViewState, metrics: LightboxMetrics): number | null {
  if (state.scale > metrics.initialScale * 1.05) return null;
  return clamp(Math.max(1, metrics.initialScale * 1.8), metrics.minScale, metrics.maxScale);
}

/**
 * Report whether scale or pan differs noticeably from the initial centered fit.
 */
export function isViewModified(state: ViewState, metrics: LightboxMetrics): boolean {
  return (
    Math.abs(state.scale - metrics.initialScale) > 0.005 ||
    Math.abs(state.tx) > 0.5 ||
    Math.abs(state.ty) > 0.5
  );
}

/**
 * Classify a wheel event into pinch/wheel zoom or 2D trackpad pan.
 */
export function classifyWheel(input: {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  ctrlKey: boolean;
  metaKey: boolean;
  vh: number;
  pannable: boolean;
}): WheelAction {
  let dx = input.deltaX;
  let dy = input.deltaY;
  if (input.deltaMode === 1) {
    dx *= 32;
    dy *= 32;
  } else if (input.deltaMode === 2) {
    const page = input.vh * 0.8;
    dx *= page;
    dy *= page;
  }

  if (input.ctrlKey || input.metaKey) {
    const clampedDy = clamp(dy, -120, 120);
    return { type: 'zoom', factor: Math.exp(-clampedDy * 0.01) };
  }

  if (input.pannable && Math.abs(dx) > 0 && Math.abs(dx) >= Math.abs(dy) * 0.5) {
    return { type: 'pan', dx: normalizeZero(-dx), dy: normalizeZero(-dy) };
  }

  const clampedDy = clamp(dy, -240, 240);
  return { type: 'zoom', factor: Math.exp(-clampedDy * 0.0022) };
}

export function formatZoomPercent(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}
