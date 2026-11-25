import SFProRoundedBold from "@/assets/fonts/SF-Pro-Rounded-Bold.latin.base.ttf";
import SFProRoundedSemibold from "@/assets/fonts/SF-Pro-Rounded-Semibold.latin.base.ttf";
import SFProRoundedMedium from "@/assets/fonts/SF-Pro-Rounded-Medium.latin.base.ttf";
import SFProRoundedRegular from "@/assets/fonts/SF-Pro-Rounded-Regular.latin.base.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: Buffer.from(SFProRoundedRegular),
      name: "SF Pro Rounded",
      style: "normal",
      weight: 400,
    },
	
    {
      data: Buffer.from(SFProRoundedMedium),
      name: "SF Pro Rounded",
      style: "normal",
      weight: 500,
    },
    {
      data: Buffer.from(SFProRoundedSemibold),
      name: "SF Pro Rounded",
      style: "normal",
      weight: 600,
    },
    {
      data: Buffer.from(SFProRoundedBold),
      name: "SF Pro Rounded",
      style: "normal",
      weight: 700,
    },
  ],
  height: 630,
  width: 1200,
};

const markup = (title: string, pubDate: string) =>
  html` <div tw="flex flex-col w-full h-full bg-[#f2f2f2] text-[#6b6b6b]">
    <div tw="flex flex-col flex-1 w-full p-10 justify-center">
      <p tw="text-3xl mb-6 text-[#8e8e8e] font-medium">${pubDate}</p>
      <h1 tw="text-6xl font-semibold leading-snug text-[#224d67]">${title}</h1>
    </div>
    <div
      tw="flex items-end justify-between w-full p-10 border-t border-[#dbdbdb] text-3xl text-[#6b6b6b]"
    >
      <div tw="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          width="64"
          height="64"
        >
          <path
            fill="#224d67"
            d="M22.5 14.8c2.9 1.3 99 44 99 44c2.7 1.2 2.9 3.1 2 12.4c-1 10.5-1.9 37.8-40.2 42.9c-24.6 3.2-55.9-4.3-70.9-27.2C-6 58.8 11 23.4 14.8 17.7c2.4-3.5 4.8-4.2 7.7-2.9"
          />
          <path
            fill="#f0f4c3"
            d="M121.5 58.8c-.3-.2-92-40.8-98.9-43.9C9.6 31.5-3.8 76 27.9 96.2c33.6 21.5 78.7-10.2 93.6-37.4"
          />
          <path
            fill="#f0f4c3"
            d="M117.7 57c-.3-.2-86.7-38.4-93.2-41.3c-12.2 15.5-23.9 59.1 5.7 78c31.4 20.2 73.6-11.2 87.5-36.7"
          />
          <path
            fill="#cb2a42"
            d="M56.2 37.6L19.5 48.2c-2.5.8-4.4 2.8-5 5.3c-1.9 8.5.8 23.3 8.9 29.8c3.5 2.7 8.6 1.8 10.8-2.1L58.5 41c1.3-1.7.5-4.2-2.3-3.4m14.3 2.9s14.6 30.1 16 33s6.3 4.7 9.9 2.8c10.7-5.6 15.5-12.4 19.2-20.2c-8.9-3.9-42.4-18.8-42.4-18.8c-2.4-1.1-4 .6-2.7 3.2m-8.6 1.9C60.3 45.1 39.5 81 37.6 84.1c-1.9 3.2-.7 7.5 2.7 9.2c12.3 6.5 30.9.4 39.6-7c2.2-1.9 4.5-5.1 3.2-8.2S68.9 44.6 67.8 42.3c-1.2-2.7-4.1-2.8-5.9.1"
          />
          <path
            fill="#f0f4c3"
            d="M52.2 42.2c-1.4.4-10.1 3-11.1 3.4c-1.4.5-2.2 1.7-1.9 2.5c.3.9 1.7 1.1 3.1.6c.8-.3 7.1-3.9 9.5-5.2c-3.1 2.4-10.2 9.4-11.1 10.3c-1.4 1.5-1.7 3.4-.8 4.3c1 .9 2.9.5 4.3-1c1.2-1.3 8.5-12.8 9.1-13.9s.4-1.4-1.1-1m10.1 16.4c0-2.2 1.4-10.3 1.8-12.3c.4-1.6 1.5-1.8 1.8.5s1.7 9.7 1.7 11.8s-1.2 3.3-2.7 3.3c-1.4 0-2.6-1.1-2.6-3.3M79.9 49c-1.2-1.8-3.3-4.9-4.1-6.1c-.7-1.2.1-2.1 1.8-.9s4 2.9 5.4 4c1.6 1.3 1.9 3 .8 4s-2.7.8-3.9-1"
          />
          <ellipse
            cx="87.3"
            cy="103.12"
            fill="#cb2a42"
            rx="3.4"
            ry="2.3"
            transform="rotate(-27.098 87.298 103.126)"
          />
          <ellipse
            cx="98.89"
            cy="103.82"
            fill="#cb2a42"
            rx="3.4"
            ry="2.3"
            transform="rotate(-30.642 98.887 103.818)"
          />
          <ellipse
            cx="102.02"
            cy="93.8"
            fill="#cb2a42"
            rx="3.4"
            ry="2.3"
            transform="rotate(-37.16 102.017 93.797)"
          />
          <path
            fill="#cb2a42"
            d="M57.6 30.3c-8.3-3.7-24.4-10.7-29.6-13c-3.6 2.2-9.7 11.4-11.2 21.2c-.6 3.6 1.7 5.9 5.3 4.9c0 0 33.7-9.3 35.3-9.7c1.6-.5 2-2.6.2-3.4"
          />
        </svg>
        <p tw="ml-3 text-5xl text-[#545454] font-bold">${siteConfig.title}</p>
      </div>
      <p tw="text-3xl text-[#8e8e8e]">by ${siteConfig.author}</p>
    </div>
  </div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { pubDate, title } = context.props as Props;
  const postDate = getFormattedDate(pubDate, {
    month: "long",
    weekday: "long",
  });
  const svg = await satori(markup(title, postDate), ogOptions);

  // Проверяем, запрашивает ли пользователь PNG
  if (context.url.pathname.endsWith(".png")) {
    const png = new Resvg(svg).render().asPng();
    return new Response(png, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/png",
      },
    });
  }

  // Проверяем, запрашивает ли пользователь SVG
  if (context.url.pathname.endsWith(".svg")) {
    return new Response(svg, {
      headers: {
        "Cache-Control": "public, max-age=31536000",
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    });
  }

  // Если запрос не заканчивается на .png или .svg, возвращаем ошибку
  return new Response("Unsupported format", { status: 400 });
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .flatMap((post) => {
      return [
        {
          params: { slug: post.id, ext: "png" },
          props: {
            pubDate: post.data.updatedDate ?? post.data.publishDate,
            title: post.data.title,
          },
        },
        {
          params: { slug: post.id, ext: "svg" },
          props: {
            pubDate: post.data.updatedDate ?? post.data.publishDate,
            title: post.data.title,
          },
        },
      ];
    });
}
