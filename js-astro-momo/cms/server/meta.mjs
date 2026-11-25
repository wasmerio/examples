// meta.mjs — 分类统计 API
import { Hono } from 'hono'
import { categoryStats } from './store.mjs'

const meta = new Hono()

// GET /api/meta
meta.get('/', async (c) => c.json(await categoryStats()))

export { meta }
