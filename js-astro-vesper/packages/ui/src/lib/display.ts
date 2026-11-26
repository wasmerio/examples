// Display type: the one class string for headings and other display text. display-face and heading-face
// (theme.css) read every display token, so a preset can change weight, tracking, width and case.

/** Display family, weight, tracking, stretch and case, with the phone stretch cap. */
export const displayType = "display-face";

/** The same face for small headings, at --ui-heading-weight when a preset sets it, else the display weight. */
export const headingType = "heading-face";

/**
 * A Stats value: the stat role (sized to the nearest container), figures of one width so a row of numbers lines up,
 * in display type.
 */
export const statType = `text-stat tabular-nums ${displayType}`;

/** A Steps number: the step role (sized to its step), figures of one width, in display type. */
export const stepType = `text-step tabular-nums ${displayType}`;

/** A plan's price (Pro's PricingPlan): the price role (sized to its plan), figures of one width, in display type. */
export const priceType = `text-price tabular-nums ${displayType}`;

/**
 * A listing's price (ListingCard and its recipes, Pro's MapCard): one flat size at every card width, in the body face,
 * so a wider card never makes a louder price. Not the plan's price above, which grows with its plan.
 */
export const listingPriceType = "text-listing-price font-body font-medium tabular-nums";
