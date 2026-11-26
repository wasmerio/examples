export type JsonLd = Record<string, unknown>;

export interface SeoAuthor {
	name: string;
	url?: string;
	image?: string;
	bio?: string;
	sameAs?: string[];
}

export interface SeoPerson {
	name: string;
	image: string;
	sameAs: string[];
}

export interface SeoSchemaInput {
	siteUrl: string;
	title: string;
	description?: string;
	canonicalUrl?: string;
	image?: string;
	keywords?: string[];
	siteName?: string;
	logo?: string;
	siteSameAs?: string[];
	inLanguage?: string;
	author?: SeoAuthor;
	person?: SeoPerson;
	category?: string;
	datePublished?: Date;
	dateModified?: string | Date;
	article?: boolean;
	breadcrumbs?: Array<{ name: string; url?: string }>;
	faqs?: Array<{ question: string; answer: string }>;
}

export function absoluteUrl(siteUrl: string, value: string): string {
	const baseUrl = siteUrl.replace(/\/+$/, "");
	if (value.startsWith("//")) return `https:${value}`;
	if (/^[a-z][a-z\d+.-]*:/i.test(value)) return value;
	return new URL(value, `${baseUrl}/`).href;
}

export function normalizeUrl(siteUrl: string, value: string): string {
	try {
		const url = new URL(absoluteUrl(siteUrl, value));
		if (url.pathname.length > 1)
			url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
		return url.href;
	} catch {
		return value;
	}
}

function compact<T extends JsonLd>(value: T): T {
	for (const key of Object.keys(value)) {
		const entry = value[key];
		if (
			entry === undefined ||
			entry === null ||
			entry === "" ||
			(Array.isArray(entry) && entry.length === 0)
		) {
			delete value[key];
		}
	}
	return value;
}

function personSchema(siteUrl: string, person: SeoAuthor | SeoPerson): JsonLd {
	return compact({
		"@type": "Person",
		name: person.name,
		url: "url" in person ? person.url : undefined,
		image: person.image ? absoluteUrl(siteUrl, person.image) : undefined,
		description: "bio" in person ? person.bio : undefined,
		sameAs: person.sameAs,
	});
}

function breadcrumbSchema(
	siteUrl: string,
	breadcrumbs: SeoSchemaInput["breadcrumbs"],
): JsonLd | undefined {
	if (!breadcrumbs?.length) return undefined;
	return compact({
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs.map((item, index) =>
			compact({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				item: item.url ? normalizeUrl(siteUrl, item.url) : undefined,
			}),
		),
	});
}

function faqSchema(faqs: SeoSchemaInput["faqs"]): JsonLd | undefined {
	if (!faqs?.length) return undefined;
	return {
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: { "@type": "Answer", text: faq.answer },
		})),
	};
}

export function createSeoSchemas(input: SeoSchemaInput): JsonLd[] {
	const canonical = normalizeUrl(input.siteUrl, input.canonicalUrl || "/");
	const siteUrl = normalizeUrl(input.siteUrl, "/");
	const publisher = compact({
		"@type": "Organization",
		name: input.siteName,
		url: siteUrl,
		logo: input.logo
			? compact({
					"@type": "ImageObject",
					url: absoluteUrl(input.siteUrl, input.logo),
				})
			: undefined,
		sameAs: input.siteSameAs?.filter((value) => /^https?:\/\//i.test(value)),
	});
	const webPage = compact({
		"@type": "WebPage",
		"@id": canonical,
		url: canonical,
		name: input.title,
		description: input.description,
		inLanguage: input.inLanguage,
		isPartOf: { "@id": `${siteUrl}#website` },
	});
	const schemas: JsonLd[] = [
		compact({
			"@type": input.article ? "BlogPosting" : "WebPage",
			"@id": input.article ? `${canonical}#article` : canonical,
			headline: input.title,
			name: input.title,
			description: input.description,
			url: canonical,
			image: input.image ? absoluteUrl(input.siteUrl, input.image) : undefined,
			keywords: input.keywords?.length ? input.keywords.join(", ") : undefined,
			datePublished: input.datePublished?.toISOString(),
			dateModified:
				input.dateModified instanceof Date
					? input.dateModified.toISOString()
					: input.dateModified,
			inLanguage: input.inLanguage,
			author: input.author
				? personSchema(input.siteUrl, input.author)
				: undefined,
			articleSection: input.article ? input.category : undefined,
			publisher: input.article ? publisher : undefined,
			mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
		}),
		...(input.article ? [webPage] : []),
	];
	if (!input.article) {
		schemas.push(
			compact({
				"@type": "WebSite",
				"@id": `${siteUrl}#website`,
				name: input.siteName,
				url: siteUrl,
				inLanguage: input.inLanguage,
				publisher,
			}),
		);
	}
	if (input.person) schemas.push(personSchema(input.siteUrl, input.person));
	const breadcrumb = breadcrumbSchema(input.siteUrl, input.breadcrumbs);
	if (breadcrumb) schemas.push(breadcrumb);
	const faq = faqSchema(input.faqs);
	if (faq) schemas.push(faq);
	return schemas.map((schema) => ({
		"@context": "https://schema.org",
		...schema,
	}));
}
