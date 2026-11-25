// Remark plugins
import remarkDirective from 'remark-directive'
import remarkDirectiveWidgets from './remark-directive-widgets'
import remarkMarkmap from 'remark-markmap'
export const remarkPlugins = [
  remarkDirective,
  remarkDirectiveWidgets,
  remarkMarkmap
]

// Rehype plugins
import rehypeImageLazyLoad from './rehype-image-lazyload'
export const rehypePlugins = [
  rehypeImageLazyLoad
]