interface ImportMetaEnv {
  /** Formgong access key (fk_…). Public by design. */
  readonly PUBLIC_FORMGONG_ACCESS_KEY?: string;
  /** Any form backend that accepts a standard POST. Defaults to https://formgong.com/submit */
  readonly PUBLIC_FORMGONG_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
