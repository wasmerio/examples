import { createContext } from "react";
import type { TemplateConfig } from "./configType";

export const ConfigContext = createContext<TemplateConfig | null>(null);
