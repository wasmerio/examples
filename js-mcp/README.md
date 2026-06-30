# Model Context Protocol Server + Wasmer

This example shows how to expose a JavaScript **Model Context Protocol** server over HTTP on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `server.js` builds an MCP server with a `greet` tool.
* `/mcp` accepts Streamable HTTP MCP POST requests; `/` provides a simple health message.
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
