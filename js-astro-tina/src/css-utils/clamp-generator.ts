import defaultViewports from "../design-tokens/viewports.json";

const clampGenerator = (
	tokens: { max: number; min: number; name: string }[],
	viewports: typeof defaultViewports = defaultViewports,
) => {
	const rootSize = 16;

	return tokens.map(({ max, min, name }) => {
		if (min === max) {
			return { name, value: `${(min / rootSize).toString()}rem` };
		}

		// Convert the min and max sizes to rems
		const minSize = min / rootSize;
		const maxSize = max / rootSize;

		// Convert the pixel viewport sizes into rems
		const minViewport = viewports.min / rootSize;
		const maxViewport = viewports.max / rootSize;

		// Slope and intersection allow us to have a fluid value but also keep that sensible
		const slope = (maxSize - minSize) / (maxViewport - minViewport);
		const intersection = -1 * minViewport * slope + minSize;

		return {
			name,
			value: `clamp(${minSize.toString()}rem, ${intersection.toFixed(2)}rem + ${(
				slope * 100
			).toFixed(2)}vw, ${maxSize.toString()}rem)`,
		};
	});
};

export { clampGenerator };
