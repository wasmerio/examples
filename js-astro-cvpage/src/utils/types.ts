import { z } from 'astro:content';
import * as content from '../../schema/cv.ts';

export type Github = z.infer<typeof content.githubInfo>;
export type GoogleScholar = z.infer<typeof content.googleScholarInfo>;
export type Email = z.infer<typeof content.emailInfo>;
export type Phone = z.infer<typeof content.phoneInfo>;
export type Info = z.infer<typeof content.InfoSchema>;
export type Markdown = z.infer<typeof content.markdownSchema>;
export type UnorderedListWithTime = z.infer<typeof content.unorderedListWithTimeSchema>;
export type UnorderedList = z.infer<typeof content.unorderedListSchema>;
export type Content = z.infer<typeof content.contentSchema>;
export type Contents = z.infer<typeof content.contentsSchema>;
export type CV = z.infer<typeof content.cvSchema>;

export interface BaseInfo {
    name: string;
    lang: string;
    info: Info[];
}