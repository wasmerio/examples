import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
import type { CommentProvider } from '@/types/runtime';
import { commentText, setStatus } from '@/scripts/features/comments/shared';
export const initializeOtherProviders = async (enabled: CommentProvider[]) => {
  const cdn = Solitude.config.cdn || {};
  const signal = lifecycle.signal;
  for (const provider of enabled.filter((p) => p !== 'valine')) {
    const selector = {
      twikoo: '#twikoo',
      waline: '#waline-wrap',
      artalk: '#artalk-wrap',
      giscus: '.giscus-comment',
    }[provider as 'twikoo' | 'waline' | 'artalk' | 'giscus'];
    const mount = document.querySelector<HTMLElement>(selector);
    if (!mount || mount.dataset.initialized === 'true') continue;
    if (
      Solitude.config.comment.lazyload &&
      mount.dataset.lazyReady !== 'true' &&
      'IntersectionObserver' in window
    ) {
      if (mount.dataset.observing === 'true') continue;
      mount.dataset.observing = 'true';
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            mount.dataset.lazyReady = 'true';
            void initializeOtherProviders([provider]);
          }
        },
        { rootMargin: '200px' },
      );
      observer.observe(mount);
      Solitude.onPageCleanup(() => observer.disconnect());
      continue;
    }
    mount.dataset.initialized = 'true';
    try {
      const config = Solitude.config[provider] || {};
      if (provider === 'giscus') {
        const config = Solitude.config.giscus;
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        const attributes = {
          repo: config.repo,
          'repo-id': config.repo_id,
          'category-id': config.category_id,
          mapping: config.mapping || 'pathname',
          theme:
            document.documentElement.dataset.theme === 'dark'
              ? config.theme.dark
              : config.theme.light,
          lang: document.documentElement.lang,
          'reactions-enabled': '1',
          'emit-metadata': '0',
          'input-position': 'top',
          ...config.option,
        };
        for (const [name, value] of Object.entries(attributes))
          script.setAttribute(`data-${name}`, String(value));
        mount.append(script);
        Solitude.onPageCleanup(() => mount.replaceChildren());
        continue;
      }
      if (provider === 'waline' && cdn.waline_css)
        await Solitude.loadStyle(cdn.waline_css);
      if (provider === 'artalk' && cdn.artalk_css)
        await Solitude.loadStyle(cdn.artalk_css);
      await Solitude.loadScript(cdn[provider]);
      if (signal.aborted || !mount.isConnected) continue;
      const options: Record<string, unknown> = {
        ...config,
        ...config.option,
        el: selector,
        path: location.pathname,
      };
      delete options.option;
      let instance: { destroy?(): void } | undefined;
      if (provider === 'twikoo') instance = await window.twikoo!.init(options);
      if (provider === 'waline') instance = window.Waline!.init(options);
      if (provider === 'artalk')
        instance = window.Artalk!.init({
          ...options,
          pageKey: location.pathname,
          pageTitle: document.title,
        });
      if (signal.aborted) instance?.destroy?.();
      else Solitude.onPageCleanup(() => instance?.destroy?.());
    } catch {
      if (signal.aborted || !mount.isConnected) continue;
      mount.dataset.initialized = 'false';
      setStatus(
        mount,
        commentText('error', 'Unable to load comments'),
        'error',
      );
    }
  }
};
