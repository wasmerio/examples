function setImgContainerHeight(img, div) {
  // 计算新的高度
  const newHeight = img.clientHeight > window.innerHeight * 0.5 ? window.innerHeight * 0.5 : img.clientHeight;
  // 设置div的高度
  div.style.height = newHeight + 'px';
}

// 替换p为div
function replacePWithDiv(img, index) {
  // 获取父级p标签
  const parentP = img.parentElement;
  img.style.maxWidth = parentP.clientWidth + 'px';
  // 记录img在parentP中的位置
  const imgIndex = Array.from(parentP.childNodes).indexOf(img);

  // 创建新的div容器
  const div = document.createElement('div');
  div.id = 'image-container-' + index;
  div.className = 'image-container';

  // 设置div的高度
  if (img.complete && img.naturalHeight > 0) {
    setImgContainerHeight(img, div);
  } else {
    // 图片未加载，添加加载事件监听
    img.onload = function() {
      setImgContainerHeight(img, div);
    };
  }

  // 将img从parentP中移除并放入div
  div.appendChild(img);

  // 创建新的p标签存放img之后的兄弟节点
  const newP = document.createElement('p');
  const afterNodes = Array.from(parentP.childNodes).slice(imgIndex);
  afterNodes.forEach(node => newP.appendChild(node));

  // 将div插入到parentP之后
  parentP.parentNode.insertBefore(div, parentP.nextSibling);
  // 将新p标签插入到div之后
  div.parentNode.insertBefore(newP, div.nextSibling);
}

// 初始化 Viewer
function viewerProcess(index) {
  // 初始化 Viewer
  const viewer = new Viewer(document.getElementById('image-container-' + index), {
    zoomRatio: 0.1, // 缩放步长
    maxZoomRatio: 5, // 最大缩放倍数
    minZoomRatio: 0.2, // 最小缩放倍数
    toolbar: true, // 显示工具栏（缩放、旋转等）
    title: true // 显示图片标题
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // 选择所有的img标签
  const images = document.querySelectorAll('p > img');
  // 替换所有img标签的父级标签p
  images.forEach((img, index) => {
    // 替换p为div
    replacePWithDiv(img, index);
    // 初始化 Viewer
    viewerProcess(index);
  });
});