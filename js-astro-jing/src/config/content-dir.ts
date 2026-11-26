import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

const DEFAULT_CONTENT_DIR = "./src/content";
export const CONTENT_DIR = env.CONTENT_DIR || process.env.CONTENT_DIR || DEFAULT_CONTENT_DIR;
