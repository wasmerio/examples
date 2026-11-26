/**
 * Starts the entrance animations in src/styles/effects.css ([data-enter]) when an element
 * reaches the screen: at 15% visible, once, as on the reference. Phones (under 751px) and
 * reduced motion get no entrances; without this script every element simply shows.
 */
if (
  matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 751px)").matches &&
  "IntersectionObserver" in window
) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.intersectionRatio >= 0.15) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
    },
    { threshold: 0.15 },
  );
  document.documentElement.classList.add("js-enter");
  for (const el of document.querySelectorAll("[data-enter]")) io.observe(el);
}
