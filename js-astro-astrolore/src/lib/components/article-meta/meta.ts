import type { ImageMetadata } from "astro";

export type MetaPropertyText = {
    type: "text";
    title: string;
    isDate?: boolean;
    value: string | string[] | undefined;
};
export type MetaPropertyImage = {
    type: "image";
    title: string;
    showTitle?: boolean;
    value: string | ImageMetadata | undefined;
};

export type MetaPropertyDate = {
    type: "date";
    title: string;
    value: string | { start: string; end: string } | undefined;
};

export type MetaProperty =
    | MetaPropertyText
    | MetaPropertyImage
    | MetaPropertyDate;
