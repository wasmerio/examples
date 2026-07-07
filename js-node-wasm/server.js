const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 8080);
const host = "0.0.0.0";

const wasmBytes = fs.readFileSync(path.join(__dirname, "add.wasm"));
const wasmReady = WebAssembly.instantiate(wasmBytes).then(
  ({ instance }) => instance.exports,
);

const server = http.createServer(async (request, response) => {
  const { add } = await wasmReady;
  const url = new URL(request.url, `http://${request.headers.host}`);
  const a = Number(url.searchParams.get("a") ?? 2);
  const b = Number(url.searchParams.get("b") ?? 3);
  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(`${a} + ${b} = ${add(a, b)} (computed in WebAssembly)`);
});

server.listen(port, host, () => {
  console.log(`Node + Wasm server listening on http://${host}:${port}`);
});
