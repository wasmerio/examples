import { readFile } from "node:fs/promises";
import path from "node:path";
import { dotcvConfigSchema, type DotcvConfig } from "../configSchema";

const CONFIG_FILENAME = "dotcv.config.json";

export async function loadConfig(directory: string = process.cwd()): Promise<DotcvConfig> {
  const filePath = path.join(directory, CONFIG_FILENAME);

  try {
    const content = await readFile(filePath, "utf-8");
    const json = JSON.parse(content);
    const result = dotcvConfigSchema.safeParse(json);

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      throw new Error(`Error in ${CONFIG_FILENAME}: ${messages}`);
    }

    return result.data;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Return default config if configuration file is not found
      return dotcvConfigSchema.parse({});
    }
    throw error;
  }
}
