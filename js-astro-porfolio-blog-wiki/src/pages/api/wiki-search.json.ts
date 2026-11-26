import { getCollection } from 'astro:content';
import { searchWikiTerms, wikiUrl } from '../../utils/wiki';
export async function GET({ url }: { url: URL }) {
  const terms = await getCollection('wiki');
  const results = searchWikiTerms(terms, url.searchParams.get('q') ?? '');
  return new Response(JSON.stringify(results.map((term) => ({ title: term.data.title, description: term.data.shortDefinition, category: term.data.category, aliases: term.data.aliases, slug: term.id, url: wikiUrl(term.id) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
