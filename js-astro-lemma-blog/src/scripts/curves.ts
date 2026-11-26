// The curves of the home tagline mark (TaglineCurve.astro), after
// paidax01.github.io/math-curve-loaders: a comet of dots runs along a closed
// curve over its faint track, and the curve slowly breathes and turns.
// Points are in a 100 x 100 box centered on (50, 50).

export type Curve = {
  // The point at t in [0, 2 pi), the curve breathing with s in [0.52, 1].
  point(t: number, s: number): [number, number];
  // Seconds per lap of the comet; a turn of the whole curve, or none.
  lap: number;
  turn?: number;
  // More faint tracks: the curve scaled about the center by these factors.
  levels?: number[];
};

const { cos, sin, PI } = Math;

export const CURVES = {
  // Monge-Ampere, det D^2 u = 1: its entire convex solutions in the plane are
  // the quadratics u = x^T A x / 2 with det A = 1 (Jorgens). Their level sets
  // are ellipses of one area; as A moves through SL(2), the ellipses stretch
  // (by s) and turn, the area fixed. The comet runs the level set u = 1,
  // the inner tracks u = 2/3 and 1/3.
  'monge-ampere': {
    point: (t, s) => {
      const k = Math.sqrt(1 + (1.2 * (s - 0.52)) / 0.48);
      return [29.6 * k * cos(t), (29.6 / k) * sin(t)];
    },
    lap: 4.6,
    turn: 24,
    levels: [Math.sqrt(2 / 3), Math.sqrt(1 / 3)],
  },
  // A circle carved by a sevenfold term: a ring of seven petals.
  ring: {
    point: (t, s) => [3.9 * (7 * cos(t) - 3 * s * cos(7 * t)), 3.9 * (7 * sin(t) - 3 * s * sin(7 * t))],
    lap: 4.6,
    turn: 28,
  },
  // r = cos(5 theta), the petals swelling and shrinking.
  rose: {
    point: (t, s) => {
      const r = 38 * (0.7 + 0.3 * s) * cos(5 * t);
      return [r * cos(t), r * sin(t)];
    },
    lap: 5.4,
    turn: 36,
  },
  // x = sin(3t + pi/2), y = sin(2t).
  lissajous: {
    point: (t, s) => [38 * sin(3 * t + PI / 2), 38 * (0.8 + 0.2 * s) * sin(2 * t)],
    lap: 6,
  },
  // Bernoulli's lemniscate.
  lemniscate: {
    point: (t, s) => {
      const d = 1 + sin(t) ** 2;
      return [(44 * cos(t)) / d, (44 * (0.7 + 0.3 * s) * sin(t) * cos(t)) / d];
    },
    lap: 4.2,
  },
  // A hypotrochoid (R = 3, r = 1, d = 3s): three looped petals.
  spirograph: {
    point: (t, s) => [7.6 * (2 * cos(t) + 3 * s * cos(2 * t)), 7.6 * (2 * sin(t) - 3 * s * sin(2 * t))],
    lap: 5,
    turn: 32,
  },
} satisfies Record<string, Curve>;

export type CurveName = keyof typeof CURVES;

// The comet: DOTS dots spread over TRAIL of a lap behind the head, each
// smaller and fainter than the one before.
export const DOTS = 60;
const TRAIL = 0.38;
// Seconds per breath.
const BREATH = 4.2;

export const breath = (time: number) => 0.52 + 0.24 * (1 + sin((2 * PI * time) / BREATH + 0.55));

// The track at scale `level` about the center.
export const track = (curve: Curve, s: number, level = 1, steps = 360) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const [x, y] = curve.point((2 * PI * i) / steps, s);
    return `${i ? 'L' : 'M'}${(50 + level * x).toFixed(2)} ${(50 + level * y).toFixed(2)}`;
  }).join('');

export const tracks = (curve: Curve, s: number) => [1, ...(curve.levels ?? [])].map((level) => track(curve, s, level));

// Dot i of the comet at `time` seconds: center, radius and opacity.
export const dot = (curve: Curve, time: number, s: number, i: number) => {
  const behind = i / (DOTS - 1);
  const [x, y] = curve.point(2 * PI * (time / curve.lap - behind * TRAIL), s);
  const weight = (1 - behind) ** 0.56;
  return { cx: 50 + x, cy: 50 + y, r: 0.9 + 2.7 * weight, opacity: 0.04 + 0.96 * weight };
};

export const rotation = (curve: Curve, time: number) => (curve.turn ? (-360 * time) / curve.turn : 0);
