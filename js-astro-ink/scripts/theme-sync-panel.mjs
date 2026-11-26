import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const themeRoot = path.resolve(scriptDir, '..')
const host = '127.0.0.1'
const token = randomBytes(24).toString('hex')

function panelOptions(args) {
  const opts = {
    source: themeRoot,
    target: path.resolve(themeRoot, '..', 'Blog'),
    port: 4175,
    open: true
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--no-open') opts.open = false
    else if (['--source', '--target', '--port'].includes(arg)) {
      const value = args[++i]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--source') opts.source = path.resolve(value)
      if (arg === '--target') opts.target = path.resolve(value)
      if (arg === '--port') {
        const port = Number(value)
        if (!Number.isInteger(port) || port < 0 || port > 65535)
          throw new Error('--port must be an integer from 0 to 65535')
        opts.port = port
      }
    } else if (arg === '--help') {
      console.log(
        'Theme sync panel: pnpm theme:sync:ui [--source <theme-directory>] [--target <blog-directory>] [--port <port>] [--no-open]\n' +
          'Starts a local-only browser panel. The panel previews by default and asks before applying.'
      )
      process.exit(0)
    } else throw new Error(`Unknown argument: ${arg}`)
  }
  return opts
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// The embedded document is deliberately kept as authored; formatting its
// visible copy inside this JavaScript template would alter the rendered panel.
// prettier-ignore
function page(defaults) {
  const source = escapeHtml(defaults.source)
  const target = escapeHtml(defaults.target)
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ink · 主题同步</title>
    <style>
      :root { color-scheme: light dark; font-family: Inter, "Noto Sans SC", system-ui, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; min-width: 20rem; background: #f8f7f3; color: #252522; }
      main { width: min(62rem, calc(100% - 2rem)); margin: 0 auto; padding: 3.5rem 0 4rem; }
      h1, h2 { font-family: Georgia, "Noto Serif SC", serif; font-weight: 600; }
      h1 { margin: 0; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.035em; }
      h2 { margin: 0; font-size: 1.25rem; }
      p { color: #67655f; line-height: 1.7; }
      .eyebrow { margin: 0 0 .75rem; color: #9a5b38; font-size: .78rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
      .panel { margin-top: 2rem; padding: 1.35rem; border: 1px solid #dfddd5; border-radius: .8rem; background: rgb(255 255 255 / .78); box-shadow: 0 1rem 3rem rgb(45 40 30 / .06); }
      .fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      label { display: grid; gap: .45rem; color: #484641; font-size: .86rem; font-weight: 600; }
      input[type="text"] { width: 100%; min-width: 0; padding: .7rem .8rem; border: 1px solid #cbc8be; border-radius: .5rem; background: #fffefa; color: inherit; font: inherit; }
      input[type="text"]:focus { outline: 2px solid #b77750; outline-offset: 2px; }
      .checks { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
      .checks label { display: flex; align-items: center; gap: .45rem; font-weight: 400; }
      .actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.25rem; }
      button { appearance: none; min-height: 2.55rem; border: 1px solid #b77750; border-radius: .5rem; padding: .55rem .9rem; background: transparent; color: #864325; cursor: pointer; font: inherit; font-weight: 650; }
      button.primary { background: #9a5b38; color: #fff; }
      button:hover:not(:disabled) { filter: brightness(.95); }
      button:focus-visible { outline: 2px solid #9a5b38; outline-offset: 3px; }
      button:disabled { cursor: wait; opacity: .55; }
      .notice { margin: 1rem 0 0; min-height: 1.5rem; color: #67655f; font-size: .92rem; }
      .notice.error { color: #a33c2d; }
      .notice.ok { color: #496b48; }
      .result { display: none; margin-top: 1.5rem; border-top: 1px solid #e4e1da; padding-top: 1.25rem; }
      .summary { display: flex; flex-wrap: wrap; gap: .5rem; margin: .75rem 0; }
      .badge { border: 1px solid #d5d1c6; border-radius: 999px; padding: .22rem .55rem; color: #5f5b53; font-size: .78rem; }
      .changes { display: grid; gap: .4rem; margin-top: 1rem; }
      .change { display: grid; grid-template-columns: 5.5rem 1fr; gap: .75rem; align-items: baseline; padding: .55rem .7rem; border-radius: .4rem; background: #f5f3ed; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .8rem; }
      .change strong { color: #9a5b38; font-size: .72rem; letter-spacing: .04em; }
      details .change { display: list-item; cursor: pointer; overflow-wrap: anywhere; }
      details .change strong { margin-inline-end: .75rem; }
      .file-diff { min-width: 0; padding: 0 .7rem .7rem; }
      .file-diff h3 { margin: 1rem 0 .35rem; font-size: .88rem; }
      .file-diff pre { margin: 0; white-space: pre; }
      .diff-add { color: #c1d6af; }
      .diff-remove { color: #efbcaa; }
      pre { max-height: 18rem; overflow: auto; margin: 1rem 0 0; padding: 1rem; border-radius: .5rem; background: #292825; color: #dedbd2; font: .78rem/1.6 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
      .hint { margin-top: 2rem; font-size: .85rem; }
      code { border-radius: .25rem; background: #ece9e0; padding: .12rem .28rem; color: #514d45; }
      @media (prefers-color-scheme: dark) { body { background: #1d1d1b; color: #e9e6dc; } p, .notice { color: #b9b5aa; } .panel { border-color: #42413b; background: #262522; box-shadow: none; } label { color: #dedbd2; } input[type="text"] { border-color: #5c5a51; background: #1c1c1a; color: #efede5; } .result { border-color: #42413b; } .badge { border-color: #59574f; color: #c7c3b9; } .change { background: #30302c; } code { background: #373630; color: #e5e1d7; } }
      @media (max-width: 42rem) { main { width: min(100% - 1.25rem, 62rem); padding-top: 2rem; } .fields { grid-template-columns: 1fr; } .change { grid-template-columns: 1fr; gap: .2rem; } }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">astro-theme-ink · local only</p>
      <h1>主题同步面板</h1>
      <p>先预览主题与博客之间的差异；确认文件列表后，再应用。面板只监听本机，不会提交、推送或部署。</p>
      <form class="panel" id="sync-form">
        <div class="fields">
          <label>主题目录<input id="source" type="text" value="${source}" spellcheck="false" /></label>
          <label>博客目录<input id="target" type="text" value="${target}" spellcheck="false" /></label>
        </div>
        <div class="checks">
          <label><input id="init" type="checkbox" /> 首次接入（没有 <code>.theme-sync.json</code> 时使用）</label>
          <label><input id="allow-dirty" type="checkbox" /> 允许博客存在未提交变更</label>
        </div>
        <div class="actions">
          <button id="preview" type="submit" class="primary">预览同步</button>
          <button id="apply" type="button">应用已预览的变更</button>
        </div>
        <p id="notice" class="notice" aria-live="polite">预览不会写入任何文件。</p>
        <section id="result" class="result" aria-live="polite">
          <h2>本次结果</h2>
          <div id="summary" class="summary"></div>
          <div id="changes" class="changes"></div>
          <pre id="log"></pre>
        </section>
      </form>
      <p class="hint">需要手动解决的 <code>REVIEW</code> 或 <code>CONFLICT</code>，请按 <code>docs/theme-sync.md</code> 处理后重新预览。</p>
    </main>
    <script>
      const token = ${JSON.stringify(token)}
      const form = document.querySelector('#sync-form')
      const preview = document.querySelector('#preview')
      const apply = document.querySelector('#apply')
      const notice = document.querySelector('#notice')
      const result = document.querySelector('#result')
      const summary = document.querySelector('#summary')
      const changes = document.querySelector('#changes')
      const log = document.querySelector('#log')
      let previewed = false
      let previewKey = ''
      const payload = (action) => ({
        action,
        source: document.querySelector('#source').value,
        target: document.querySelector('#target').value,
        init: document.querySelector('#init').checked,
        allowDirty: document.querySelector('#allow-dirty').checked
      })
      const setBusy = (busy) => {
        preview.disabled = busy
        apply.disabled = busy
      }
      const show = (data) => {
        result.style.display = 'block'
        summary.replaceChildren()
        for (const [kind, count] of Object.entries(data.summary)) {
          const badge = document.createElement('span')
          badge.className = 'badge'
          badge.textContent = kind + ' ' + count
          summary.append(badge)
        }
        changes.replaceChildren()
        for (const item of data.changes) {
          const expandable = data.reviewId && (item.kind === 'REVIEW' || item.kind === 'CONFLICT')
          const row = document.createElement(expandable ? 'summary' : 'div')
          row.className = 'change'
          const kind = document.createElement('strong')
          kind.textContent = item.kind
          const name = document.createElement('span')
          name.textContent = item.name
          row.append(kind, name)
          if (expandable) {
            const details = document.createElement('details')
            const content = document.createElement('div')
            content.className = 'file-diff'
            content.setAttribute('aria-live', 'polite')
            let loading = false
            details.addEventListener('toggle', async () => {
              if (!details.open || loading) return
              loading = true
              content.textContent = '正在读取差异…'
              try {
                const response = await fetch('/api/sync', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json', 'x-ink-sync-token': token },
                  body: JSON.stringify({ action: 'diff', reviewId: data.reviewId, name: item.name })
                })
                const detail = await response.json()
                if (!response.ok) throw new Error(detail.message)
                content.replaceChildren()
                for (const section of detail.sections) {
                  const title = document.createElement('h3')
                  title.textContent = section.title
                  const patch = document.createElement('pre')
                  for (const line of section.text.split('\\n')) {
                    const span = document.createElement('span')
                    if (line.startsWith('+')) span.className = 'diff-add'
                    else if (line.startsWith('-')) span.className = 'diff-remove'
                    span.textContent = line + '\\n'
                    patch.append(span)
                  }
                  content.append(title, patch)
                }
              } catch (error) {
                loading = false
                content.textContent = '无法读取差异：' + error.message
              }
            })
            details.append(row, content)
            changes.append(details)
          } else changes.append(row)
        }
        log.textContent = data.log
      }
      const run = async (action) => {
        setBusy(true)
        notice.className = 'notice'
        notice.textContent = action === 'apply' ? '正在应用…' : '正在预览…'
        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-ink-sync-token': token },
            body: JSON.stringify(payload(action))
          })
          const data = await response.json()
          show(data)
          previewed = action === 'preview' && data.ok
          previewKey = previewed ? JSON.stringify(payload('preview')) : ''
          notice.className = data.ok ? 'notice ok' : 'notice error'
          notice.textContent = data.message
        } catch (error) {
          previewed = false
          notice.className = 'notice error'
          notice.textContent = '面板请求失败：' + error.message
        } finally { setBusy(false) }
      }
      form.addEventListener('submit', (event) => { event.preventDefault(); run('preview') })
      apply.addEventListener('click', () => {
        if (!previewed || previewKey !== JSON.stringify(payload('preview'))) { notice.className = 'notice error'; notice.textContent = '目录或选项已变更，请重新预览。'; return }
        if (confirm('确认将预览中列出的主题变更写入博客目录？')) run('apply')
      })
    </script>
  </body>
</html>`
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 64 * 1024) request.destroy(new Error('Request body is too large.'))
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('Invalid JSON request.'))
      }
    })
    request.on('error', reject)
  })
}

function response(reply, status, value) {
  reply.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  })
  reply.end(JSON.stringify(value))
}

function requestOptions(input) {
  if (!input || typeof input !== 'object') throw new Error('Invalid request.')
  if (!['preview', 'apply'].includes(input.action)) throw new Error('Invalid sync action.')
  if (typeof input.source !== 'string' || typeof input.target !== 'string')
    throw new Error('Theme and blog directories are required.')
  if (input.source.includes('\0') || input.target.includes('\0'))
    throw new Error('Invalid directory.')
  return {
    action: input.action,
    source: path.resolve(input.source),
    target: path.resolve(input.target),
    init: input.init === true,
    allowDirty: input.allowDirty === true
  }
}

function parseLog(log) {
  const changes = []
  const summary = {}
  for (const line of log.split(/\r?\n/)) {
    const matched = line.match(
      /^(UPDATE|ADD|DELETE|MERGE|REVIEW|CONFLICT|BASELINE|KEEP LOCAL \(REVIEWED\)|USE THEME \(REVIEWED\)) (.+)$/
    )
    if (!matched) continue
    const [, kind, name] = matched
    changes.push({ kind, name })
    summary[kind] = (summary[kind] ?? 0) + 1
  }
  return { changes, summary }
}

function runSync(opts) {
  return new Promise((resolve) => {
    const syncScript =
      opts.action === 'diff'
        ? path.join(scriptDir, 'theme-sync.mjs')
        : path.join(opts.source, 'scripts', 'theme-sync.mjs')
    if (!fs.existsSync(syncScript)) {
      resolve({ status: 1, log: `Theme sync script not found: ${syncScript}\n` })
      return
    }
    const args = [syncScript, '--source', opts.source, '--target', opts.target]
    if (opts.init) args.push('--init')
    if (opts.allowDirty) args.push('--allow-dirty')
    if (opts.action === 'apply') args.push('--apply')
    if (opts.action === 'diff') args.push('--diff', opts.name)
    const child = spawn(process.execPath, args, { cwd: opts.source, windowsHide: true })
    let log = ''
    let stdout = ''
    const append = (chunk) => {
      log += chunk
      if (log.length > 1024 * 1024) {
        child.kill()
        log += '\nOutput exceeded 1 MiB; sync stopped.\n'
      }
    }
    child.stdout.setEncoding('utf8').on('data', (chunk) => {
      if (opts.action === 'diff') stdout += chunk
      append(chunk)
    })
    child.stderr.setEncoding('utf8').on('data', append)
    child.on('error', (error) => resolve({ status: 1, log: `${log}${error.message}\n` }))
    child.on('close', (status) => resolve({ status: status ?? 1, log, stdout }))
  })
}

function openBrowser(url) {
  const command =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]]
  const child = spawn(command[0], command[1], {
    detached: true,
    stdio: 'ignore',
    ...(process.platform === 'win32' ? { windowsHide: true } : {})
  })
  child.unref()
}

const defaults = panelOptions(process.argv.slice(2))
let review
const server = http.createServer(async (request, reply) => {
  // Reject DNS-rebinding requests: only the loopback host may use the panel.
  const hostHeader = request.headers.host || ''
  if (!/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(hostHeader)) {
    reply.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    reply.end('Forbidden')
    return
  }
  if (request.method === 'GET' && request.url === '/') {
    reply.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    })
    reply.end(page(defaults))
    return
  }
  if (request.method === 'POST' && request.url === '/api/sync') {
    if (request.headers['x-ink-sync-token'] !== token) {
      response(reply, 403, {
        ok: false,
        message: 'Invalid local panel token.',
        log: '',
        changes: [],
        summary: {}
      })
      return
    }
    try {
      const input = await readJson(request)
      if (input?.action === 'diff') {
        if (!review || input.reviewId !== review.id || !review.names.has(input.name)) {
          response(reply, 409, { message: '该文件不在当前待核对列表中，请重新预览。' })
          return
        }
        const detail = await runSync({ ...review.opts, action: 'diff', name: input.name })
        if (detail.status !== 0) throw new Error(detail.log.trim())
        response(reply, 200, { sections: JSON.parse(detail.stdout) })
        return
      }
      const opts = requestOptions(input)
      review = null
      const result = await runSync(opts)
      const parsed = parseLog(result.log)
      const ok = result.status === 0
      if (opts.action === 'preview' && result.status === 2) {
        const unresolved = parsed.changes.filter(
          ({ kind }) => kind === 'REVIEW' || kind === 'CONFLICT'
        )
        review = {
          id: randomBytes(16).toString('hex'),
          opts,
          names: new Set(unresolved.map(({ name }) => name))
        }
      }
      response(reply, ok ? 200 : 422, {
        ok,
        reviewId: review?.id,
        message: ok
          ? opts.action === 'preview'
            ? '预览完成，尚未写入任何文件。'
            : '同步已应用。请检查 Git diff。'
          : result.status === 2
            ? '有文件需要人工处理；没有写入任何文件。'
            : '同步未完成；请查看日志。',
        log: result.log,
        ...parsed
      })
    } catch (error) {
      response(reply, 400, {
        ok: false,
        message: error.message,
        log: '',
        changes: [],
        summary: {}
      })
    }
    return
  }
  reply.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  reply.end('Not found')
})

server.listen({ host, port: defaults.port }, () => {
  const address = server.address()
  const url = `http://${host}:${address.port}`
  console.log(`Theme sync panel: ${url}\nPress Ctrl+C to stop.`)
  if (defaults.open) openBrowser(url)
})
