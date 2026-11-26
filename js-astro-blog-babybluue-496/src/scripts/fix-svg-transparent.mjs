import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const svgPath = join(rootDir, 'assets', 'avatar.svg')
let svgContent = readFileSync(svgPath, 'utf-8')

console.log('检查SVG文件...')
console.log('文件大小:', svgContent.length, '字符')

// 查找所有rect元素，特别是可能作为背景的
// 匹配自闭合标签和开放标签
const rectMatches = [...svgContent.matchAll(/<rect([^>]*?)(\/>|>([\s\S]*?)<\/rect>)/gi)]
console.log('\n找到rect元素:', rectMatches.length, '个')

let removedCount = 0
for (const match of rectMatches) {
  const fullMatch = match[0]
  const attributes = match[1]

  // 检查是否是背景rect（覆盖整个viewBox的rect）
  // 检查x, y, width, height属性，可能是-100或0，width/height可能是100%或200
  const hasX = /x\s*=\s*["']-?100["']/.test(attributes) || /x\s*=\s*["']0["']/.test(attributes)
  const hasY = /y\s*=\s*["']-?100["']/.test(attributes) || /y\s*=\s*["']0["']/.test(attributes)
  const hasWidth = /width\s*=\s*["']100%["']/.test(attributes) || /width\s*=\s*["']200["']/.test(attributes)
  const hasHeight = /height\s*=\s*["']100%["']/.test(attributes) || /height\s*=\s*["']200["']/.test(attributes)

  // 检查是否有fill属性且是白色/浅色背景（包括rgb格式）
  // 匹配白色、浅色（rgb值接近255的，如248,248,255）
  const fillMatch = attributes.match(/fill\s*=\s*["']([^"']+)["']/i)
  let hasLightFill = false
  if (fillMatch) {
    const fillValue = fillMatch[1].toLowerCase()
    // 检查白色关键词
    if (fillValue === 'white' || fillValue === '#fff' || fillValue === '#ffffff') {
      hasLightFill = true
    }
    // 检查rgb格式，如果rgb值都大于240，认为是浅色背景
    const rgbMatch = fillValue.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      // 如果RGB值都大于240，认为是浅色背景
      if (r >= 240 && g >= 240 && b >= 240) {
        hasLightFill = true
      }
    }
  }

  // 如果是覆盖整个viewBox的rect，或者有浅色fill，都认为是背景
  const isBackground = (hasX && hasY && hasWidth && hasHeight) || hasLightFill

  if (isBackground) {
    console.log('移除背景rect:', fullMatch.substring(0, 200))
    // 使用更精确的替换，避免替换错误的部分
    svgContent = svgContent.replace(fullMatch, '')
    removedCount++
  }
}

if (removedCount > 0) {
  console.log(`✓ 移除了 ${removedCount} 个背景rect元素`)
}

// 确保SVG根元素有透明背景样式
if (!svgContent.match(/<svg[^>]*style\s*=\s*["'][^"']*background/i)) {
  // 在svg标签中添加透明背景
  svgContent = svgContent.replace(/(<svg[^>]*)(>)/i, '$1 style="background: transparent;"$2')
  console.log('✓ 添加了透明背景样式到SVG根元素')
} else {
  // 如果已有style，确保背景是透明的
  svgContent = svgContent.replace(/(<svg[^>]*style\s*=\s*["'])([^"']*)(["'])/i, (match, start, styles, end) => {
    if (!styles.includes('background')) {
      return `${start}${styles}; background: transparent;${end}`
    }
    // 如果已有background，替换为透明
    return start + styles.replace(/background[^;]*/gi, 'background: transparent') + end
  })
  console.log('✓ 更新了SVG根元素的背景样式为透明')
}

// 验证SVG格式（检查是否有未匹配的标签）
const openTags = (svgContent.match(/<rect[^>]*>/gi) || []).length
const closeTags = (svgContent.match(/<\/rect>/gi) || []).length
const selfClosing = (svgContent.match(/<rect[^>]*\/>/gi) || []).length

console.log('\nSVG格式检查:')
console.log('  rect开始标签:', openTags)
console.log('  rect结束标签:', closeTags)
console.log('  rect自闭合标签:', selfClosing)

if (openTags - selfClosing !== closeTags) {
  console.warn('⚠ 警告: rect标签不匹配，尝试修复...')

  // 如果有孤立的结束标签，移除它们
  if (closeTags > 0 && openTags - selfClosing === 0) {
    svgContent = svgContent.replace(/<\/rect>/gi, '')
    console.log('✓ 移除了孤立的rect结束标签')
  }
}

// 保存修改后的SVG
writeFileSync(svgPath, svgContent, 'utf-8')
console.log('\n✓ SVG文件已更新')
console.log('处理完成！')
