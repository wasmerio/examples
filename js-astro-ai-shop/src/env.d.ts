interface ImportMetaEnv {
	readonly PUBLIC_ONETAG_KEY?: string;
	readonly PUBLIC_ONETAG_SITE?: string;
	readonly PUBLIC_STRIPE_MODE?: 'test' | 'live';
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
