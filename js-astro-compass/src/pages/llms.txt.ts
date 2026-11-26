import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { docsParentCategories } from '../config/docs';
import { siteConfig } from '../config/site';
import { getCategoriesForParent, getDocHref, getOrderedDocsForCategory, getPublicDocs } from '../lib/docs';

export const GET: APIRoute = async () => {
  const docs = getPublicDocs(await getCollection('docs')).filter((doc) => !doc.data.hideFromSearch);
  const lines = [`# ${siteConfig.name}`, '', `> ${siteConfig.description}`, ''];

  docsParentCategories.forEach((parent) => {
    getCategoriesForParent(parent.slug).forEach((category) => {
      const entries = getOrderedDocsForCategory(docs, category.slug);
      if (entries.length === 0) return;

      lines.push(`## ${parent.name}: ${category.name}`, '');
      entries.forEach((doc) => {
        const url = new URL(getDocHref(doc), siteConfig.siteUrl).toString();
        lines.push(`- [${doc.data.title}](${url})${doc.data.description ? `: ${doc.data.description}` : ''}`);
      });
      lines.push('');
    });
  });

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
