import type { APIRoute } from 'astro';
import { feed } from '../../../lib/feed';
import { languagePaths, type Lang } from '../../../i18n';
export const getStaticPaths = languagePaths;
export const GET: APIRoute = ({ params, site }) => feed(params.lang as Lang, site, 'seriesPosts');
