# Node.js + WebAssembly + Wasmer

This example shows how to run **Node.js** on **Wasmer Edge** as an HTTP server that calls a **WebAssembly** module.

## Demo

`https://<your-subdomain>.wasmer.app/?a=2&b=3` (deploy to get a live URL)

## How it Works

* `add.wasm` is a minimal WebAssembly module exporting `add(a, b)` (source in `add.wat`).
* `server.js` instantiates the module with the `WebAssembly` API and uses it to answer HTTP requests: `/?a=2&b=3` responds with the sum computed inside Wasm.
* `package.json` defines `npm start`, which runs the server entrypoint.
* Wasmer Edge runs the Node.js process and forwards HTTP traffic to the configured port.

## Running Locally

```bash
npm install
npm start
```

Open `http://127.0.0.1:8080/?a=2&b=3` to hit the server locally. Set `PORT=...` if you want to use a different port.

## Deploying to Wasmer (Overview)

1. Install dependencies and confirm the app starts locally.
2. Deploy from this example directory with `wasmer deploy`.
3. Visit `https://<your-subdomain>.wasmer.app/` once the deployment is live.
