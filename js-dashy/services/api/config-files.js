/**
 * File-system + YAML helpers for the REST API
 * Reads config files from USER_DATA_DIR, and reuses save-config.js for writes
 */
const fsPromises = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const saveConfig = require('../save-config');
const schema = require('../../src/utils/config/ConfigSchema.json');

const rootDir = path.join(__dirname, '..', '..');

// Same rules as save-config.js: no path separators, control chars or ..
const SAFE_FILENAME = /^(?!\.+$)[^\\/\0\r\n]+\.ya?ml$/i;

const validateSchema = new Ajv({ strict: false, allowUnionTypes: true, allErrors: true })
  .compile(schema);

/* An error with an associated HTTP status code, for the router to render */
class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const userDataDir = () => path.resolve(rootDir, process.env.USER_DATA_DIR || 'user-data');

/* Returns the validated basename of a config filename, or throws a 400 */
const safeFilename = (filename) => {
  const base = path.basename(String(filename));
  if (!SAFE_FILENAME.test(base)) {
    throw new ApiError('Invalid filename: must be a basename ending in .yml or .yaml');
  }
  return base;
};

/* Lists all YAML config files in the user data directory */
const listConfigFiles = async () => {
  const entries = await fsPromises.readdir(userDataDir(), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
};

/* Reads and parses a config file, returning it as a plain object */
const readConfig = async (filename) => {
  const base = safeFilename(filename);
  let raw;
  try {
    raw = await fsPromises.readFile(path.join(userDataDir(), base), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') throw new ApiError(`${base} not found`, 404);
    throw new ApiError(`Could not read ${base}`, 500);
  }
  let parsed;
  try {
    parsed = yaml.load(raw);
  } catch (e) {
    throw new ApiError(`Could not parse ${base}: ${e.reason || e.message}`, 500);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ApiError(`${base} is not a valid config (expected a YAML mapping)`);
  }
  return parsed;
};

/* Serializes and writes a config, via save-config for backups + size limits.
   The root conf.yml is validated against the schema; sub-pages are not,
   since they may contain only a subset of fields (e.g. just pageInfo) */
const writeConfig = async (filename, config) => {
  const base = safeFilename(filename);
  if (base === 'conf.yml' && !validateSchema(config)) {
    const issues = (validateSchema.errors || []).slice(0, 5)
      .map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ');
    throw new ApiError(`Config does not conform to schema: ${issues}`);
  }
  const result = await new Promise((resolve) => {
    saveConfig({ config: yaml.dump(config, { noRefs: true }), filename: base }, (jsonStr) => {
      resolve(JSON.parse(jsonStr));
    });
  });
  if (!result.success) throw new ApiError(result.message);
  return result.message;
};

/* Resolves a section/item identifier (numeric index, or match on keyField)
   to an array index, returning -1 when not found */
const resolveIndex = (arr, id, keyField) => {
  if (/^\d+$/.test(id)) {
    return Number(id) < arr.length ? Number(id) : -1;
  }
  return arr.findIndex((entry) => entry && entry[keyField] === id);
};

module.exports = {
  ApiError, safeFilename, listConfigFiles, readConfig, writeConfig, resolveIndex,
};
