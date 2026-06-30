# Static HTML with JavaScript + Wasmer

This example shows how to host a plain **HTML, CSS, and JavaScript** site on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `index.html` loads `styles.css` and `app.js` directly.
* No build step is required; the directory itself is the publishable static site.
* Wasmer Edge serves the files directly without a Node.js runtime.

## Running Locally

```bash
npx serve .
```

Open `http://127.0.0.1:3000/` to view the static site.

## Deploying to Wasmer (Overview)

1. Configure Wasmer Edge to publish this directory as static files.
2. Deploy with `wasmer deploy` or through the Wasmer dashboard.
3. Visit `https://<your-subdomain>.wasmer.app/`.
