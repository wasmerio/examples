/* @jsxRuntime automatic */
/** @jsxImportSource react */

import fs from 'node:fs';
import satori, { type SatoriOptions } from 'satori';
import sharp from 'sharp';
import {
	FooterDescription,
	OpenGraphConfig,
	Site,
	SiteDescription,
	SiteTitle,
} from '~/config';

const font = async () => fs.promises.readFile(OpenGraphConfig.fontPath);

const options: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{
			name: OpenGraphConfig.fontFamily,
			data: await font(),
		},
	],
	tailwindConfig: {
		theme: {
			fontFamily: {
				sans: [`"${OpenGraphConfig.fontFamily}"`],
				serif: [`"${OpenGraphConfig.fontFamily}"`],
				mono: ['Menlo', 'Consolas'],
			},
		},
	},
	loadAdditionalAsset: async (languageCode, segment) => {
		if (languageCode === 'emoji') {
			try {
				const response = await fetch(
					`https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${segment}_color.svg`,
				);
				if (!response.ok) {
					return segment;
				}
				return `data:image/png;base64,${(
					await sharp(await response.arrayBuffer()).png().toBuffer()
				).toString('base64')}`;
			} catch {
				return segment;
			}
		}
		return segment;
	},
};

declare module 'react' {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		tw?: string;
	}
}

export async function siteOpenGraph() {
	const template = (
		<div
			tw="flex h-full w-full flex-col justify-between pb-4 pt-6"
			style={{ backgroundColor: OpenGraphConfig.background, color: OpenGraphConfig.text }}
		>
			<div
				tw="mx-auto flex w-[85%] grow flex-col px-6 py-5"
				style={{
					backgroundColor: OpenGraphConfig.surface,
					boxShadow: `0 0 20px 10px ${OpenGraphConfig.shadow}`,
				}}
			>
				<div tw="mt-2 grow flex flex-col justify-center px-4 text-center">
					<p tw="text-3xl font-semibold" style={{ color: OpenGraphConfig.muted }}>
						{SiteTitle}
					</p>
					<p tw="mt-7 text-5xl font-semibold" style={{ color: OpenGraphConfig.accent }}>
						{SiteDescription}
					</p>
				</div>
			</div>
			<div tw="mt-5 flex flex-col items-center text-xl">
				<div>{FooterDescription}</div>
				<div style={{ color: OpenGraphConfig.muted }}>{`Copyright ${new Date().getFullYear()} ${Site}`}</div>
			</div>
		</div>
	);
	return await sharp(Buffer.from(await satori(template, options))).png().toBuffer();
}

type Config = {
	title: string;
	description?: string;
	tags?: string[];
};

export async function postOpenGraph({ title, description, tags }: Config) {
	const template = (
		<div
			tw="flex h-full w-full flex-col justify-between pb-4 pt-6"
			style={{ backgroundColor: OpenGraphConfig.background, color: OpenGraphConfig.text }}
		>
			<div
				tw="mx-auto flex w-[85%] grow flex-col px-6 py-5"
				style={{
					backgroundColor: OpenGraphConfig.surface,
					boxShadow: `0 0 20px 10px ${OpenGraphConfig.shadow}`,
				}}
			>
				<div tw="mt-2 flex items-start justify-between" style={{ columnGap: 24 }}>
					<p tw="text-3xl font-semibold" style={{ color: OpenGraphConfig.text }}>
						{SiteTitle}
					</p>
					<p tw="text-right text-3xl" style={{ color: OpenGraphConfig.accent }}>
						{SiteDescription}
					</p>
				</div>
				<div tw="mt-8 grow flex flex-col pl-4">
					<p tw="text-6xl font-bold">{title}</p>
					{description && <p tw="mt-5 text-4xl font-bold">{description}</p>}
					<div tw="mt-6 flex" style={{ color: OpenGraphConfig.muted }}>
						{tags?.map((tag) => (
							<p tw="mr-4 text-xl" key={tag}>
								{tag}
							</p>
						))}
					</div>
				</div>
			</div>
			<div tw="mt-5 flex flex-col items-center text-xl">
				<div>{FooterDescription}</div>
				<div style={{ color: OpenGraphConfig.muted }}>{`Copyright ${new Date().getFullYear()} ${Site}`}</div>
			</div>
		</div>
	);
	return await sharp(Buffer.from(await satori(template, options))).png().toBuffer();
}
