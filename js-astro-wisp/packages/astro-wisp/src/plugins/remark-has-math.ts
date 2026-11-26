import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { EXIT, visit } from 'unist-util-visit';

interface AstroFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/**
 * remark 插件：检测文档是否包含公式（math 块级或 inlineMath 行内节点），
 * 结果写入 `file.data.astro.frontmatter.hasMath`（布尔值）。
 * Post 布局据此按需引入 katex.css。
 */
const remarkHasMath: Plugin<[], Root> = () => (tree, file) => {
  let hasMath = false;

  visit(tree, (node) => {
    if (node.type === 'math' || node.type === 'inlineMath') {
      hasMath = true;
      return EXIT;
    }
    return undefined;
  });

  const data = file.data as AstroFileData;
  data.astro ??= {};
  data.astro.frontmatter ??= {};
  data.astro.frontmatter.hasMath = hasMath;
};

export default remarkHasMath;
