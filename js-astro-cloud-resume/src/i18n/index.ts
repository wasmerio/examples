import config from '../config';
import { ui } from './ui';

export const lang = config.lang;
export const t = ui[lang];
