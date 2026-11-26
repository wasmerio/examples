
/**
 * Imports the 'unist-util-visit' module for traversing the Markdown AST and finding nodes of type 'image' and 'link'.
 */
import { visit } from 'unist-util-visit';

/**
 * Remark plugin to prepend baseUrl to relative URLs in Markdown images and links.
 * @param {Object} options
 * @param {string} options.baseUrl - For example, '/astro/'
 */
export default function remarkBaseUrl(options) {
  return (tree) => {
    const baseUrl = (options && options.baseUrl) || '/';

    const processUrl = (url) => {
      if (
        url &&
        !url.startsWith('http') &&
        !url.startsWith('/') &&
        !url.startsWith('#') &&
        !url.startsWith(baseUrl)
      ) {
        return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\.\//, '')}`;
      }
      return url;
    };

    visit(tree, ['image', 'link'], (node) => {
      node.url = processUrl(node.url);
    });

    visit(tree, 'html', (node) => {
      const urlRegex = /(src|href)=["']([^"']+)["']/g;
      node.value = node.value.replace(urlRegex, (match, attr, url) => {
        const newUrl = processUrl(url);
        if (newUrl !== url) {
          return `${attr}="${newUrl}"`;
        }
        return match;
      });
    });
  };
}