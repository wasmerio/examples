import { html } from "satori-html";
import { formatLocalizedDate, formatReadingTime } from "../../i18n/format.ts";

export type ArticleCardLocale = "en" | "zh";

export interface ArticleCardInput {
	author?: string;
	description: string;
	host: string;
	locale: ArticleCardLocale;
	publishDate: Date;
	readingTime?: string;
	tags: string[];
	title: string;
}

export interface ArticleCardModel {
	byline: string;
	dateLabel: string;
	description: string;
	host: string;
	htmlLang: "en" | "zh-CN";
	locale: ArticleCardLocale;
	sectionLabel: string;
	tagsLine: string;
	title: string;
}

export interface ArticleCardFontFamilies {
	body: string;
	brand: string;
	display: string;
	displayWeight: 400 | 600;
	meta: string;
}

export const defaultArticleCardFonts: ArticleCardFontFamilies = {
	body: "Newsreader",
	brand: "Maple Mono",
	display: "Newsreader",
	displayWeight: 600,
	meta: "Maple Mono",
};

function truncateForCard(value: string, maxCharacters: number): string {
	const characters = Array.from(value.trim());
	if (characters.length <= maxCharacters) return characters.join("");
	return `${characters
		.slice(0, maxCharacters - 1)
		.join("")
		.trimEnd()}…`;
}

export function createArticleCardModel(input: ArticleCardInput): ArticleCardModel {
	const visibleTags = input.tags.slice(0, 3);
	const hiddenTagCount = input.tags.length - visibleTags.length;
	const tagParts =
		input.locale === "en" ? visibleTags.map((tag) => tag.toUpperCase()) : visibleTags;
	if (hiddenTagCount > 0) tagParts.push(`+${hiddenTagCount}`);

	const bylineParts = [
		input.author ? `${input.locale === "en" ? "By" : "作者"} ${input.author}` : null,
		input.readingTime ? formatReadingTime(input.readingTime, input.locale) : null,
	].filter(Boolean);

	return {
		byline: bylineParts.join(" · "),
		dateLabel: formatLocalizedDate(input.publishDate, input.locale, {
			day: "numeric",
			month: "long",
			timeZone: "UTC",
			year: "numeric",
		}),
		description: truncateForCard(input.description, input.locale === "zh" ? 78 : 145),
		host: input.host,
		htmlLang: input.locale === "zh" ? "zh-CN" : "en",
		locale: input.locale,
		sectionLabel: input.locale === "zh" ? "文章" : "Journal",
		tagsLine: tagParts.join(" · "),
		title: truncateForCard(input.title, input.locale === "zh" ? 44 : 100),
	};
}

export function titleTypography(title: string, locale: ArticleCardLocale) {
	if (locale === "zh") {
		if (title.length > 30) return { fontSize: 48, lineHeight: 1.22 };
		if (title.length > 20) return { fontSize: 54, lineHeight: 1.2 };
		return { fontSize: 64, lineHeight: 1.16 };
	}

	if (title.length > 80) return { fontSize: 48, lineHeight: 1.12 };
	if (title.length > 52) return { fontSize: 56, lineHeight: 1.12 };
	return { fontSize: 68, lineHeight: 1.08 };
}

export function articleCardMarkup(
	model: ArticleCardModel,
	fonts: ArticleCardFontFamilies = defaultArticleCardFonts,
) {
	const titleType = titleTypography(model.title, model.locale);
	const bodySize = model.locale === "zh" ? 27 : 29;
	const bodyLineHeight = model.locale === "zh" ? 1.58 : 1.42;

	return html`<div
		lang="${model.htmlLang}"
		tw="flex flex-col w-full h-full px-20 py-16"
		style="background-color: #171513; color: #fbf6ec;"
	>
		<div tw="flex items-center justify-between w-full pb-6 border-b" style="border-color: #3a332d;">
			<div tw="flex items-center">
				<span tw="w-3 h-3 mr-5" style="background-color: #a34a28;"></span>
				<span
					tw="text-xl tracking-widest uppercase"
					style="color: #d6a06c; font-family: ${fonts.brand};"
				>
					Astro Kami /
				</span>
				<span tw="text-xl ml-3 tracking-widest" style="color: #d6a06c; font-family: ${fonts.meta};">
					${model.sectionLabel}
				</span>
			</div>
			<span tw="text-xl tracking-wide" style="color: #8f8479; font-family: ${fonts.meta};">
				${model.dateLabel}
			</span>
		</div>

		<div tw="flex flex-col flex-1 pt-10">
			<h1
				tw="m-0"
				style="color: #fbf6ec; font-family: ${fonts.display}; font-size: ${titleType.fontSize}px; font-weight: ${fonts.displayWeight}; line-height: ${titleType.lineHeight};"
			>
				${model.title}
			</h1>

			<div tw="flex mt-8 pl-7" style="border-left: 4px solid #a34a28;">
				<p
					tw="m-0"
					style="color: #c7bdb3; font-family: ${fonts.body}; font-size: ${bodySize}px; line-height: ${bodyLineHeight};"
				>
					${model.description}
				</p>
			</div>
		</div>

		<div tw="flex items-end justify-between w-full pt-7 border-t" style="border-color: #3a332d;">
			<div tw="flex flex-col" style="max-width: 760px;">
				<span tw="text-xl mb-3" style="color: #b4a99e; font-family: ${fonts.meta};">
					${model.byline}
				</span>
				<span tw="text-lg tracking-wider uppercase" style="color: #d6a06c; font-family: ${fonts.meta};">
					${model.tagsLine}
				</span>
			</div>
			<span tw="text-lg tracking-wide" style="color: #6f655c; font-family: ${fonts.brand};">
				${model.host}
			</span>
		</div>
	</div>`;
}
