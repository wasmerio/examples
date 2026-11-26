type FrameCallback = (time: number) => void;
type RequestFrame = (callback: FrameCallback) => number;
type CancelFrame = (id: number) => void;

type DemandRenderLoop = {
	request: () => void;
	pause: () => void;
	resume: () => void;
	dispose: () => void;
};

export function createDemandRenderLoop(
	render: (time: number) => boolean,
	requestFrame: RequestFrame = requestAnimationFrame,
	cancelFrame: CancelFrame = cancelAnimationFrame,
): DemandRenderLoop {
	let frameId: number | undefined;
	let paused = false;
	let disposed = false;

	const schedule = () => {
		if (disposed || paused || frameId !== undefined) return;
		frameId = requestFrame((time) => {
			frameId = undefined;
			if (disposed || paused) return;
			if (render(time)) schedule();
		});
	};

	const cancelPending = () => {
		if (frameId === undefined) return;
		cancelFrame(frameId);
		frameId = undefined;
	};

	return {
		request: schedule,
		pause: () => {
			paused = true;
			cancelPending();
		},
		resume: () => {
			if (disposed) return;
			paused = false;
			schedule();
		},
		dispose: () => {
			disposed = true;
			paused = true;
			cancelPending();
		},
	};
}
