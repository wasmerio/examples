import { concatRelativeUrls } from "@/utils";

const getSectionFromURL = (url: URL): string => {
  const pathname = url.pathname;
  const currentPath = pathname.split("/").filter((path) => path !== "");
  const currentSection = concatRelativeUrls("/", currentPath[0]);

  return currentSection;
};

export default getSectionFromURL;
