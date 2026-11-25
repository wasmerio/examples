import type { SolitudeAPI } from '@/scripts/types/api';
export interface TypeItInstance {
  go(): TypeItInstance;
  destroy(): void;
  type(text: string): TypeItInstance;
  pause(ms: number): TypeItInstance;
  delete(text?: string | number): TypeItInstance;
}
interface Destroyable {
  destroy(): void;
}
interface ValineInstance {
  destroy?(): void;
  init?(options: Record<string, unknown>): void;
}
declare global {
  interface Window {
    Solitude: SolitudeAPI;
    globalFn: Record<string, Record<string, (mode?: string) => void>>;
    Fancybox?: {
      close(): void;
      bind(selector: string, options: Record<string, unknown>): void;
      bind(
        container: HTMLElement,
        selector: string,
        options: Record<string, unknown>,
      ): void;
    };
    __solitudeShortcodeRuntime?: {
      init(): Promise<PromiseSettledResult<unknown>[]>;
      configure(config: { chartjs?: string; abcjs?: string }): void;
      destroyCharts(): void;
    };
    Chart?: {
      new (
        canvas: CanvasRenderingContext2D | null,
        definition: unknown,
      ): Destroyable;
      getChart(canvas: HTMLCanvasElement): Destroyable | undefined;
      defaults: { color: string; borderColor: string };
    };
    ABCJS?: {
      renderAbc(
        element: HTMLElement,
        source: string,
        params: Record<string, unknown>,
      ): unknown;
    };
    mermaid?: {
      initialize(options: { startOnLoad: boolean; theme: string }): void;
      run(options: { nodes: HTMLElement[] }): Promise<void>;
    };
    TypeIt?: new (
      element: HTMLElement | string,
      options: Record<string, unknown>,
    ) => TypeItInstance;
    ColorThief?: {
      getColorSync(image: HTMLImageElement): { array(): number[] } | undefined;
    };
    lazyLoadInstance?: { destroy(): void; update(): void };
    LazyLoad?: new (options: {
      elements_selector: string;
      threshold: number;
      data_src: string;
      callback_error(image: HTMLImageElement): void;
    }) => { destroy(): void; update(): void };
    Snackbar?: {
      show(options: {
        text: string;
        showAction: boolean;
        duration: number;
        pos: string;
      }): void;
    };
    mediumZoom?: (
      images: NodeListOf<HTMLImageElement>,
      options: { background: string },
    ) => unknown;
    fancyboxRun?: boolean;
    meting_api?: string;
    docsearch?: (options: Record<string, unknown>) => void;
    waterfall?: (element: Element) => Promise<void>;
    Swiper?: new (
      selector: string,
      options: Record<string, unknown>,
    ) => { destroy(): void };
    home_subtitle?: string[];
    loadTwoComment?: () => void;
    updatePostsBasedOnComments?: () => void;
    md5?: (value: string) => string;
    initializeCommentBarrage?: (...args: unknown[]) => void;
    Valine?: new (options: Record<string, unknown>) => ValineInstance;
    twikoo?: {
      init(options: Record<string, unknown>): Promise<Destroyable | undefined>;
    };
    Waline?: { init(options: Record<string, unknown>): Destroyable };
    Artalk?: { init(options: Record<string, unknown>): Destroyable };
  }
}
