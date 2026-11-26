/**
 * Reads the fence meta and copies what the code shell needs onto the <pre>:
 *
 *   ```yaml title="site.config.yaml"     → data-filename
 *   ```bash group="install"              → data-group (tabbed panel)
 *   ```js showLineNumbers                → data-linenos
 *
 * The language comes from shiki itself.
 */
export default function transformerCodeMeta() {
  return {
    name: 'inkfolio:code-meta',
    pre(node) {
      const meta = String(this.options?.meta?.__raw ?? node.meta ?? '');
      const filename = meta.match(/(?:title|filename)="([^"]+)"/);
      const group = meta.match(/group="([^"]+)"/);
      if (filename) node.properties['data-filename'] = filename[1];
      if (group) node.properties['data-group'] = group[1];
      if (/showLineNumbers/.test(meta)) node.properties['data-linenos'] = '';
      if (this.options?.lang) node.properties['data-lang'] = this.options.lang;
    },
  };
}
