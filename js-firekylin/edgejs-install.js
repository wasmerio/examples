'use strict';

// Non-interactive replacement for Firekylin's web install wizard, run by the
// EdgeJS framework-test harness as a `database.setup` command (host Node).
// Mirrors src/home/service/install.js `saveSiteInfo`:
//   1. import firekylin.sql into the FK_DB_* database,
//   2. seed the options rows the installer sets,
//   3. create the admin user (phpass hash of md5(salt + password)),
//   4. write the `.installed` marker file.
// Idempotent: skips the import when the fk_post table already exists.

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const ROOT = __dirname;
// `mysql` is a transitive dependency (think-model-mysql -> think-mysql ->
// mysql), so resolve it along that chain under pnpm's strict layout.
// createRequire must start from the realpath: under pnpm,
// node_modules/think-model-mysql is a symlink and dependency resolution only
// works from the real .pnpm location.
const requireFromThinkModel = createRequire(
  fs.realpathSync(path.join(ROOT, 'node_modules', 'think-model-mysql', 'package.json')),
);
const mysql = createRequire(requireFromThinkModel.resolve('think-mysql'))('mysql');
const { PasswordHash } = require('phpass');

const SITE_TITLE = 'Firekylin on EdgeJS';
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'framework-test-password';
const PASSWORD_SALT = 'edgejs-framework-test-salt!@#$%^&*';

function query(connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, result) => (error ? reject(error) : resolve(result)));
  });
}

async function importSchema(connection) {
  const existing = await query(
    connection,
    'SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = ? AND `TABLE_NAME` = ?',
    [process.env.FK_DB_DATABASE, 'fk_post'],
  );
  if (existing.length > 0) {
    console.log('schema already imported; skipping');
    return;
  }

  // Same filtering the upstream installer applies to firekylin.sql.
  let content = fs.readFileSync(path.join(ROOT, 'firekylin.sql'), 'utf8');
  content = content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return !['#', 'LOCK', 'UNLOCK'].some((prefix) => trimmed.indexOf(prefix) === 0);
    })
    .join(' ')
    .replace(/\/\*.*?\*\//g, '');

  for (const statement of content.split(';')) {
    const sql = statement.trim();
    if (sql) {
      await query(connection, sql);
    }
  }
  console.log('schema imported');
}

async function seedOptions(connection) {
  const md5 = crypto.createHash('md5').update(PASSWORD_SALT + ADMIN_PASSWORD).digest('hex');
  const passwordHash = new PasswordHash().hashPassword(md5);

  const options = {
    title: SITE_TITLE,
    site_url: 'http://127.0.0.1',
    password_salt: PASSWORD_SALT,
    logo_url: '/static/img/firekylin.jpg',
    theme: 'firekylin',
    navigation: JSON.stringify([
      { label: 'Home', url: '/', option: 'home' },
      { label: 'Archives', url: '/archives/', option: 'archive' },
    ]),
  };
  for (const [key, value] of Object.entries(options)) {
    await query(
      connection,
      'INSERT INTO `fk_options` (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      [key, value],
    );
  }

  await query(
    connection,
    'INSERT INTO `fk_user` (`name`, `display_name`, `password`, `type`, `email`, `status`, `create_time`, `create_ip`, `last_login_time`, `last_login_ip`) ' +
      'SELECT ?, ?, ?, 1, ?, 1, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `fk_user` WHERE `name` = ?)',
    [ADMIN_USER, ADMIN_USER, passwordHash, 'admin@example.com', '127.0.0.1', '127.0.0.1', ADMIN_USER],
  );
  console.log('options and admin user seeded');
}

async function main() {
  const connection = mysql.createConnection({
    host: process.env.FK_DB_HOST,
    port: Number(process.env.FK_DB_PORT || 3306),
    user: process.env.FK_DB_USER,
    password: process.env.FK_DB_PASSWORD,
    database: process.env.FK_DB_DATABASE,
  });

  try {
    await importSchema(connection);
    await seedOptions(connection);
  } finally {
    connection.end();
  }

  fs.writeFileSync(path.join(ROOT, '.installed'), 'firekylin');
  console.log('.installed written');
}

main().catch((error) => {
  console.error('edgejs-install failed:', error);
  process.exit(1);
});
