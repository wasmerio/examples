/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from "slugify";

const tokensToTailwind = (tokens: { name: string; value: any }[]) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
	const nameSlug = (text: string) => slugify(text, { lower: true });
	const response: Record<string, any> = {};

	tokens.forEach(({ name, value }) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		response[nameSlug(name)] = value;
	});

	return response;
};

export { tokensToTailwind };
