import { describe, expect, it } from 'vitest';
import {
  KEEP_VISIBLE,
  SVG_MAX_INITIAL_SCALE,
  canPan,
  clampPan,
  classifyWheel,
  computeLightboxMetrics,
  doubleClickTargetScale,
  formatZoomPercent,
  isViewModified,
  zoomAtPoint,
} from './lightbox-view';

describe('computeLightboxMetrics', () => {
  it('enlarges desktop SVG diagrams comfortably up to 1.65x', () => {
    const m1 = computeLightboxMetrics(1280, 800, 704, 394, 'svg');
    expect(m1.initialScale).toBeCloseTo(1.6, 5);
    expect(m1.initialScale).toBeLessThanOrEqual(SVG_MAX_INITIAL_SCALE);

    const m2 = computeLightboxMetrics(1536, 794, 704, 394, 'svg');
    expect(m2.initialScale).toBeCloseTo(SVG_MAX_INITIAL_SCALE, 5);
  });

  it('caps tiny SVGs at 1.65x so small graphics are not over-magnified', () => {
    const m = computeLightboxMetrics(1280, 800, 180, 100, 'svg');
    expect(m.initialScale).toBe(SVG_MAX_INITIAL_SCALE);
    expect(m.minScale).toBe(0.5);
    expect(m.maxScale).toBeGreaterThanOrEqual(6);
  });

  it('scales down wide SVGs and mobile SVGs to fit comfortably', () => {
    const wide = computeLightboxMetrics(1280, 800, 1400, 400, 'svg');
    expect(wide.initialScale).toBeLessThan(1);
    expect(wide.initialScale).toBeCloseTo((1280 - 1280 * 0.06 * 2) / 1400, 4);

    const mobile = computeLightboxMetrics(375, 812, 704, 394, 'svg');
    expect(mobile.initialScale).toBeCloseTo((375 - 48) / 704, 4);
    expect(mobile.minScale).toBeCloseTo(mobile.initialScale * 0.5, 4);
  });

  it('keeps bitmaps at 1:1 when smaller than viewport and fits larger bitmaps', () => {
    const smallImg = computeLightboxMetrics(1280, 800, 600, 400, 'img');
    expect(smallImg.initialScale).toBe(1);
    expect(smallImg.maxScale).toBeGreaterThanOrEqual(4);

    // Tiny bitmap on a wide monitor can still zoom past 4x using fitScale * 3
    const tinyImg = computeLightboxMetrics(1536, 794, 320, 180, 'img');
    expect(tinyImg.initialScale).toBe(1);
    expect(tinyImg.maxScale).toBeGreaterThan(4);

    const hugeImg = computeLightboxMetrics(1280, 800, 2400, 1600, 'img');
    expect(hugeImg.initialScale).toBeLessThan(1);
    expect(hugeImg.initialScale).toBeCloseTo((800 - 56 - 72) / 1600, 4);
  });
});

describe('zoomAtPoint & clampPan', () => {
  it('keeps the media point under the cursor stationary when zooming unclamped', () => {
    const m = computeLightboxMetrics(1280, 800, 704, 394, 'svg');
    const initial = { scale: m.initialScale, tx: 0, ty: 0 };
    const anchorX = 912;
    const anchorY = 265;

    // Local coordinates relative to media center before zoom
    const cx = m.vw / 2;
    const cy = m.vh / 2;
    const localXBefore = (anchorX - cx - initial.tx) / initial.scale;
    const localYBefore = (anchorY - cy - initial.ty) / initial.scale;

    const next = zoomAtPoint(initial, 3, anchorX, anchorY, m);
    expect(next.scale).toBe(3);

    const screenXAfter = cx + next.tx + localXBefore * next.scale;
    const screenYAfter = cy + next.ty + localYBefore * next.scale;
    expect(screenXAfter).toBeCloseTo(anchorX, 5);
    expect(screenYAfter).toBeCloseTo(anchorY, 5);
  });

  it('preserves center when zooming at viewport center and clamps min/max scale', () => {
    const m = computeLightboxMetrics(1280, 800, 704, 394, 'svg');
    const initial = { scale: m.initialScale, tx: 0, ty: 0 };

    const zoomedIn = zoomAtPoint(initial, 99, m.vw / 2, m.vh / 2, m);
    expect(zoomedIn.scale).toBe(m.maxScale);
    expect(zoomedIn.tx).toBe(0);
    expect(zoomedIn.ty).toBe(0);

    const zoomedOut = zoomAtPoint(initial, 0.01, m.vw / 2, m.vh / 2, m);
    expect(zoomedOut.scale).toBe(m.minScale);
    expect(zoomedOut.tx).toBe(0);
    expect(zoomedOut.ty).toBe(0);
  });

  it('allows free 2D pan for bitmaps and Mermaid SVGs while keeping KEEP_VISIBLE inside viewport', () => {
    const smallImg = computeLightboxMetrics(1536, 794, 320, 180, 'img');
    expect(canPan(1, smallImg)).toBe(true);
    // At scale 1: rw=320, rh=180, keepX=120, keepY=90 -> maxTx=(1536+320)/2-120=808, maxTy=(794+180)/2-90=397
    expect(clampPan(2000, -2000, 1, smallImg)).toEqual({
      tx: (1536 + 320) / 2 - KEEP_VISIBLE,
      ty: -((794 + 180) / 2 - 90),
    });

    const mermaid = computeLightboxMetrics(1536, 794, 345, 278, 'svg');
    expect(canPan(mermaid.initialScale, mermaid)).toBe(true);
    const bounds = clampPan(5000, 5000, mermaid.initialScale, mermaid);
    expect(bounds.tx).toBeGreaterThan(0);
    expect(bounds.ty).toBeGreaterThan(0);
    expect(clampPan(-40, 10, 2, mermaid)).toEqual({ tx: -40, ty: 10 });
  });
});

describe('doubleClickTargetScale & isViewModified', () => {
  it('toggles between initial comfortable size and zoomed state', () => {
    const desktopSvg = computeLightboxMetrics(1280, 800, 704, 394, 'svg');
    const target = doubleClickTargetScale(
      { scale: desktopSvg.initialScale, tx: 0, ty: 0 },
      desktopSvg,
    );
    expect(target).toBeCloseTo(desktopSvg.initialScale * 1.8, 5);
    expect(doubleClickTargetScale({ scale: target!, tx: 0, ty: 0 }, desktopSvg)).toBeNull();

    const mobileSvg = computeLightboxMetrics(375, 812, 704, 394, 'svg');
    const mobileTarget = doubleClickTargetScale(
      { scale: mobileSvg.initialScale, tx: 0, ty: 0 },
      mobileSvg,
    );
    expect(mobileTarget).toBeGreaterThanOrEqual(1);

    const hugeImg = computeLightboxMetrics(1280, 800, 2400, 1600, 'img');
    const imgTarget = doubleClickTargetScale(
      { scale: hugeImg.initialScale, tx: 0, ty: 0 },
      hugeImg,
    );
    expect(imgTarget).toBe(1);
  });

  it('detects view modification with small tolerance', () => {
    const m = computeLightboxMetrics(1280, 800, 704, 394, 'svg');
    expect(isViewModified({ scale: m.initialScale, tx: 0, ty: 0 }, m)).toBe(false);
    expect(isViewModified({ scale: m.initialScale + 0.002, tx: 0.2, ty: -0.2 }, m)).toBe(false);
    expect(isViewModified({ scale: m.initialScale + 0.02, tx: 0, ty: 0 }, m)).toBe(true);
    expect(isViewModified({ scale: m.initialScale, tx: 5, ty: 0 }, m)).toBe(true);
  });

  it('formats zoom percent with rounded integer', () => {
    expect(formatZoomPercent(1.646)).toBe('165%');
    expect(formatZoomPercent(1)).toBe('100%');
  });
});

describe('classifyWheel', () => {
  it('treats ctrlKey/metaKey wheel events as pinch zoom', () => {
    const zoomIn = classifyWheel({
      deltaX: 0,
      deltaY: -20,
      deltaMode: 0,
      ctrlKey: true,
      metaKey: false,
      vh: 800,
      pannable: true,
    });
    expect(zoomIn.type).toBe('zoom');
    if (zoomIn.type === 'zoom') expect(zoomIn.factor).toBeGreaterThan(1.1);
  });

  it('treats standard vertical mouse wheel (pixel & line mode) as zoom', () => {
    const px = classifyWheel({
      deltaX: 0,
      deltaY: -100,
      deltaMode: 0,
      ctrlKey: false,
      metaKey: false,
      vh: 800,
      pannable: false,
    });
    expect(px.type).toBe('zoom');
    if (px.type === 'zoom') expect(px.factor).toBeGreaterThan(1);

    const lines = classifyWheel({
      deltaX: 0,
      deltaY: 3,
      deltaMode: 1,
      ctrlKey: false,
      metaKey: false,
      vh: 800,
      pannable: true,
    });
    expect(lines.type).toBe('zoom');
    if (lines.type === 'zoom') expect(lines.factor).toBeLessThan(1);
  });

  it('treats horizontal/diagonal trackpad scroll while zoomed as 2D pan', () => {
    const pan = classifyWheel({
      deltaX: 24,
      deltaY: 16,
      deltaMode: 0,
      ctrlKey: false,
      metaKey: false,
      vh: 800,
      pannable: true,
    });
    expect(pan).toEqual({ type: 'pan', dx: -24, dy: -16 });

    // When not pannable, horizontal tilt does not pan
    const notPannable = classifyWheel({
      deltaX: 24,
      deltaY: 16,
      deltaMode: 0,
      ctrlKey: false,
      metaKey: false,
      vh: 800,
      pannable: false,
    });
    expect(notPannable.type).toBe('zoom');
  });
});
