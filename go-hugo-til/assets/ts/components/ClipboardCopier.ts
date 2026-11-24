const classSuccess = '!text-green-500';
const classFailure = '!text-red-500';
const clearStatusDelayMs = 3500;

export default class ClipboardCopier extends HTMLElement {
  private _target: string;

  constructor() {
    super();

    const target = this.getAttribute('target');
    if (!target) {
      this.statusFailure();
      throw new Error('missing target attribute on ClipboardCopier element');
    }

    this._target = target;
    this.addEventListener('click', this.copyToClipboard);
  }

  private async copyToClipboard(e: MouseEvent) {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(this.getTarget().textContent);
      this.statusSuccess();
    } catch (error) {
      console.error(`copying to clipboard: ${error}`);
      this.statusFailure();
    } finally {
      this.clearStatusAfterDelay();
    }
  }

  private getTarget(): Element {
    const els = document.querySelectorAll(this._target);
    if (els.length === 0) {
      throw new Error(`ClipboardCopier target element not found with selector ${this._target}`);
    }

    // The last matching element is returned to skip the element containing
    // line numbers, in case the target is a code block with line numbers.
    return els.item(els.length - 1);
  }

  private statusSuccess() {
    this.clearStatus();
    this.classList.add(classSuccess);
  }

  private statusFailure() {
    this.clearStatus();
    this.classList.add(classFailure);
  }

  private clearStatus() {
    this.classList.remove(classSuccess, classFailure);
  }

  private clearStatusAfterDelay() {
    setTimeout(() => {
      this.clearStatus();
    }, clearStatusDelayMs);
  }
}
