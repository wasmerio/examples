import { readFile } from "node:fs/promises";
import {cvSchema} from "../cvSchema.ts";

export async function parseJson(filePath: string) {
    const content = await readFile(filePath, "utf-8");
    const result = cvSchema.safeParse(JSON.parse(content));

    if (!result.success) {
        throw new Error(result.error.issues.map(i => i.message).join(", "));
    }
    console.log(result.data);
    console.log(typeof result.data)
    return result.data;
}