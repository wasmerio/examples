import { lang as siteLang } from 'virtual:wisp/locale';

/** Explainer 的界面文字。站点语言为英文时自动用英文；也可以通过 `labels` 属性逐项覆盖。 */
export interface ExplainerLabels {
  first: string;
  prev: string;
  next: string;
  last: string;
  replay: string;
  demo: string;
  stop: string;
  expand: string;
  close: string;
  tabs: string;
  progress: string;
  reducedMotion: string;
  /** 进度的朗读文本 */
  stepOf: (index: number, total: number) => string;
  /** 未提供语义标签时的短编号文字 */
  stepShort: (index: number) => string;
  /** 键盘提示（title 中的括号部分） */
  keys: {
    first: string;
    prev: string;
    next: string;
    last: string;
    replay: string;
    demo: string;
    expand: string;
  };
}

export type ExplainerLabelOverrides = Partial<Omit<ExplainerLabels, 'keys'>> & {
  keys?: Partial<ExplainerLabels['keys']>;
};

export const ZH: ExplainerLabels = {
  first: '第一步',
  prev: '上一步',
  next: '下一步',
  last: '最后一步',
  replay: '重播',
  demo: '自动演示',
  stop: '停止演示',
  expand: '全屏查看',
  close: '关闭全屏',
  tabs: '演示步骤',
  progress: '进度',
  reducedMotion: '系统已减少过渡动画；仍可手动步进',
  stepOf: (i, n) => `第 ${i} 步，共 ${n} 步`,
  stepShort: (i) => `第 ${i} 步`,
  keys: {
    first: 'Home',
    prev: '←',
    next: '→',
    last: 'End',
    replay: 'R',
    demo: '空格',
    expand: 'F',
  },
};

export const EN: ExplainerLabels = {
  first: 'First step',
  prev: 'Previous step',
  next: 'Next step',
  last: 'Last step',
  replay: 'Replay',
  demo: 'Auto walkthrough',
  stop: 'Stop walkthrough',
  expand: 'Expand view',
  close: 'Close',
  tabs: 'Steps',
  progress: 'Progress',
  reducedMotion: 'Transitions are reduced; manual stepping is still available',
  stepOf: (i, n) => `Step ${i} of ${n}`,
  stepShort: (i) => `Step ${i}`,
  keys: {
    first: 'Home',
    prev: '←',
    next: '→',
    last: 'End',
    replay: 'R',
    demo: 'Space',
    expand: 'F',
  },
};

/** 按 BCP 47 语言标签选择内置文字：zh* → 中文，其余 → 英文。缺省取站点语言（wisp 配置的 site.lang）。 */
export function labelsFor(
  lang: string = siteLang,
  overrides: ExplainerLabelOverrides = {},
): ExplainerLabels {
  const base = /^zh\b/i.test(lang) ? ZH : EN;
  return { ...base, ...overrides, keys: { ...base.keys, ...overrides.keys } };
}
