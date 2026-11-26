import { createHash } from "node:crypto";

const TEXT = /\.(ts|md|json|svg|astro)$/;

/** sha256 of a file. Text files are hashed with LF line endings so Windows checkouts match. */
export const fingerprint = (path: string, data: Buffer) =>
  createHash("sha256")
    .update(TEXT.test(path) ? Buffer.from(data.toString("utf8").replace(/\r\n/g, "\n")) : data)
    .digest("hex");
