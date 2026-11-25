interface MetingElement extends HTMLElement {
  aplayer?: { destroy(): void };
  connectedCallback(): void;
  _loadPlayer(audio: unknown[]): void;
}

// Keep Meting's playlist/configuration support while adapting its lifecycle to
// Astro's DOM moves. The upstream element destroys and recreates on every move.
export function registerMetingElement() {
  if (customElements.get('solitude-meting')) return;
  const Meting = customElements.get('meting-js') as
    (new () => MetingElement) | undefined;
  if (!Meting) return;

  class SolitudeMeting extends Meting {
    private started = false;

    connectedCallback() {
      // Astro briefly connects the incoming capsule before replacing it with
      // the persisted one. Do not start requests for that temporary element.
      queueMicrotask(() => {
        if (!this.isConnected || this.started) return;
        this.started = true;
        super.connectedCallback();
      });
    }

    // Element.moveBefore() can preserve the player without disconnecting it.
    connectedMoveCallback() {}

    disconnectedCallback() {
      // Older browsers move persisted nodes by detaching and reconnecting them
      // within the same swap. Only dispose when the page actually removes us.
      queueMicrotask(() => {
        if (this.isConnected || !this.aplayer) return;
        this.aplayer.destroy();
        this.aplayer = undefined;
        this.started = false;
        this.replaceChildren();
      });
    }

    _loadPlayer(audio: unknown[]) {
      // A playlist may finish loading after its page has already been removed.
      if (!this.isConnected) {
        this.started = false;
        return;
      }
      if (this.aplayer) return;
      super._loadPlayer(audio);
      if (this.closest('#nav-music')) window.Solitude?.musicBind?.();
    }
  }

  customElements.define('solitude-meting', SolitudeMeting);
}
