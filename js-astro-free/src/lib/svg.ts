export function sanitizeToOutline(svg: string, size: number = 16): string {
  let s = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    // normalize size attributes on root and any nested symbols
    .replace(/<svg([^>]*?)>/, (m, attrs) => {
      let a = attrs
        // drop existing width/height
        .replace(/\swidth=\"[^\"]*\"/g, '')
        .replace(/\sheight=\"[^\"]*\"/g, '');
      // ensure outline coloring
      if (!/\sstroke=/.test(a)) a += ' stroke="currentColor"';
      if (!/\sfill=/.test(a)) a += ' fill="none"';
      return `<svg${a} width="${size}" height="${size}">`;
    })
    // force fills to none
    .replace(/fill=\"(?!none)[^\"]*\"/gi, 'fill="none"')
    // force strokes to currentColor
    .replace(/stroke=\"(?!none)[^\"]*\"/gi, 'stroke="currentColor"');

  // add fill="none" to common shapes if missing
  const tags = ['path', 'rect', 'circle', 'polygon', 'ellipse'];
  for (const tag of tags) {
    const re = new RegExp(`<${tag}([^>]*)>`, 'gi');
    s = s.replace(re, (m, attrs) => {
      if (/fill=/.test(attrs)) return m;
      return `<${tag}${attrs} fill="none">`;
    });
  }

  return s;
}


