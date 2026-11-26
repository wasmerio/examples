import type { CV, BaseInfo } from './types';
import { micromark } from 'micromark';

export function extractLangInfo(id: string, lang?: string) {
    return lang || id;
}

export function extractBaseInfo(id: string, cv: CV): BaseInfo {
    return {
        name: cv.name,
        lang: extractLangInfo(id, cv.lang),
        info: cv.info,
    };
}

export function extractLanguageLink(id: string, cv: CV) {
    return {
        lang: extractLangInfo(id, cv.lang),
        link: `/${id}`,
    }
}

export function md2html(md: string): string {
    return micromark(md);
}