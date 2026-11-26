// One-off asset optimization: shrink the home-page avatar.
// Replace public/avatar.png with your photo, then re-run `node scripts/optimize-avatar.mjs`.
import sharp from 'sharp'

await sharp('public/avatar.png')
  .resize(256, 256, { fit: 'cover' })
  .webp({ quality: 82 })
  .toFile('public/avatar.webp')

console.log('public/avatar.webp written (256x256 webp)')
