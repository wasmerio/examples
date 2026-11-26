import { useCallback, useEffect, useState } from 'react';
import { clampIndex, type Step } from '../core/timeline';

/** 自动演示每步默认停留毫秒数（不慌不忙、按步骤节奏推进）。 */
export const DEFAULT_DEMO_INTERVAL_MS = 3600;

export interface ExplainerApi {
  index: number;
  demoPlaying: boolean;
  replayKey: number;
  expanded: boolean;
  /** 系统是否启用减少动态效果。仅影响视觉过渡，手动步进与演示仍可用。 */
  reducedMotion: boolean;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  replay: () => void;
  toggleDemo: () => void;
  stopDemo: () => void;
  setExpanded: (next: boolean) => void;
}

/**
 * 讲解组件状态机。首帧（SSR / 初次水合）固定为 index=0、demoPlaying=false、expanded=false、reducedMotion=false，
 * `matchMedia` 仅在 effect 中同步，避免服务端渲染与客户端首帧属性不一致引发 hydration mismatch。
 */
export function useExplainer(steps: readonly Step<unknown>[]): ExplainerApi {
  const length = steps.length;
  const lastIndex = Math.max(length - 1, 0);

  const [index, setIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const safeIndex = clampIndex(index, length);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!demoPlaying) return;
    if (safeIndex >= lastIndex) {
      const done = setTimeout(() => setDemoPlaying(false), 0);
      return () => clearTimeout(done);
    }
    const delay = steps[safeIndex]?.duration ?? DEFAULT_DEMO_INTERVAL_MS;
    const t = setTimeout(() => {
      const nextIdx = clampIndex(safeIndex + 1, length);
      setIndex(nextIdx);
      if (nextIdx >= lastIndex) setDemoPlaying(false);
    }, delay);
    return () => clearTimeout(t);
  }, [demoPlaying, safeIndex, lastIndex, length, steps]);

  const stopDemo = useCallback(() => setDemoPlaying(false), []);

  const goTo = useCallback(
    (i: number) => {
      setDemoPlaying(false);
      const nextIdx = clampIndex(i, length);
      if (nextIdx === safeIndex) {
        setReplayKey((k) => k + 1);
      } else {
        setIndex(nextIdx);
      }
    },
    [length, safeIndex],
  );

  const next = useCallback(() => {
    setDemoPlaying(false);
    setIndex((i) => clampIndex(clampIndex(i, length) + 1, length));
  }, [length]);

  const prev = useCallback(() => {
    setDemoPlaying(false);
    setIndex((i) => clampIndex(clampIndex(i, length) - 1, length));
  }, [length]);

  const first = useCallback(() => {
    setDemoPlaying(false);
    setIndex(0);
  }, []);

  const last = useCallback(() => {
    setDemoPlaying(false);
    setIndex(lastIndex);
  }, [lastIndex]);

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  const toggleDemo = useCallback(() => {
    if (length <= 1) return;
    if (demoPlaying) {
      setDemoPlaying(false);
      return;
    }
    if (safeIndex >= lastIndex) setIndex(0);
    setDemoPlaying(true);
  }, [length, demoPlaying, safeIndex, lastIndex]);

  return {
    index: safeIndex,
    demoPlaying,
    replayKey,
    expanded,
    reducedMotion,
    goTo,
    next,
    prev,
    first,
    last,
    replay,
    toggleDemo,
    stopDemo,
    setExpanded,
  };
}
