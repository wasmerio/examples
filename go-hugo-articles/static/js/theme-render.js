// 设置博客主题
function setTheme(mode) {
    localStorage.setItem("theme-storage", mode);
    const iconElement = document.getElementById("theme-icon");

    if (mode === "dark") {
        document.getElementById("darkStyle").disabled = false;
        document.getElementById("oneDarkStyle").disabled = false;
        iconElement.setAttribute("data-feather", "moon");
        iconElement.parentNode.setAttribute("title", "moon");
    } else if (mode === "light") {
        document.getElementById("darkStyle").disabled = true;
        document.getElementById("oneDarkStyle").disabled = true;
        iconElement.setAttribute("data-feather", "sun");
        iconElement.parentNode.setAttribute("title", "sun");
    }

    iconElement.setAttribute('stroke-width', '3');
    feather.replace();
}

// 更新mermaid图表主题
function setMermaidChartTheme(mode) {
    if (typeof mermaid !== 'undefined') {
        // 重置所有mermaidBlocks
        restoreMermaidBlocks();
        // 重新渲染所有mermaid图表
        initMermaidConfig(mode);
        // 等待 mermaid 全部加载完再重新渲染所有 svg 图表
        mermaid.run().then(() => {
            svgRenderMain();
        });
    }
}

// 切换所有主题
function switchTheme() {
    if (localStorage.getItem("theme-storage") === "light") {
        setTheme("dark");
        setMermaidChartTheme("dark");
    } else if (localStorage.getItem("theme-storage") === "dark") {
        setTheme("light");
        setMermaidChartTheme("default");
    }
}

// 初始化博客主题
function initTheme() {
    var savedTheme = localStorage.getItem("theme-storage") || "light";
    setTheme(savedTheme);
};


document.addEventListener("DOMContentLoaded", function() {
    initTheme();
    const darkModeSwitch = document.getElementById("dark-mode-switch");
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener("click", switchTheme);
    }
});
