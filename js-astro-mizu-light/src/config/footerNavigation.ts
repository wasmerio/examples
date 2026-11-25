// Footer Navigation
// ------------
// Description: The footer navigation data for the website.

export interface Logo {
	src: string
	srcDark: string
	alt?: string
}

export interface FooterAbout {
	aboutText: string
}

export interface FooterLink {
	label: string
	href: string
}

export interface FooterColumn {
	title: string
	links: FooterLink[]
}

export interface Copyright {
	text: string
	legal: FooterLink[] // e.g. Terms, Privacy, Cookies
}

export interface FooterData {
	logo?: Logo
	footerAbout: FooterAbout
	footerColumns: FooterColumn[]
	copyright: Copyright
}

export async function getFooterNavigationData(): Promise<FooterData> {
	const { default: data } = await import('../data/json-files/footerNavigationData.json')
	return data as FooterData
}
