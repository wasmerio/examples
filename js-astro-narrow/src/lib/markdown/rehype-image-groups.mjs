function isWhitespace(node) {
  return node.type === 'text' && /^\s*$/.test(node.value || '');
}

function imageChildren(paragraph) {
  const children = paragraph.children || [];
  if (
    !children.every(
      (child) => isWhitespace(child) || (child.type === 'element' && child.tagName === 'img')
    )
  ) {
    return [];
  }
  return children.filter((child) => child.type === 'element' && child.tagName === 'img');
}

function figureForImage(img, index = 0) {
  const title = img.properties?.title;
  const alt = img.properties?.alt || '';
  img.properties ||= {};
  img.properties.loading ||= 'lazy';
  img.properties.decoding ||= 'async';
  img.properties.className = [
    'mx-auto',
    'block',
    'max-h-[30rem]',
    'w-auto',
    'max-w-full',
    'cursor-zoom-in',
    'object-contain'
  ];

  const children = [
    {
      type: 'element',
      tagName: 'div',
      properties: {
        className: [
          'image-container',
          'flex',
          'justify-center',
          'overflow-hidden',
          'rounded-base',
          'bg-muted/20'
        ]
      },
      children: [img]
    }
  ];

  if (title) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {
        className: ['image-caption', 'mt-2.5', 'text-center', 'text-sm', 'text-fg-muted']
      },
      children: [{ type: 'text', value: String(title) }]
    });
  }

  // `not-prose` opts the figure out of the typography plugin so the utility
  // classes fully control its appearance. The semantic class names are kept as
  // hooks for the gallery/lightbox client script.
  return {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: ['image-figure', 'not-prose', 'my-8'],
      dataImageSrc: img.properties.src,
      dataImageAlt: alt,
      dataGalleryIndex: String(index)
    },
    children
  };
}

function galleryForImages(images) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['markdown-gallery', 'not-prose', 'my-8'],
      dataGallery: 'true',
      dataLayout: 'auto'
    },
    children: images.map((img, index) => figureForImage(img, index))
  };
}

function visit(parent) {
  if (!Array.isArray(parent.children)) return;

  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];

    if (child.type === 'element' && child.tagName === 'p') {
      const images = imageChildren(child);
      if (images.length === 1) {
        parent.children[index] = figureForImage(images[0]);
        continue;
      }
      if (images.length > 1) {
        parent.children[index] = galleryForImages(images);
        continue;
      }
    }

    visit(child);
  }
}

export function rehypeImageGroups() {
  return (tree) => visit(tree);
}
