// @env browser
import { gsap } from 'gsap'

let initialized = false

/**
 * Full-screen plate index. Native <dialog> gives focus trapping and Escape
 * handling; closing restores focus to the button that opened it.
 */
export function initIndexDialog(): void {
  if (initialized)
    return
  initialized = true

  const dialog = document.getElementById('indexDialog') as HTMLDialogElement | null
  if (!dialog)
    return

  let lastTrigger: HTMLElement | null = null
  let animation: gsap.core.Timeline | undefined
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const triggers = [
    ...document.querySelectorAll<HTMLElement>('[data-index-open]'),
  ]
  const paintTriggers = (open: boolean) => {
    for (const trigger of triggers)
      trigger.setAttribute('aria-expanded', String(open))
  }

  const open = (trigger: HTMLElement) => {
    if (dialog.open && dialog.dataset.menuState !== 'closing')
      return
    const reopening = dialog.open
    animation?.kill()
    lastTrigger = trigger
    if (!dialog.open)
      dialog.showModal()
    document.documentElement.classList.add('index-open')
    paintTriggers(true)
    dialog.dataset.menuState = 'opening'
    if (reduced.matches) {
      gsap.set(dialog, { clearProps: 'clipPath,transform' })
      dialog.dataset.menuState = 'open'
      return
    }
    animation = gsap.timeline({
      onComplete: () => {
        dialog.dataset.menuState = 'open'
        gsap.set(dialog, { clearProps: 'clipPath,transform' })
      },
    })
    if (!reopening)
      gsap.set(dialog, { clipPath: 'inset(0 0 100% 0)' })
    animation.to(dialog, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.5,
      ease: 'power3.inOut',
    }, 0)
    if (!reopening) {
      animation.fromTo(dialog.querySelectorAll('.index-dialog__label'), { yPercent: 70, rotation: 3 }, {
        yPercent: 0,
        rotation: 0,
        stagger: 0.035,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'transform',
      }, 0.13)
    }
  }

  const close = (animate = true) => {
    if (!dialog.open)
      return
    if (animate && dialog.dataset.menuState === 'closing')
      return
    animation?.kill()
    gsap.set(dialog.querySelectorAll('.index-dialog__label'), { clearProps: 'transform' })
    if (!animate || reduced.matches) {
      dialog.close()
      return
    }
    dialog.dataset.menuState = 'closing'
    animation = gsap.timeline({
      onComplete: () => dialog.close(),
    })
    animation.to(dialog, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.18,
      ease: 'power2.in',
    })
  }

  paintTriggers(false)
  for (const trigger of triggers) {
    trigger.addEventListener('click', () => open(trigger))
  }

  for (const closer of document.querySelectorAll<HTMLElement>('[data-index-close]')) {
    closer.addEventListener('click', () => close())
  }

  for (const link of dialog.querySelectorAll<HTMLElement>('[data-index-link]')) {
    link.addEventListener('click', () => close(false))
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog)
      close()
  })

  dialog.addEventListener('close', () => {
    if (dialog.open)
      return
    animation?.kill()
    gsap.set(dialog, { clearProps: 'clipPath,transform' })
    gsap.set(dialog.querySelectorAll('.index-dialog__label'), { clearProps: 'transform' })
    dialog.dataset.menuState = 'closed'
    paintTriggers(false)
    document.documentElement.classList.remove('index-open')
    lastTrigger?.focus({ preventScroll: true })
  })
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    close()
  })
  reduced.addEventListener('change', (event) => {
    if (!event.matches)
      return
    animation?.kill()
    gsap.set(dialog, { clearProps: 'clipPath,transform' })
    gsap.set(dialog.querySelectorAll('.index-dialog__label'), { clearProps: 'transform' })
    if (dialog.dataset.menuState === 'closing')
      close(false)
    else if (dialog.open)
      dialog.dataset.menuState = 'open'
  })
}
