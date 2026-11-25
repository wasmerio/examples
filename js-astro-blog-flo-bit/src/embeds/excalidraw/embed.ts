import type { EmbedsOption } from "astro-custom-embeds";
import ExcalidrawMatcher from "./matcher";

const ExcalidrawEmbed: EmbedsOption = {
  componentName: "Excalidraw",
  urlArgument: "src",
  urlMatcher: ExcalidrawMatcher,
  directiveName: "excalidraw",
  importPath: "src/embeds",
};

export default ExcalidrawEmbed;
