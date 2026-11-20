'use strict';

const http = require('node:http');
const path = require('node:path');

const env = process.env;
const port = env.PORT || '8080';

// Accept a plain password secret and hash it for n8n's env-managed owner.
if (!env.N8N_INSTANCE_OWNER_PASSWORD_HASH && env.N8N_OWNER_PASSWORD) {
  env.N8N_INSTANCE_OWNER_PASSWORD_HASH = require('bcryptjs').hashSync(env.N8N_OWNER_PASSWORD, 10);
}

const missing = ['N8N_INSTANCE_OWNER_EMAIL', 'N8N_OWNER_PASSWORD', 'N8N_ENCRYPTION_KEY'].filter(
  (name) => !env[name] && !(name === 'N8N_OWNER_PASSWORD' && env.N8N_INSTANCE_OWNER_PASSWORD_HASH),
);

if (missing.length) {
  // Never expose an unclaimed editor: explain the setup instead.
  const body =
    'n8n is not configured yet.\n\n' +
    'Add these secrets in your Wasmer app settings, then redeploy:\n' +
    missing.map((name) => '  - ' + name).join('\n') +
    '\n\nSee https://github.com/wasmerio/examples/tree/main/js-n8n#setup\n';
  console.error('n8n setup required, missing: ' + missing.join(', '));
  http
    .createServer((req, res) => {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '3600' });
      res.end(body);
    })
    .listen(port, env.N8N_LISTEN_ADDRESS || '0.0.0.0');
  return;
}

env.N8N_INSTANCE_OWNER_MANAGED_BY_ENV = 'true';
env.N8N_PORT = port;
// External runner mode needs a token even though no runner launcher is started.
env.N8N_RUNNERS_AUTH_TOKEN ||= require('node:crypto').randomBytes(24).toString('hex');

// Use the app's public URL for webhook and editor links.
const publicUrl = env.WASMER_APP_URL && env.WASMER_APP_URL.replace(/\/?$/, '/');
if (publicUrl) {
  env.N8N_HOST ||= new URL(publicUrl).host;
  env.WEBHOOK_URL ||= publicUrl;
  env.N8N_EDITOR_BASE_URL ||= publicUrl;
}

// Map Wasmer's managed PostgreSQL variables to n8n's names.
if (env.DB_HOST) {
  env.DB_TYPE = 'postgresdb';
  for (const [target, source] of Object.entries({
    DB_POSTGRESDB_HOST: 'DB_HOST',
    DB_POSTGRESDB_PORT: 'DB_PORT',
    DB_POSTGRESDB_DATABASE: 'DB_NAME',
    DB_POSTGRESDB_USER: 'DB_USERNAME',
    DB_POSTGRESDB_PASSWORD: 'DB_PASSWORD',
  })) {
    env[target] ||= env[source];
  }
}

const cli = path.join(__dirname, 'bin', 'n8n');
process.argv = [process.execPath, cli, 'start'];
require(cli);
