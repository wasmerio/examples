/**
 * astro-wisp/explainers —— 交互式分步讲解（React island）。需要站点安装 @astrojs/react、react、react-dom、motion。
 *
 * 分层：core（纯 TS：Step 协议、record 录制器、格式化、色调）+ react（Explainer 外壳 / 原语 / KaTeX）。
 * 具体讲解（矩阵乘、Engram、注意力…）写在站点或文章目录里，组合这些积木即可。
 */
export * from './core';
export {
  default as Explainer,
  MAX_TABS,
  MAX_TICKS,
  Reserve,
  StepCount,
  type ExplainerProps,
  type ExplainerStageContext,
} from './react/Explainer';
export { RichText, Tex, loadKatex, type RichTextProps, type TexProps } from './react/RichText';
export { useExplainer, DEFAULT_DEMO_INTERVAL_MS, type ExplainerApi } from './react/useExplainer';
export {
  labelsFor,
  ZH,
  EN,
  type ExplainerLabels,
  type ExplainerLabelOverrides,
} from './react/labels';
export { default as ExplainerIcon, type ExplainerIconName } from './react/ExplainerIcon';
export { default as Stage, type StageProps } from './react/primitives/Stage';
export {
  default as Matrix,
  CELL,
  LABEL_H,
  matrixWidth,
  matrixHeight,
  type MatrixProps,
  type GridValue,
} from './react/primitives/Matrix';
export { default as Cell, type CellProps, type CellState } from './react/primitives/Cell';
export { default as Label, type LabelProps } from './react/primitives/Label';
export { default as TexLabel, type TexLabelProps } from './react/primitives/TexLabel';
