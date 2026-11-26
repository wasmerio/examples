import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';
import { differenceCiede2000, parse, formatHex } from 'culori';

export type Mode = 'light' | 'dark';
export interface Pair<T = string> {
  light: T;
  dark: T;
}

export interface Palette {
  version: number;
  color: {
    base: Record<string, Pair>;
    hue: Record<string, { stroke: Pair; fill: Pair }>;
    semantic: Record<string, string>;
  };
  font: { sans: string[]; mono: string[]; hand: string[] };
  radius: { sm: number; md: number; lg: number; [k: string]: unknown };
  [k: string]: unknown;
}

const colorValueSchema = z
  .string()
  .min(1, '颜色不能为空')
  .refine((v) => parse(v) !== undefined, '无效颜色值');

const pairSchema = z.object({
  light: colorValueSchema,
  dark: colorValueSchema,
});

const pairOverrideSchema = z.object({
  light: colorValueSchema.optional(),
  dark: colorValueSchema.optional(),
});

const hueSchema = z.object({
  stroke: pairSchema,
  fill: pairSchema,
});

const hueOverrideSchema = z.object({
  stroke: pairOverrideSchema.optional(),
  fill: pairOverrideSchema.optional(),
});

const requiredBaseSchema = z
  .object({
    bg: pairSchema,
    surface: pairSchema,
    'surface-2': pairSchema,
    border: pairSchema,
    fg: pairSchema,
    muted: pairSchema,
    subtle: pairSchema,
    accent: pairSchema,
    'accent-fg': pairSchema,
    'code-bg': pairSchema,
    selection: pairSchema,
  })
  .catchall(pairSchema);

const fontStackSchema = z.array(z.string().min(1)).min(1);

export const paletteSchema = z
  .object({
    version: z.number().int().positive(),
    color: z
      .object({
        base: requiredBaseSchema,
        hue: z
          .record(z.string().min(1), hueSchema)
          .refine((h) => Object.keys(h).length > 0, '至少需要一种 hue 颜色'),
        semantic: z.record(z.string().min(1), z.string().min(1)),
      })
      .superRefine((color, ctx) => {
        for (const [sem, hue] of Object.entries(color.semantic)) {
          if (!(hue in color.hue)) {
            ctx.addIssue({
              code: 'custom',
              path: ['semantic', sem],
              message: `引用了未知 hue "${hue}"`,
            });
          }
        }
      }),
    font: z.object({
      sans: fontStackSchema,
      mono: fontStackSchema,
      hand: fontStackSchema,
    }),
    radius: z
      .object({
        sm: z.number().nonnegative(),
        md: z.number().nonnegative(),
        lg: z.number().nonnegative(),
      })
      .passthrough(),
  })
  .passthrough();

export const paletteOverrideSchema = z
  .object({
    version: z.number().int().positive().optional(),
    color: z
      .object({
        base: z.record(z.string().min(1), pairOverrideSchema).optional(),
        hue: z.record(z.string().min(1), hueOverrideSchema).optional(),
        semantic: z.record(z.string().min(1), z.string().min(1)).optional(),
      })
      .optional(),
    font: z
      .object({
        sans: fontStackSchema.optional(),
        mono: fontStackSchema.optional(),
        hand: fontStackSchema.optional(),
      })
      .optional(),
    radius: z
      .object({
        sm: z.number().nonnegative().optional(),
        md: z.number().nonnegative().optional(),
        lg: z.number().nonnegative().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

function parseWith<T>(schema: z.ZodType<T>, value: unknown, context: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`[astro-wisp] palette ${context}无效：${msg}`);
  }
  return result.data;
}

function parseJson(raw: string, path: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`[astro-wisp] palette JSON 解析失败 (${path})：${detail}`, { cause: err });
  }
}

/** 递归可选：用户覆盖调色板时只写需要改的键。数组整体替换。 */
export type PaletteOverride = {
  [K in keyof Palette]?: Palette[K] extends unknown[]
    ? Palette[K]
    : Palette[K] extends object
      ? DeepPartial<Palette[K]>
      : Palette[K];
};
type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/** 主题自带的默认调色板（设计令牌唯一来源）。 */
export const PALETTE_PATH = fileURLToPath(new URL('../../design/palette.json', import.meta.url));

/** 去掉以 `$` 开头的注释键（递归）。 */
function strip(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v)
        .filter(([k]) => !k.startsWith('$'))
        .map(([k, x]) => [k, strip(x)]),
    );
  }
  return v;
}

function merge(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (Array.isArray(over) || !over || typeof over !== 'object' || !base || typeof base !== 'object')
    return over;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over)) out[k] = merge(out[k], v);
  return out;
}

export function loadPaletteRaw(path = PALETTE_PATH): string {
  return readFileSync(path, 'utf8');
}

/** 读取并清洗调色板 JSON（去掉 `$` 注释键并校验完整结构）。 */
export function readPalette(path = PALETTE_PATH): Palette {
  const cleaned = strip(parseJson(loadPaletteRaw(path), path));
  return parseWith(paletteSchema, cleaned, `(${path})`) as Palette;
}

/** 读取并校验调色板覆盖 JSON（允许只写部分字段）。 */
export function readPaletteOverride(path: string): PaletteOverride {
  const cleaned = strip(parseJson(loadPaletteRaw(path), path));
  return parseWith(paletteOverrideSchema, cleaned, `覆盖文件 (${path})`) as PaletteOverride;
}

/** 在默认调色板上深度合并覆盖项（对象递归，数组整体替换）。 */
export function mergePalette(
  override: PaletteOverride | Palette | undefined,
  base: Palette = palette,
): Palette {
  const cleanedOverride =
    override === undefined
      ? undefined
      : parseWith(paletteOverrideSchema, strip(override), '覆盖配置');
  const merged = merge(base, cleanedOverride);
  return parseWith(paletteSchema, merged, '合并结果') as Palette;
}

export const palette = readPalette();

export const hueNamesOf = (p: Palette): string[] => Object.keys(p.color.hue);
export const hueNames = hueNamesOf(palette);

export interface Token {
  name: string;
  hex: string;
  mode: Mode;
}

/** 解析为 hex。支持：基础色名（fg）、hue 名（blue = stroke）、`blue-fill`、语义名（q）、已是 hex 的值。 */
export function resolveColor(
  nameOrSemantic: string,
  mode: Mode = 'light',
  p: Palette = palette,
): string {
  const { base, hue, semantic } = p.color;
  let n = nameOrSemantic.trim();
  if (n.startsWith('#')) return n.toLowerCase();
  n = n
    .replace(/^--wisp-/, '')
    .replace(/^sem-/, '')
    .replace(/^hue-/, '');
  let fill = false;
  if (n.endsWith('-fill') && !(n in base)) {
    fill = true;
    n = n.slice(0, -5);
  }
  if (n in semantic) n = semantic[n];
  if (n in hue) return hue[n][fill ? 'fill' : 'stroke'][mode];
  if (!fill && n in base) return base[n][mode];
  throw new Error(`未知颜色令牌: ${nameOrSemantic}`);
}

/** 全部令牌（基础色 + hue stroke/fill），用于最近邻查找。 */
export function allTokens(mode: Mode = 'light', p: Palette = palette): Token[] {
  const out: Token[] = [];
  for (const [k, v] of Object.entries(p.color.base)) out.push({ name: k, hex: v[mode], mode });
  for (const [k, v] of Object.entries(p.color.hue)) {
    out.push({ name: k, hex: v.stroke[mode], mode });
    out.push({ name: `${k}-fill`, hex: v.fill[mode], mode });
  }
  return out;
}

const de = differenceCiede2000();

/** 返回与 hex 的 ΔE2000 最近的令牌（默认在 light 令牌中查找）。 */
export function nearestToken(
  hex: string,
  mode: Mode = 'light',
  p: Palette = palette,
): { name: string; hex: string; deltaE: number } {
  const c = parse(hex);
  if (!c) throw new Error(`无法解析颜色: ${hex}`);
  let best: { name: string; hex: string; deltaE: number } | undefined;
  for (const t of allTokens(mode, p)) {
    const d = de(c, parse(t.hex)!);
    if (!best || d < best.deltaE)
      best = { name: t.name, hex: formatHex(t.hex) ?? t.hex, deltaE: d };
  }
  return best!;
}
