import type { Locale } from "@/i18n/config";

export interface ShowcaseItem {
	name: string;
	href: string;
	stack: string;
	badge?: ShowcaseBadge;
	desc: Record<Locale, string>;
	/** Higher values appear first and are favored on the home page. */
	priority: number;
}

export interface ShowcaseBadge {
	icon?: "star";
	label: string;
}

export const showcase: ShowcaseItem[] = [
	{
		name: "Astro Kami",
		href: "https://github.com/automann/astro-kami",
		stack: "Astro · TypeScript",
		badge: { icon: "star", label: "8.8k" },
		desc: {
			en: "A minimal, internationalized Astro blog theme with an editorial visual system, Markdown and MDX support, search, comments, and static deployment.",
			zh: "一款支持国际化的极简 Astro 博客主题，具备编辑式视觉系统、Markdown 与 MDX、搜索、评论和静态部署能力。",
		},
		priority: 120,
	},
	{
		name: "Sample Project",
		href: "https://github.com/example/sample",
		stack: "TypeScript · CLI",
		badge: { label: "OSS" },
		desc: {
			en: "A short, plain description of what the project does and why it's interesting. One or two sentences is plenty — keep the prose tight so the row stays scannable.",
			zh: "用简短、直白的文字说明项目的用途和亮点。一两句话就足够，保持精炼，让列表易于浏览。",
		},
		priority: 100,
	},
	{
		name: "Another Thing",
		href: "https://example.com",
		stack: "Web App · Realtime",
		badge: { label: "Live" },
		desc: {
			en: "Use the badge slot for a status hint — installs, stars, version, or just an OSS / Closed marker. Leave the field undefined and the badge disappears.",
			zh: "徽章可以展示安装量、星标数、版本或开源状态；不设置该字段时，徽章会自动隐藏。",
		},
		priority: 80,
	},
	{
		name: "Research Note",
		href: "https://github.com/example/paper",
		stack: "Python · Algorithms",
		desc: {
			en: "Showcase entries don't have to be products — a write-up, a paper repo, a one-off experiment all fit. The list is rendered in order; reorder to taste.",
			zh: "展示条目不必都是产品，也可以是文章、论文仓库或一次性实验。列表按数据顺序呈现，可按需调整。",
		},
		priority: 60,
	},
];

export function getShowcaseByPriority(): ShowcaseItem[] {
	return [...showcase].sort((a, b) => b.priority - a.priority);
}

export function getFeaturedShowcase(limit = 3): ShowcaseItem[] {
	return getShowcaseByPriority().slice(0, limit);
}
