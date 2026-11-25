import rss from '@astrojs/rss';
import { getPublishedWriting, writingPath } from '../lib/content';
import { site } from '../data/site';
const entries=await getPublishedWriting();
export const GET=()=>rss({title:site.title,description:site.description,site:site.url,items:entries.map((entry)=>({title:entry.data.title,description:entry.data.description,pubDate:entry.data.publishedAt,link:writingPath(entry)}))});
