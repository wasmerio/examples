import type { APIRoute } from "astro";
import { books, getAllChapters } from "../../data/books";

export const GET: APIRoute = () => {
  const entries = books.flatMap((book) =>
    [
      {
        type: "book",
        title: book.title,
        author: book.author,
        url: `/${book.slug}`,
        category: book.category,
      },
      ...getAllChapters(book).map((ch) => ({
        type: "chapter",
        title: `${ch.number}. ${ch.title}`,
        author: book.title,
        url: `/${book.slug}/${ch.slug}`,
        category: book.category,
      })),
    ]
  );

  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
};
