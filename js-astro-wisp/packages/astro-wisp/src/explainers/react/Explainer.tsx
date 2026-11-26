import { LayoutGroup, MotionConfig, motion } from 'motion/react';
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { plainInlineMath, splitFigureLabel } from '../core/math';
import { clampIndex, stepAt, type Step } from '../core/timeline';
import ExplainerIcon from './ExplainerIcon';
import { labelsFor, type ExplainerLabelOverrides, type ExplainerLabels } from './labels';
import { RichText } from './RichText';
import { useExplainer, type ExplainerApi } from './useExplainer';
import '../explainers.css';

/** ≤ MAX_TABS 步时显示顶部语义阶段标签栏；超过时切换为发丝线进度刻度条。 */
export const MAX_TABS = 8;
/** 进度刻度条最多绘制 24 个离散刻度。 */
export const MAX_TICKS = 24;

const TAB_SPRING = { type: 'spring' as const, visualDuration: 0.32, bounce: 0.08 };

export interface ExplainerStageContext {
  replayKey: number;
  expanded: boolean;
  reducedMotion: boolean;
  total: number;
}

export interface ExplainerProps<S> {
  /** 预先生成的全部步骤（通常来自 `(input) => Step<S>[]` 纯函数或 `record()`） */
  steps: Step<S>[];
  /** 渲染当前步骤画面 */
  children: (step: Step<S>, index: number, ctx: ExplainerStageContext) => ReactNode;
  /** 图注标题（可见）。开头的图号（`图 2：`、`Figure 2:`）单独加粗；支持 `$…$` 行内公式 */
  title?: string;
  /** 无障碍名称；缺省取 title */
  label?: string;
  /** 突破正文宽度（.wisp-wide），默认 false */
  wide?: boolean;
  /** 固定正文内联舞台最小高度（桌面端），避免不同步高度变化引起跳动；移动端自动忽略 */
  stageMinHeight?: number | string;
  lang?: string;
  labels?: ExplainerLabelOverrides;
  /** 注入自定义状态控制（单测用） */
  controller?: ExplainerApi;
}

const isButton = (t: EventTarget) => t instanceof HTMLElement && t.tagName === 'BUTTON';
const isRange = (t: EventTarget) => t instanceof HTMLInputElement && t.type === 'range';
const isTextInput = (t: EventTarget) =>
  t instanceof HTMLElement &&
  (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) &&
  !isRange(t);
const isScrollBox = (t: EventTarget) =>
  t instanceof HTMLElement &&
  (t.classList.contains('wisp-explainer__scroll') || t.hasAttribute('data-wisp-overflow'));

/**
 * 为会变化的短数字（如 `3 / 6`）预留最宽字符格，避免数字跳变时周围控件抖动。
 */
export function Reserve({ all, show }: { all: readonly string[]; show: string }) {
  const widest = [...all, show].reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <span className="wisp-explainer__reserve" data-reserve={widest}>
      <span>{show}</span>
    </span>
  );
}

/** 步数「3 / 6」，按最宽的「6 / 6」预留宽度。 */
export function StepCount({ index, total }: { index: number; total: number }) {
  return (
    <span className="wisp-explainer__count" aria-hidden="true">
      <Reserve all={[`${total} / ${total}`]} show={`${index + 1} / ${total}`} />
    </span>
  );
}

/** 全部步骤说明叠在同一格里（不可见、不朗读、不可交互），把说明区撑到最高那一步的高度。 */
const CaptionGhosts = memo(function CaptionGhosts({ steps }: { steps: Step<unknown>[] }) {
  return (
    <div className="wisp-explainer__ghosts" aria-hidden="true" inert>
      {steps.map((s, i) => (
        <div key={i}>
          <RichText text={s.caption} />
        </div>
      ))}
    </div>
  );
});

/**
 * 舞台高度棘轮：记录当前宽度下的最大高度并设为 min-height，防止切步时卡片高度跳动；
 * 宽度变化或切换全屏时重置。
 */
function useStageRatchet(stepCount: number, expanded: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let width = -1;
    let max = 0;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0].borderBoxSize?.[0];
      const w = box ? box.inlineSize : el.offsetWidth;
      const h = box ? box.blockSize : el.offsetHeight;
      if (width === -1) {
        width = w;
        max = h;
        return;
      }
      if (Math.abs(w - width) > 0.5) {
        width = w;
        el.style.minHeight = '';
        max = el.getBoundingClientRect().height;
        return;
      }
      if (h > max + 0.5) {
        max = h;
        el.style.minHeight = `${max}px`;
      }
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      el.style.minHeight = '';
    };
  }, [stepCount, expanded]);
  return ref;
}

/** 标题：图号（ink 600，与静态图共用 .wisp-fig-no）+ 其余文字（muted）。 */
function TitleText({ title }: { title: string }) {
  const { label, rest } = splitFigureLabel(title);
  if (!label)
    return (
      <span className="wisp-explainer__title-text">
        <RichText text={title} />
      </span>
    );
  return (
    <span className="wisp-explainer__title-text" data-numbered="">
      <span className="wisp-fig-no">{label}</span>
      <RichText text={rest} />
    </span>
  );
}

interface InnerProps<S> {
  steps: Step<S>[];
  children: (step: Step<S>, index: number, ctx: ExplainerStageContext) => ReactNode;
  title?: string;
  stageMinHeight?: number | string;
  t: ExplainerLabels;
  api: ExplainerApi;
  uid: string;
  expanded: boolean;
  onOpenExpand: () => void;
  onCloseExpand: () => void;
  expandBtnRef: React.RefObject<HTMLButtonElement | null>;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
}

function ExplainerInner<S>({
  steps,
  children,
  title,
  stageMinHeight,
  t,
  api,
  uid,
  expanded,
  onOpenExpand,
  onCloseExpand,
  expandBtnRef,
  closeBtnRef,
}: InnerProps<S>) {
  const n = steps.length;
  const index = clampIndex(api.index, n);
  const step = stepAt(steps, index);
  const atFirst = index <= 0;
  const atLast = index >= n - 1;
  const hasTabs = n > 1 && n <= MAX_TABS;
  const hasLabels =
    hasTabs && steps.some((s) => typeof s.label === 'string' && s.label.trim().length > 0);
  const progress = n > 1 ? index / (n - 1) : 1;
  const stageRef = useStageRatchet(n, expanded);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = `${uid}-stage`;
  const activeTabId = hasTabs ? `${uid}-tab-${index}` : undefined;
  const stageStyle =
    !expanded && stageMinHeight !== undefined
      ? ({
          '--wisp-explainer-stage-min-h':
            typeof stageMinHeight === 'number' ? `${stageMinHeight}px` : stageMinHeight,
        } as CSSProperties)
      : undefined;

  useEffect(() => {
    const scrollEl = stageRef.current?.querySelector<HTMLElement>('.wisp-explainer__scroll');
    if (!scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth + 4) return;
    const focusEl = scrollEl.querySelector<SVGGraphicsElement>('[data-focus-target]');
    if (!focusEl) return;
    const sr = scrollEl.getBoundingClientRect();
    const fr = focusEl.getBoundingClientRect();
    const targetLeft = scrollEl.scrollLeft + (fr.left + fr.width / 2) - (sr.left + sr.width / 2);
    scrollEl.scrollTo({
      left: Math.max(0, Math.min(scrollEl.scrollWidth - scrollEl.clientWidth, targetLeft)),
      behavior: api.reducedMotion ? 'auto' : 'smooth',
    });
  }, [index, api.reducedMotion, stageRef, expanded]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % n;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + n) % n;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = n - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    e.stopPropagation();
    api.goTo(nextIdx);
    tabRefs.current[nextIdx]?.focus();
  };

  const demoLabel = api.demoPlaying ? t.stop : t.demo;
  const HeaderTag = !expanded ? 'figcaption' : 'div';

  return (
    <div className="wisp-explainer__inner" data-expanded={expanded ? '' : undefined}>
      <HeaderTag className="wisp-explainer__header">
        <div className="wisp-explainer__title">
          {title ? <TitleText title={title} /> : <StepCount index={index} total={n} />}
        </div>

        <div className="wisp-explainer__toolbar">
          {title && <StepCount index={index} total={n} />}
          <button
            type="button"
            className="wisp-explainer__btn"
            aria-label={t.prev}
            title={`${t.prev} (${t.keys.prev})`}
            aria-disabled={atFirst || undefined}
            onClick={() => !atFirst && api.prev()}
          >
            <ExplainerIcon name="prev" />
          </button>
          <button
            type="button"
            className="wisp-explainer__btn"
            aria-label={t.next}
            title={`${t.next} (${t.keys.next})`}
            aria-disabled={atLast || undefined}
            onClick={() => !atLast && api.next()}
          >
            <ExplainerIcon name="next" />
          </button>
          <button
            type="button"
            className="wisp-explainer__btn"
            aria-label={t.replay}
            title={`${t.replay} (${t.keys.replay})`}
            onClick={api.replay}
          >
            <ExplainerIcon name="replay" />
          </button>
          <button
            type="button"
            className="wisp-explainer__btn wisp-explainer__demo"
            aria-label={demoLabel}
            aria-pressed={api.demoPlaying}
            aria-disabled={n <= 1 || undefined}
            aria-description={api.reducedMotion ? t.reducedMotion : undefined}
            data-active={api.demoPlaying ? '' : undefined}
            title={`${demoLabel} (${t.keys.demo})`}
            onClick={api.toggleDemo}
          >
            <ExplainerIcon name={api.demoPlaying ? 'stop' : 'play'} />
          </button>
          {expanded ? (
            <button
              ref={closeBtnRef}
              type="button"
              className="wisp-explainer__btn"
              aria-label={t.close}
              title={`${t.close} (Esc)`}
              onClick={onCloseExpand}
            >
              <ExplainerIcon name="close" />
            </button>
          ) : (
            <button
              ref={expandBtnRef}
              type="button"
              className="wisp-explainer__btn"
              aria-label={t.expand}
              title={`${t.expand} (${t.keys.expand})`}
              onClick={onOpenExpand}
            >
              <ExplainerIcon name="expand" />
            </button>
          )}
        </div>
      </HeaderTag>

      <MotionConfig reducedMotion="user">
        <LayoutGroup id={`${uid}-${expanded ? 'dlg' : 'inline'}`}>
          {hasTabs && (
            <div
              className="wisp-explainer__tabs"
              role="tablist"
              aria-label={t.tabs}
              data-labeled={hasLabels ? '' : undefined}
            >
              {steps.map((s, i) => {
                const active = i === index;
                const num = String(i + 1).padStart(2, '0');
                return (
                  <button
                    key={i}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${uid}-tab-${i}`}
                    type="button"
                    role="tab"
                    className="wisp-explainer__tab"
                    aria-selected={active}
                    aria-controls={panelId}
                    aria-label={s.label ? undefined : `${num} · ${t.stepOf(i + 1, n)}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => api.goTo(i)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                  >
                    <span className="wisp-explainer__tab-num">{num}</span>
                    {s.label && <span className="wisp-explainer__tab-label">{s.label}</span>}
                    {active && (
                      <motion.span
                        className="wisp-explainer__tab-indicator"
                        layoutId="wisp-tab-indicator"
                        transition={TAB_SPRING}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {n > MAX_TABS && (
            <div
              className="wisp-explainer__track"
              style={{ '--wisp-progress': progress } as CSSProperties}
              data-ticks={n <= MAX_TICKS ? '' : undefined}
              data-at-start={atFirst ? '' : undefined}
            >
              <div className="wisp-explainer__rail" aria-hidden="true">
                <span className="wisp-explainer__fill" />
                {n <= MAX_TICKS &&
                  steps.map((_, i) => (
                    <span
                      key={i}
                      className="wisp-explainer__tick"
                      data-done={i <= index ? '' : undefined}
                      style={{ '--wisp-at': i / (n - 1) } as CSSProperties}
                    />
                  ))}
              </div>
              <input
                className="wisp-explainer__range"
                type="range"
                min={0}
                max={n - 1}
                step={1}
                value={index}
                aria-label={t.progress}
                aria-valuetext={t.stepOf(index + 1, n)}
                title={`${t.progress} (${t.keys.first} / ${t.keys.last})`}
                onChange={(e) => api.goTo(Number(e.target.value))}
              />
            </div>
          )}

          <div
            ref={stageRef}
            id={panelId}
            className="wisp-explainer__stage"
            style={stageStyle}
            role={hasTabs ? 'tabpanel' : undefined}
            aria-labelledby={activeTabId}
          >
            {children(step, index, {
              replayKey: api.replayKey,
              expanded,
              reducedMotion: api.reducedMotion,
              total: n,
            })}
          </div>
        </LayoutGroup>
      </MotionConfig>

      <div className="wisp-explainer__captions">
        <div
          className="wisp-explainer__caption"
          aria-live={api.demoPlaying ? 'off' : 'polite'}
          aria-atomic="true"
        >
          <RichText text={step.caption} />
        </div>
        <CaptionGhosts steps={steps} />
      </div>
    </div>
  );
}

/**
 * 讲解组件外壳：`<figure>` + 标题工具条 + 顶部语义阶段标签栏（≤8 步）/ 进度条（>8 步）
 * + Motion 舞台 + 固定高度说明区 + 原生 `<dialog>` 全屏推演。
 */
export default function Explainer<S>({
  steps,
  children,
  title,
  label,
  wide = false,
  stageMinHeight,
  lang,
  labels,
  controller,
}: ExplainerProps<S>) {
  const internalApi = useExplainer(steps);
  const api = controller ?? internalApi;
  const t = labelsFor(lang, labels);
  const accessibleLabel = label ?? (title ? plainInlineMath(title) : 'Explainer');
  const uid = useId();

  const figureRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const wasExpandedRef = useRef(false);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  const { demoPlaying, stopDemo, expanded, setExpanded } = api;

  useEffect(() => {
    const el = figureRef.current;
    if (!el || !demoPlaying) return;
    const onVis = () => {
      if (document.hidden) stopDemo();
    };
    const onContentVis = (e: Event) => {
      if ((e as Event & { skipped?: boolean }).skipped) stopDemo();
    };
    document.addEventListener('visibilitychange', onVis);
    el.addEventListener('contentvisibilityautostatechange', onContentVis);
    let io: IntersectionObserver | undefined;
    if (!expanded && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => !entry.isIntersecting)) stopDemo();
        },
        { threshold: 0.05 },
      );
      io.observe(el);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('contentvisibilityautostatechange', onContentVis);
      io?.disconnect();
    };
  }, [demoPlaying, stopDemo, expanded]);

  useEffect(() => {
    if (expanded) {
      wasExpandedRef.current = true;
      const dlg = dialogRef.current;
      if (dlg && typeof dlg.showModal === 'function' && !dlg.open) {
        dlg.showModal();
      }
      closeBtnRef.current?.focus();
      return;
    }
    if (wasExpandedRef.current) {
      wasExpandedRef.current = false;
      expandBtnRef.current?.focus();
    }
  }, [expanded]);

  const openExpand = useCallback(() => {
    const h = figureRef.current?.getBoundingClientRect().height ?? 0;
    if (h > 0) setPlaceholderHeight(h);
    setExpanded(true);
  }, [setExpanded]);

  const closeExpand = useCallback(() => {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.close === 'function' && dlg.open) {
      dlg.close();
    } else {
      setExpanded(false);
    }
  }, [setExpanded]);

  const handleDialogClose = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);

  const handleDialogClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) closeExpand();
    },
    [closeExpand],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTextInput(e.target)) return;
      switch (e.key) {
        case ' ':
          if (isButton(e.target) || isRange(e.target) || isScrollBox(e.target)) return;
          api.toggleDemo();
          break;
        case 'ArrowRight':
          if (isRange(e.target) || isScrollBox(e.target)) return;
          api.next();
          break;
        case 'ArrowLeft':
          if (isRange(e.target) || isScrollBox(e.target)) return;
          api.prev();
          break;
        case 'Home':
          if (isButton(e.target) || isRange(e.target) || isScrollBox(e.target)) return;
          api.first();
          break;
        case 'End':
          if (isButton(e.target) || isRange(e.target) || isScrollBox(e.target)) return;
          api.last();
          break;
        case 'r':
        case 'R':
          api.replay();
          break;
        case 'f':
        case 'F':
          if (expanded) closeExpand();
          else openExpand();
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    [api, expanded, closeExpand, openExpand],
  );

  const inner = (
    <ExplainerInner
      steps={steps}
      title={title}
      stageMinHeight={stageMinHeight}
      t={t}
      api={api}
      uid={uid}
      expanded={expanded}
      onOpenExpand={openExpand}
      onCloseExpand={closeExpand}
      expandBtnRef={expandBtnRef}
      closeBtnRef={closeBtnRef}
    >
      {children}
    </ExplainerInner>
  );

  return (
    <figure
      ref={figureRef}
      className={wide ? 'wisp-wide wisp-explainer' : 'wisp-explainer'}
      role="group"
      aria-label={accessibleLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {expanded ? (
        <>
          <div
            className="wisp-explainer__placeholder"
            style={placeholderHeight > 0 ? { height: placeholderHeight } : undefined}
            aria-hidden="true"
          />
          <dialog
            ref={dialogRef}
            className="wisp-explainer__dialog"
            aria-label={accessibleLabel}
            onClose={handleDialogClose}
            onClick={handleDialogClick}
            onKeyDown={onKeyDown}
          >
            {inner}
          </dialog>
        </>
      ) : (
        inner
      )}
    </figure>
  );
}
