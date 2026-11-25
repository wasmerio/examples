// stats.mjs — 概览统计 API
import { Hono } from 'hono'
import { overviewStats } from './store.mjs'

const stats = new Hono()

// GET /api/stats
stats.get('/', async (c) => c.json(await overviewStats()))

export { stats }
