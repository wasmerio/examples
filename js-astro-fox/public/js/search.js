class SiteSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // DOM이 연결된 후에 이벤트 리스너 설정
    const openBtn = this.querySelector("button[data-open-modal]");
    const dialog = this.querySelector("dialog");

    if (!openBtn || !dialog) {
      console.warn("Required elements not found in site-search component");
      return;
    }

    const openModal = () => {
      dialog.showModal();
      setTimeout(() => {
        const searchInput = this.querySelector(".pagefind-ui input");
        searchInput?.focus();
      }, 100);
    };

    const closeModal = () => {
      dialog.close();
      const searchInput = this.querySelector(".pagefind-ui input");
      if (searchInput) searchInput.value = "";
    };

    dialog.addEventListener("click", (e) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeModal();
      }
    });

    dialog.querySelector(".pagefind-ui")?.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    openBtn.addEventListener("click", openModal);
    openBtn.disabled = false;

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey === true || e.ctrlKey === true) && e.key === "k") {
        e.preventDefault();
        dialog.open ? closeModal() : openModal();
      }
      if (e.key === "Escape" && dialog.open) {
        closeModal();
      }
    });
  }
}

// 먼저 커스텀 엘리먼트 정의
customElements.define("site-search", SiteSearch);
