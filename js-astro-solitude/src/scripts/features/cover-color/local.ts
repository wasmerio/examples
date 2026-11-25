/** Browser behavior preserved from Solitude Hugo; typed boundary: core/api.ts. */
import { Solitude } from '@/scripts/core/api';
import {
  applyThemeColor,
  getCoverSource,
  resolveColor,
  rgbToHex,
} from '@/scripts/features/cover-color/shared';
// Keep local images usable when the optional Color Thief CDN is unavailable.
const getAverageColor = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is unavailable');
  context.drawImage(image, 0, 0, 32, 32);
  const pixels = context.getImageData(0, 0, 32, 32).data;
  const channels = [0, 0, 0];
  let count = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 128) continue;
    channels.forEach(
      (_, channel) => (channels[channel] += pixels[index + channel]),
    );
    count++;
  }
  if (!count) throw new Error('Image has no visible pixels');
  return channels.map((value) => Math.round(value / count));
};
const extractLocalColor = (source: string) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener(
      'load',
      () => {
        try {
          const color = window.ColorThief?.getColorSync(image);
          resolve(
            rgbToHex(color ? color.array() : getAverageColor(image), 0.8),
          );
        } catch (error) {
          reject(error);
        }
      },
      { once: true },
    );
    image.addEventListener(
      'error',
      () => reject(new Error(`Unable to load ${source}`)),
      { once: true },
    );
    image.src = source;
  });
export const coverColor = (music = false) => {
  const configured = !music && Solitude.page.color;
  if (configured && /^#[0-9a-f]{6}$/i.test(configured))
    return applyThemeColor(configured);
  return resolveColor(getCoverSource(music), extractLocalColor, music);
};
