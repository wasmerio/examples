function animateOnScroll() {
  document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(
      //   ".animate-fade-up, .animate-fade-right, .animate-fade-left, .animate-fade-down",
      ".animate-fade-up, .animate-fade-right, .animate-fade-left, .animate-fade-down",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );

    if (animatedElements.length === 0) {
      return;
    }
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  });
}

export { animateOnScroll };
