/**
 * Adds a filename label to code blocks written as
 *
 *   ```yaml title="site.config.yaml"
 *
 * Shiki copies the fence meta onto the <pre>, and the stylesheet renders it as
 * a small caption above the code.
 */
export default function transformerFilename() {
  return {
    name: 'inkfolio:filename',
    pre(node) {
      const meta = this.options?.meta?.__raw ?? node.meta ?? '';
      const match = String(meta).match(/(?:title|filename)="([^"]+)"/);
      if (match) node.properties['data-filename'] = match[1];
    },
  };
}
