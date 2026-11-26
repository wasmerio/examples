export type GraphNode = {
    id: string;
    title: string;
    href: string;
    radius?: number;
    fill?: string;
    shape?: "circle" | "square";
};
export type GraphLink = {
    source: string;
    target: string;
};
