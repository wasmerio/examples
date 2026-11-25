type ColorMode = 'light' | 'dark';

const diagrams = [...document.querySelectorAll<HTMLElement>('[data-mermaid="true"]')];

if (diagrams.length > 0) {
  import('mermaid').then(({ default: mermaid }) => {
    const sources = diagrams.map((diagram) => diagram.textContent ?? '');
    let pendingMode: ColorMode | null = null;
    let rendering = false;
    let generation = 0;

    const renderDiagrams = async (mode: ColorMode) => {
      pendingMode = mode;
      if (rendering) return;

      rendering = true;
      try {
        while (pendingMode) {
          const activeMode = pendingMode;
          pendingMode = null;
          const renderGeneration = ++generation;

          mermaid.initialize({
            startOnLoad: false,
            theme: activeMode === 'dark' ? 'dark' : 'default'
          });

          const results = [];
          for (const [index, source] of sources.entries()) {
            results.push(await mermaid.render(`mermaid-${renderGeneration}-${index}`, source));
          }

          // 新的模式请求已经到达时丢弃本轮结果，避免旧主题覆盖最新选择。
          if (pendingMode) continue;

          results.forEach(({ svg, bindFunctions }, index) => {
            const diagram = diagrams[index];
            diagram.innerHTML = svg;
            bindFunctions?.(diagram);
          });
        }
      } catch (error) {
        console.error('Failed to render Mermaid diagrams.', error);
      } finally {
        rendering = false;
        if (pendingMode) void renderDiagrams(pendingMode);
      }
    };

    const currentMode = (): ColorMode =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    document.addEventListener('astro-narrow:color-mode-change', (event) => {
      const mode = (event as CustomEvent<{ mode?: ColorMode }>).detail?.mode;
      void renderDiagrams(mode === 'dark' || mode === 'light' ? mode : currentMode());
    });

    void renderDiagrams(currentMode());
  });
}
