import type { RehypePlugin } from '@astrojs/markdown-remark'
import { visit } from 'unist-util-visit'
import imageLazyload from './image-lazyload';

const rehypeImageLazyLoad: RehypePlugin = () => {
  return (tree) => {
    let imageCount = 0
    visit(tree, (node) => {
      if (node.type == 'element' && node.tagName == 'img') {
        node.properties['class'] = ((node.properties['class'] || '') + ' lazyload').trim()
        node.properties['data-src'] = node.properties['src']
        node.properties['src'] = ''
        imageCount ++
      }
    })
    imageCount && tree.children.push({
      type: 'element',
      tagName: 'script',
      properties: { type: 'text/javascript' },
      children: [{ type: 'text', value: `(${imageLazyload.toString()})();` }],
    })
  }
}

export default rehypeImageLazyLoad