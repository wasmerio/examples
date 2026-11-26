import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

const images = [
	{
		url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=85',
		out: 'public/sample/home-hero.jpg',
		w: 1200,
	},
	{
		url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
		out: 'public/sample/about-hero.jpg',
		w: 1200,
	},
	{
		url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/illustration-01.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/illustration-02.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/life-01.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/life-02.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/view-01.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=85',
		out: 'src/assets/sample/gallery/view-02.jpg',
		w: 1600,
	},
	{
		url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400',
		out: 'src/assets/sample/portraits/focus-01.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400',
		out: 'src/assets/sample/portraits/focus-02.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400',
		out: 'src/assets/sample/portraits/focus-03.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400',
		out: 'public/sample/friends/alex.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400',
		out: 'public/sample/friends/lin.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400',
		out: 'public/sample/friends/mika.jpg',
		w: 400,
		h: 400,
	},
	{
		url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400',
		out: 'public/sample/friends/noa.jpg',
		w: 400,
		h: 400,
	},
];

for (const img of images) {
	await mkdir(dirname(img.out), { recursive: true });
	const res = await fetch(img.url);
	if (!res.ok) throw new Error(`Failed ${img.url}: ${res.status}`);
	const buf = Buffer.from(await res.arrayBuffer());
	let pipeline = sharp(buf);
	if (img.h) {
		pipeline = pipeline.resize(img.w, img.h, { fit: 'cover', position: 'centre' });
	} else {
		pipeline = pipeline.resize(img.w, null, { withoutEnlargement: false });
	}
	await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(img.out);
	console.log('saved', img.out);
}
