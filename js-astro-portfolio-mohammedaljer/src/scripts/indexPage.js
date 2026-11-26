// SPDX-License-Identifier: MIT

export function initIndexPage() {
  const initHeroIntroOnce = () => {
    const key = "heroAnimatedOnce";
    if (sessionStorage.getItem(key)) return;

    const left = document.querySelector("[data-hero-left]");
    const card = document.querySelector("[data-hero-card]");
    const social = document.querySelector("[data-hero-social]");

    left?.classList.add("enter-left");
    if (left) left.style.animationDelay = "120ms";

    card?.classList.add("enter-right");
    if (card) card.style.animationDelay = "260ms";

    social?.classList.add("enter-down");
    if (social) social.style.animationDelay = "420ms";

    sessionStorage.setItem(key, "1");
  };

  const initReveal = () => {
    document.documentElement.classList.add("js");
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const delay = Number(el.getAttribute("data-delay") || "0");
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("is-in");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => obs.observe(el));
  };

  const runIntroOnce = () => {
    document.documentElement.classList.add("js");
    const key = "introPlayed";
    const items = document.querySelectorAll("[data-intro]");

    if (sessionStorage.getItem(key)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      items.forEach((el) => el.classList.add("is-in"));
      sessionStorage.setItem(key, "1");
      return;
    }

    items.forEach((el) => {
      const delay = Number(el.getAttribute("data-delay") || "0");
      el.style.animationDelay = `${delay}ms`;
      el.classList.add("is-in");
    });

    sessionStorage.setItem(key, "1");
  };

  initHeroIntroOnce();
  initReveal();
  runIntroOnce();
}

if (typeof window !== "undefined") {
  window.initIndexPage = initIndexPage;
}
