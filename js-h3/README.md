# H3 + Wasmer

This example shows how to run **H3** on **Wasmer Edge** as an HTTP server.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `server.js` adapts an H3 app to Node's HTTP server with `toNodeListener`.
* The app responds to `/` with a plain-text message.
* Wasmer Edge runs the Node.js process and forwards HTTP traffic to the configured port.

## Running Locally

```bash
npm install
npm start
```

Open `http://127.0.0.1:3000/` to hit the server locally. Set `PORT=...` if you want to use a different port.

## Deploying to Wasmer (Overview)

1. Install dependencies and confirm the app starts locally.
2. Deploy from this example directory with `wasmer deploy`.
3. Visit `https://<your-subdomain>.wasmer.app/` once the deployment is live.
