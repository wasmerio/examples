const origin = new URL(process.argv[2]);
const timeout = 30000;
async function get(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response;
}
const page = await (await get("/")).text();
if (!page.toLowerCase().includes("swagger")) throw new Error("index is not Swagger UI");
const license = await (await get("/LICENSE")).text();
if (!license.includes("Apache License")) throw new Error("LICENSE is not Apache-2.0");
console.log(`Smoke check passed for ${origin.origin}`);
