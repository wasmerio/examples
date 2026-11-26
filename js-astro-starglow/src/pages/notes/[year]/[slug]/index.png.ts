import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getNoteParts } from "@/utils/content/entryIds";
import { formatNoteDate, getNoteDate } from "@/utils/content/notes";
import { isVisible } from "@/utils/content/visibility";
import { renderOgImage } from "@/utils/og/renderOg";
import config from "@/config";
import { useTranslations } from "@/i18n";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const notes = (await getCollection("notes")).filter(isVisible);
  return notes.map(note => ({
    params: getNoteParts(note.id),
    props: { note },
  }));
}

export const GET: APIRoute = ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const t = useTranslations(config.site.lang);
  const { note } = props;
  const { date, year } = getNoteDate(note);

  return renderOgImage({
    typeLabel: t.content.typeNote,
    title: note.data.title,
    // The date the note page shows: the effective date, else the folder year.
    date: date ? formatNoteDate(date).text : year,
  });
};
