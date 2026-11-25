import { initGridTrail } from './gridTrail'
import { bindControlClicks, bindScrollControls, bindTocFab, initPageFlags } from './pageBindings'
import { initPet } from './pet'
import { bindProfileCardAnim } from './profileCardAnim'
import { bindPureReading } from './pureReading'
import {
  bindCrossPageAnchors,
  bindNavStartSync,
  bindPetToSwup,
  bindSwapHooks,
} from './swupBindings'

document.addEventListener('DOMContentLoaded', () => {
  document.dispatchEvent(new Event('astro:page-load'))
})

initPageFlags()
bindTocFab()
bindScrollControls()
bindNavStartSync()
bindProfileCardAnim()
initGridTrail()
initPet()
bindPetToSwup()
bindSwapHooks()
bindCrossPageAnchors()
bindControlClicks()
bindPureReading()
