/* Popular: copy button on fenced code blocks. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (!navigator.clipboard) return;
    document.querySelectorAll("pre > code").forEach(function (code) {
      var pre = code.parentElement;
      var btn = document.createElement("button");
      btn.className = "g-copy";
      btn.type = "button";
      btn.setAttribute("aria-label", document.body.getAttribute("data-copy-label") || "Copy code");
      btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(code.innerText).then(function () {
          btn.classList.add("is-copied");
          btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
          setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
          }, 1600);
        });
      });
      pre.appendChild(btn);
    });
  });
})();
