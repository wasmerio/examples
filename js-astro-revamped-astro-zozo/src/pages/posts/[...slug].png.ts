import type { APIContext } from 'astro';
import {
	findPostByRouteSlug,
	getPostRouteSlug,
	getPosts,
} from '~/utils/collection';
import { postOpenGraph } from '~/utils/openGraphImage';

export async function getStaticPaths() {
	return (await getPosts()).map((post) => ({
		params: { slug: getPostRouteSlug(post) },
	}));
}

export const GET = async ({ params }: APIContext) => {
	const post = params.slug ? await findPostByRouteSlug(params.slug) : undefined;
	return new Response(
		await postOpenGraph({
			title: post?.data.title ?? '',
			description: post?.data.description,
			tags: post?.data.tags,
		}),
		{
			headers: { 'content-type': 'image/png' },
		},
	);
};
