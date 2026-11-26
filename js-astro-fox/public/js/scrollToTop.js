class ScrollToTop extends HTMLElement {
  constructor() {
    super();
    this.setupScrollListener();
  }

  setupScrollListener() {
    const button = document.querySelector("button[scroll-to-top]");
    const SHOW_THRESHOLD = 400;

    window.addEventListener("scroll", () => {
      if (window.scrollY > SHOW_THRESHOLD) {
        button.classList.remove("invisible", "opacity-0");
      } else {
        button.classList.add("invisible", "opacity-0");
      }
    });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

customElements.define("scroll-to-top", ScrollToTop);
