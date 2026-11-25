import contextCursor from "@/lib/contextCursor";

const mq = window.matchMedia("(min-width: 640px)");
if (mq.matches) {
	contextCursor({
		radius: 25,
		transitionSpeed: 0.1,
	});
	
	const container = document.documentElement;
	const throttleDelay = 50; // cap the rate of scroll events in ms
	const scrollSpeedSensitivity = 1.6; // adjust this value to your needs, 1.0 is the 100% scroll speed
	
	let isDragging = false;
	let startY !: number;
	let scrollTop !: number;
	let lastY !: number;

// Limit the rate of scroll events
	function throttle(func: Function, delay: number) {
		let lastCall = 0;
		
		return function (...args: unknown[]) {
			const now = Date.now();
			if (now - lastCall < delay) return;
			lastCall = now;
			return func(...args);
		};
	}
	
	container.addEventListener("mousedown", (e: MouseEvent) => {
		isDragging = true;
		startY = e.pageY;
		lastY = e.pageY;
		scrollTop = container.scrollTop;
	});
	
	container.addEventListener("mousemove", throttle(
		(e: MouseEvent) => {
			if (!isDragging) return;
			lastY = e.pageY;
			requestAnimationFrame(() => {
				const deltaY = lastY - startY;
				container.scrollTop = scrollTop - deltaY * scrollSpeedSensitivity;
			});
		}, throttleDelay));
	
	container.addEventListener("mouseup", () => {
		isDragging = false;
	});
	
	container.addEventListener("mouseleave", () => {
		if (isDragging) {
			isDragging = false;
		}
	});
	
	container.style.scrollBehavior = "smooth";
	container.style.cursor = "none";
}

