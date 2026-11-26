import { getImage } from "astro:assets";
import avatar from "../assets/avatar.jpg";

export type Avatar = { src: string; srcset: string };

// Replace src/assets/avatar.jpg to change the avatar everywhere.
export async function getAvatar(size: number): Promise<Avatar> {
  const [normal, retina] = await Promise.all(
    [1, 2].map((density) =>
      getImage({
        src: avatar,
        width: size * density,
        height: size * density,
        format: "webp",
      }),
    ),
  );
  return { src: normal.src, srcset: `${normal.src} 1x, ${retina.src} 2x` };
}

// JPEG keeps the social preview compatible with every platform.
export async function getShareImage() {
  const image = await getImage({ src: avatar, width: 460, format: "jpg" });
  return image.src;
}
