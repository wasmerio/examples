# n8n + Wasmer

Deploy [n8n](https://n8n.io/), the workflow automation tool, on Wasmer Edge with a
managed PostgreSQL database. Workflows, credentials and executions persist across
deployments.

## How it works

- `app.yaml` runs the prebuilt [`wasmer/n8n@2.48.4`](https://wasmer.io/wasmer/n8n@2.48.4)
  package and asks Wasmer for a PostgreSQL database and 2 GiB of memory. Nothing is
  built from this folder.
- The package contains n8n 2.48.4 from the official release, trimmed to fit the
  registry size limit, on Node.js-compatible `wasmer/edgejs-quickjs`. n8n's own
  QuickJS expression engine evaluates expressions.
- `package/wasmer-start.cjs` is the package entrypoint. It maps Wasmer's database
  variables to n8n's, sets webhook and editor URLs from the app's public URL, and
  hashes the owner password before starting n8n.
- Without the setup secrets below, the app returns HTTP 503 with instructions
  instead of exposing an unclaimed editor.

## Setup

Add these secrets in your Wasmer app settings, then redeploy:

- **`N8N_INSTANCE_OWNER_EMAIL`**: the owner account's email.
- **`N8N_OWNER_PASSWORD`**: the owner account's password. It is applied on every
  start, so change it here rather than in n8n.
- **`N8N_ENCRYPTION_KEY`**: a long random string, for example from
  `openssl rand -hex 32`. Keep it stable: n8n uses it to encrypt saved credentials.

The first start runs n8n's database migrations and can take a minute.

## Limits

- The Code node needs n8n's task runner, which is not started on Wasmer Edge.
- Nodes that rely on native binaries may not work. The Webhook and Edit Fields
  nodes are tested; other nodes are not individually checked.
- Runs in one region next to its database.

## License

n8n is fair-code software under the
[Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md),
included in the package. Check that your use fits its terms.
