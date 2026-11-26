import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..', '..') // 项目根目录
const srcDir = join(rootDir, 'src')

// PWA需要的图标尺寸
const sizes = [48, 64, 72, 96, 192, 512]

// 读取SVG文件
const svgPath = join(srcDir, 'assets', 'avatar.svg')
let svgContent = readFileSync(svgPath, 'utf-8')

// 复制SVG到public目录作为favicon
const faviconPath = join(rootDir, 'public', 'favicon.svg')
writeFileSync(faviconPath, svgContent, 'utf-8')
console.log('✓ 已复制 avatar.svg 到 public/favicon.svg')

// 检查是否有命令行参数（除了 node 和脚本路径）
const hasPadding = process.argv.length > 2

// 生成各尺寸的PNG
console.log('开始生成PWA图标...')
for (const size of sizes) {
  try {
    const outputPath = join(rootDir, 'public', `pwa-${size}.png`)

    if (hasPadding) {
      // 有参数时：SVG占88%，周围留白
      const contentSize = Math.floor(size * 0.88)
      const offset = Math.floor((size - contentSize) / 2)

      // 创建目标尺寸的透明画布
      const canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })

      // 将SVG resize到88%尺寸
      const resizedSvg = await sharp(Buffer.from(svgContent))
        .resize(contentSize, contentSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()

      // 将缩小后的SVG居中合成到画布上
      await canvas
        .composite([
          {
            input: resizedSvg,
            left: offset,
            top: offset,
          },
        ])
        .png()
        .toFile(outputPath)

      console.log(`✓ 已生成 pwa-${size}.png (${size}x${size}, 内容${contentSize}x${contentSize})`)
    } else {
      // 无参数时：保持原行为，占满整个图标
      await sharp(Buffer.from(svgContent))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // 透明背景
        })
        .png()
        .toFile(outputPath)

      console.log(`✓ 已生成 pwa-${size}.png (${size}x${size})`)
    }
  } catch (error) {
    console.error(`✗ 生成 pwa-${size}.png 失败:`, error.message)
  }
}

console.log('完成！所有PWA图标已生成。')
