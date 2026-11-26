export function verifyBrowserMatrix(run, root, port) {
  for (const base of ['/', '/toolkit/']) {
    run(
      'npx',
      [
        'playwright',
        'test',
        'tests/browser/routes.spec.ts',
        'tests/browser/metadata.spec.ts',
        'tests/browser/interactions.spec.ts',
      ],
      root,
      { SITE_BASE: base, PREVIEW_PORT: port },
    );
  }
}
