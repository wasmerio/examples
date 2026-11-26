import { Socials } from '~/config';
import { socialConfig, socialOrder } from '~/data/socials';

export interface EnabledSocialLink {
	platform: string;
	url: string;
	icon: string;
	label: string;
}

export const getEnabledSocialLinks = (): EnabledSocialLink[] =>
	socialOrder.flatMap((platform: (typeof socialOrder)[number]) => {
		const social = Socials[platform];
		const config = socialConfig[platform];
		if (!social?.url || !config?.icon) {
			return [];
		}

		return [
			{
				platform,
				url: social.url,
				icon: config.icon,
				label: config.label ?? platform,
			},
		];
	});
