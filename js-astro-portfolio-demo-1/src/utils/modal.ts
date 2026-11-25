import { animate } from "motion/mini";

const MODAL_ANIMATION_DURATION_IN_MS = 200;

export class Modal {
  private animationOptions = {
    duration: MODAL_ANIMATION_DURATION_IN_MS / 1000,
  };
  private modalEl: HTMLElement;
  private backdrop = document.createElement("div");

  constructor(elementOrId: HTMLElement | string) {
    const el =
      elementOrId instanceof HTMLElement
        ? elementOrId
        : document.getElementById(elementOrId);

    if (!el) {
      throw new Error(`Modal Element not found`);
    }

    el.classList.add("hidden", "fixed", "top-0", "left-0", "w-full", "z-50");

    this.modalEl = el;
    this.backdrop.classList.add("backdrop");
  }

  show() {
    document.body.appendChild(this.backdrop);
    this.modalEl.classList.remove("hidden");

    animate(
      this.modalEl,
      {
        scale: [0, 1],
        opacity: [0, 1],
      },
      this.animationOptions
    );
  }

  hide() {
    animate(
      this.modalEl,
      {
        scale: [1, 0],
        opacity: [1, 0],
      },
      this.animationOptions
    );

    setTimeout(() => {
      document.body.removeChild(this.backdrop);
      this.modalEl.classList.add("hidden");
    }, MODAL_ANIMATION_DURATION_IN_MS);
  }
}
