function setupNavigation() {
  const toggleButton = document.querySelector("[data-toggle-nav]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (!toggleButton || !navMenu) return;

  let isExpanded = false;

  const handleClick = () => {
    isExpanded = !isExpanded;

    if (isExpanded) {
      navMenu.style.maxHeight = `${navMenu.scrollHeight}px`;
      toggleButton.setAttribute("aria-expanded", "true");
    } else {
      navMenu.style.maxHeight = "0";
      toggleButton.setAttribute("aria-expanded", "false");
    }
  };

  toggleButton.setAttribute("aria-expanded", "false");

  toggleButton.addEventListener("click", handleClick);

  document.addEventListener("astro:after-swap", () => {
    isExpanded = false;
    toggleButton.setAttribute("aria-expanded", "false");
  });

  return () => {
    toggleButton.removeEventListener("click", handleClick);
  };
}

document.addEventListener("astro:page-load", setupNavigation);
