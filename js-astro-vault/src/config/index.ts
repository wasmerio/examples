import { SITE_CONF as userConfig } from "./siteConfig";
import { SITE_CONF as demoConfig } from "./site.demo.config";

const isDemo = import.meta.env.PUBLIC_IS_DEMO === "true";

export const SITE_CONF = isDemo ? demoConfig : userConfig;