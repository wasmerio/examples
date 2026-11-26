// @env browser
import { gsap } from 'gsap'

export function initReveals(main: HTMLElement): void {
  for (const element of main.querySelectorAll<HTMLElement>('[data-scroll], [data-reveal]')) {
    if (element.closest('[data-project-scroll="true"]'))
      continue
    if (element.matches('.about__quote, .about__fact, .work__body, .school, .contact__statement-wrap'))
      continue
    const media = element.dataset.scroll === 'media'
    gsap.fromTo(element, {
      opacity: 1,
      y: media ? 0 : 36,
      clipPath: media ? 'inset(9% 4% 9% 4%)' : 'inset(0% 0% 0% 0%)',
    }, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top 94%',
        end: 'top 68%',
        scrub: 0.5,
      },
    })
  }

  for (const title of main.querySelectorAll<HTMLElement>('[data-title]')) {
    gsap.fromTo(title.querySelectorAll('.char'), { yPercent: 108, rotation: 3 }, {
      yPercent: 0,
      rotation: 0,
      stagger: 0.035,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 94%',
        end: 'top 68%',
        scrub: 0.65,
      },
    })
  }

  for (const section of main.querySelectorAll<HTMLElement>('[data-scroll-section]')) {
    const watermark = section.querySelector('[data-section-watermark]')
    if (watermark) {
      gsap.fromTo(watermark, { y: 70 }, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }
  }
}

export function initHeroTimeline(desktop: boolean, headerHeight: () => number): void {
  const hero = document.querySelector<HTMLElement>('.hero')
  if (!hero)
    return
  const visual = hero.querySelector<HTMLElement>('[data-hero-visual], .hero__portrait')
  const construction = hero.querySelector('[data-hero-construction]')
  if (window.scrollY < 20 && !window.location.hash) {
    gsap.fromTo(hero.querySelectorAll('[data-hero-letter]'), { yPercent: 48, opacity: 0, rotation: 4 }, {
      yPercent: 0,
      opacity: 1,
      rotation: 0,
      duration: 1.05,
      stagger: 0.035,
      ease: 'power4.out',
    })
    gsap.fromTo(hero.querySelectorAll('[data-hero-note], .hero__bottom, .hero__foot'), { opacity: 0, y: 15 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.4,
      stagger: 0.06,
      clearProps: 'opacity,transform',
    })
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: () => `top top+=${headerHeight()}`,
      end: desktop ? 'bottom bottom' : 'bottom top',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  })
  timeline
    .to(hero.querySelector('[data-hero-word="first"]'), {
      xPercent: desktop
        ? -7
        : -2,
      y: desktop
        ? -18
        : 0,
      ease: 'none',
    }, 0)
    .to(hero.querySelector('[data-hero-word="last"]'), {
      xPercent: desktop ? 5 : 2,
      ease: 'none',
    }, 0)
    .to(hero.querySelector('[data-hero-plane]'), {
      xPercent: desktop
        ? -10
        : -3,
      scaleX: 1.12,
      ease: 'none',
    }, 0)
    .to(hero.querySelector('.hero__coordinates'), { y: -10, ease: 'none' }, 0)
  if (visual) {
    timeline.to(visual, {
      y: desktop
        ? -42
        : -12,
      rotation: desktop
        ? -5
        : 6,
      ease: 'none',
    }, 0)
  }
  if (construction) {
    timeline.to(construction, {
      yPercent: -12,
      rotation: 24,
      scale: 0.84,
      ease: 'none',
    }, 0)
  }
}

function initAboutTimeline(main: HTMLElement): void {
  const ink = main.querySelector<HTMLElement>('[data-ink-text]')
  if (ink) {
    gsap.fromTo(ink.querySelectorAll('[data-ink-word]'), { '--word-ink': 0 }, {
      '--word-ink': 1,
      'stagger': 0.25,
      'ease': 'none',
      'scrollTrigger': {
        trigger: ink,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 0.65,
      },
    })
  }

  const facts = main.querySelectorAll('.about__fact')
  if (facts.length) {
    gsap.fromTo(facts, { x: 28 }, {
      x: 0,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__facts',
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.65,
      },
    })
  }
  const quote = main.querySelector('.about__quote')
  if (quote) {
    gsap.fromTo(quote, { '--quote-rule': 0, 'rotation': -1.2, 'clipPath': 'inset(0% 3% 0% 3%)' }, {
      '--quote-rule': 1,
      'rotation': 0,
      'clipPath': 'inset(0% 0% 0% 0%)',
      'ease': 'none',
      'scrollTrigger': {
        trigger: quote,
        start: 'top 90%',
        end: 'top 35%',
        scrub: 0.8,
      },
    })
  }
}

function initRecordTimelines(main: HTMLElement): void {
  const work = main.querySelector<HTMLElement>('.work-list')
  if (work) {
    gsap.fromTo(work, { '--work-progress': 0 }, {
      '--work-progress': 1,
      'ease': 'none',
      'scrollTrigger': {
        trigger: work,
        start: 'top 75%',
        end: 'bottom 65%',
        scrub: 0.4,
      },
    })
  }

  for (const year of main.querySelectorAll('.work__year, .school__year')) {
    gsap.fromTo(year, { y: 24 }, {
      y: -24,
      ease: 'none',
      scrollTrigger: {
        trigger: year.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7,
      },
    })
  }

  for (const record of main.querySelectorAll<HTMLElement>('.work')) {
    const body = record.querySelector('.work__body')
    const year = record.querySelector('.work__year')
    if (body) {
      gsap.fromTo(body, { x: 22 }, {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: record,
          start: 'top 86%',
          end: 'top 45%',
          scrub: 0.7,
        },
      })
    }
    gsap.to(record, {
      '--record-rule': 1,
      'ease': 'none',
      'scrollTrigger': {
        trigger: record,
        start: 'top 78%',
        end: 'top 32%',
        scrub: 0.6,
      },
    })
    if (year) {
      gsap.fromTo(year, { '--year-ink': 0 }, {
        '--year-ink': 1,
        'ease': 'none',
        'scrollTrigger': {
          trigger: record,
          start: 'top 78%',
          end: 'top 42%',
          scrub: 0.6,
        },
      })
    }
  }

  for (const school of main.querySelectorAll('.school')) {
    gsap.fromTo(school, { 'x': 26, '--record-rule': 0 }, {
      'x': 0,
      '--record-rule': 1,
      'ease': 'none',
      'scrollTrigger': {
        trigger: school,
        start: 'top 88%',
        end: 'top 50%',
        scrub: 0.65,
      },
    })
  }
}

function initProjectTimelines(main: HTMLElement): void {
  for (const project of main.querySelectorAll<HTMLElement>('[data-project]')) {
    if (project.closest('[data-project-scroll="true"]'))
      continue
    const title = project.querySelector('[data-project-title]')
    const images = project.querySelectorAll('.project__image')
    if (title) {
      gsap.fromTo(title, { y: 28 }, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: project,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 0.6,
        },
      })
    }
    if (images.length) {
      gsap.fromTo(images, { scale: 1.05 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: project,
          start: 'top bottom',
          end: 'bottom 25%',
          scrub: 0.8,
        },
      })
    }
  }
}

function initMaterialTimelines(main: HTMLElement): void {
  for (const seal of main.querySelectorAll('.cert__seal, [data-contact-seal]')) {
    gsap.fromTo(seal, { rotation: -28 }, {
      rotation: 16,
      ease: 'none',
      scrollTrigger: {
        trigger: seal,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })
  }

  for (const group of main.querySelectorAll('[data-skill-group]')) {
    // Keep filtered-in skills readable even when their one-shot reveal ran hidden.
    gsap.fromTo(group.querySelectorAll('[data-skill-item]'), { y: 20 }, {
      y: 0,
      duration: 0.55,
      stagger: 0.025,
      ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 87%', once: true },
    })
  }

  const board = main.querySelector<HTMLElement>('[data-board]')
  if (board) {
    gsap.fromTo(board.querySelectorAll('[data-board-print]'), {
      '--entry-y': '65px',
      '--entry-rotate': '-5deg',
    }, {
      '--entry-y': '0px',
      '--entry-rotate': '0deg',
      'duration': 1.1,
      'stagger': 0.12,
      'ease': 'power3.out',
      'scrollTrigger': { trigger: board, start: 'top 80%', once: true },
    })
  }
}

function initContactTimeline(main: HTMLElement): void {
  const contact = main.querySelector('#contact')
  if (contact) {
    gsap.fromTo(contact.querySelectorAll('[data-contact-line]'), { yPercent: 35 }, {
      yPercent: 0,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact__statement',
        start: 'top 90%',
        end: 'top 40%',
        scrub: 0.7,
      },
    })
    gsap.fromTo(contact.querySelectorAll('.contact__profile-list li'), { x: -24 }, {
      x: 0,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact__profiles',
        start: 'top 88%',
        end: 'top 44%',
        scrub: 0.65,
      },
    })
  }
}

export function initSectionTimelines(main: HTMLElement): void {
  initAboutTimeline(main)
  initRecordTimelines(main)
  initProjectTimelines(main)
  initMaterialTimelines(main)
  initContactTimeline(main)
  for (const transition of main.querySelectorAll('[data-chapter-transition]')) {
    gsap.fromTo(transition, { '--bridge-progress': 0 }, {
      '--bridge-progress': 1,
      'ease': 'none',
      'scrollTrigger': {
        trigger: transition,
        start: 'top 92%',
        end: 'bottom 30%',
        scrub: 0.75,
      },
    })
  }
}
