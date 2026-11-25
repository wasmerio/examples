import { render, type CollectionEntry } from "astro:content";
import { authorsHandler } from "@/lib/handlers/authors";
import { SITE } from "@/lib/config";
import defaultImage from "@/assets/images/default-image.jpg";
import type { ArticleMeta, Meta } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils/letter";
import { normalizeDate } from "@/lib/utils/date";

type GetMetaCollection = CollectionEntry<"articles" | "views">;

const renderCache = new Map<string, any>();

export const getMeta = async (
  collection: GetMetaCollection,
  category?: string
): Promise<Meta | ArticleMeta> => {
  try {
    const collectionId = `${collection.collection}-${collection.id}`;

    if (collection.collection === "articles") {

      if (renderCache.has(collectionId)) {
        return renderCache.get(collectionId);
      }

      const { remarkPluginFrontmatter } = await render(collection);
      const authors = authorsHandler.getAuthors(collection.data.authors);

      const meta: ArticleMeta = {
        title: `${capitalizeFirstLetter(collection.data.title)} - ${SITE.title}`,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: collection.data.cover.src,
        ogImageAlt: collection.data.covert_alt || collection.data.title,
        publishedTime: normalizeDate(collection.data.publishedTime),
        lastModified: remarkPluginFrontmatter.lastModified,
        authors: authors.map((author) => ({
          name: author.data.name,
          link: `${author.id}`,
        })),
        type: "article",
      }

      renderCache.set(collectionId, meta);

      return meta;
    }

    if (collection.collection === "views") {

      const cacheKey = category ? `${collectionId}-${category}` : collectionId;
      if (renderCache.has(cacheKey)) {
        return renderCache.get(cacheKey);
      }

      const title = collection.id === "categories" && category
        ? `${capitalizeFirstLetter(category)} - ${SITE.title}`
        : collection.id === "home"
          ? SITE.title
          : `${capitalizeFirstLetter(collection.data.title)} - ${SITE.title}`;

      const meta: Meta = {
        title,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: defaultImage.src,
        ogImageAlt: SITE.title,
        type: "website",
      };
      renderCache.set(cacheKey, meta);
      return meta;
    }

    throw new Error(`Invalid collection type: ${(collection as GetMetaCollection).collection}`);
  } catch (error) {
    console.error(`Error generating metadata for ${collection.id}:`, error);
    throw error;
  }
};
