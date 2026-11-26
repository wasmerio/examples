/** The disciplines a project can be tagged with. They drive the filters on the work index. */
export const disciplines = {
  identity: { label: "Brand identity" },
  digital: { label: "Digital" },
  packaging: { label: "Packaging" },
  campaign: { label: "Campaign" },
  spatial: { label: "Spatial" },
} as const;

export type Discipline = keyof typeof disciplines;
export const disciplineKeys = Object.keys(disciplines) as [Discipline, ...Discipline[]];
