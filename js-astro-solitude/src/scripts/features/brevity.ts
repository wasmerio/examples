// Keep chronological DOM order while packing cards into the shortest column.
// Observing each card also handles delayed images, fonts and music players.
class SolitudeBrevity extends HTMLElement {
  #observer?: ResizeObserver;
  #frame = 0;

  connectedCallback() {
    const list = this.querySelector<HTMLElement>('.waterfall');
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>('.item'));
    const layout = () => {
      const styles = getComputedStyle(list);
      const columns = Number(styles.getPropertyValue('--bber-columns')) || 1;
      const gap = parseFloat(styles.columnGap) || 8;
      const width = (list.clientWidth - gap * (columns - 1)) / columns;
      cards.forEach((card) => {
        card.style.width = `${width}px`;
      });
      const heights = Array<number>(columns).fill(0);
      cards.forEach((card) => {
        const column = heights.indexOf(Math.min(...heights));
        card.style.position = 'absolute';
        card.style.left = `${column * (width + gap)}px`;
        card.style.top = `${heights[column]}px`;
        heights[column] += card.offsetHeight + gap;
      });
      list.style.height = `${Math.max(0, ...heights) - (cards.length ? gap : 0)}px`;
    };
    this.#observer = new ResizeObserver(() => {
      cancelAnimationFrame(this.#frame);
      this.#frame = requestAnimationFrame(layout);
    });
    this.#observer.observe(list);
    cards.forEach((card) => this.#observer!.observe(card));
    layout();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    cancelAnimationFrame(this.#frame);
  }
}

if (!customElements.get('solitude-brevity')) {
  customElements.define('solitude-brevity', SolitudeBrevity);
}
