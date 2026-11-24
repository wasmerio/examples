// 复制代码到剪贴板
function copyCodeHandler(button, preElement) {
  // 获取<pre>内<code>的文本内容
  const codeElement = preElement.querySelector('code');
  const codeText = codeElement ? codeElement.textContent : preElement.textContent;

  // 执行复制操作
  navigator.clipboard.writeText(codeText)
    .then(() => {
      // 成功处理
      button.textContent = 'success';
      button.classList.add('success');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('success');
      }, 2000);
    })
    .catch(() => {
      // 失败处理
      button.textContent = 'failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
}

// 初始化复制按钮
function initCopyCodeBtn(button) {
  button.textContent = 'Copy';
  button.className = 'copy-code-btn';
  button.type = 'button';
}

function codeCopyMain() {
  const preElements = document.querySelectorAll('pre');
  preElements.forEach(function(preElement) {
    // 为每个<pre>创建复制按钮
    const button = document.createElement('button');
    // 初始化复制按钮
    initCopyCodeBtn(button);
    // 将按钮添加到<pre>元素附近
    preElement.parentNode.insertBefore(button, preElement);
    // 绑定点击事件
    button.addEventListener('click', () => copyCodeHandler(button, preElement));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  codeCopyMain();
});