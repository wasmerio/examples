/* Popular: mobile nav toggle. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".g-nav__toggle");
    var links = document.querySelector(".g-navlinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
