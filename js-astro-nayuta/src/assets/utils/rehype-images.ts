import type { RehypePlugin } from '@astrojs/markdown-remark';
import { resolveImageDimensions } from './image-metadata';

interface ImageNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: ImageNode[];
}

/** Preserve Astro's local asset pipeline, but never require remote inference. */
export const rehypeImages: RehypePlugin = () => async (tree, file) => {
  if (file.data.astro) file.data.astro.remoteImagePaths = [];
  async function visit(parent: ImageNode, inParagraph = false): Promise<void> {
    if (!parent.children || parent.tagName === 'nayuta-image') return;
    // A standalone image is a block; mixed text retains a phrasing-only wrapper.
    if (parent.tagName === 'p') {
      const meaningful = parent.children.filter(
        (child) => child.type !== 'text' || child.value?.trim(),
      );
      const only = meaningful[0];
      if (
        meaningful.length === 1 &&
        (only?.tagName === 'img' ||
          (only?.tagName === 'a' &&
            only.children?.length === 1 &&
            only.children[0].tagName === 'img'))
      ) {
        parent.tagName = 'div';
        parent.properties = {
          ...parent.properties,
          className: ['ny-image-block'],
        };
      }
    }
    const inline = inParagraph || parent.tagName === 'p';
    await Promise.all(
      parent.children.map(async (node, index) => {
        if (
          node.tagName !== 'img' ||
          typeof node.properties?.src !== 'string'
        ) {
          await visit(node, inline);
          return;
        }
        const props = node.properties;
        if ('data-image-native' in props || 'dataImageNative' in props) return;
        const dimensions = await resolveImageDimensions(props.src as string, {
          width: props.width,
          height: props.height,
          file: file.path,
        });
        if (dimensions) Object.assign(props, dimensions);
        props.loading ??= 'lazy';
        props.decoding = 'async';
        parent.children![index] = {
          type: 'element',
          tagName: 'nayuta-image',
          properties: {
            style: dimensions
              ? `--ny-image-ratio:${dimensions.width} / ${dimensions.height};--ny-image-width:${dimensions.width}px`
              : '--ny-image-ratio:16 / 9',
            'data-lightbox': props['data-lightbox'] ?? props.dataLightbox,
          },
          children: [
            {
              type: 'element',
              tagName: inline ? 'span' : 'div',
              properties: {
                className: ['ny-image-placeholder'],
                'aria-hidden': 'true',
              },
              children: [],
            },
            node,
          ],
        };
      }),
    );
  }
  await visit(tree);
};
