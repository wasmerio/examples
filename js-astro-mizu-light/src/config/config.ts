// Config
// ------------
// Description: The configuration file for the website.

export interface Logo {
	src: string
	srcDark: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface Config {
	siteTitle: string
	siteDescription: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
}

export const configData: Config = {
	siteTitle:
		'Mizu Light Astro Theme | Modern SaaS & Startup Landing Page Template for Fast Product Launches by Oxygenna',
	siteDescription:
		'Launch your next big idea with Mizu Light — a sleek, responsive Astro theme built for SaaS startups and tech companies. Streamline onboarding, showcase features beautifully, and convert visitors into users faster.',
	ogImage: '/og.jpg',
	logo: {
		src: '/logo-light.svg',
		srcDark: '/logo-dark.svg',
		alt: 'Mizu Light logo'
	},
	canonical: true,
	noindex: false,
	mode: 'auto',
	scrollAnimations: true
}
