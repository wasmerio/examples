/* Popular: persistent runbook checklists.
   Any .g-checklist with a data-key gets its tick state saved to
   localStorage so organizers can close the tab and resume. */
(function () {
  function initChecklist(root) {
    var key = root.getAttribute("data-key") || "";
    var items = Array.prototype.slice.call(root.querySelectorAll(".g-check"));
    var countEl = root.querySelector(".g-checklist__count");
    var state = {};
    try { state = JSON.parse(localStorage.getItem("popular-check:" + key) || "{}"); } catch (e) {}

    function render() {
      var done = 0;
      items.forEach(function (btn, i) {
        var on = !!state[i];
        btn.classList.toggle("is-done", on);
        var box = btn.querySelector(".g-check__box");
        if (box) box.innerHTML = on ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : "";
        btn.setAttribute("aria-checked", on ? "true" : "false");
        if (on) done++;
      });
      if (countEl) {
        countEl.textContent = done + "/" + items.length + " " + (document.body.getAttribute("data-checklist-done") || "done");
        countEl.classList.toggle("is-complete", done === items.length && items.length > 0);
      }
    }

    if (countEl) countEl.setAttribute("aria-live", "polite");
    items.forEach(function (btn, i) {
      btn.setAttribute("role", "checkbox");
      btn.addEventListener("click", function () {
        state[i] = !state[i];
        try { localStorage.setItem("popular-check:" + key, JSON.stringify(state)); } catch (e) {}
        render();
      });
    });
    render();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".g-checklist[data-key]").forEach(initChecklist);
  });
})();
