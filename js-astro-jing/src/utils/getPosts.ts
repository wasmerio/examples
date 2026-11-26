import { type CollectionEntry, getCollection } from "astro:content";
import getDescriptionFromBody from "@/utils/getDescription";

export type BlogPost = Omit<CollectionEntry<"blog">, "data"> & {
  data: Omit<CollectionEntry<"blog">["data"], "description"> & {
    description: string;
  };
};

const getDesc = (desc: string | undefined, body: string | undefined): string => {
  let output = "";
  if (desc) {
    output = desc;
  } else if (body) {
    output = getDescriptionFromBody(body);
  }
  return output.replace(/\s+/g, " ").trim();
};

const getBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await getCollection("blog");
  return posts
    .filter((post) => {
      if (import.meta.env.PROD && post.data.draft) return false;
      if (post.data.date > new Date()) return false;
      return true;
    })
    .map((post) => ({
      ...post,
      data: {
        ...post.data,
        description: getDesc(post.data.description, post.body),
      },
    }))
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.updated ?? b.data.date).getTime()) -
        Math.floor(new Date(a.data.updated ?? a.data.date).getTime()),
    );
};

export default getBlogPosts;
