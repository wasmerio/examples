/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	/** Umami website ID. Set to enable analytics; leave unset to disable. */
	readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
	/** Umami script URL. Defaults to the Umami Cloud script. */
	readonly PUBLIC_UMAMI_SRC?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
