// Navigation Bar
// ------------
// Description: The navigation bar data for the website.

export interface Logo {
	src: string
	srcDark: string
	alt: string
	text: string
}

export interface NavSubItem {
	name?: string
	icon?: string
	link: string
}

export interface NavItem {
	name: string
	link: string
	submenu?: NavSubItem[]
	align?: string
}

export interface NavAction {
	name: string
	link?: string
}

export interface NavData {
	logo: Logo
	navItems: NavItem[]
	navActions: NavAction[]
}

export async function getNavigationBarData() {
	const { default: data } = await import('../data/json-files/navigationBarData.json')
	return data as NavData
}
