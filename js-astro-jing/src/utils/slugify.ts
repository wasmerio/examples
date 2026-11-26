import kebabcase from "lodash.kebabcase";

export const slugifyStr = (str: string): string => kebabcase(str);
