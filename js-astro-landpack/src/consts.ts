import projectYaml from "./content/project/main.yaml?raw";
import { parse } from "yaml";
const project = parse(projectYaml) as {
  name: string;
  description: string;
  headline: string;
  headlineAccent: string;
  seo?: {
    image: string;
    imageAlt: string;
    imageWidth?: number;
    imageHeight?: number;
  };
};
/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = project.name;
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION = project.description;
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search results and the sitemap. */
export const NOINDEX_ROUTES: string[] = ["/404", "/example-components"];

/** Default public social card path or absolute URL. */
export const SITE_SOCIAL_IMAGE = project.seo?.image ?? "/og-image.jpg";
/** Accessible description of the default social card. */
export const SITE_SOCIAL_IMAGE_ALT =
  project.seo?.imageAlt ??
  `${project.name} — ${project.headline} ${project.headlineAccent}`;
/** Dimensions of the configured social card; custom assets may omit them. */
export const SITE_SOCIAL_IMAGE_WIDTH =
  project.seo?.imageWidth ??
  (SITE_SOCIAL_IMAGE === "/og-image.jpg" ? 1200 : undefined);
export const SITE_SOCIAL_IMAGE_HEIGHT =
  project.seo?.imageHeight ??
  (SITE_SOCIAL_IMAGE === "/og-image.jpg" ? 630 : undefined);
