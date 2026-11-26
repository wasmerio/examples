(() => {
	function setupMenuToggle() {
		for (const button of document.querySelectorAll("[data-menu-toggle]")) {
			const controlsId = button.getAttribute("aria-controls");
			if (!controlsId) {
				continue;
			}
			const drawer = document.getElementById(controlsId);
			if (!drawer || button.dataset.boundMenuToggle === "true") {
				continue;
			}
			button.dataset.boundMenuToggle = "true";
			button.addEventListener("click", () => {
				const expanded = button.getAttribute("aria-expanded") === "true";
				button.setAttribute("aria-expanded", expanded ? "false" : "true");
				drawer.classList.toggle("is-open", !expanded);
			});
		}
	}

	function selectCodeTab(root, nextTabId) {
		for (const trigger of root.querySelectorAll("[data-code-tab-trigger]")) {
			const selected = trigger.dataset.codeTabTrigger === nextTabId;
			trigger.setAttribute("aria-selected", selected ? "true" : "false");
			trigger.tabIndex = selected ? 0 : -1;
			trigger.classList.toggle("is-active", selected);
		}
		for (const panel of root.querySelectorAll("[data-code-tab-panel]")) {
			panel.hidden = panel.dataset.codeTabPanel !== nextTabId;
		}
	}

	function setupCodeTabs() {
		for (const root of document.querySelectorAll("[data-code-tabs]")) {
			for (const trigger of root.querySelectorAll("[data-code-tab-trigger]")) {
				if (trigger.dataset.boundCodeTab === "true") {
					continue;
				}
				trigger.dataset.boundCodeTab = "true";
				trigger.addEventListener("click", () => {
					const nextTabId = trigger.dataset.codeTabTrigger;
					if (nextTabId) {
						selectCodeTab(root, nextTabId);
					}
				});
			}
		}
	}

	function normalizeSearchText(text) {
		return text.trim().toLowerCase();
	}

	function readDocsSearchLimit(root, attributeName, fallback) {
		const limit = Number.parseInt(root.dataset[attributeName] ?? "", 10);
		return Number.isFinite(limit) && limit > 0 ? limit : fallback;
	}

	function applyDocsSearchFilter(root, input, entries, empty) {
		const query = normalizeSearchText(input.value ?? "");
		const fallbackLimit = readDocsSearchLimit(
			root,
			"docsSearchInitialLimit",
			8,
		);
		const limit =
			query === ""
				? fallbackLimit
				: readDocsSearchLimit(root, "docsSearchQueryLimit", fallbackLimit);
		let visibleCount = 0;
		for (const entry of entries) {
			const matches =
				query === "" || (entry.dataset.searchText ?? "").includes(query);
			const visible = matches && visibleCount < limit;
			entry.hidden = !visible;
			if (visible) {
				visibleCount += 1;
			}
		}
		if (empty) {
			empty.hidden = visibleCount > 0;
		}
	}

	function closeDocsSearchDisclosure(details, summary) {
		details.open = false;
		if (summary) {
			summary.focus();
		}
	}

	function setupDocsSearchDisclosure(root, details, entries) {
		const summary = details.querySelector("summary");
		document.addEventListener("click", (event) => {
			const targetNode = event.target;
			if (
				details.open &&
				targetNode instanceof Node &&
				!details.contains(targetNode)
			) {
				details.open = false;
			}
		});
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && details.open) {
				closeDocsSearchDisclosure(details, summary);
			}
		});
		for (const entry of entries) {
			entry.addEventListener("click", () => {
				details.open = false;
			});
		}
		root.dataset.boundDocsSearchDisclosure = "true";
	}

	function setupDocsSearch() {
		for (const root of document.querySelectorAll("[data-docs-search]")) {
			const input = root.querySelector("[data-docs-search-input]");
			const entries = Array.from(
				root.querySelectorAll("[data-docs-search-entry]"),
			);
			const empty = root.querySelector("[data-docs-search-empty]");
			const details = root.querySelector("[data-docs-search-details]");
			if (!input || input.dataset.boundDocsSearch === "true") {
				continue;
			}
			input.dataset.boundDocsSearch = "true";
			const update = () => {
				applyDocsSearchFilter(root, input, entries, empty);
			};
			input.addEventListener("input", update);
			update();
			if (details && root.dataset.boundDocsSearchDisclosure !== "true") {
				setupDocsSearchDisclosure(root, details, entries);
			}
		}
	}

	function setupSiteInteractions() {
		setupMenuToggle();
		setupCodeTabs();
		setupDocsSearch();
	}

	window.requestAnimationFrame(setupSiteInteractions);
})();
