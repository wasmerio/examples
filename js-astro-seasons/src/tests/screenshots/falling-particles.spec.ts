import { AUTUMN_SEASON, SPRING_SEASON, WINTER_SEASON } from '../seasons';
import { defineScreenshotTests } from './support';

defineScreenshotTests('falling-particles', '/', [AUTUMN_SEASON, WINTER_SEASON, SPRING_SEASON], {
  keepAnimations: true,
});
