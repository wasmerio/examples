/** Stand-in for `astro:assets` (aliased in vitest.config.ts). `getImage` is never called by the tests. */
export async function getImage(options: { src: string | { src?: string } }): Promise<{
  src: string;
}> {
  const { src } = options;

  return { src: typeof src === "string" ? src : (src?.src ?? "") };
}
