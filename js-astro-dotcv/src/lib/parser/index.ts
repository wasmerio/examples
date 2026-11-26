import { readdir } from "node:fs/promises";
import path from "node:path";

import { parseJson } from "./jsonParser";

export async function loadData(directory: string = process.cwd()) {
    const files = await readdir(directory);

    let dataFile = files.find((file) => {
        const ext = path.extname(file);
        const name = path.basename(file, ext);

        return name === "cv" || name === "data";
    });

    if (!dataFile) {
        dataFile = files.find((file) => {
            return (
                file.startsWith("cv.example.") ||
                file.startsWith("data.example.")
            );
        });
    }

    if (!dataFile) {
        throw new Error(
            "Keine cv.* oder cv.example.* Datei im Verzeichnis gefunden."
        );
    }

    const extension = path.extname(dataFile).toLowerCase();

    const filePath = path.join(directory, dataFile);

    switch (extension) {
        case ".json":
            return parseJson(filePath);
        default:
            throw new Error(
                `Nicht unterstütztes Dateiformat: ${extension}`
            );
    }
}