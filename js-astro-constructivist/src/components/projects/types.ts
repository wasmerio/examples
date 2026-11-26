import type { cv } from '@/data/cv'

export type ProjectRecord = (typeof cv.projects)[number]
export type ProjectPresentation = 'project' | 'case'
