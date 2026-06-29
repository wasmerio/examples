/**
 * Opt-in REST API for reading + writing config files (see docs/api.md)
 * Disabled unless ENABLE_API=true
 * Uses the same auth as rest of Dashy or API_TOKEN as bearer token
 */
const crypto = require('crypto');
const express = require('express');

const {
  ApiError, safeFilename, listConfigFiles, readConfig, writeConfig, resolveIndex,
} = require('./config-files');

/* The editable top-level config keys (matches ConfigSchema.json) */
const TOP_LEVEL_KEYS = ['pageInfo', 'appConfig', 'sections', 'pages'];

/* Check specified token matches allowed token */
const tokensMatch = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/* Renders errors raised before route handlers as jason */
const apiErrorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  return res.status(err.status || 400).json({ success: false, message: err.message });
};

/* Responds with a 404 unless the API has been explicitly enabled */
const apiEnabledGate = (req, res, next) => {
  if (process.env.ENABLE_API === 'true') return next();
  return res.status(404).json({
    success: false,
    message: 'API not enabled. Set ENABLE_API=true to use the REST API.',
  });
};

/* Throws a 400 unless the request body is a plain object */
const requireObjectBody = (body, what) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(`Request body must be ${what}`);
  }
};

/* Throws a 400 if key isn't one of the editable top-level config keys */
const checkKey = (key) => {
  if (!TOP_LEVEL_KEYS.includes(key)) {
    throw new ApiError(`Invalid key '${key}', must be one of: ${TOP_LEVEL_KEYS.join(', ')}`);
  }
};

/* Returns parent[key] as an array, creating it if requested + missing */
const getArray = (parent, key, create) => {
  if (parent[key] === undefined && create) parent[key] = [];
  const arr = parent[key] === undefined ? [] : parent[key];
  if (!Array.isArray(arr)) throw new ApiError(`'${key}' is not a list`);
  return arr;
};

/* Locates a section by index or name, throwing a 404 when not found */
const findSection = (config, sid) => {
  const sections = getArray(config, 'sections');
  const index = resolveIndex(sections, sid, 'name');
  if (index === -1) throw new ApiError(`Section '${sid}' not found`, 404);
  return { sections, index, section: sections[index] };
};

/* Locates an item within a section by index or title */
const findItem = (section, iid) => {
  const items = getArray(section, 'items');
  const index = resolveIndex(items, iid, 'title');
  if (index === -1) throw new ApiError(`Item '${iid}' not found`, 404);
  return { items, index, item: items[index] };
};

const createApiRouter = ({
  protectConfig, authIsConfigured, onConfigSaved, requireAdmin: delegateAdmin,
}) => {
  const router = express.Router();

  /* The API is gated when Dashy auth, or an API token, is configured */
  const secured = () => authIsConfigured || Boolean(process.env.API_TOKEN);

  /* Either authenticate with API_TOKEN bearer if set, or defer to user's auth */
  const apiAuth = (req, res, next) => {
    const token = process.env.API_TOKEN;
    if (token) {
      const header = req.headers.authorization || '';
      const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (provided && tokensMatch(provided, token)) {
        req.auth = { user: 'api-token', isAdmin: true };
        return next();
      }
    }
    return protectConfig(req, res, next);
  };

  /* Require any authenticated identity */
  const requireAuth = (req, res, next) => {
    if (!secured() || req.auth) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  };

  /* Require an admin identity, delegating the role check to Dashy's auth */
  const requireAdmin = (req, res, next) => {
    if (!secured()) return next();
    if (req.auth?.isAdmin === true) return next();
    if (!req.auth) return res.status(401).json({ success: false, message: 'Unauthorized' });
    return delegateAdmin(req, res, next);
  };

  router.use(apiAuth);

  /* Wraps an async handler, rendering thrown ApiErrors as JSON */
  const route = (handler) => async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      res.status(e.status || 500).json({ success: false, message: e.message });
    }
  };

  /* Read-modify-write handler
   * Applies mutate() to the parsed config, writes it back
   * Responds with the save message + anything mutate returned
   */
  const update = (mutate, status = 200) => route(async (req, res) => {
    const config = await readConfig(req.params.filename);
    const result = mutate(req, config);
    const message = await writeConfig(req.params.filename, config);
    if (onConfigSaved) onConfigSaved(safeFilename(req.params.filename), config);
    res.status(status).json({ success: true, message, ...result });
  });

  router.get('/config', requireAuth, route(async (req, res) => {
    res.json({ success: true, files: await listConfigFiles() });
  }));

  router.get('/config/:filename', requireAuth, route(async (req, res) => {
    res.json(await readConfig(req.params.filename));
  }));

  router.put('/config/:filename', requireAdmin, route(async (req, res) => {
    requireObjectBody(req.body, 'a config object');
    const message = await writeConfig(req.params.filename, req.body);
    if (onConfigSaved) onConfigSaved(safeFilename(req.params.filename), req.body);
    res.json({ success: true, message });
  }));

  router.post('/config/:filename/sections', requireAdmin, update((req, config) => {
    requireObjectBody(req.body, 'a section object');
    if (!req.body.name) throw new ApiError("Section must have a 'name'");
    const sections = getArray(config, 'sections', true);
    sections.push(req.body);
    return { index: sections.length - 1, section: req.body };
  }, 201));

  router.get('/config/:filename/sections/:sid', requireAuth, route(async (req, res) => {
    const config = await readConfig(req.params.filename);
    res.json(findSection(config, req.params.sid).section);
  }));

  router.patch('/config/:filename/sections/:sid', requireAdmin, update((req, config) => {
    requireObjectBody(req.body, 'a partial section object');
    const { section } = findSection(config, req.params.sid);
    Object.assign(section, req.body);
    return { section };
  }));

  router.delete('/config/:filename/sections/:sid', requireAdmin, update((req, config) => {
    const { sections, index } = findSection(config, req.params.sid);
    sections.splice(index, 1);
  }));

  router.get('/config/:filename/sections/:sid/items', requireAuth, route(async (req, res) => {
    const config = await readConfig(req.params.filename);
    res.json(getArray(findSection(config, req.params.sid).section, 'items'));
  }));

  router.post('/config/:filename/sections/:sid/items', requireAdmin, update((req, config) => {
    requireObjectBody(req.body, 'an item object');
    if (!req.body.title) throw new ApiError("Item must have a 'title'");
    const items = getArray(findSection(config, req.params.sid).section, 'items', true);
    items.push(req.body);
    return { index: items.length - 1, item: req.body };
  }, 201));

  router.get('/config/:filename/sections/:sid/items/:iid', requireAuth, route(async (req, res) => {
    const config = await readConfig(req.params.filename);
    const { section } = findSection(config, req.params.sid);
    res.json(findItem(section, req.params.iid).item);
  }));

  router.patch('/config/:filename/sections/:sid/items/:iid', requireAdmin, update((req, config) => {
    requireObjectBody(req.body, 'a partial item object');
    const { section } = findSection(config, req.params.sid);
    const { item } = findItem(section, req.params.iid);
    Object.assign(item, req.body);
    return { item };
  }));

  router.delete('/config/:filename/sections/:sid/items/:iid', requireAdmin, update((req, config) => {
    const { section } = findSection(config, req.params.sid);
    const { items, index } = findItem(section, req.params.iid);
    items.splice(index, 1);
  }));

  router.get('/config/:filename/:key', requireAuth, route(async (req, res) => {
    checkKey(req.params.key);
    const config = await readConfig(req.params.filename);
    if (config[req.params.key] === undefined) {
      throw new ApiError(`'${req.params.key}' not present in config`, 404);
    }
    res.json(config[req.params.key]);
  }));

  router.put('/config/:filename/:key', requireAdmin, update((req, config) => {
    checkKey(req.params.key);
    config[req.params.key] = req.body;
  }));

  router.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));

  return router;
};

module.exports = { apiEnabledGate, apiErrorHandler, createApiRouter };
