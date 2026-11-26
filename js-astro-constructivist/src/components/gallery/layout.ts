import type { PrintPlacement } from './types'

export const ratios = ['16 / 10', '4 / 5', '1 / 1', '3 / 2'] as const
export const rotations = [
  '-3.2deg',
  '2.6deg',
  '1.4deg',
  '-2.1deg',
] as const

export const placements: PrintPlacement[] = [
  {
    x: '4%',
    y: '5%',
    w: '31%',
    smX: '2%',
    smY: '3%',
    smW: '46%',
  },
  {
    x: '40%',
    y: '3%',
    w: '24%',
    smX: '50%',
    smY: '5%',
    smW: '46%',
  },
  {
    x: '10%',
    y: '44%',
    w: '24%',
    smX: '3%',
    smY: '36%',
    smW: '44%',
  },
  {
    x: '54%',
    y: '52%',
    w: '27%',
    smX: '52%',
    smY: '58%',
    smW: '44%',
  },
]
