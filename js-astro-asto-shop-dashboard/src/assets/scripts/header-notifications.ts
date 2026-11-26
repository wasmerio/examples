export {};

const button = document.querySelector<HTMLButtonElement>("#notifications-btn");
const panel = document.querySelector<HTMLElement>("#notifications-modal");

if (button && panel) {
	const closePanel = () => {
		panel.classList.add("hidden");
		button.setAttribute("aria-expanded", "false");
	};

	button.addEventListener("click", (event) => {
		event.stopPropagation();
		const willOpen = panel.classList.contains("hidden");

		panel.classList.toggle("hidden");
		button.setAttribute("aria-expanded", String(willOpen));
	});

	document.addEventListener("click", (event) => {
		if (!(event.target instanceof Node) || panel.contains(event.target)) return;
		closePanel();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closePanel();
	});
}
