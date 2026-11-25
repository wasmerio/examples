import { rememberFocus } from '@/lib/focusTrap'

const FACE_SIZE = 224

const MAX_X = 14
const MAX_Y = 16
const RANGE = 280
const EASE = 0.15

const SLIDE_DIST = 168
const SPEED_OUT = 0.26
const SPEED_IN = 0.2

const BLINK_SCALE = 1 / 2.5
const CLOSE_HOLD = 1500

const SLEEP_DELAY = 5000

const TOUCH_TAP_MS = 300
const TOUCH_TAP_MOVE = 10
const TOUCH_SLIDE_DIST = 24
const EMULATED_MOUSE_GUARD = 500

const LONG_PRESS_MS = 550
const LONG_PRESS_MOVE = 14

const ALERT_MS = 620
const CARD_CLOSE_MS = 150

const PET_GRID = 8
const CELL_STEP = 16
const CELL_DISSOLVE_MS = 380
const CELL_ASSEMBLE_MS = 400
const CELL_MAX_ORDER = (PET_GRID - 1) * 2
const SETTLE_MS = 24
const CLICK_GUARD = 400

const HIDE_KEY = 'petClosedUntil'
const HIDE_DURATION = 24 * 60 * 60 * 1000

interface TouchStart {
  x: number
  y: number
  at: number
  onPet: boolean
  moved: boolean
  slid: boolean
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

function petClosedUntil(): number {
  try {
    return Number(window.localStorage.getItem(HIDE_KEY) || 0)
  } catch {
    return 0
  }
}

let petLayoutSync: (() => void) | null = null

export function syncPet() {
  petLayoutSync?.()
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function buildPetGrid(face: HTMLElement): HTMLElement {
  const existing = face.querySelector<HTMLElement>('.pet-grid')
  if (existing) return existing

  const grid = document.createElement('div')
  grid.className = 'pet-grid'
  grid.setAttribute('aria-hidden', 'true')
  for (let row = 0; row < PET_GRID; row++) {
    for (let col = 0; col < PET_GRID; col++) {
      if (row !== 0 && col !== 0 && row !== PET_GRID - 1 && col !== PET_GRID - 1) continue
      const cell = document.createElement('span')
      cell.className = 'pet-cell'
      cell.style.left = `calc(var(--pet-unit) * ${col})`
      cell.style.top = `calc(var(--pet-unit) * ${row})`
      cell.dataset.order = String(row + col)
      grid.appendChild(cell)
    }
  }
  face.appendChild(grid)
  return grid
}

let gridAnims: Animation[] = []

function playGrid(grid: HTMLElement, mode: 'dissolve' | 'assemble') {
  const duration = mode === 'dissolve' ? CELL_DISSOLVE_MS : CELL_ASSEMBLE_MS
  const frames: Keyframe[] =
    mode === 'dissolve'
      ? [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1.45)', opacity: 0.9, offset: 0.45 },
          { transform: 'scale(0.1)', opacity: 0 },
        ]
      : [
          { transform: 'scale(0.1)', opacity: 0 },
          { transform: 'scale(1.3)', opacity: 1, offset: 0.55 },
          { transform: 'scale(1)', opacity: 1 },
        ]

  for (const anim of gridAnims) anim.cancel()
  gridAnims = []
  for (const cell of grid.querySelectorAll<HTMLElement>('.pet-cell')) {
    const order = Number(cell.dataset.order || 0)
    const delay = (mode === 'dissolve' ? order : CELL_MAX_ORDER - order) * CELL_STEP
    gridAnims.push(
      cell.animate(frames, {
        duration,
        delay,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
      }),
    )
  }
  return CELL_MAX_ORDER * CELL_STEP + duration
}

const RESTORE_WIDTH = 84

let petRevive: (() => void) | null = null
let restoreBound = false
let restoreHideAnim: Animation | null = null

const restoreBtn = () => document.querySelector<HTMLElement>('[data-pet-restore]')

function showRestoreBtn(animate: boolean) {
  const btn = restoreBtn()
  if (!btn) return
  if (!btn.hidden) return
  restoreHideAnim?.cancel()
  restoreHideAnim = null
  btn.hidden = false
  if (!animate || prefersReducedMotion()) return
  btn.animate(
    [
      { width: '0px', opacity: 0, transform: 'translateY(-46px)' },
      { width: `${RESTORE_WIDTH}px`, opacity: 1, transform: 'translateY(5px)', offset: 0.7 },
      { width: `${RESTORE_WIDTH}px`, opacity: 1, transform: 'translateY(0)' },
    ],
    { duration: 520, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  )
}

function hideRestoreBtn(animate: boolean) {
  const btn = restoreBtn()
  if (!btn || btn.hidden) return
  if (!animate || prefersReducedMotion()) {
    restoreHideAnim?.cancel()
    restoreHideAnim = null
    btn.hidden = true
    return
  }
  restoreHideAnim = btn.animate(
    [
      { width: `${RESTORE_WIDTH}px`, opacity: 1, transform: 'translateY(0)' },
      { width: '0px', opacity: 0, transform: 'translateY(-12px)' },
    ],
    { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
  )
  restoreHideAnim.onfinish = () => {
    btn.hidden = true
  }
}

function syncRestoreBtn(animate: boolean) {
  if (petClosedUntil() > Date.now()) showRestoreBtn(animate)
  else hideRestoreBtn(false)
}

function restorePet() {
  try {
    window.localStorage.removeItem(HIDE_KEY)
  } catch {}
  hideRestoreBtn(true)
  if (petRevive) {
    petRevive()
    return
  }
  document.documentElement.classList.remove('pet-off')
  document.documentElement.classList.add('pet-assembling')
  initPet()
}

function bindRestore() {
  if (restoreBound) return
  const btn = restoreBtn()
  if (!btn) return
  restoreBound = true
  btn.addEventListener('click', restorePet)
}

export function initPet() {
  bindRestore()
  const root = document.querySelector<HTMLElement>('[data-pet]')
  if (!root || root.dataset.petReady === '1') return
  const petEl: HTMLElement = root
  if (petClosedUntil() > Date.now()) {
    syncRestoreBtn(true)
    return
  }
  const slide = petEl.querySelector<HTMLElement>('[data-pet-slide]')
  const eyes = petEl.querySelector<HTMLElement>('[data-pet-eyes]')
  const eyeEls = Array.from(petEl.querySelectorAll<HTMLElement>('[data-pet-eye]'))
  if (!slide || !eyes || eyeEls.length === 0) return
  root.dataset.petReady = '1'

  const card = petEl.querySelector<HTMLElement>('[data-pet-card]')
  const dismissBtn = petEl.querySelector<HTMLElement>('[data-pet-dismiss]')

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  let scale = 1
  const measure = () => {
    const width = petEl.getBoundingClientRect().width
    if (width > 0) scale = width / FACE_SIZE
  }
  measure()
  new ResizeObserver(measure).observe(petEl)

  const syncAnchor = () => {
    const main = document.querySelector<HTMLElement>('#swup-container > main')
    if (!main) return
    const left = main.getBoundingClientRect().left
    petEl.style.setProperty('--pet-anchor-x', `${left.toFixed(2)}px`)
  }

  const syncBottom = () => {
    const lowest = Array.from(
      document.querySelectorAll<HTMLElement>('.scroll-control-nav, .music-fab'),
    ).reduce((max, el) => {
      const rect = el.getBoundingClientRect()
      return rect.height > 0 ? Math.max(max, rect.bottom) : max
    }, 0)
    if (lowest <= 0) return
    const offset = window.innerHeight - lowest
    if (offset > 0) petEl.style.setProperty('--pet-bottom', `${offset.toFixed(2)}px`)
  }

  const syncLayout = () => {
    syncAnchor()
    syncBottom()
  }

  syncLayout()
  const scheduleLayout = () => requestAnimationFrame(syncLayout)
  window.addEventListener('resize', scheduleLayout)
  new ResizeObserver(scheduleLayout).observe(document.documentElement)
  window.visualViewport?.addEventListener('resize', scheduleLayout)
  document.addEventListener('astro:after-swap', scheduleLayout)
  document.addEventListener('astro:page-load', scheduleLayout)

  petLayoutSync = () => {
    syncLayout()
    measure()
  }

  const face = petEl.querySelector<HTMLElement>('[data-pet-face]')

  const playAssemble = () => {
    const html = document.documentElement
    if (!face || reduceMotion.matches) {
      html.classList.remove('pet-assembling')
      return
    }
    html.classList.add('pet-assembling')
    const grid = buildPetGrid(face)
    const total = playGrid(grid, 'assemble')
    window.setTimeout(() => {
      grid.remove()
      html.classList.remove('pet-assembling')
    }, total + SETTLE_MS)
  }

  const playDissolve = () => {
    if (!face || reduceMotion.matches) return 0
    return playGrid(buildPetGrid(face), 'dissolve')
  }

  if (document.documentElement.classList.contains('pet-assembling')) playAssemble()

  let slidePhase = 0
  let slideDir = 0
  let slideOffset = 0

  let blink = 1
  let closed = false
  let closeValue = 1
  let closeTimer = 0
  let lastActivity = Date.now()
  let isSleeping = false

  let mouseX = 0
  let mouseY = 0
  let active = false
  const cur = { x: 0, y: 0 }
  const tgt = { x: 0, y: 0 }

  let cardOpen = false
  let leaving = false
  let stopped = false
  let longPressTimer = 0
  let longPressFired = false
  let pressFrom: { x: number; y: number } | null = null
  let alertTimer = 0
  let cardCloseTimer = 0
  let restoreCardFocus: () => void = () => {}

  function compute() {
    if (!active) {
      tgt.x = 0
      tgt.y = 0
      return
    }

    const rect = petEl.getBoundingClientRect()
    const dx = mouseX - (rect.left + rect.width / 2)
    const dy = mouseY - (rect.top + rect.height / 2)
    const dist = Math.hypot(dx, dy)

    if (dist < 0.001) {
      tgt.x = 0
      tgt.y = 0
      return
    }

    const maxX = MAX_X * scale
    const maxY = MAX_Y * scale
    const k = Math.min(1, dist / (RANGE * scale))
    tgt.x = clamp((dx / dist) * maxX * k, -maxX, maxX)
    tgt.y = clamp((dy / dist) * maxY * k, -maxY, maxY)
  }

  function reset() {
    active = false
    compute()
  }

  function wake() {
    lastActivity = Date.now()
    isSleeping = false
  }

  const isOverPet = (x: number, y: number) => {
    const rect = petEl.getBoundingClientRect()
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  }
  let touchStart: TouchStart | null = null
  let lastTouchAt = 0

  const lookAt = (x: number, y: number) => {
    mouseX = x
    mouseY = y
    active = true
    wake()
    compute()
  }

  const blinkOnce = () => {
    blink = BLINK_SCALE
  }

  const closeFor = (holdMs: number) => {
    closed = true
    window.clearTimeout(closeTimer)
    closeTimer = window.setTimeout(() => {
      closed = false
    }, holdMs)
  }

  const slideOut = (dir: 1 | -1) => {
    if (reduceMotion.matches || slidePhase !== 0 || cardOpen || leaving) return false
    slideDir = dir
    slidePhase = 1
    return true
  }

  const cancelLongPress = () => {
    window.clearTimeout(longPressTimer)
    longPressTimer = 0
    pressFrom = null
  }

  const closeCard = (animate = true) => {
    if (!cardOpen || !card) return
    cardOpen = false
    petEl.classList.remove('is-alert')
    restoreCardFocus()
    const finish = () => {
      card.hidden = true
      card.classList.remove('is-closing')
    }
    if (!animate || reduceMotion.matches) {
      finish()
      return
    }
    card.classList.remove('is-open')
    card.classList.add('is-closing')
    window.clearTimeout(cardCloseTimer)
    cardCloseTimer = window.setTimeout(finish, CARD_CLOSE_MS)
  }

  const openCard = () => {
    if (cardOpen || leaving || !card) return
    cardOpen = true
    card.hidden = false
    card.classList.remove('is-closing')
    card.classList.add('is-open')
    petEl.classList.add('is-alert')
    // 卡片仅长按/触摸可唤出，键盘用户无法触达：打开时移焦到确认按钮，
    // 使其可用 Enter 确认关闭，关闭时归还焦点
    restoreCardFocus = rememberFocus()
    card.querySelector<HTMLElement>('[data-pet-dismiss]')?.focus({ preventScroll: true })
    window.clearTimeout(alertTimer)
    alertTimer = window.setTimeout(() => petEl.classList.remove('is-alert'), ALERT_MS)
    wake()
    const petRect = petEl.getBoundingClientRect()
    lookAt(petRect.left + petRect.width * 0.4, petRect.top - petRect.height * 0.6)
  }

  const startLongPress = (x: number, y: number) => {
    if (cardOpen || leaving) return
    cancelLongPress()
    longPressFired = false
    pressFrom = { x, y }
    longPressTimer = window.setTimeout(() => {
      longPressTimer = 0
      pressFrom = null
      longPressFired = true
      openCard()
    }, LONG_PRESS_MS)
  }

  const suppressNextClick = () => {
    const stop = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      document.removeEventListener('click', stop, true)
    }
    document.addEventListener('click', stop, true)
    window.setTimeout(() => document.removeEventListener('click', stop, true), CLICK_GUARD)
  }

  const releaseLongPress = () => {
    if (longPressFired) {
      longPressFired = false
      suppressNextClick()
    }
    cancelLongPress()
  }

  const confirmHide = () => {
    if (leaving) return
    leaving = true
    cancelLongPress()
    closeCard()
    try {
      window.localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DURATION))
    } catch {}
    petEl.classList.add('is-leaving')
    const instant = reduceMotion.matches
    const total = instant ? 0 : playDissolve()
    window.setTimeout(() => {
      document.documentElement.classList.add('pet-off')
      stopped = true
      syncRestoreBtn(true)
    }, total + SETTLE_MS)
  }

  dismissBtn?.addEventListener('click', () => confirmHide())

  document.addEventListener('pointerdown', (e) => {
    if (!cardOpen) return
    if (card && e.target instanceof Node && card.contains(e.target)) return
    if (e.pointerType === 'mouse' && Date.now() - lastTouchAt < EMULATED_MOUSE_GUARD) return
    closeCard()
  })

  document.addEventListener('keydown', (e) => {
    if (cardOpen && e.key === 'Escape') closeCard()
  })

  window.addEventListener(
    'mousemove',
    (e) => {
      lookAt(e.clientX, e.clientY)
      if (
        pressFrom &&
        Math.hypot(e.clientX - pressFrom.x, e.clientY - pressFrom.y) > LONG_PRESS_MOVE
      ) {
        cancelLongPress()
      }
    },
    { passive: true },
  )

  document.addEventListener('mouseleave', reset)
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) reset()
  })
  window.addEventListener('blur', reset)

  window.addEventListener(
    'wheel',
    (e) => {
      wake()
      slideOut(e.deltaY > 0 ? -1 : 1)
    },
    { passive: true },
  )

  window.addEventListener('mousedown', (e) => {
    wake()
    if (Date.now() - lastTouchAt < EMULATED_MOUSE_GUARD) return
    if (e.button === 0) {
      blinkOnce()
      if (isOverPet(e.clientX, e.clientY)) startLongPress(e.clientX, e.clientY)
    } else if (e.button === 2) closeFor(CLOSE_HOLD)
  })

  window.addEventListener('mouseup', releaseLongPress)

  document.addEventListener('contextmenu', (e) => {
    if (isOverPet(e.clientX, e.clientY)) e.preventDefault()
  })

  window.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.touches[0]
      if (!touch) return
      lastTouchAt = Date.now()
      lookAt(touch.clientX, touch.clientY)

      touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        at: lastTouchAt,
        onPet: isOverPet(touch.clientX, touch.clientY),
        moved: false,
        slid: false,
      }
      if (touchStart.onPet) startLongPress(touch.clientX, touch.clientY)
    },
    { passive: true },
  )

  window.addEventListener(
    'touchmove',
    (e) => {
      const touch = e.touches[0]
      if (!touch) return
      lastTouchAt = Date.now()
      lookAt(touch.clientX, touch.clientY)

      if (!touchStart) return
      const dx = touch.clientX - touchStart.x
      const dy = touch.clientY - touchStart.y
      const moved = Math.hypot(dx, dy)
      if (moved > TOUCH_TAP_MOVE) touchStart.moved = true
      if (moved > LONG_PRESS_MOVE) cancelLongPress()
      if (touchStart.onPet && !touchStart.slid && !cardOpen && Math.abs(dy) >= TOUCH_SLIDE_DIST) {
        touchStart.slid = slideOut(dy > 0 ? 1 : -1)
      }
    },
    { passive: true },
  )

  const endTouch = (e: TouchEvent) => {
    const touch = e.changedTouches[0]
    lastTouchAt = Date.now()
    releaseLongPress()
    if (touchStart && touch && !touchStart.moved && !touchStart.slid && !cardOpen) {
      const held = lastTouchAt - touchStart.at
      const dist = Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y)
      if (held <= TOUCH_TAP_MS && dist <= TOUCH_TAP_MOVE) blinkOnce()
    }
    touchStart = null
    reset()
  }
  window.addEventListener('touchend', endTouch, { passive: true })
  window.addEventListener('touchcancel', endTouch, { passive: true })

  let lastSlideText = ''
  let lastEyesText = ''
  let lastEyeScale = ''

  compute()

  const tick = () => {
    if (stopped) return

    if (!isSleeping && Date.now() - lastActivity > SLEEP_DELAY) isSleeping = true

    cur.x += (tgt.x - cur.x) * EASE
    cur.y += (tgt.y - cur.y) * EASE
    if (Math.abs(tgt.x - cur.x) < 0.01) cur.x = tgt.x
    if (Math.abs(tgt.y - cur.y) < 0.01) cur.y = tgt.y

    blink += (1 - blink) * 0.22

    closeValue += ((closed || isSleeping ? BLINK_SCALE : 1) - closeValue) * 0.18

    if (slidePhase === 1) {
      const goal = slideDir * SLIDE_DIST * scale
      slideOffset += (goal - slideOffset) * SPEED_OUT
      if (Math.abs(goal - slideOffset) < 1) {
        slideOffset = -goal
        slidePhase = 2
      }
    } else if (slidePhase === 2) {
      slideOffset += (0 - slideOffset) * SPEED_IN
      if (Math.abs(slideOffset) < 0.5) {
        slideOffset = 0
        slidePhase = 0
      }
    }

    const slideText = slideOffset.toFixed(2)
    if (slideText !== lastSlideText) {
      lastSlideText = slideText
      slide.style.transform = `translate3d(0, ${slideText}px, 0)`
    }

    const eyesText = `${cur.x.toFixed(2)},${cur.y.toFixed(2)}`
    if (eyesText !== lastEyesText) {
      lastEyesText = eyesText
      eyes.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`
    }

    const eyeScale = Math.max(BLINK_SCALE, blink * closeValue).toFixed(3)
    if (eyeScale !== lastEyeScale) {
      lastEyeScale = eyeScale
      for (const el of eyeEls) el.style.transform = `scaleY(${eyeScale})`
    }

    requestAnimationFrame(tick)
  }

  petRevive = () => {
    if (!stopped) return
    document.documentElement.classList.remove('pet-off')
    petEl.classList.remove('is-leaving')
    leaving = false
    stopped = false
    wake()
    playAssemble()
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
