const INITIAL_LIMIT = 2 * 1024 * 1024
const MAX_EXTRA_FETCH = 32 * 1024 * 1024

export interface ExtractedCover {
  mime: string
  blobUrl: string
}

function be24(b: Uint8Array, o: number): number {
  return ((b[o] << 16) | (b[o + 1] << 8) | b[o + 2]) >>> 0
}

function be32(b: Uint8Array, o: number): number {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0
}

function syncsafe32(b: Uint8Array, o: number): number {
  return (
    ((b[o] & 0x7f) << 21) | ((b[o + 1] & 0x7f) << 14) | ((b[o + 2] & 0x7f) << 7) | (b[o + 3] & 0x7f)
  )
}

function ascii(b: Uint8Array, o: number, len: number): string {
  return String.fromCharCode(...b.subarray(o, o + len))
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length)
  out.set(a, 0)
  out.set(b, a.length)
  return out
}

function deUnsync(b: Uint8Array): Uint8Array {
  const out = new Uint8Array(b.length)
  let n = 0
  for (let i = 0; i < b.length; i++) {
    out[n++] = b[i]
    if (b[i] === 0xff && i + 1 < b.length && b[i + 1] === 0x00) i++
  }
  return out.subarray(0, n)
}

function sniffImageMime(d: Uint8Array): string {
  if (d.length > 3 && d[0] === 0xff && d[1] === 0xd8) return 'image/jpeg'
  if (d.length > 8 && d[0] === 0x89 && d[1] === 0x50 && d[2] === 0x4e && d[3] === 0x47)
    return 'image/png'
  if (d.length > 12 && ascii(d, 0, 4) === 'RIFF' && ascii(d, 8, 4) === 'WEBP') return 'image/webp'
  if (d.length > 6 && ascii(d, 0, 3) === 'GIF') return 'image/gif'
  return ''
}

function normalizeMime(raw: string, data: Uint8Array): string {
  const m = raw.trim().toLowerCase()
  if (m === 'jpg' || m === 'jpeg' || m === 'image/jpg' || m === 'image/jpeg') return 'image/jpeg'
  if (m === 'png' || m === 'image/png') return 'image/png'
  if (m === 'image/webp') return 'image/webp'
  if (m === 'gif' || m === 'image/gif') return 'image/gif'
  if (m.startsWith('image/')) return m
  return sniffImageMime(data) || 'image/jpeg'
}

interface PictureData {
  mime: string
  data: Uint8Array
}

function parseApicBody(d: Uint8Array, isV2: boolean): { type: number; pic: PictureData } | null {
  if (d.length < 4) return null
  const enc = d[0]
  let o = 1
  let mime = ''
  if (isV2) {
    if (o + 4 > d.length) return null
    mime = ascii(d, o, 3)
    o += 4
  } else {
    const mimeEnd = d.indexOf(0, o)
    if (mimeEnd <= o || mimeEnd - o > 128) return null
    mime = ascii(d, o, mimeEnd - o)
    o = mimeEnd + 1
  }
  if (o >= d.length) return null
  const picType = d[o]
  o += 1
  if (enc === 1 || enc === 2) {
    let z = -1
    for (let i = o; i + 1 < d.length; i += 2) {
      if (d[i] === 0 && d[i + 1] === 0) {
        z = i
        break
      }
    }
    if (z < 0) return null
    o = z + 2
  } else {
    const z = d.indexOf(0, o)
    if (z < 0) return null
    o = z + 1
  }
  if (o >= d.length) return null
  const data = d.slice(o)
  if (data.length < 8) return null
  return { type: picType, pic: { mime: normalizeMime(mime, data), data } }
}

function findMp3Picture(tag: Uint8Array): PictureData | null {
  const major = tag[3]
  if (major < 2 || major > 4) return null
  const tagFlags = tag[5]
  const tagSize = syncsafe32(tag, 6)
  const end = Math.min(tag.length, 10 + tagSize)
  if (major === 3 && tagFlags & 0x08) return null
  const globalUnsync = major < 4 && (tagFlags & 0x80) !== 0

  let pos = 10
  if (major >= 3 && pos + 4 <= end) {
    const extSize = major === 4 ? syncsafe32(tag, pos) : be32(tag, pos)
    const skip = major === 4 ? extSize : 4 + extSize
    if (extSize > 0 && extSize < 1024 && pos + skip <= end) pos += skip
  }

  let best: { type: number; pic: PictureData } | null = null
  const headLen = major === 2 ? 6 : 10
  while (pos + headLen <= end) {
    let id: string
    let size: number
    let dataStart: number
    let frameFlags = 0
    if (major === 2) {
      id = ascii(tag, pos, 3)
      size = be24(tag, pos + 3)
      dataStart = pos + 6
    } else {
      id = ascii(tag, pos, 4)
      const be = be32(tag, pos + 4)
      const ss = syncsafe32(tag, pos + 4)
      size = major === 4 ? (ss > 0 ? ss : be) : be > 0 ? be : ss
      frameFlags = tag[pos + 9]
      dataStart = pos + 10
      const unsupported = major === 3 ? frameFlags & 0xe0 : frameFlags & 0x0c
      if (unsupported) {
        if (size <= 0 || dataStart + size > end) break
        pos = dataStart + size
        continue
      }
    }
    if (id.charCodeAt(0) === 0) break
    if (size <= 0 || dataStart + size > end) break
    if ((major === 2 && id === 'PIC') || (major !== 2 && id === 'APIC')) {
      let d = tag.subarray(dataStart, dataStart + size)
      const needsUnsync = globalUnsync || (major === 4 && (frameFlags & 0x02) !== 0)
      if (needsUnsync) d = deUnsync(d)
      if (major === 4 && frameFlags & 0x01) d = d.subarray(4)
      const parsed = parseApicBody(d, major === 2)
      if (parsed && (!best || (parsed.type === 3 && best.type !== 3))) best = parsed
    }
    pos = dataStart + size
  }
  return best?.pic ?? null
}

function parseFlacPictureBlock(d: Uint8Array): PictureData | null {
  if (d.length < 32) return null
  const mimeLen = be32(d, 4)
  if (mimeLen <= 0 || mimeLen > 128 || 8 + mimeLen > d.length) return null
  const mime = ascii(d, 8, mimeLen)
  let o = 8 + mimeLen
  if (o + 4 > d.length) return null
  const descLen = be32(d, o)
  o += 4
  if (o + descLen + 16 + 4 > d.length) return null
  o += descLen
  o += 16
  const dataLen = be32(d, o)
  o += 4
  if (dataLen <= 0 || o + dataLen > d.length) return null
  const data = d.slice(o, o + dataLen)
  return { mime: normalizeMime(mime, data), data }
}

async function readFrom(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  limit: number,
  cancelAfter: boolean,
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (total < limit) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value || value.length === 0) continue
      const need = limit - total
      if (value.length <= need) {
        chunks.push(value)
        total += value.length
      } else {
        chunks.push(value.subarray(0, need))
        total = limit
        break
      }
    }
  } catch {
  } finally {
    if (cancelAfter) {
      try {
        await reader.cancel()
      } catch {}
      try {
        reader.releaseLock()
      } catch {}
    }
  }
  if (!chunks.length) return new Uint8Array(0)
  const out = new Uint8Array(total)
  let o = 0
  for (const c of chunks) {
    out.set(c, o)
    o += c.length
  }
  return out
}

async function readLimited(res: Response, limit: number): Promise<Uint8Array> {
  if (!res.body) return new Uint8Array()
  const reader = res.body.getReader()
  return readFrom(reader, limit, true)
}

async function fetchBytes(
  url: string,
  start: number,
  endInclusive: number,
): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Range: `bytes=${start}-${endInclusive}` },
    })
    if (!res.ok && res.status !== 206) return null
    if (res.status === 206) return await readLimited(res, endInclusive - start + 1)
    const all = await readLimited(res, endInclusive + 1)
    return all.length > start ? all.subarray(start) : new Uint8Array(0)
  } catch {
    return null
  }
}

interface HeadResult {
  buf: Uint8Array
  // 200（服务器忽略 Range）时保留的响应流，可从断点续读
  reader: ReadableStreamDefaultReader<Uint8Array> | null
  rangeSupported: boolean
}

// 首次请求：Range 支持时读完前缀即可；
// 200 时保留流不取消，后续需要后段数据时直接续读，
// 避免旧实现里为取文件后段而二次全量下载（前缀部分重复传输）
async function fetchHead(url: string): Promise<HeadResult | null> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Range: `bytes=0-${INITIAL_LIMIT - 1}` },
    })
    if (!res.ok && res.status !== 206) return null
    if (res.status === 206) {
      return { buf: await readLimited(res, INITIAL_LIMIT), reader: null, rangeSupported: true }
    }
    if (!res.body) return { buf: new Uint8Array(), reader: null, rangeSupported: false }
    const reader = res.body.getReader()
    const buf = await readFrom(reader, INITIAL_LIMIT, false)
    return { buf, reader, rangeSupported: false }
  } catch {
    return null
  }
}

// 补齐到 wantEnd（不含）：Range 支持时发起新的区间请求；
// 200 时从保留的流续读，两次读取合并为一次顺序下载
async function fetchRest(
  head: HeadResult,
  url: string,
  wantEnd: number,
): Promise<Uint8Array | null> {
  const start = head.buf.length
  if (wantEnd <= start) return head.buf
  const need = wantEnd - start
  if (head.reader) {
    const more = await readFrom(head.reader, need, true)
    head.reader = null
    if (more.length === 0) return null
    return concatBytes(head.buf, more)
  }
  if (!head.rangeSupported) return null
  const rest = await fetchBytes(url, start, wantEnd - 1)
  if (!rest || rest.length === 0) return null
  return concatBytes(head.buf, rest)
}

function releaseHead(head: HeadResult) {
  const reader = head.reader
  if (!reader) return
  head.reader = null
  try {
    reader.cancel().catch(() => {})
  } catch {}
  try {
    reader.releaseLock()
  } catch {}
}

async function extractMp3(head: HeadResult, url: string): Promise<ExtractedCover | null> {
  const buf = head.buf
  const major = buf[3]
  if (major < 2 || major > 4) return null
  const tagSize = syncsafe32(buf, 6)
  if (tagSize <= 0 || tagSize > INITIAL_LIMIT + MAX_EXTRA_FETCH) return null
  const tagEnd = 10 + tagSize
  let tag = buf
  if (tagEnd > buf.length) {
    const rest = await fetchRest(head, url, tagEnd)
    if (!rest || rest.length === 0) return null
    tag = rest
  }
  const pic = findMp3Picture(tag.subarray(0, Math.min(tag.length, tagEnd)))
  if (!pic) return null
  return {
    mime: pic.mime,
    blobUrl: URL.createObjectURL(new Blob([pic.data as BlobPart], { type: pic.mime })),
  }
}

async function extractFlac(head: HeadResult, url: string): Promise<ExtractedCover | null> {
  const buf = head.buf
  let pos = 4
  while (pos + 4 <= buf.length) {
    const header = buf[pos]
    const type = header & 0x7f
    const isLast = (header & 0x80) !== 0
    const len = be24(buf, pos + 1)
    const body = pos + 4
    if (len <= 0) return null
    if (type === 6) {
      let block = buf.subarray(body, Math.min(body + len, buf.length))
      if (body + len > buf.length) {
        const full = await fetchRest(head, url, body + len)
        if (!full || full.length === 0) return null
        block = full.subarray(body)
      }
      const pic = parseFlacPictureBlock(block)
      if (!pic) return null
      return {
        mime: pic.mime,
        blobUrl: URL.createObjectURL(new Blob([pic.data as BlobPart], { type: pic.mime })),
      }
    }
    if (isLast) return null
    pos = body + len
  }
  return null
}

const cache = new Map<string, Promise<ExtractedCover | null>>()

// 撤销延迟：切曲后给界面换图留出余量，避免撤销仍被 <img> 引用的 URL
const REVOKE_DELAY_MS = 60_000

export function extractAudioCover(src: string): Promise<ExtractedCover | null> {
  const hit = cache.get(src)
  if (hit) return hit
  const p = doExtract(src)
  cache.set(src, p)
  return p
}

// 曲目切换后回收旧封面的 blob URL：撤销是延迟执行的，同时移除缓存条目，
// 切回该曲目会重新提取（代价是一次元数据请求）；
// 不撤销的话会话内切换曲目会累积持有整张封面图
export function revokeAudioCover(src: string) {
  const hit = cache.get(src)
  if (!hit) return
  cache.delete(src)
  hit
    .then((cover) => {
      if (!cover) return
      window.setTimeout(() => URL.revokeObjectURL(cover.blobUrl), REVOKE_DELAY_MS)
    })
    .catch(() => {})
}

async function doExtract(src: string): Promise<ExtractedCover | null> {
  try {
    const url =
      src.startsWith('/') || src.startsWith('./') ? new URL(src, location.origin).href : src
    const head = await fetchHead(url)
    if (!head) return null
    try {
      if (head.buf.length < 10) return null
      if (ascii(head.buf, 0, 3) === 'ID3') return await extractMp3(head, url)
      if (ascii(head.buf, 0, 4) === 'fLaC') return await extractFlac(head, url)
      return null
    } finally {
      // 所有出口都释放可能仍持有的响应流（200 续读场景）
      releaseHead(head)
    }
  } catch {
    return null
  }
}
