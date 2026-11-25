import { getCollection } from "astro:content";

const authorsCollection = await getCollection("authors");

export const authorsHandler = {
  allAuthors: () => authorsCollection,
  limitAurhors: (limit: number) => authorsCollection.slice(0, limit),
  getAuthors: (authors: { collection: string; id: string }[]) => {
    return authors.map(({ id }) => {
      const author = authorsCollection.find((author) => author.id === id);
      if (!author) {
        throw new Error(`Author ${id} not found`);
      }
      return author;
    });
  },
  findAuthor: (id: string) => {
    const author = authorsCollection.find((author) => author.id === id);
    if (!author) {
      throw new Error(`Author ${id} not found`);
    }
    return author;
  },
};
