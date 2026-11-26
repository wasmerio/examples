export const IMAGE_PRESETS = {
  hero: { width: 1600, widths: [640, 960, 1280, 1600], sizes: '100vw' },
  story: { width: 1200, widths: [480, 800, 1200], sizes: '(max-width: 900px) 100vw, 50vw' },
  album: { width: 960, widths: [480, 720, 960], sizes: '(max-width: 800px) 100vw, 480px' },
  card: { width: 800, widths: [320, 480, 800], sizes: '(max-width: 700px) 100vw, 320px' },
  thumb: { width: 320, widths: [160, 320], sizes: '160px' },
};

export function selectImagePreset({ variant, className = '' } = {}) {
  if (variant && IMAGE_PRESETS[variant]) return IMAGE_PRESETS[variant];
  if (String(className).split(/\s+/).includes('memory-image-frame__image')) return IMAGE_PRESETS.story;
  return IMAGE_PRESETS.card;
}

export function getAlbumImageOptions(image, preset = IMAGE_PRESETS.card) {
  const width = preset.width ?? 960;
  const target = Math.min(image?.width || width, width);
  const widths = [...new Set([...(preset.widths ?? [target]), target].filter((value) => value > 0 && value <= target))].sort((left, right) => left - right);
  return {
    format: 'webp',
    quality: preset.quality ?? 80,
    layout: 'constrained',
    width: target,
    widths: widths.length ? widths : [target],
    sizes: preset.sizes ?? '(max-width: 800px) 100vw, 480px',
  };
}

export function isVectorImage(image, source = '') {
  return image?.format === 'svg' || /\.svg(?:$|\?)/i.test(String(image?.src || source));
}
