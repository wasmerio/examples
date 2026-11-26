import type { APIRoute } from "astro";
import { getVisibleProjects } from "@/utils/content/projects";
import { renderOgImage } from "@/utils/og/renderOg";
import config from "@/config";
import { useTranslations } from "@/i18n";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const projects = await getVisibleProjects();
  return projects.map(project => ({
    params: { slug: project.id },
    props: { project },
  }));
}

export const GET: APIRoute = ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const t = useTranslations(config.site.lang);

  // A project has no single date, so the image shows none.
  return renderOgImage({
    typeLabel: t.content.typeProject,
    title: props.project.data.title,
  });
};
