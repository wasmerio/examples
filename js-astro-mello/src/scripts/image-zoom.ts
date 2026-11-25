/**
 * 基于medium-zoom插件的图片放大功能
*/

import mediumZoom from 'medium-zoom';

const zoom = mediumZoom('article img', {
  background: 'rgba(0, 0, 0, 0.9)',
  margin: 24,
});

document.addEventListener('astro:page-load', () => {
  zoom.attach('article img');
});