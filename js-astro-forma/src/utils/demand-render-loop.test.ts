import { describe, expect, it, vi } from 'vitest';
import { createDemandRenderLoop } from './demand-render-loop';

function createFrameQueue() {
	let nextId = 1;
	const callbacks = new Map<number, (time: number) => void>();
	const requestFrame = vi.fn((callback: (time: number) => void) => {
		const id = nextId++;
		callbacks.set(id, callback);
		return id;
	});
	const cancelFrame = vi.fn((id: number) => callbacks.delete(id));
	const flush = (time: number) => {
		const entry = callbacks.entries().next().value as [number, (time: number) => void] | undefined;
		if (!entry) throw new Error('No queued frame to flush.');
		callbacks.delete(entry[0]);
		entry[1](time);
	};

	return { callbacks, requestFrame, cancelFrame, flush };
}

describe('demand render loop', () => {
	it('stops requesting frames when rendering becomes idle', () => {
		const queue = createFrameQueue();
		const render = vi.fn(() => false);
		const loop = createDemandRenderLoop(render, queue.requestFrame, queue.cancelFrame);

		loop.request();
		queue.flush(16);

		expect(render).toHaveBeenCalledTimes(1);
		expect(queue.callbacks.size).toBe(0);
		expect(queue.requestFrame).toHaveBeenCalledTimes(1);
	});

	it('continues only while the frame callback reports active work', () => {
		const queue = createFrameQueue();
		const render = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);
		const loop = createDemandRenderLoop(render, queue.requestFrame, queue.cancelFrame);

		loop.request();
		queue.flush(16);
		queue.flush(32);
		queue.flush(48);

		expect(render).toHaveBeenCalledTimes(3);
		expect(queue.callbacks.size).toBe(0);
		expect(queue.requestFrame).toHaveBeenCalledTimes(3);
	});

	it('pauses a queued frame and resumes on demand', () => {
		const queue = createFrameQueue();
		const render = vi.fn(() => false);
		const loop = createDemandRenderLoop(render, queue.requestFrame, queue.cancelFrame);

		loop.request();
		loop.pause();
		loop.request();
		expect(queue.callbacks.size).toBe(0);
		expect(queue.cancelFrame).toHaveBeenCalledTimes(1);

		loop.resume();
		expect(queue.callbacks.size).toBe(1);
		queue.flush(32);
		expect(render).toHaveBeenCalledTimes(1);
	});

	it('cancels pending work and ignores requests after disposal', () => {
		const queue = createFrameQueue();
		const render = vi.fn(() => true);
		const loop = createDemandRenderLoop(render, queue.requestFrame, queue.cancelFrame);

		loop.request();
		loop.dispose();
		loop.request();
		loop.resume();

		expect(queue.callbacks.size).toBe(0);
		expect(queue.cancelFrame).toHaveBeenCalledTimes(1);
		expect(queue.requestFrame).toHaveBeenCalledTimes(1);
		expect(render).not.toHaveBeenCalled();
	});
});
