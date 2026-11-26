import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { sortChapters, toChapterUrl } from "@/lib/novel";

export async function GET(context: { site: URL | undefined }) {
  const chapters = (await getCollection("novel")).sort(sortChapters);

  return rss({
    title: "Novel Project RSS",
    description: "Chapter updates for Novel Project",
    site: context.site ?? new URL("https://example.com"),
    items: chapters.map((chapter) => ({
      title: chapter.data.title,
      description: chapter.data.summary ?? "",
      pubDate: chapter.data.date,
      link: toChapterUrl(chapter),
    })),
  });
}
