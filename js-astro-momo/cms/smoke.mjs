// 冒烟测试：在 jsdom 中真实点击「新建文章」→ 创建 → 编辑 → 实时预览 → 保存 → 删除
// 覆盖：el() 只读属性（input.list）、空路径自动生成 yyyy/yyyy-mm-dd
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost:5188/',
  pretendToBeVisual: true,
})

const { window } = dom
const setGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}
setGlobal('window', window)
setGlobal('document', window.document)
setGlobal('location', window.location)
setGlobal('navigator', window.navigator)
setGlobal('HTMLElement', window.HTMLElement)
setGlobal('HTMLInputElement', window.HTMLInputElement)
setGlobal('HTMLIFrameElement', window.HTMLIFrameElement)
setGlobal('Node', window.Node)
setGlobal('Event', window.Event)
setGlobal('HashChangeEvent', window.HashChangeEvent)
setGlobal('KeyboardEvent', window.KeyboardEvent)
setGlobal('confirm', () => true)
setGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 0))
window.confirm = () => true
window.requestAnimationFrame = (cb) => setTimeout(cb, 0)

// 浏览器里相对 URL 由页面 origin 解析；node fetch 需要绝对 URL，这里模拟浏览器行为
const realFetch = globalThis.fetch
setGlobal('fetch', (input, init) => {
  const url = typeof input === 'string' ? new URL(input, window.location.origin).href : input
  return realFetch(url, init)
})

// 在 window 上跑模块（模块内部使用全局 document/window/location）
const { renderList } = await import('./src/pages/ListPage.ts')
const { renderEditor } = await import('./src/pages/EditorPage.ts')

const app = document.getElementById('app')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// 模拟 main.ts 的路由渲染：每次先清空 app 再渲染
const render = (fn, ...args) => {
  app.innerHTML = ''
  return fn(app, ...args)
}

async function waitFor(fn, timeout = 8000, interval = 100) {
  const start = Date.now()
  let result
  while (Date.now() - start < timeout) {
    result = await fn()
    if (result) return result
    await sleep(interval)
  }
  return false
}

// 轮询直到文章被删除（GET 返回 404）
async function waitDeleted(path, timeout = 10000) {
  return waitFor(async () => {
    const res = await realFetch('http://localhost:5188/api/articles/' + encodeURI(path))
    return res.status === 404
  }, timeout, 200)
}

// ---------- 1. 列表页渲染 ----------
await render(renderList)
const btnNew = document.getElementById('btn-new')
if (!btnNew) throw new Error('FAIL: 列表页未渲染出「新建文章」按钮')
console.log('PASS: 列表页渲染，新建按钮存在')

// ---------- 1.1 概览页渲染 ----------
const { renderOverview } = await import('./src/pages/OverviewPage.ts')
await render(renderOverview)
const statCards = await waitFor(() => app.querySelectorAll('.stat-card').length >= 4, 8000)
if (!statCards) throw new Error('FAIL: 概览页未渲染统计卡片')
const statText = app.querySelector('.stat-grid').textContent
if (!statText.includes('文章总数') || !statText.includes('正文总字数')) {
  throw new Error('FAIL: 概览页统计卡片内容缺失: ' + statText)
}
console.log('PASS: 概览页渲染，统计卡片数量=' + app.querySelectorAll('.stat-card').length)

// ---------- 1.2 列表页表格 / 卡片视图切换 ----------
await render(renderList)
const viewTable = document.getElementById('view-table')
if (!viewTable) throw new Error('FAIL: 未渲染「表格」视图切换按钮')
viewTable.click()
await sleep(200)
if (!app.querySelector('.article-table')) throw new Error('FAIL: 表格视图未渲染出表格')
console.log('PASS: 表格视图切换成功')
document.getElementById('view-card').click()
await sleep(200)
if (app.querySelector('.article-table')) throw new Error('FAIL: 切回卡片视图后表格未移除')
if (app.querySelector('#article-list').classList.contains('is-table')) throw new Error('FAIL: 卡片视图容器仍带表格样式')
console.log('PASS: 卡片视图切换成功')

// ---------- 2. 点击「新建文章」打开弹窗（复现原 bug 的位置） ----------
btnNew.click()
await sleep(300)
const modalInput = app.querySelector('.modal input')
const modalSubmit = document.getElementById('modal-submit')
if (!modalInput || !modalSubmit) throw new Error('FAIL: 新建弹窗未打开')
console.log('PASS: 点击新建文章，弹窗正常打开（不再抛 list 只读属性错误）')

// ---------- 3. 填写并创建 ----------
const inputs = app.querySelectorAll('.modal input')
inputs[0].value = 'smoke-test-post' // 路径
const submitBtn = document.getElementById('modal-submit')
submitBtn.click()

// 等待跳转（api.create 完成）
const navigated = await waitFor(() => location.hash.startsWith('#/edit/'), 10000)
if (!navigated) throw new Error('FAIL: 创建后未跳转到编辑页 (hash=' + location.hash + ')')
console.log('PASS: 创建成功并跳转编辑页 →', location.hash)

// ---------- 4. 编辑器渲染 + 预览 ----------
const path = decodeURIComponent(location.hash.replace(/^#\/edit\//, ''))
await render(renderEditor, path)
await sleep(500)
const titleInput = document.getElementById('f-title')
const mdEditor = document.getElementById('md-editor')
const frame = document.getElementById('preview-frame')
if (!titleInput || !mdEditor || !frame) throw new Error('FAIL: 编辑器页面元素缺失')
console.log('PASS: 编辑器渲染（表单 + textarea + 预览 iframe）')

// 等待首次预览渲染
const previewOk = await waitFor(() => frame.srcdoc && frame.srcdoc.length > 200, 15000)
if (!previewOk) throw new Error('FAIL: 预览未渲染')
console.log('PASS: 实时预览已渲染, srcdoc len=' + frame.srcdoc.length)

// ---------- 5. 修改正文 → 防抖预览 ----------
mdEditor.value = '# 冒烟测试\n\n::note[hello]\n\n$E=mc^2$'
mdEditor.dispatchEvent(new window.Event('input', { bubbles: true }))
const preview2 = await waitFor(() => frame.srcdoc.includes('admonition-title'), 15000)
if (!preview2) throw new Error('FAIL: 编辑后预览未更新（含 note 组件）')
console.log('PASS: 编辑正文后实时预览更新（Alert 组件渲染成功）')

// ---------- 6. 保存 ----------
const saveBtn = document.getElementById('btn-save')
saveBtn.click()
await sleep(1200)
const dirtyBadge = document.getElementById('dirty-badge')
console.log('PASS: 保存完成, dirty=' + (!dirtyBadge || dirtyBadge.hidden))

// ---------- 7. 清理测试文章 ----------
const delBtn = document.querySelector('.btn-danger')
const smokePath = 'smoke-test-post'
delBtn.click()
const smokeDeleted = await waitDeleted(smokePath)
if (!smokeDeleted) throw new Error('FAIL: smoke-test-post 删除未完成')
console.log('PASS: 删除完成, hash=' + location.hash)

// ---------- 8. 空路径新建 → 自动生成 yyyy/yyyy-mm-dd ----------
await render(renderList)
await sleep(300)
document.getElementById('btn-new').click()
await sleep(200)
const modalInputs = app.querySelectorAll('.modal input')
modalInputs[0].value = '' // 路径留空
document.getElementById('modal-submit').click()
const autoPath = await waitFor(() => {
  const m = location.hash.match(/^#\/edit\/(\d{4})\/(\d{4}-\d{2}-\d{2})$/)
  return m ? m[1] + '/' + m[2] : null
}, 10000)
if (!autoPath) throw new Error('FAIL: 空路径未自动生成日期路径 (hash=' + location.hash + ')')
console.log('PASS: 空路径自动生成 → #/edit/' + autoPath)

// 清理自动生成的文章
const autoPathStr = decodeURIComponent(location.hash.replace(/^#\/edit\//, ''))
await render(renderEditor, autoPathStr)
await sleep(500)
document.querySelector('.btn-danger').click()
const autoDeleted = await waitDeleted(autoPathStr)
if (!autoDeleted) throw new Error('FAIL: 自动生成文章删除未完成: ' + autoPathStr)
console.log('PASS: 自动生成文章已删除 (' + autoPathStr + ')')

console.log('\n=== 冒烟测试全部通过 ===')
process.exit(0)
