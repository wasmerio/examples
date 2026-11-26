/** Draft rule for notes and projects. Posts use `postFilter` instead. */
export const isVisible = (entry: { data: { draft?: boolean } }): boolean =>
  import.meta.env.DEV || !entry.data.draft;
