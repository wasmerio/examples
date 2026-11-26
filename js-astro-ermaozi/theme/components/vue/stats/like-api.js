import { canonicalizeStatsPath } from './stats-path.js'
import { siteConfig } from '../../../../site.config.mjs'

/** @typedef {{ path: string, count: number, views: number, likedToday: boolean }} EngagementStatus */
/** @typedef {EngagementStatus & { error?: string, items?: EngagementStatus[] }} ApiResponse */
/** @typedef {{ request: Promise<EngagementStatus>, resolve: (value: EngagementStatus) => void, reject: (reason?: unknown) => void }} PendingStatus */

const VISITOR_STORAGE_KEY = `${siteConfig.namespace}_like_visitor_v1`
export const LIKE_UPDATE_EVENT = `${siteConfig.namespace}:like-updated`
/** @type {Map<string, Promise<EngagementStatus>>} */
const statusRequests = new Map()
/** @type {Map<string, PendingStatus>} */
const pendingStatusRequests = new Map()

let statusBatchScheduled = false

let inMemoryVisitorId = ''

export const resolveWorkerUrl = () => {
  return siteConfig.services.statsBase
}

/** @type {Map<string, EngagementStatus>} */
const localStatuses = new Map()
const isLocal = () => typeof location !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(location.hostname)
/** @param {string} path @returns {EngagementStatus} */
const localStatus = path => {
  let status = localStatuses.get(path)
  if (!status) {
    const seed = [...path].reduce((total, character) => total + character.charCodeAt(0), 0)
    status = { path, count: seed % 31, views: 500 + seed % 4500, likedToday: false }
    localStatuses.set(path, status)
  }
  return status
}

const createVisitorId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replaceAll('-', '')
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

const getVisitorId = () => {
  if (inMemoryVisitorId) return inMemoryVisitorId
  if (typeof window === 'undefined') return ''

  try {
    const saved = window.localStorage.getItem(VISITOR_STORAGE_KEY)
    if (saved && /^[A-Za-z0-9_-]{20,128}$/.test(saved)) {
      inMemoryVisitorId = saved
      return saved
    }
  } catch {
    // A module-scoped identifier still keeps the current session usable.
  }

  inMemoryVisitorId = createVisitorId()
  try {
    window.localStorage.setItem(VISITOR_STORAGE_KEY, inMemoryVisitorId)
  } catch {
    // Storage can be disabled in privacy-focused browsers.
  }
  return inMemoryVisitorId
}

const getHeaders = (includeContentType = false) => {
  const headers = {
    [siteConfig.services.statsVisitorHeader]: getVisitorId()
  }
  if (includeContentType) headers['Content-Type'] = 'application/json'
  return headers
}

/** @param {Response} response @returns {Promise<ApiResponse>} */
const parseResponse = async (response) => {
  /** @type {ApiResponse} */
  let data = /** @type {ApiResponse} */ ({})
  try {
    data = /** @type {ApiResponse} */ (await response.json())
  } catch {
    data = /** @type {ApiResponse} */ ({})
  }

  if (!response.ok) {
    throw Object.assign(new Error(data.error || '点赞服务请求失败'), { status: response.status })
  }
  return data
}

const flushStatusBatch = async () => {
  statusBatchScheduled = false
  const batch = Array.from(pendingStatusRequests.entries()).slice(0, 20)
  batch.forEach(([path]) => pendingStatusRequests.delete(path))
  if (pendingStatusRequests.size > 0) {
    statusBatchScheduled = true
    queueMicrotask(flushStatusBatch)
  }

  const workerUrl = resolveWorkerUrl()
  try {
    const response = await fetch(`${workerUrl}/engagement`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ paths: batch.map(([path]) => path) })
    })
    const data = await parseResponse(response)
    const items = new Map((data?.items || []).map(item => [item.path, item]))

    for (const [path, pending] of batch) {
      const item = items.get(path)
      if (item) pending.resolve(item)
      else pending.reject(new Error('文章统计数据缺失'))
    }
  } catch (error) {
    for (const [path, pending] of batch) {
      if (statusRequests.get(path) === pending.request) statusRequests.delete(path)
      pending.reject(error)
    }
  }
}

/** @param {string} path @param {boolean} [force] @returns {Promise<EngagementStatus>} */
export const getEngagementStatus = (path, force = false) => {
  path = canonicalizeStatsPath(path)
  if (isLocal()) return Promise.resolve({ ...localStatus(path) })
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) return Promise.reject(new Error('点赞服务地址未配置'))
  const existingRequest = statusRequests.get(path)
  if (!force && existingRequest) return existingRequest

  /** @type {(value: EngagementStatus) => void} */
  let resolveRequest = () => {}
  /** @type {(reason?: unknown) => void} */
  let rejectRequest = () => {}
  const request = /** @type {Promise<EngagementStatus>} */ (new Promise((resolve, reject) => {
    resolveRequest = resolve
    rejectRequest = reject
  }))

  statusRequests.set(path, request)
  pendingStatusRequests.set(path, {
    request,
    resolve: resolveRequest,
    reject: rejectRequest
  })
  if (!statusBatchScheduled) {
    statusBatchScheduled = true
    queueMicrotask(flushStatusBatch)
  }
  return request
}

export const getLikeStatus = getEngagementStatus

/** @param {string} path @param {'POST' | 'DELETE'} method @returns {Promise<EngagementStatus>} */
const updateLike = async (path, method) => {
  path = canonicalizeStatsPath(path)
  if (isLocal()) {
    const current = localStatus(path)
    const likedToday = method === 'POST'
    const updated = { ...current, count: Math.max(0, current.count + (likedToday ? 1 : -1)), likedToday }
    localStatuses.set(path, updated)
    window.dispatchEvent(new CustomEvent(LIKE_UPDATE_EVENT, { detail: updated }))
    return updated
  }
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) throw new Error('点赞服务地址未配置')

  const cachedRequest = statusRequests.get(path)
  const response = await fetch(`${workerUrl}/likes`, {
    method,
    headers: getHeaders(true),
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ path })
  })
  const data = await parseResponse(response)
  const cached = await cachedRequest?.catch(() => null)
  const updated = { ...cached, ...data }
  statusRequests.set(path, Promise.resolve(updated))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LIKE_UPDATE_EVENT, { detail: updated }))
  }
  return updated
}

/** @param {string} path */
export const submitLike = (path) => updateLike(path, 'POST')

/** @param {string} path */
export const removeLike = (path) => updateLike(path, 'DELETE')
