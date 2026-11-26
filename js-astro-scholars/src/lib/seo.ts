import type { SiteConfig, SocialLink } from "../types/config";
import { buildAbsoluteUrl, withTrailingSlash } from "./site-url";

export type PageSchemaType =
	| "AboutPage"
	| "BlogPosting"
	| "CollectionPage"
	| "ProfilePage"
	| "WebPage";

export interface SeoBreadcrumb {
	name: string;
	url: string;
}

export interface StructuredDataOptions {
	siteConfig: SiteConfig;
	canonicalUrl: string;
	pageTitle: string;
	description: string;
	imageUrl: string;
	imageWidth?: number;
	imageHeight?: number;
	schemaType: PageSchemaType;
	publishedAt?: string;
	modifiedAt?: string;
	tags?: string[];
	breadcrumbs?: SeoBreadcrumb[];
}

export function getTwitterHandle(socialLinks: SocialLink[]): string | undefined {
	for (const link of socialLinks) {
		try {
			const url = new URL(link.href);
			if (
				!["twitter.com", "www.twitter.com", "x.com", "www.x.com"].includes(
					url.hostname,
				)
			) {
				continue;
			}

			const handle = url.pathname.split("/").filter(Boolean)[0];
			if (
				handle &&
				!["home", "intent", "share"].includes(handle.toLowerCase())
			) {
				return `@${handle}`;
			}
		} catch {
			// Ignore non-URL links such as mailto addresses.
		}
	}

	return undefined;
}

export function buildStructuredData(options: StructuredDataOptions) {
	const {
		siteConfig,
		canonicalUrl,
		pageTitle,
		description,
		imageUrl,
		imageWidth,
		imageHeight,
		schemaType,
		publishedAt,
		modifiedAt,
		tags,
		breadcrumbs = [],
	} = options;

	const siteUrl = withTrailingSlash(siteConfig.siteUrl);
	const personId = `${siteUrl}#person`;
	const websiteId = `${siteUrl}#website`;
	const webpageId = `${canonicalUrl}#webpage`;
	const imageId = `${canonicalUrl}#primaryimage`;
	const profileImage = buildAbsoluteUrl(
		siteConfig.hero.profileImage,
		siteConfig.siteUrl,
	);
	const sameAs = siteConfig.socialLinks
		.map((link) => link.href)
		.filter((href) => /^https?:\/\//i.test(href));

	const person = {
		"@type": "Person",
		"@id": personId,
		name: siteConfig.author,
		url: siteUrl,
		image: {
			"@type": "ImageObject",
			url: profileImage,
		},
		...(siteConfig.affiliations[0]?.role
			? { jobTitle: siteConfig.affiliations[0].role }
			: {}),
		...(siteConfig.affiliations.length
			? {
					affiliation: siteConfig.affiliations.map((affiliation) => ({
						"@type": "Organization",
						name: affiliation.institution,
						...(affiliation.url ? { url: affiliation.url } : {}),
					})),
				}
			: {}),
		...(siteConfig.researchInterests.length
			? { knowsAbout: siteConfig.researchInterests }
			: {}),
		...(sameAs.length ? { sameAs } : {}),
	};

	const website = {
		"@type": "WebSite",
		"@id": websiteId,
		url: siteUrl,
		name: siteConfig.title,
		description: siteConfig.description,
		inLanguage: siteConfig.language,
		author: { "@id": personId },
	};

	const primaryImage = {
		"@type": "ImageObject",
		"@id": imageId,
		url: imageUrl,
		...(imageWidth ? { width: imageWidth } : {}),
		...(imageHeight ? { height: imageHeight } : {}),
	};

	const webpage = {
		"@type": schemaType,
		"@id": webpageId,
		url: canonicalUrl,
		name: pageTitle,
		description,
		inLanguage: siteConfig.language,
		isPartOf: { "@id": websiteId },
		primaryImageOfPage: { "@id": imageId },
		author: { "@id": personId },
		...(schemaType === "ProfilePage"
			? { mainEntity: { "@id": personId } }
			: {}),
		...(schemaType === "BlogPosting"
			? {
					headline: pageTitle,
					mainEntityOfPage: canonicalUrl,
					...(publishedAt ? { datePublished: publishedAt } : {}),
					...(modifiedAt ? { dateModified: modifiedAt } : {}),
					...(tags?.length ? { keywords: tags.join(", ") } : {}),
				}
			: {}),
	};

	const breadcrumb =
		breadcrumbs.length > 1
			? {
					"@type": "BreadcrumbList",
					"@id": `${canonicalUrl}#breadcrumb`,
					itemListElement: breadcrumbs.map((item, index) => ({
						"@type": "ListItem",
						position: index + 1,
						name: item.name,
						item: item.url,
					})),
				}
			: undefined;

	return {
		"@context": "https://schema.org",
		"@graph": [person, website, primaryImage, webpage, breadcrumb].filter(Boolean),
	};
}
