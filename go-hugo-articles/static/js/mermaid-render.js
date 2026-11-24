// 初始化 Mermaid 配置
function initMermaidConfig(themeMode) {
  // 根据当前主题设置mermaid初始主题
  const initialMermaidTheme = themeMode === "dark" ? "dark" : "default";

  // Mermaid 全局配置（可选，根据需求调整）
  mermaid.initialize({
    startOnLoad: false, // 关闭自动加载，手动触发（避免冲突）
    theme: initialMermaidTheme,   // 主题：default/forest/dark/neutral/base
    themeVariables: {
      primaryColor: '#007bff'
    }
  });
}

function replaceMermaidBlocks() {
  // 找到所有 class 为 language-mermaid 的代码块
  mermaidBlocks = document.querySelectorAll('pre > code.language-mermaid');
  if (!window.mermaidContents) window.mermaidContents = [];
  mermaidBlocks.forEach(block => {
    // 创建容器替换原代码块（避免样式冲突）
    const container = document.createElement('div');
    container.className = 'mermaid';
    container.textContent = block.textContent;
    // 将文本内容追加到数组
    window.mermaidContents.push(block.textContent);
    // 替换原代码块的父元素（pre）
    block.parentElement.replaceWith(container);
  });
}

// 重置所有 mermaid 元素的 data-processed 属性
function restoreMermaidBlocks() {
  // 将当前 mermaidBlocks的内容 恢复成保存的 window.mermaidContents
  const currentMermaidBlocks = document.querySelectorAll('.mermaid');
  currentMermaidBlocks.forEach((block, index) => {
    block.removeAttribute('data-processed');
    block.textContent = window.mermaidContents[index];
  });
}

function mermaidRenderMain() {
  // 初始化 Mermaid 配置
  initMermaidConfig(localStorage.getItem("theme-storage"));
  // 替换 mermaid 代码块为渲染容器
  replaceMermaidBlocks();
  // 渲染所有 mermaid 容器
  mermaid.run();
}

// 手动渲染所有 mermaid 代码块
document.addEventListener('DOMContentLoaded', function() {
  mermaidRenderMain();
});