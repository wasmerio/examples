import { cvSchema } from "../schema/cv";
import { zodToJsonSchema } from "zod-to-json-schema";

console.log(JSON.stringify(zodToJsonSchema(cvSchema, "cv"), null, 2));