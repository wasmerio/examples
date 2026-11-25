/**
 * Creates a URL by combining pathname and search params
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams,
): string => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

/**
 * Ensures a string starts with a specified prefix
 */
export const ensureStartsWith = (
  stringToCheck: string,
  startsWith: string,
): string =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

/**
 * Validates required environment variables for Shopify integration
 */
export const validateEnvironmentVariables = (): void => {
  const requiredEnvironmentVariables = [
    "PUBLIC_SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables: string[] = [];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://docs.astro.build/en/guides/environment-variables/\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }

  if (
    import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN?.includes("[") ||
    import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `PUBLIC_SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};
