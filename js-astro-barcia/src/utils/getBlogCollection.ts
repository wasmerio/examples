import { getCollection, type CollectionEntry } from "astro:content";

interface GetBlogCollection {
  drafts?: boolean;
  future?: boolean;
  sortByDate?: boolean;
  limit?: number | undefined;
}

const getBlogCollection = async ({
  drafts = false,
  future = false,
  sortByDate = true,
  limit = undefined,
}: GetBlogCollection = {}): Promise<CollectionEntry<"blog">[]> => {
  let blogCollection = await getCollection("blog");

  if (!drafts && import.meta.env.PROD) {
    blogCollection = blogCollection.filter((item) => !item.data.draft);
  }

  if (!future && import.meta.env.PROD) {
    blogCollection = blogCollection.filter(
      (item) => item.data.datePub <= new Date(),
    );
  }

  if (sortByDate) {
    blogCollection = blogCollection.sort((a, b) => {
      return b.data.datePub.getTime() - a.data.datePub.getTime();
    });
  }

  if (limit) {
    blogCollection = blogCollection.slice(0, limit);
  }

  return blogCollection;
};

export default getBlogCollection;
