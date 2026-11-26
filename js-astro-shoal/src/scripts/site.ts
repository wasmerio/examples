// Entrances, the header that hides on the way down, and the two dialogs (contact, menu).

// 1. Entrances (the reference uses WOW.js + animate.css): each [data-reveal] plays once on entering the viewport.
const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0 },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// 2. Header: transparent at the top, hidden while scrolling down, white while scrolling up.
const header = document.querySelector<HTMLElement>("[data-header]");
if (header) {
  let last = scrollY;
  const update = () => {
    const y = scrollY;
    const top = y < 10;
    header.classList.toggle("is-solid", !top);
    header.classList.toggle("is-hidden", !top && y > last && y > 120);
    last = y;
  };
  addEventListener("scroll", update, { passive: true });
  update();
}

// 3. Dialogs.
const contact = document.querySelector<HTMLDialogElement>("[data-contact-modal]");
const menu = document.querySelector<HTMLDialogElement>("[data-side-menu]");
document.addEventListener("click", (event) => {
  const target = event.target as Element | null;
  if (!target) return;
  if (target.closest("[data-open-contact]") && contact) {
    event.preventDefault();
    menu?.close();
    contact.showModal();
    return;
  }
  if (target.closest("[data-open-menu]") && menu) {
    menu.showModal();
    return;
  }
  const dialog = target.closest("dialog");
  if (target.closest("[data-close-dialog]") && dialog) {
    dialog.close();
    return;
  }
  // A click on the backdrop lands on the dialog element itself.
  if (target instanceof HTMLDialogElement) target.close();
  // Links inside the menu that point to this page close it.
  if (target.closest("[data-side-menu] a")) menu?.close();
});
