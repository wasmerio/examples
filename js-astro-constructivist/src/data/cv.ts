import rawCv from '../../cv.json'
import { cvSchema } from './schema'

/**
 * cv.json is parsed and validated at build time. Invalid data fails the build
 * with the exact field path.
 */
export const cv = cvSchema.parse(rawCv)
