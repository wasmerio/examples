import { render } from "astro:content";
import { loadMapleMonoCnRegular } from "@automann/maple-mono-cn/og-cn";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import MapleMono from "@/assets/fonts/maplemono-regular.ttf";
import NewsreaderItalic from "@/assets/fonts/newsreader-italic.ttf";
import NewsreaderRegular from "@/assets/fonts/newsreader-regular.ttf";
import NewsreaderSemiBold from "@/assets/fonts/newsreader-semibold.ttf";
import {
	type ArticleCardFontFamilies,
	articleCardMarkup,
	createArticleCardModel,
	defaultArticleCardFonts,
} from "@/components/og/article-card";
import { getAllPosts } from "@/data/post";
import { type Locale, postLocaleFromId } from "@/i18n/config";
import { siteConfig } from "@/site-config";

const englishFonts: SatoriOptions["fonts"] = [
	{ data: Buffer.from(NewsreaderRegular), name: "Newsreader", style: "normal", weight: 400 },
	{ data: Buffer.from(NewsreaderSemiBold), name: "Newsreader", style: "normal", weight: 600 },
	{ data: Buffer.from(NewsreaderItalic), name: "Newsreader", style: "italic", weight: 400 },
	{ data: Buffer.from(MapleMono), name: "Maple Mono", style: "normal", weight: 400 },
];

interface OgRenderProfile {
	families: ArticleCardFontFamilies;
	options: SatoriOptions;
}

async function getOgRenderProfile(locale: Locale): Promise<OgRenderProfile> {
	if (locale === "zh") {
		return {
			families: {
				body: "Maple Mono CN",
				brand: "Maple Mono",
				display: "Maple Mono CN",
				displayWeight: 400,
				meta: "Maple Mono CN",
			},
			options: {
				fonts: [
					{
						data: Buffer.from(MapleMono),
						name: "Maple Mono",
						style: "normal",
						weight: 400,
					},
					{
						data: await loadMapleMonoCnRegular(),
						name: "Maple Mono CN",
						style: "normal",
						weight: 400,
					},
				],
				height: 630,
				width: 1200,
			},
		};
	}

	return {
		families: defaultArticleCardFonts,
		options: { fonts: englishFonts, height: 630, width: 1200 },
	};
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { author, description, locale, pubDate, title, tags, readingTime } = context.props as Props;
	const profile = await getOgRenderProfile(locale);
	const host = context.site ? new URL(context.site).host : siteConfig.title;
	const card = createArticleCardModel({
		author,
		description,
		host,
		locale,
		publishDate: new Date(pubDate),
		readingTime,
		tags,
		title,
	});

	const svg = await satori(articleCardMarkup(card, profile.families), profile.options);
	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	const filtered = posts.filter(({ data }) => !data.ogImage);
	return Promise.all(
		filtered.map(async (post) => {
			const { remarkPluginFrontmatter } = await render(post);
			const readingTime = (remarkPluginFrontmatter as { minutesRead?: string })?.minutesRead ?? "";
			return {
				params: { slug: post.id },
				props: {
					author: siteConfig.profile?.name ?? siteConfig.author,
					description: post.data.description,
					locale: postLocaleFromId(post.id),
					pubDate: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
					readingTime,
					tags: post.data.tags ?? [],
					title: post.data.title,
				},
			};
		}),
	);
}
