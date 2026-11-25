async function loadPhotoswipeStyles() {
  if (document.querySelector('style[data-photoswipe-css]')) return
  const { default: css } = await import('photoswipe/style.css?inline')
  const style = document.createElement('style')
  style.dataset.photoswipeCss = '1'
  style.textContent = css
  document.head.appendChild(style)
}

export async function initPhotoswipe() {
  const container = document.querySelector('.post-content')
  if (!container?.querySelector('a.img-lightbox img')) return
  const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a.img-lightbox'))
  links.forEach((a) => {
    if (a.dataset.pswpWidth) return
    const img = a.querySelector<HTMLImageElement>('img')
    if (!img) return
    const setDims = () => {
      if (img.naturalWidth) {
        a.dataset.pswpWidth = String(img.naturalWidth)
        a.dataset.pswpHeight = String(img.naturalHeight)
      }
    }
    if (img.naturalWidth) setDims()
    else img.addEventListener('load', setDims, { once: true })
  })
  const [{ default: PhotoSwipeLightbox }, { default: PhotoSwipe }] = await Promise.all([
    import('photoswipe/lightbox'),
    import('photoswipe'),
    loadPhotoswipeStyles(),
  ])
  const lightbox = new PhotoSwipeLightbox({
    gallery: '.post-content',
    children: 'a.img-lightbox',
    showHideAnimationType: 'zoom',
    imageClickAction: 'next',
    bgOpacity: 0.85,
    pswpModule: () => PhotoSwipe,
  } as unknown as ConstructorParameters<typeof PhotoSwipeLightbox>[0])
  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        const caption = el as HTMLElement
        caption.style.cssText =
          'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);color:#fff;font-size:13px;text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:none'
        pswp.on('change', () => {
          const slide = pswp.currSlide
          caption.textContent = slide?.data.width
            ? `${slide.data.width} × ${slide.data.height}`
            : ''
        })
      },
    })
  })
  lightbox.init()
}
