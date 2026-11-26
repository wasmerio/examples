import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

const MIN_WIDTH = 1200;

/**
 * The hero kite's string unspools down the right gutter as the page scrolls.
 * The path is built in page pixels, then the dash offset is driven by how far the viewport has travelled.
 */
export function KiteString({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const bowRef = useRef<SVGGElement>(null);
  const samples = useRef<{ len: number; x: number; y: number }[]>([]);
  const total = useRef(0);
  const reduced = useReducedMotion();
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const build = () => {
      const w = root.clientWidth;
      const h = root.scrollHeight;
      const anchor = root.querySelector<HTMLElement>("[data-kite-anchor]");
      const footer = root.querySelector("footer");
      if (w < MIN_WIDTH || !anchor || !footer) {
        setGeo(null);
        return;
      }
      const rootTop = root.getBoundingClientRect().top;
      const a = anchor.getBoundingClientRect();
      const sx = a.left + a.width / 2;
      const sy = a.top - rootTop + a.height * 0.97;
      const gutter = w - Math.max(26, (w - 1152) / 4);
      const end = footer.getBoundingClientRect().top - rootTop + 40;
      let d = `M ${sx} ${sy} C ${sx} ${sy + 160}, ${gutter} ${sy + 140}, ${gutter} ${sy + 380}`;
      let y = sy + 380;
      let flip = 1;
      while (y < end - 360) {
        y += 360;
        d += ` S ${gutter + 16 * flip} ${y - 120}, ${gutter} ${y}`;
        flip *= -1;
      }
      d += ` S ${gutter} ${end - 40}, ${gutter - 30} ${end}`;
      setGeo({ w, h, d });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(root);
    return () => ro.disconnect();
  }, [rootRef]);

  const update = (scroll: number) => {
    const path = pathRef.current;
    if (!path || !samples.current.length) return;
    const target = reduced ? Infinity : scroll + window.innerHeight * 0.72;
    const list = samples.current;
    let hit = list[list.length - 1];
    for (let i = 1; i < list.length; i++) {
      if (list[i].y >= target) {
        const p = list[i - 1];
        const q = list[i];
        const t = (target - p.y) / Math.max(1, q.y - p.y);
        hit = { len: p.len + (q.len - p.len) * t, x: p.x + (q.x - p.x) * t, y: target };
        break;
      }
    }
    path.style.strokeDashoffset = String(total.current - hit.len);
    bowRef.current?.setAttribute("transform", `translate(${hit.x} ${hit.y})`);
  };

  useEffect(() => {
    const path = pathRef.current;
    if (!geo || !path) return;
    total.current = path.getTotalLength();
    path.style.strokeDasharray = String(total.current);
    const n = 240;
    samples.current = Array.from({ length: n + 1 }, (_, i) => {
      const len = (total.current * i) / n;
      const pt = path.getPointAtLength(len);
      return { len, x: pt.x, y: pt.y };
    });
    update(window.scrollY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, reduced]);

  useMotionValueEvent(scrollY, "change", update);

  if (!geo) return null;
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-40"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
    >
      <path ref={pathRef} d={geo.d} fill="none" stroke="#141217" strokeWidth="2.25" strokeLinecap="round" />
      <g ref={bowRef}>
        <path d="M0 0 L-12 -8 L-12 8 Z M0 0 L12 -8 L12 8 Z" fill="#FFE15A" stroke="#141217" strokeWidth="2.25" strokeLinejoin="round" />
        <circle r="3.5" fill="#141217" />
      </g>
    </svg>
  );
}
