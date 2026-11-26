import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getPostSlug } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";
import { renderOgImage } from "@/utils/og/renderOg";
import { resolveTimezone } from "@/utils/resolveTimezone";
import config from "@/config";
import { useTranslations } from "@/i18n";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(post => postFilter(post) && !post.data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const t = useTranslations(config.site.lang);
  const zone = resolveTimezone(props.data.timezone ?? config.site.timezone);

  return renderOgImage({
    typeLabel: t.content.typePost,
    title: props.data.title,
    date: dayjs(props.data.pubDatetime).tz(zone).format("D MMM, YYYY"),
  });
};
