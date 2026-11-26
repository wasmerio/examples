/*
 * 此脚本用于为代码块提供复制功能
 * @author crrashh1542
 * @version 1.0
 */

// mdi 中对应的 content-copy 和 check 图标的 SVG
// Licensed under Apache-2.0
const iconCopy = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z" />
    </svg>
`
const iconCheck = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
    </svg>
`

const createCopyButton = () => {
    const button = document.createElement('button')
    button.className = 'r-copy-btn'
    button.dataset.state = 'default'
    button.innerHTML = iconCopy
    return button
}

const setButtonState = (button: HTMLButtonElement, state: 'default' | 'copied' | 'error') => {
    switch (state) {
        case 'copied':
            button.dataset.state = 'copied'
            button.innerHTML = iconCheck
            break
        case 'error':
            button.dataset.state = 'error'
            break
        case 'default':
            button.dataset.state = 'default'
            button.innerHTML = iconCopy
            break
    }
}

const bindCopyButtons = () => {
    const blocks = document.querySelectorAll<HTMLPreElement>('.r-prose pre')

    blocks.forEach((block) => {
        // 后注：添加 copyBound 属性，如果已绑定则跳过
        if (block.dataset.copyBound == '1') return
        const code = block.querySelector('code')
        if (!code) return

        const scrollWrap = document.createElement('div')
        scrollWrap.className = 'r-code-scroll'
        code.parentElement?.insertBefore(scrollWrap, code)
        scrollWrap.appendChild(code)

        // 给复制按钮绑定事件
        const button = createCopyButton()
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.innerText)
                setButtonState(button, 'copied')
                setTimeout(() => setButtonState(button, 'default'), 500)
            } catch (err) {
                console.error('复制代码失败', err)
                setButtonState(button, 'error')
                setTimeout(() => setButtonState(button, 'default'), 500)
            }
        })

        // 将按钮添加到代码块顶部
        block.insertBefore(button, scrollWrap)
        block.classList.add('r-has-copy')
        block.dataset.copyBound = '1'
    })
}

// AI 补充，等到 DOM 加载完成后再绑定复制按钮
const initCopy = () => {
    bindCopyButtons()
    document.addEventListener('astro:after-swap', bindCopyButtons)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopy)
} else {
    initCopy()
}
