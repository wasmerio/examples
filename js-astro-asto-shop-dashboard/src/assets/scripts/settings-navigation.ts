export {};

const settingsNavigation = document.querySelector<HTMLElement>("#settings-nav");
const sections = document.querySelectorAll<HTMLElement>("[data-settings-section]");

if (settingsNavigation && sections.length > 0) {
	const links = settingsNavigation.querySelectorAll<HTMLAnchorElement>(".nav-link");

	const activateLink = (sectionId: string) => {
		links.forEach((link) => {
			const isActive = link.dataset.target === sectionId;
			link.classList.toggle("bg-primary/10", isActive);
			link.classList.toggle("text-primary", isActive);
			link.classList.toggle("text-muted", !isActive);
			link.classList.toggle("hover:text-foreground", !isActive);
			link.classList.toggle("hover:bg-surface-hover", !isActive);
			link.setAttribute("aria-current", isActive ? "location" : "false");
			link.querySelector(".icon")?.setAttribute("stroke-width", isActive ? "2.5" : "2");
		});
	};

	const observer = new IntersectionObserver(
		(entries) => {
			const visibleSection = entries.find((entry) => entry.isIntersecting);
			if (visibleSection?.target.id) activateLink(visibleSection.target.id);
		},
		{ rootMargin: "-100px 0px -60% 0px" },
	);

	sections.forEach((section) => observer.observe(section));
}
