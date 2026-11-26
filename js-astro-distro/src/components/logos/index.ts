import { fetchLogo } from "@/lib/fastfetch";
import { systems } from "@/lib/themes";

const resolvedSystems = async () =>
	await Promise.all(
		systems.map(async (distro) => {
			const logo = await fetchLogo(distro.slug);
			return { ...distro, logo };
		}),
	);

export default await resolvedSystems();
