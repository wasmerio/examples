import { discoverTools } from "./lib/tools.ts";

async function listTools() {
    const tools = await discoverTools();
    console.log(`Rise of Machine MCP Server — ${tools.length} tools\n`);
    for (const tool of tools) {
        const def = tool.definition.function;
        console.log(def.name);
        if (def.description) console.log(`  ${def.description}`);
        const props = def.parameters?.properties ?? {};
        const required = new Set(def.parameters?.required ?? []);
        const keys = Object.keys(props);
        if (keys.length) {
            console.log("  params:");
            for (const key of keys) {
                const req = required.has(key) ? " (required)" : "";
                const desc = props[key]?.description ? ` — ${props[key].description}` : "";
                console.log(`    ${key}${req}${desc}`);
            }
        }
        console.log("");
    }
}

const command = process.argv[2];
if (command === "tools") {
    await listTools();
} else {
    console.log("Usage: bun index.ts tools");
    process.exit(command ? 1 : 0);
}
