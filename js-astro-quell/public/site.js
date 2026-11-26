(function () {
  var root = document.documentElement;
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  if (!still) root.classList.add("anim");

  // Split paragraphs into lines and headings into words, for the reveal.
  function splitLines(el) {
    var text = el.dataset.text || (el.dataset.text = el.textContent.replace(/\s+/g, " ").trim());
    el.textContent = "";
    var words = text.split(" ").map(function (w) { var s = document.createElement("span"); s.textContent = w + " "; el.appendChild(s); return s; });
    var lines = [], top = null;
    words.forEach(function (s) { if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; } lines[lines.length - 1].push(s.textContent); });
    el.textContent = "";
    lines.forEach(function (l, i) {
      var outer = document.createElement("span"), inner = document.createElement("span");
      outer.className = "ln"; inner.textContent = l.join("").trim(); inner.style.setProperty("--i", i);
      outer.appendChild(inner); el.appendChild(outer); el.appendChild(document.createTextNode(" "));
    });
  }
  function splitWords(el) {
    var text = el.textContent.replace(/\s+/g, " ").trim();
    el.textContent = "";
    text.split(" ").forEach(function (w, i) {
      var outer = document.createElement("span"), inner = document.createElement("span");
      outer.className = "wd"; inner.textContent = w; inner.style.setProperty("--i", i);
      outer.appendChild(inner); el.appendChild(outer); el.appendChild(document.createTextNode(" "));
    });
  }
  var lineEls = $$("[data-lines]");
  function relayout() { lineEls.forEach(splitLines); }
  if (!still) {
    $$("[data-words]").forEach(splitWords);
    relayout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    var lastW = innerWidth, rt;
    addEventListener("resize", function () {
      if (innerWidth === lastW) return;
      lastW = innerWidth; clearTimeout(rt); rt = setTimeout(relayout, 150);
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".rv").forEach(function (el) { io.observe(el); });
  }

  // Scroll: the name slides apart, the nav rises, the timeline fills, the footer photo drifts.
  var w1 = $("[data-w1]"), w2 = $("[data-w2]"), hnav = $("[data-hnav]"), stageImg = $(".stage > img");
  var tl = $("[data-tl]"), prog = $("[data-tl-prog]"), years = $$(".year"), giant = $("[data-giant]");
  var menuBtn = $("[data-menu-open]"), ticking = false;
  function frame() {
    ticking = false;
    var y = scrollY, vh = innerHeight, mid = vh / 2;
    if (!still) {
      var p = Math.min(1, y / (vh * .8));
      w1.style.transform = "translate3d(" + (-p * 62) + "vw,0,0)";
      w2.style.transform = "translate3d(" + (p * 62) + "vw,0,0)";
      hnav.style.transform = "translate3d(0," + (-Math.min(y * 1.15, vh)) + "px,0)";
      stageImg.style.setProperty("--zoom", (1.06 - p * .06).toFixed(4));
      var g = giant.getBoundingClientRect();
      giant.style.setProperty("--gy", Math.max(0, Math.min(100, (g.top / vh) * 100)).toFixed(1) + "%");
    }
    var r = tl.getBoundingClientRect();
    prog.style.height = Math.max(0, Math.min(r.height, mid - r.top)) + "px";
    years.forEach(function (n) { n.classList.toggle("past", n.getBoundingClientRect().top < mid); });
    menuBtn.classList.toggle("on", y > vh * .9);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  // The footer name fills the width exactly.
  function fitGiant() {
    var span = giant.firstElementChild;
    giant.style.fontSize = "";
    var size = parseFloat(getComputedStyle(giant).fontSize), w = span.getBoundingClientRect().width;
    if (w) giant.style.fontSize = (size * giant.clientWidth / w).toFixed(2) + "px";
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", function () { fitGiant(); onScroll(); });
  fitGiant();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGiant);
  frame();

  // Menu
  var menu = $("#menu");
  menuBtn.addEventListener("click", function () { menu.showModal(); });
  $("[data-menu-close]").addEventListener("click", function () { menu.close(); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menu.close(); }); });

  // Form: thanks only when Formgong answers success: true.
  var form = $("#f-project"), button = $(".send", form), label = $("[data-send-label]", form), status = $("[data-status]", form);
  function say(text, bad) { status.textContent = text; status.classList.toggle("err", !!bad); }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    button.disabled = true; label.textContent = "Sending…"; say("");
    var first = (form.elements.namedItem("name").value || "").trim().split(/\s+/)[0];
    fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (res) { return res.json().catch(function () { return null; }); })
      .then(function (result) {
        if (result && result.success === true) {
          $("[data-name]", form).textContent = first || "there";
          form.reset();
          form.classList.add("is-sent");
          $(".thanks", form).focus();
        } else {
          say((result && result.message) || "Could not send. Please try again.", true);
        }
      })
      .catch(function () { say("Could not send. Check your connection and try again.", true); })
      .then(function () { button.disabled = false; label.textContent = "Send"; });
  });
  $("[data-again]", form).addEventListener("click", function () { form.classList.remove("is-sent"); say(""); form.elements.namedItem("name").focus(); });
})();
