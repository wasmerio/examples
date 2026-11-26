import { AUTUMN_SEASON, SUMMER_SEASON, SPRING_SEASON, WINTER_SEASON } from '../seasons';
import { defineScreenshotTests } from './support';

defineScreenshotTests('home', '/', [SUMMER_SEASON, AUTUMN_SEASON, WINTER_SEASON, SPRING_SEASON]);
