import { HUE_TONES, SEMANTIC_TONES } from './tones.generated';

export { HUE_TONES, SEMANTIC_TONES };

/**
 * 色调：调色板中的语义色（q / k / v / weight / visited / done …）或 hue 名（blue / amber …）。
 * 颜色只来自令牌：语义色 → `--wisp-sem-*`，hue → `--wisp-hue-*`；每个色调都有 stroke 与 fill 两档。
 */
export type SemanticTone = (typeof SEMANTIC_TONES)[number];
export type HueTone = (typeof HUE_TONES)[number];
export type Tone = SemanticTone | HueTone;

const SEM = new Set<string>(SEMANTIC_TONES);
const prefix = (t: Tone) => (SEM.has(t) ? `--wisp-sem-${t}` : `--wisp-hue-${t}`);

/** 色调的描边色（文字、边框），如 `var(--wisp-sem-q)`。 */
export const toneStroke = (t: Tone): string => `var(${prefix(t)})`;
/** 色调的填充色（背景），如 `var(--wisp-sem-q-fill)`。 */
export const toneFill = (t: Tone): string => `var(${prefix(t)}-fill)`;
