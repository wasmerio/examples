/** posts/<slug>/index.mdx -> <slug>；posts/<slug>.md -> <slug>；嵌套目录保留路径。内容集合与图表下载共用。 */
export function postId(entry: string): string {
  return entry
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '')
    .replace(/\/index$/i, '');
}
