import { inView } from 'motion';

type StopObserver = () => void;

const observedElements = new Set<Element>();
let stopObservers: StopObserver[] = [];
let initFrame: number | undefined;

const isMotionTarget = (element: Element) => {
	const tagName = element.tagName.toLowerCase();
	return !['script', 'style', 'link', 'template'].includes(tagName);
};

const getElementChildren = (element: Element) =>
	Array.from(element.children).filter(isMotionTarget);

const getDisplay = (element: Element) => getComputedStyle(element).display;

const resolveBoxTargets = (element: Element): Element[] => {
	if (!isMotionTarget(element)) return [];
	if (getDisplay(element) !== 'contents') return [element];

	return getElementChildren(element).flatMap(resolveBoxTargets);
};

const collectTargets = (element: Element): Element[] => {
	if (!isMotionTarget(element)) return [];

	const children = getElementChildren(element);
	const display = getDisplay(element);

	// Astro island nie ma własnego pudełka, ale jego interaktywny root musi pozostać całością.
	if (element.localName === 'astro-island') return children.flatMap(resolveBoxTargets);
	if (display === 'contents') return children.flatMap(collectTargets);

	if (element.matches('a, button, input, select, textarea, form, summary')) return [element];

	if (display === 'grid' || display === 'inline-grid' || display === 'flex' || display === 'inline-flex') {
		return children.length > 1 ? children.flatMap(resolveBoxTargets) : [element];
	}

	// Zwykłe divy układające sekcję są tylko opakowaniem. Schodzimy nimi do pierwszego układu treści.
	if (element instanceof HTMLElement && element.tagName === 'DIV' && children.length > 0) {
		return children.flatMap(collectTargets);
	}

	return [element];
};

const setVisualOrder = (targets: Element[]) => {
	const rows: { top: number; elements: Element[] }[] = [];
	const sortedTargets = targets
		.map((element) => ({ element, rect: element.getBoundingClientRect() }))
		.sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);

	sortedTargets.forEach(({ element, rect }) => {
		const row = rows.find((candidate) => Math.abs(candidate.top - rect.top) <= 24);
		if (row) {
			row.elements.push(element);
			return;
		}
		rows.push({ top: rect.top, elements: [element] });
	});

	rows.forEach(({ elements }) => {
		elements
			.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
			.forEach((element, index) => {
				if (element instanceof HTMLElement) {
					element.style.setProperty('--motion-auto-order', String(index));
				}
			});
	});
};

const markVisible = (element: Element) => {
	element.setAttribute('data-motion-visible', '');
};

const observeOnce = (element: Element) => {
	if (observedElements.has(element)) return;

	observedElements.add(element);
	stopObservers.push(
		inView(
			element,
			() => {
				markVisible(element);
			},
			{ amount: 0.12, margin: '0px 0px -8% 0px' },
		),
	);
};

const prepareAutoTargets = (section: Element) => {
	if (section.querySelector('[data-motion], [data-motion-sequence]')) return;

	const targets = getElementChildren(section).flatMap(collectTargets);
	setVisualOrder(targets);
	targets.forEach((element) => {
		element.setAttribute('data-motion-auto-target', '');
	});
};

const reset = () => {
	if (initFrame !== undefined) {
		cancelAnimationFrame(initFrame);
		initFrame = undefined;
	}

	stopObservers.forEach((stop) => stop());
	stopObservers = [];
	observedElements.clear();

	document
		.querySelectorAll('[data-motion-visible], [data-motion-auto-target]')
		.forEach((element) => {
			element.removeAttribute('data-motion-visible');
			element.removeAttribute('data-motion-auto-target');
			if (element instanceof HTMLElement) {
				element.style.removeProperty('--motion-auto-order');
			}
		});

	document.documentElement.removeAttribute('data-motion-ready');
};

const init = () => {
	reset();
	document.documentElement.dataset.motionReady = 'true';
	document.querySelectorAll('[data-motion-section]').forEach(prepareAutoTargets);

	// Najpierw pozwalamy przeglądarce wyrenderować stan początkowy, żeby transition nie został pominięty.
	initFrame = requestAnimationFrame(() => {
		initFrame = undefined;

		// Elementy pierwszego ekranu pokazujemy od razu po pierwszym renderze, żeby nie opóźniać LCP.
		document
			.querySelectorAll('[data-motion="fade"], [data-motion-sequence="fade"] > *')
			.forEach(markVisible);

		document.querySelectorAll('[data-motion-sequence="viewport"] > *').forEach(observeOnce);
		document.querySelectorAll('[data-motion-auto-target]').forEach(observeOnce);
	});
};

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', reset, { once: true });
init();
