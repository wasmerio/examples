import type { lifecycle } from '@/scripts/core/lifecycle';
import type {
  loadScript,
  loadStyle,
  ScriptOptions,
} from '@/scripts/core/resources';
import type { saveToLocal } from '@/scripts/core/storage';
import type { actions } from '@/scripts/app/actions';
import type {
  SolitudePageConfiguration,
  SolitudeSiteConfiguration,
} from '@/types/runtime';
import type { utilsFn } from '@/scripts/core/utils';
import type { createIcon } from '@/scripts/core/icons';

/** The public facade is installed once; optional features register on demand. */
export type SolitudeAPI = typeof actions &
  typeof utilsFn & {
    createIcon: typeof createIcon;
    readonly config: SolitudeSiteConfiguration;
    readonly page: SolitudePageConfiguration;
    saveToLocal: typeof saveToLocal;
    loadScript: typeof loadScript;
    loadStyle: typeof loadStyle;
    on: typeof lifecycle.on;
    listen: typeof lifecycle.listen;
    onPageCleanup: typeof lifecycle.add;
    disposePage: typeof lifecycle.disposePage;
    navigate(url: string): void;
    refresh(): Promise<void>;
    toggleTheme(): void;
    initThemeColor(): void;
    endLoading?(): void;
    addGlobalFn(
      key: string,
      fn: (mode?: string) => void,
      name?: string | false,
      parent?: Window,
    ): void;
    addEventListenerPjax(
      element: EventTarget | null,
      event: string,
      handler: EventListener,
      options?: boolean | AddEventListenerOptions,
    ): void;
    diffDateFormat(elements: NodeListOf<HTMLElement>): void;
    installLegacyAdapter(): void;
    getCSS(url: string, id?: string | false): ReturnType<typeof loadStyle>;
    getScript(
      url: string,
      attributes?: ScriptOptions['attributes'],
    ): ReturnType<typeof loadScript>;
    coverColor?(music?: boolean): void | Promise<void>;
    musicPlayer?: import('@/scripts/features/music/player').MusicPlayer;
    localSearch?: import('@/scripts/features/search/local').LocalSearch;
    algoliaSearch?: import('@/scripts/features/search/algolia').AlgoliaSearch;
    rightMenu?: typeof import('@/scripts/features/right-menu').rm;
    hideRightMenu?(): void;
    openSearch?(): void;
    selectedText?: string;
    travelling?(): Promise<void>;
    randomLinksList?(): Promise<void>;
    friendLinks?: { init(): void; load(): Promise<unknown> };
    registerShortcutAction?(name: string, handler: () => void): () => void;
    switchKeyboard(): void;
    pjax?: { refresh(element?: HTMLElement): void };
  };
