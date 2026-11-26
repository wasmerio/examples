import { z } from "astro/zod";
import { contentTextSchema } from "./content";

const optionalText = contentTextSchema.optional();
const stringOrNumber = z.union([contentTextSchema, z.number()]);

const customItemSchema = z
	.object({
		title: optionalText,
		subtitle: optionalText,
		date: stringOrNumber.optional(),
		description: optionalText,
		link: optionalText,
		icon: optionalText,
		badges: z.array(contentTextSchema).optional(),
		highlights: z.array(contentTextSchema).optional(),
		links: z
			.array(
				z
					.object({
						label: optionalText,
						href: contentTextSchema,
						icon: optionalText,
					})
					.strict(),
			)
			.optional(),
	})
	.strict();

export const aboutDataSchema = z
	.object({
		// Kept for compatibility; visible page copy is configured in site.config.ts.
		hero: z
			.object({ title: optionalText, description: optionalText })
			.strict()
			.optional(),
		profile: z
			.array(z.object({ label: optionalText, value: optionalText }).strict())
			.optional(),
		experience: z
			.array(
				z
					.object({
						role: optionalText,
						organization: optionalText,
						period: optionalText,
						bullets: z.array(contentTextSchema).optional(),
					})
					.strict(),
			)
			.optional(),
		service: z
			.array(
				z.union([
					contentTextSchema,
					z
						.object({
							role: optionalText,
							organization: optionalText,
							period: optionalText,
						})
						.strict(),
				]),
			)
			.optional(),
		education: z
			.array(
				z
					.object({
						degree: optionalText,
						institution: optionalText,
						year: stringOrNumber.optional(),
					})
					.strict(),
			)
			.optional(),
		sections: z
			.array(
				z
					.object({
						title: optionalText,
						icon: optionalText,
						items: z
							.array(z.union([contentTextSchema, customItemSchema]))
							.optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
