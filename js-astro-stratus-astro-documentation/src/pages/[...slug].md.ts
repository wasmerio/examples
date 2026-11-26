// A root page is skipped: its empty slug would emit a file called `.md`.
import { docsMarkdown } from "@utils/docsMarkdown";
import { docHref } from "@utils/docsNav";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const docs = await getCollection("docs");

  return docs
    .map((doc: CollectionEntry<"docs">) => ({
      params: { slug: doc.id.replace(/\/?index$/, "") },
      props: { doc },
    }))
    .filter((path) => path.params.slug);
}

export const GET: APIRoute = ({ props, site }) => {
  const doc = props.doc as CollectionEntry<"docs">;
  const url = site ? new URL(docHref(doc.id), site).href : undefined;

  const markdown = docsMarkdown({
    title: doc.data.title,
    description: doc.data.description,
    body: doc.body,
    url,
  });

  // Only the dev server honors this; a static host picks its own type for `.md`.
  return new Response(markdown, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
