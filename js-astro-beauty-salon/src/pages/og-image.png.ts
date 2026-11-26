// src/pages/og-image.png.ts
import { ImageResponse } from '@vercel/og';

export const prerender = false; // Importante para que se genere al momento

export async function GET() {
  // 1. Cargamos la fuente Playfair Display desde Google Fonts
  // Usamos la versión Bold (700) para el título
  const fontData = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  // 2. Definimos el diseño HTML/CSS (Objeto tipo React/Satori)
  const html = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFBF0', // Tu Crema
        fontFamily: '"Playfair Display"',
      },
      children: [
        // Tarjeta blanca central
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: '40px 80px',
              borderRadius: '20px',
              border: '4px solid #FBCFE8', // Borde rosa suave
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.1)',
            },
            children: [
              // Icono Tijeras
              {
                type: 'svg',
                props: {
                  width: '64',
                  height: '64',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: '#EC4899', // Pink-500
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  style: { marginBottom: '20px' },
                  children: [
                    { type: 'circle', props: { cx: '6', cy: '6', r: '3' } },
                    { type: 'circle', props: { cx: '6', cy: '18', r: '3' } },
                    {
                      type: 'line',
                      props: { x1: '20', y1: '4', x2: '8.12', y2: '15.88' },
                    },
                    {
                      type: 'line',
                      props: { x1: '14.47', y1: '14.48', x2: '20', y2: '20' },
                    },
                    {
                      type: 'line',
                      props: { x1: '8.12', y1: '8.12', x2: '12', y2: '12' },
                    },
                  ],
                },
              },
              // Título
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '70px',
                    color: '#1E293B', // Navy
                    fontWeight: 700, // Bold
                    lineHeight: 1,
                    textAlign: 'center',
                    marginBottom: '10px',
                  },
                  children: 'Beauty Salon Template',
                },
              },
              // Subtítulo / Firma
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '30px',
                    color: '#B45309', // Dorado Oscuro
                    fontStyle: 'italic',
                    marginBottom: '30px',
                  },
                  children: 'By Norma Adams',
                },
              },
              // Badge "Hair & Beauty"
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 25px',
                    backgroundColor: '#FDF2F8',
                    borderRadius: '50px',
                    border: '1px solid #FBCFE8',
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: '#EC4899',
                          fontWeight: 700, // Usamos bold simulado
                          letterSpacing: '3px',
                          textTransform: 'uppercase',
                        },
                        children: 'Hair & Beauty Studio',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ImageResponse(html as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Playfair Display',
        data: fontData,
        style: 'normal',
        weight: 700,
      },
    ],
  });
}
