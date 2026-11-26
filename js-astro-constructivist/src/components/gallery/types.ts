import type { cv } from '@/data/cv'

export type GalleryEntry = NonNullable<typeof cv.images>['list'][number]
export type GalleryPresentation = 'board' | 'strip'

export interface PrintPlacement {
  x: string
  y: string
  w: string
  smX: string
  smY: string
  smW: string
}
