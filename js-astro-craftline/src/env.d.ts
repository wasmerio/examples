interface ImportMetaEnv {
  /** Your Formgong access key (fk_…). Public by design. Falls back to SITE.formgong.accessKey. */
  readonly PUBLIC_FORMGONG_ACCESS_KEY?: string;
  /** Optional: another endpoint that accepts the same POST. Falls back to SITE.formgong.endpoint. */
  readonly PUBLIC_FORMGONG_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
