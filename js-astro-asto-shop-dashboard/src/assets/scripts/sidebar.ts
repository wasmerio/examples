export {};

const menuButton = document.querySelector<HTMLButtonElement>("#mobile-menu-btn");
const sidebar = document.querySelector<HTMLElement>("#sidebar");
const backdrop = document.querySelector<HTMLElement>("#sidebar-backdrop");

if (menuButton && sidebar && backdrop) {
	const setSidebarOpen = (isOpen: boolean) => {
		sidebar.classList.toggle("-translate-x-full", !isOpen);
		backdrop.classList.toggle("hidden", !isOpen);
		document.body.style.overflow = isOpen ? "hidden" : "";
		menuButton.setAttribute("aria-expanded", String(isOpen));
	};

	menuButton.addEventListener("click", () => {
		setSidebarOpen(sidebar.classList.contains("-translate-x-full"));
	});

	backdrop.addEventListener("click", () => setSidebarOpen(false));

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") setSidebarOpen(false);
	});
}
