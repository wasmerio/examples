function updateFaviconFromCSS() {
    // Get CSS variable color
    const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim()

    if (!color || color === '') return

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')

    // Draw favicon
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(50, 50, 50, 0, Math.PI * 2) // (cx, cy, radius, startAngle, endAngle)
    ctx.fill()

    // Update favicon
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
    }
    link.href = canvas.toDataURL('image/x-icon')
}

// Initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateFaviconFromCSS)
    } else {
        updateFaviconFromCSS()
    }
}