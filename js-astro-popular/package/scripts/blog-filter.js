/* Popular: client-side tag filter for the blog list.
   Buttons [data-filter] show/hide [data-tags] cards. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector("[data-filterbar]");
    if (!bar) return;
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tags]"));
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.classList.contains("is-active") ? "true" : "false"); });
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        cards.forEach(function (card) {
          var tags = (card.getAttribute("data-tags") || "").split(",");
          card.style.display = (f === "*" || tags.indexOf(f) !== -1) ? "" : "none";
        });
      });
    });
  });
})();
