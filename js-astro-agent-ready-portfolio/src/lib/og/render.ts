// Build-time only: renders a 1200x630 social card with satori and the native resvg
// binding. Imported dynamically from the og.png endpoints.

// `cover` is a finished 1200x630 JPEG under content/public/ (for example /images/blog/x.jpg)
// with the title already on it. With one, the card is that image and nothing else.
export type OgCard = { title: string; eyebrow: string; footer: string; cover?: string };

const fontDir = "node_modules/@fontsource/inter/files";

let fonts: Promise<
  { name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" }[]
> | null = null;

const loadFonts = () =>
  (fonts ??= (async () => {
    const { readFile } = await import("node:fs/promises");
    return Promise.all(
      ([400, 600, 700] as const).map(async (weight) => ({
        name: "Inter",
        data: await readFile(`${fontDir}/inter-latin-${weight}-normal.woff`),
        weight,
        style: "normal" as const,
      })),
    );
  })());

const box = (style: Record<string, string | number>, children: unknown) => ({
  type: "div",
  props: { style: { display: "flex", flexDirection: "column", ...style }, children },
});

const coverUri = async (cover: string) => {
  const { readFile } = await import("node:fs/promises");
  const data = await readFile(`content/public${cover}`);
  return `url(data:image/jpeg;base64,${data.toString("base64")})`;
};

export async function renderOgPng({ title, eyebrow, footer, cover }: OgCard) {
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");

  const fontSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;
  const background = cover
    ? `${await coverUri(cover)} 0 0 / cover`
    : "radial-gradient(circle at 15% 0%, #1f1f23 0%, #09090b 55%, #000000 100%)";

  const tree = box(
    {
      width: 1200,
      height: 630,
      boxSizing: "border-box",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 72,
      color: "#fafafa",
      fontFamily: "Inter",
      background,
    },
    cover ? [] : [
      box(
        {
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#a1a1aa",
        },
        eyebrow,
      ),
      box(
        {
          fontSize,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -2,
        },
        title,
      ),
      box(
        {
          fontSize: 28,
          color: "#a1a1aa",
          borderTop: "2px solid #27272a",
          paddingTop: 28,
        },
        footer,
      ),
    ],
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: await loadFonts(),
  });
  return new Resvg(svg).render().asPng();
}
