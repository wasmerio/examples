import { villa as baseVilla } from '../../villa.config.ts';
import { UI_LOCALES } from '../i18n/ui/index.ts';
import { applyOverlay, type VillaOverlay } from './overlay.ts';
import { validateVilla } from './validate.ts';

// The hosted demo adds demo/villa.demo.ts (absent from the theme package: nothing happens then).
const overlays = import.meta.glob<{ demo: VillaOverlay }>('/demo/villa.demo.ts', { eager: true });
const overlay = Object.values(overlays)[0]?.demo;
const rawVilla = overlay ? applyOverlay(baseVilla, overlay) : baseVilla;

const photoFiles = Object.keys(
  import.meta.glob('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', { caseSensitive: false }),
).map((path) => path.split('/').pop() ?? path);

const validated = validateVilla(rawVilla, { availablePhotos: photoFiles, uiLocales: UI_LOCALES });

for (const warning of validated.warnings) {
  console.warn(`[villa.config] ${warning}`);
}

/** The validated villa config, with defaults filled in. */
export const villa = validated.villa;

/** True when the booking form can send through Web3Forms or Formspree. */
export const formEnabled = villa.booking.provider !== 'none' && villa.booking.key !== '';
