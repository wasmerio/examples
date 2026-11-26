import Lenis from 'lenis';

let lenis: Lenis | undefined;
let frameId: number | undefined;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const destroyLenis = () => {
	if (frameId !== undefined) {
		cancelAnimationFrame(frameId);
		frameId = undefined;
	}

	lenis?.destroy();
	lenis = undefined;
	document.documentElement.removeAttribute('data-lenis');
};

const startLenis = () => {
	destroyLenis();

	if (reduceMotion.matches) {
		document.documentElement.dataset.motionDisabled = 'true';
		return;
	}

	document.documentElement.removeAttribute('data-motion-disabled');
	document.documentElement.dataset.lenis = 'true';
	lenis = new Lenis({
		anchors: true,
		allowNestedScroll: true,
		naiveDimensions: true,
		stopInertiaOnNavigate: true,
		smoothWheel: true,
	});

	// Jawna pętla utrzymuje animację aktywną niezależnie od kolejności skryptów Astro.
	const raf = (time: number) => {
		lenis?.raf(time);
		frameId = requestAnimationFrame(raf);
	};

	frameId = requestAnimationFrame(raf);
};

document.addEventListener('astro:page-load', startLenis);
document.addEventListener('astro:before-swap', destroyLenis);
reduceMotion.addEventListener('change', startLenis);

startLenis();
