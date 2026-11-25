import type { SolitudeLifecycleEvents } from '@/types/runtime';
const EVENT_PREFIX = 'solitude:';

class Lifecycle {
  #pageController = new AbortController();
  #disposers = new Set<() => void>();

  get signal() {
    return this.#pageController.signal;
  }

  add(disposer: () => void) {
    if (typeof disposer !== 'function') return () => {};
    this.#disposers.add(disposer);
    return () => this.#disposers.delete(disposer);
  }

  listen<K extends keyof (HTMLElementEventMap & DocumentEventMap)>(
    target: EventTarget | null,
    type: K,
    handler: (event: (HTMLElementEventMap & DocumentEventMap)[K]) => void,
    options: boolean | AddEventListenerOptions = {},
  ) {
    if (!target?.addEventListener) return () => {};
    const normalized: AddEventListenerOptions =
      typeof options === 'boolean' ? { capture: options } : { ...options };
    normalized.signal ??= this.signal;
    target.addEventListener(type, handler as EventListener, normalized);
    return () =>
      target.removeEventListener(type, handler as EventListener, normalized);
  }

  disposePage() {
    this.#pageController.abort();
    this.#disposers.forEach((dispose) => {
      try {
        dispose();
      } catch (error) {
        console.error('Failed to dispose a Solitude page resource:', error);
      }
    });
    this.#disposers.clear();
    this.#pageController = new AbortController();
  }

  emit<K extends string>(
    type: K,
    detail?: K extends keyof SolitudeLifecycleEvents
      ? SolitudeLifecycleEvents[K]
      : unknown,
  ) {
    document.dispatchEvent(
      new CustomEvent(`${EVENT_PREFIX}${type}`, { detail, bubbles: true }),
    );
  }

  on<K extends string>(
    type: K,
    handler: (
      event: K extends keyof SolitudeLifecycleEvents
        ? CustomEvent<SolitudeLifecycleEvents[K]>
        : Event,
    ) => void,
  ) {
    const eventName = `${EVENT_PREFIX}${type}`;
    document.addEventListener(eventName, handler as EventListener);
    return () =>
      document.removeEventListener(eventName, handler as EventListener);
  }
}

export const lifecycle = new Lifecycle();
