/* Popular: scroll-spy for the docs table of contents.
   Highlights the .g-doc-toc link whose section is in view. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var toc = document.querySelector(".g-doc-toc");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    if (!links.length) return;
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) { map[id] = a; targets.push(el); }
    });
    /* The sidebar has its own scrollbar when it outgrows the viewport, so
       follow the reader: keep the highlighted entry in view. Done by hand
       rather than with scrollIntoView, which would also scroll the page. */
    function reveal(a) {
      if (!a || toc.scrollHeight <= toc.clientHeight) return;
      var box = toc.getBoundingClientRect();
      var item = a.getBoundingClientRect();
      if (item.top < box.top) toc.scrollTop -= box.top - item.top;
      else if (item.bottom > box.bottom) toc.scrollTop += item.bottom - box.bottom;
    }
    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle("is-active", a === map[id]); });
      reveal(map[id]);
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    targets.forEach(function (t) { obs.observe(t); });
    if (targets[0]) setActive(targets[0].id);
  });
})();
