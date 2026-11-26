import { readFile } from 'node:fs/promises';
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
import { getNotes } from '@/lib/notes';

const font = await readFile('public/fonts/IBMPlexMono-Regular.woff2');

export const getStaticPaths = (async () => {
  const notes = await getNotes();
  return [
    { params: { slug: 'index' }, props: { title: SITE_DESCRIPTION } },
    { params: { slug: 'notes' }, props: { title: 'Notes' } },
    ...notes.map((note) => ({
      params: { slug: note.id },
      props: { title: note.data.title },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: 80,
          background: '#0a2675',
          color: '#ddd8cc',
          fontFamily: 'IBM Plex Mono',
        },
        children: [
          { type: 'div', props: { style: { fontSize: 64, lineHeight: 1.25 }, children: props.title } },
          { type: 'div', props: { style: { fontSize: 28, color: '#aaa597' }, children: SITE_TITLE } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'IBM Plex Mono', data: font }] },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
