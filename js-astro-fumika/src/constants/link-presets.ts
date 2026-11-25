import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export function getLinkPresets(lang?: string): Record<LinkPreset, NavBarLink> {
	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, lang),
			url: "/",
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, lang),
			url: "/about/",
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, lang),
			url: "/archive/",
		},
		[LinkPreset.Friends]: {
			name: i18n(I18nKey.friends, lang),
			url: "/friends/",
		},
	};
}
