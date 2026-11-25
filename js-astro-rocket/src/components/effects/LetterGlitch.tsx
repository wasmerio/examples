import { useRef, useEffect } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  /**
   * When true (default), at mount the component reads --brand-300, --brand-600,
   * and --brand-900 from :root and uses those as the glitch palette so the
   * effect tracks the active theme. Falls back to `glitchColors` if the
   * tokens can't be resolved.
   */
  useBrandTokens?: boolean;
}

const FALLBACK_COLORS = ['#5e4491', '#A476FF', '#241a38'];
const BRAND_VARS = ['--brand-300', '--brand-600', '--brand-900'];

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * One cell of the grid.
 *
 * Colours are held as numbers rather than CSS strings so a frame can
 * interpolate with arithmetic instead of parsing. `css` is the string the
 * canvas needs, rebuilt only on the frames where the colour moves.
 *
 * `transitioning` keeps the cell out of the active list twice — see
 * `activeIndices` below.
 */
interface Letter {
  char: string;
  r: number;
  g: number;
  b: number;
  targetR: number;
  targetG: number;
  targetB: number;
  colorProgress: number;
  css: string;
  transitioning: boolean;
}

const LetterGlitch = ({
  glitchColors = FALLBACK_COLORS,
  glitchSpeed = 33,
  centerVignette = false,
  outerVignette = false,
  smooth = true,
  useBrandTokens = true,
}: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<Letter[]>([]);
  /**
   * Indices of the cells whose colour is still moving.
   *
   * Around 40% of a grid is mid-transition at any moment with the default
   * `glitchSpeed`, so scanning every cell each frame to find them was most of
   * the work the effect did. Entries are removed by swapping in the last one,
   * which keeps removal O(1) and does not preserve order — nothing here needs
   * order.
   */
  const activeIndices = useRef<number[]>([]);
  const grid = useRef({ columns: 0, rows: 0 });
  // Cached canvas dimensions — updated only in resizeCanvas (called on init
  // and on window resize). Reading getBoundingClientRect() per frame from
  // drawLetters() forced a synchronous layout recompute on every animation
  // tick (~215ms total reflow time on the homepage per Lighthouse Insights).
  const dimensions = useRef({ width: 0, height: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  /** The palette as numbers, parsed once at mount. */
  const palette = useRef<Rgb[]>([]);
  /** The same palette as CSS strings, so an untouched cell allocates nothing. */
  const paletteCss = useRef<string[]>([]);
  /** Whether the canvas is in view. The loop does not run when it is not. */
  const inView = useRef(true);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const lettersAndSymbols = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/',
    '[', ']', '{', '}', ';', ':', '<', '>', ',',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ];

  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  /** An index into the palette rather than a colour, so nothing is allocated. */
  const getRandomColorIndex = () => Math.floor(Math.random() * palette.current.length);

  const parseColor = (color: string): Rgb | null => {
    const sixHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (sixHex) {
      return {
        r: parseInt(sixHex[1], 16),
        g: parseInt(sixHex[2], 16),
        b: parseInt(sixHex[3], 16),
      };
    }
    const threeHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
    if (threeHex) {
      return {
        r: parseInt(threeHex[1] + threeHex[1], 16),
        g: parseInt(threeHex[2] + threeHex[2], 16),
        b: parseInt(threeHex[3] + threeHex[3], 16),
      };
    }
    const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(color);
    if (rgb) {
      return {
        r: parseInt(rgb[1], 10),
        g: parseInt(rgb[2], 10),
        b: parseInt(rgb[3], 10),
      };
    }
    return null;
  };

  /**
   * Turn the configured colours into numbers once.
   *
   * Every colour the effect ever paints is an interpolation between two of
   * these, so this is the only place a colour string is ever parsed. Anything
   * unparseable is dropped; if that leaves nothing, the fallback palette is
   * used, because a grid with no colours draws nothing.
   */
  const setPalette = (colors: string[]) => {
    const parsed = colors.map(parseColor).filter((c): c is Rgb => c !== null);
    const usable = parsed.length > 0 ? parsed : (FALLBACK_COLORS.map(parseColor) as Rgb[]);
    palette.current = usable;
    paletteCss.current = usable.map((c) => `rgb(${c.r}, ${c.g}, ${c.b})`);
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    activeIndices.current = [];
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => {
      const from = getRandomColorIndex();
      const to = getRandomColorIndex();
      const start = palette.current[from];
      const target = palette.current[to];
      return {
        char: getRandomChar(),
        r: start.r,
        g: start.g,
        b: start.b,
        targetR: target.r,
        targetG: target.g,
        targetB: target.b,
        colorProgress: 1,
        css: paletteCss.current[from],
        transitioning: false,
      };
    });
  };

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = dimensions.current;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    const columns = grid.current.columns;
    const all = letters.current;
    for (let index = 0; index < all.length; index++) {
      const letter = all[index];
      const x = (index % columns) * charWidth;
      const y = Math.floor(index / columns) * charHeight;
      ctx.fillStyle = letter.css;
      ctx.fillText(letter.char, x, y);
    }
  };

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      const letter = letters.current[index];
      if (!letter) continue;

      const to = getRandomColorIndex();
      const target = palette.current[to];

      letter.char = getRandomChar();
      letter.targetR = target.r;
      letter.targetG = target.g;
      letter.targetB = target.b;

      if (!smooth) {
        letter.r = target.r;
        letter.g = target.g;
        letter.b = target.b;
        letter.colorProgress = 1;
        letter.css = paletteCss.current[to];
      } else {
        letter.colorProgress = 0;
        // A cell already in the list keeps its single entry and simply
        // restarts, so the list can never hold a duplicate.
        if (!letter.transitioning) {
          letter.transitioning = true;
          activeIndices.current.push(index);
        }
      }
    }
  };

  const handleSmoothTransitions = () => {
    const active = activeIndices.current;
    if (active.length === 0) return;

    const all = letters.current;
    let needsRedraw = false;

    for (let i = active.length - 1; i >= 0; i--) {
      const letter = all[active[i]];
      if (!letter) {
        active[i] = active[active.length - 1];
        active.pop();
        continue;
      }

      letter.colorProgress += 0.05;
      if (letter.colorProgress >= 1) letter.colorProgress = 1;

      const factor = letter.colorProgress;
      letter.r = Math.round(letter.r + (letter.targetR - letter.r) * factor);
      letter.g = Math.round(letter.g + (letter.targetG - letter.g) * factor);
      letter.b = Math.round(letter.b + (letter.targetB - letter.b) * factor);
      letter.css = `rgb(${letter.r}, ${letter.g}, ${letter.b})`;
      needsRedraw = true;

      if (letter.colorProgress === 1) {
        letter.transitioning = false;
        active[i] = active[active.length - 1];
        active.pop();
      }
    }

    if (needsRedraw) {
      drawLetters();
    }
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Cache so drawLetters can use these on every frame without forcing
    // a fresh layout read.
    dimensions.current = { width: rect.width, height: rect.height };

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  // Resolves brand tokens (e.g. --brand-500: oklch(...)) to plain rgb(r,g,b)
  // strings via a 1×1 canvas. Works for any CSS colour the browser can paint.
  const resolveBrandColors = (): string[] => {
    if (typeof document === 'undefined') return [];
    const tmp = document.createElement('canvas');
    tmp.width = 1;
    tmp.height = 1;
    const tmpCtx = tmp.getContext('2d');
    if (!tmpCtx) return [];
    const root = getComputedStyle(document.documentElement);
    const resolved: string[] = [];
    for (const name of BRAND_VARS) {
      const raw = root.getPropertyValue(name).trim();
      if (!raw) continue;
      tmpCtx.clearRect(0, 0, 1, 1);
      tmpCtx.fillStyle = '#000';
      tmpCtx.fillStyle = raw;
      tmpCtx.fillRect(0, 0, 1, 1);
      const [r, g, b] = tmpCtx.getImageData(0, 0, 1, 1).data;
      resolved.push(`rgb(${r}, ${g}, ${b})`);
    }
    return resolved;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');

    let colors = glitchColors;
    if (useBrandTokens) {
      const brand = resolveBrandColors();
      if (brand.length > 0) colors = brand;
    }
    setPalette(colors);

    resizeCanvas();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const start = () => {
      if (prefersReducedMotion || animationRef.current !== null) return;
      // The loop times itself from this instant, so a restart does not fire a
      // burst of catch-up glitches for the time it spent off screen.
      lastGlitchTime.current = Date.now();
      animate();
    };

    /**
     * The effect is decorative and usually sits at the foot of a page, where
     * it ran for the whole visit while the reader was somewhere else. It only
     * runs while it is on screen now.
     *
     * Without IntersectionObserver — no browser the theme supports, but the
     * component also renders in tests and other non-browser hosts — it runs
     * as before rather than not at all.
     */
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          inView.current = visible;
          if (visible) start();
          else stop();
        },
        { rootMargin: '100px' },
      );
      observer.observe(canvas);
    } else {
      start();
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        stop();
        resizeCanvas();
        if (inView.current) start();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      stop();
      clearTimeout(resizeTimeout);
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [glitchSpeed, smooth, useBrandTokens]);

  return (
    <div className="relative w-full h-full bg-[#101010] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(16,16,16,0)_60%,_rgba(16,16,16,1)_100%)]"></div>
      )}
      {centerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"></div>
      )}
    </div>
  );
};

export default LetterGlitch;
