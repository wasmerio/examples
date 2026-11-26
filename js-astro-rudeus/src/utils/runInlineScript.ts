// 此脚本用于在从其他路由进入包含 script 的路由时，重新加载其中的 script
// 从而防止进入新页面了但是 script 不执行
const runInlineScripts = () => {
    const container = document.querySelector('.r-prose')
    if (!container) return

    container.querySelectorAll('script').forEach((oldScript) => {
        if ((oldScript as HTMLElement).dataset.executed == '1') return

        // 直接创建新 script
        const newScript = document.createElement('script')
        Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value)
        })

        // 将旧 script 的内容包在自执行函数中，防止变量污染
        newScript.textContent = `(function(){\n${oldScript.textContent || ''}\n})();`
        ;(newScript as HTMLElement).dataset.executed = '1'
        oldScript.replaceWith(newScript)
    })
}

document.addEventListener('astro:after-swap', runInlineScripts)
