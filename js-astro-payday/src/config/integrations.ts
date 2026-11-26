export interface Integration {
  /** A file name in `src/assets/integrations`, without `.svg`. */
  icon: string;
  name: string;
  /** The mark's colour on a white tile. */
  color: string;
}

/** Marks come from Simple Icons (CC0). Each brand belongs to its owner. */
export const integrations: Integration[] = [
  { icon: "quickbooks", name: "QuickBooks", color: "#2ca01c" },
  { icon: "xero", name: "Xero", color: "#13b5ea" },
  { icon: "slack", name: "Slack", color: "#4a154b" },
  { icon: "okta", name: "Okta", color: "#007dc1" },
];

export const integration = (icon: string) => integrations.find((item) => item.icon === icon);
