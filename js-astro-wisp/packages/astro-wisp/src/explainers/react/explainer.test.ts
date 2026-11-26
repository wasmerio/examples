import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { stepAt, type Step } from '../core/timeline';
import Explainer from './Explainer';
import { harvestSsrTex, renderTex } from './RichText';
import { EN, ZH, labelsFor } from './labels';
import { DEFAULT_DEMO_INTERVAL_MS, type ExplainerApi } from './useExplainer';

describe('labels', () => {
  it('按语言选择内置文字', () => {
    expect(labelsFor('zh-CN').demo).toBe(ZH.demo);
    expect(labelsFor('en').demo).toBe(EN.demo);
    expect(labelsFor('fr').replay).toBe('Replay');
    expect(labelsFor('zh-CN').expand).toBe(ZH.expand);
  });
  it('逐项覆盖，键位提示单独合并', () => {
    const t = labelsFor('en', { demo: 'Walkthrough', keys: { expand: 'E' } });
    expect(t.demo).toBe('Walkthrough');
    expect(t.keys.expand).toBe('E');
    expect(t.keys.next).toBe(EN.keys.next);
  });
});

describe('DEFAULT_DEMO_INTERVAL_MS', () => {
  it('默认演示步长为舒缓节奏（>= 3000ms）', () => {
    expect(DEFAULT_DEMO_INTERVAL_MS).toBeGreaterThanOrEqual(3000);
  });
});

describe('Explainer 服务端渲染', () => {
  const steps: Step<number>[] = [
    { state: 0, label: '词缀', caption: '短' },
    { state: 1, label: '异或', caption: '第二步：令 $q = W^{Q} x$，再看' },
    { state: 2, label: '建桶', caption: '价格 \\$5 <b>不是标签</b>' },
  ];
  const html = renderToString(
    createElement(Explainer<number>, {
      steps,
      title: '图 05-2a：$W^{UK}$ 的吸收',
      lang: 'zh-CN',
      children: (s: Step<number>) => createElement('svg', { 'data-state': s.state }),
    }),
  );

  it('标题：图号单独一段，步数在标题行工具条里，重播 / 演示 / 全屏按钮齐全', () => {
    expect(html).toContain('<span class="wisp-fig-no">图 05-2a</span>');
    expect(html.match(/wisp-explainer__count/g)).toHaveLength(1);
    expect(html).toContain('data-reserve="3 / 3"');
    expect(html).toContain('aria-label="重播"');
    expect(html).toContain('aria-label="自动演示"');
    expect(html).toContain('aria-label="全屏查看"');
    expect(html).not.toContain('rx="2"');
  });

  it('≤ 8 步渲染顶部语义标签栏，含编号与 label；第一步时上一步 aria-disabled', () => {
    expect(html).toContain('role="tablist"');
    expect(html).toContain('data-labeled=""');
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html).toContain('词缀');
    expect(html).toContain('异或');
    expect(html).toContain('建桶');
    expect(html).toMatch(/aria-label="上一步"[^>]*aria-disabled="true"/);
    expect(html).not.toContain('aria-label="第一步"');
    expect(html).not.toContain('aria-label="最后一步"');
  });

  it('公式在服务端就排好（KaTeX HTML），正文文字被转义，并输出 data-tex 与中文避头尾属性', () => {
    expect(html).toMatch(/class="katex"/);
    expect(html).toContain('data-tex="q = W^{Q} x" data-wisp-kinsoku=""');
    expect(html).toContain('data-tex="W^{UK}"');
    expect(html).not.toContain('data-tex="W^{UK}" data-wisp-kinsoku');
    expect(html).not.toContain('<b>不是标签</b>');
    expect(html).toContain('价格 $5');
  });

  it('全部说明都渲染在不朗读的预留层里，aria-live 区只有当前一步', () => {
    const live = /<div class="wisp-explainer__caption" aria-live="polite"[^>]*>(.*?)<\/div>/.exec(
      html,
    );
    expect(live?.[1]).toBe('短');
    expect(html).toMatch(/class="wisp-explainer__ghosts" aria-hidden="true" inert=""/);
    expect(html).toContain('W^{Q} x');
  });

  it('未传 label 且 ≤ 8 步时仍生成可访问的无标记 tablist', () => {
    const plainSteps: Step<number>[] = [
      { state: 0, caption: 'A' },
      { state: 1, caption: 'B' },
    ];
    const noLabelHtml = renderToString(
      createElement(Explainer<number>, {
        steps: plainSteps,
        lang: 'zh-CN',
        children: (s: Step<number>) => createElement('svg', { 'data-state': s.state }),
      }),
    );
    expect(noLabelHtml).toContain('role="tablist"');
    expect(noLabelHtml).not.toContain('data-labeled=""');
    expect(noLabelHtml).toContain('01 · 第 1 步，共 2 步');
  });

  it('> 8 步切换为发丝线进度条与离散刻度', () => {
    const manySteps: Step<number>[] = Array.from({ length: 10 }, (_, i) => ({
      state: i,
      caption: `第 ${i + 1} 步`,
    }));
    const manyHtml = renderToString(
      createElement(Explainer<number>, {
        steps: manySteps,
        lang: 'zh-CN',
        children: (s: Step<number>) => createElement('svg', { 'data-state': s.state }),
      }),
    );
    expect(manyHtml).not.toContain('role="tablist"');
    expect(manyHtml).toContain('class="wisp-explainer__track"');
    expect(manyHtml).toContain('class="wisp-explainer__range"');
    expect(manyHtml).toContain('data-at-start=""');
    expect(manyHtml.match(/wisp-explainer__tick/g)).toHaveLength(10);
  });

  it('stageMinHeight 写入内联舞台 CSS 自定义属性', () => {
    const fixedHtml = renderToString(
      createElement(Explainer<number>, {
        steps: [
          { state: 0, caption: 'A' },
          { state: 1, caption: 'B' },
        ],
        stageMinHeight: 440,
        children: (s: Step<number>) => createElement('svg', { 'data-state': s.state }),
      }),
    );
    expect(fixedHtml).toContain('--wisp-explainer-stage-min-h:440px');
  });
});

describe('stepAt 与步骤收缩边界保护', () => {
  const steps: Step<number>[] = [
    { state: 10, caption: '第一步' },
    { state: 20, caption: '第二步' },
  ];

  it('stepAt 对越界索引做夹紧，空数组抛错', () => {
    expect(stepAt(steps, -1)).toBe(steps[0]);
    expect(stepAt(steps, 10)).toBe(steps[1]);
    expect(() => stepAt([], 0)).toThrow(/空/);
  });

  it('steps 缩短且 controller.index 越界时 Explainer 安全夹紧到最后一步而不崩溃', () => {
    const staleCtrl: ExplainerApi = {
      index: 5,
      demoPlaying: false,
      replayKey: 0,
      expanded: false,
      reducedMotion: false,
      goTo: () => {},
      next: () => {},
      prev: () => {},
      first: () => {},
      last: () => {},
      replay: () => {},
      toggleDemo: () => {},
      stopDemo: () => {},
      setExpanded: () => {},
    };
    const html = renderToString(
      createElement(Explainer<number>, {
        steps,
        label: '边界夹紧',
        controller: staleCtrl,
        children: (s: Step<number>, idx: number) =>
          createElement('svg', { 'data-state': s.state, 'data-idx': idx }),
      }),
    );
    expect(html).toContain('data-state="20"');
    expect(html).toContain('data-idx="1"');
    expect(html).toContain('data-reserve="2 / 2"');
    expect(html).toContain('>第二步</div>');
  });
});

describe('RichText SSR data-tex 采集与缓存复用', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('harvestSsrTex 从 SSR DOM 采集已排好的 KaTeX HTML 并让 renderTex(null, tex) 直接命中缓存', () => {
    const cachedHtml = '<span class="katex"><span class="katex-html">H</span></span>';
    const fakeEls = [
      {
        dataset: { tex: 'H_{\\text{ssr}}' },
        innerHTML: cachedHtml,
        querySelector: (sel: string) => (sel === '.katex' ? {} : null),
      },
      {
        dataset: { tex: 'raw_{\\text{only}} <x>' },
        innerHTML: 'raw_{\\text{only}} &lt;x&gt;',
        querySelector: () => null,
      },
    ];
    vi.stubGlobal('document', {
      querySelectorAll: (sel: string) => (sel === '.wisp-tex[data-tex]' ? fakeEls : []),
    });

    harvestSsrTex();
    fakeEls[0]!.innerHTML = 'mutated';
    harvestSsrTex();

    expect(renderTex(null, 'H_{\\text{ssr}}')).toBe(cachedHtml);
    expect(renderTex(null, 'raw_{\\text{only}} <x>')).toBe('raw_{\\text{only}} &#60;x&#62;');
  });

  it('客户端命中 SSR 缓存的公式渲染完整 KaTeX HTML 且不触发 loadKatex()', async () => {
    vi.resetModules();
    const originalSsr = import.meta.env.SSR;
    (import.meta.env as Record<string, unknown>).SSR = false;

    const katexRender = vi.fn((tex: string) => `<span class="katex">dyn:${tex}</span>`);
    const katexLoader = vi.fn(() => ({
      default: {
        renderToString: katexRender,
      },
    }));
    const effects: Array<() => void> = [];
    const appendedLinks: Array<{ rel: string; href: string }> = [];
    const cachedHtml = '<span class="katex"><span class="katex-html">SSR</span></span>';

    vi.doMock('katex', katexLoader);
    vi.doMock('react', async () => {
      const actual = await vi.importActual<typeof import('react')>('react');
      return {
        ...actual,
        useEffect: (fn: () => void) => {
          effects.push(fn);
        },
        useSyncExternalStore: (_sub: () => () => void, getSnap: () => unknown) => getSnap(),
      };
    });
    let hasExistingKatexLink = false;
    vi.stubGlobal('document', {
      querySelectorAll: (sel: string) =>
        sel === '.wisp-tex[data-tex]'
          ? [
              {
                dataset: { tex: 'E = mc^2' },
                innerHTML: cachedHtml,
                querySelector: (s: string) => (s === '.katex' ? {} : null),
              },
            ]
          : [],
      querySelector: (sel: string) => (sel.includes('katex') && hasExistingKatexLink ? {} : null),
      createElement: () => ({ rel: '', href: '' }),
      head: {
        appendChild: (node: { rel: string; href: string }) => {
          appendedLinks.push(node);
          hasExistingKatexLink = true;
        },
      },
    });

    try {
      const { RichText } = await import('./RichText');
      const html = renderToString(createElement(RichText, { text: '公式 $E = mc^2$，完成' }));
      for (const run of effects) run();

      expect(html).toContain(cachedHtml);
      expect(html).toContain('data-tex="E = mc^2" data-wisp-kinsoku=""');
      expect(katexLoader).not.toHaveBeenCalled();
      expect(appendedLinks).toHaveLength(1);
      expect(appendedLinks[0]?.rel).toBe('stylesheet');

      effects.length = 0;
      renderToString(createElement(RichText, { text: '再次 $E = mc^2$' }));
      for (const run of effects) run();
      expect(appendedLinks).toHaveLength(1);
      expect(katexLoader).not.toHaveBeenCalled();

      effects.length = 0;
      renderToString(createElement(RichText, { text: '新公式 $Z_{\\text{new}}$' }));
      for (const run of effects) run();
      await vi.waitFor(() => {
        expect(katexLoader).toHaveBeenCalledTimes(1);
      });
      const afterLoadHtml = renderToString(
        createElement(RichText, { text: '新公式 $Z_{\\text{new}}$' }),
      );
      expect(katexRender).toHaveBeenCalledWith(
        'Z_{\\text{new}}',
        expect.objectContaining({ throwOnError: false }),
      );
      expect(afterLoadHtml).toContain('<span class="katex">dyn:Z_{\\text{new}}</span>');
    } finally {
      (import.meta.env as Record<string, unknown>).SSR = originalSsr;
      vi.doUnmock('katex');
      vi.doUnmock('react');
    }
  });
});
