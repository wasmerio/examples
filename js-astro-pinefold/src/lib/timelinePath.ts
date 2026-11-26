// Generates a rounded "elbow route" SVG path through a list of points —
// vertical, then horizontal, between each pair, with the corner rounded.
export interface Point {
  x: number;
  y: number;
}

export function buildElbowPath(points: Point[], radius = 16): string {
  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const corner: Point = { x: p0.x, y: p1.y };

    if (p0.y === p1.y || p0.x === p1.x) {
      // Straight line only — no corner to round.
      d += ` L${p1.x},${p1.y}`;
      continue;
    }

    const dirV = corner.y > p0.y ? 1 : -1; // approaching corner: up or down?
    const dirH = p1.x > corner.x ? 1 : -1; // leaving corner: left or right?
    const r = Math.min(radius, Math.abs(corner.y - p0.y) / 2, Math.abs(p1.x - corner.x) / 2);

    d += ` L${p0.x},${corner.y - dirV * r}`; // straight in, stop short of corner
    d += ` Q${corner.x},${corner.y} ${corner.x + dirH * r},${corner.y}`; // curve around it
    d += ` L${p1.x},${p1.y}`; // straight out to next point
  }

  return d;
}

// Spaces N points evenly left-to-right, alternating a high/low y band.
// Requires count >= 2 — a single point has no line to draw.
export function layoutTimelinePoints(count: number, width: number, marginX: number, highY: number, lowY: number): Point[] {
  const usable = width - marginX * 2;
  return Array.from({ length: count }, (_, i) => ({
    x: marginX + (usable * i) / (count - 1),
    y: i % 2 === 0 ? lowY : highY,
  }));
}

// SVG text has no automatic word-wrap (unlike HTML), so long titles need to
// be split into lines manually before rendering — Timeline.astro renders
// each returned line as its own <text> element.
export function wrapText(text: string, maxChars = 24): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}