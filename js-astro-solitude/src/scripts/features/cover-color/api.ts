import { Solitude } from '@/scripts/core/api';
/** Browser behavior preserved from Solitude Hugo; typed boundary: core/api.ts. */
import { applyThemeColor, getCoverSource, resolveColor } from '@/scripts/features/cover-color/shared';
const fetchApiColor = async (source: string) => {
  const response = await fetch(
    `${Solitude.config.covercolor.api}${encodeURIComponent(source)}`,
  );
  if (!response.ok)
    throw new Error(`Cover color API returned ${response.status}`);
  return (await response.json()).RGB;
};
export const coverColor = (music = false) => {
  const configured = !music && Solitude.page.color;
  if (configured) return applyThemeColor(configured);
  return resolveColor(getCoverSource(music), fetchApiColor, music);
};
