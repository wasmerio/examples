import type { CollectionEntry } from 'astro:content';
import { siteConfig } from '../../config/site';
import { localizedEntryPath } from './entries';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderRss(posts: Array<CollectionEntry<'posts'>>, origin: string, basePath = '/') {
  const siteUrl = origin.replace(/\/$/, '');
  const channelUrl = `${siteUrl}${basePath}`;

  const items = posts
    .map((entry) => {
      const url = `${siteUrl}${localizedEntryPath('posts', entry as any)}`;
      const date = entry.data.date.toUTCString();
      return [
        '<item>',
        `<title>${escapeXml(entry.data.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        `<pubDate>${escapeXml(date)}</pubDate>`,
        `<description>${escapeXml(entry.data.description || '')}</description>`,
        '</item>'
      ].join('');
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml(siteConfig.name)}</title>`,
    `<link>${escapeXml(channelUrl)}</link>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    items,
    '</channel>',
    '</rss>'
  ].join('');
}
