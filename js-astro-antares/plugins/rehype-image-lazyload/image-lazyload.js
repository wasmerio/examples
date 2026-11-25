export default function () {
  document.addEventListener('DOMContentLoaded', function () {
    let lazyImages = [].slice.call(document.querySelectorAll('img.lazyload'))
    let active = false

    const lazyLoad = function () {
      if (active === false) {
        active = true

        setTimeout(function () {
          lazyImages.forEach(function (lazyImage) {
            if (
              lazyImage.getBoundingClientRect().top <= window.innerHeight &&
              lazyImage.getBoundingClientRect().bottom >= 0 &&
              getComputedStyle(lazyImage).display !== 'none'
            ) {
              lazyImage.src = lazyImage.dataset.src
              lazyImage.classList.remove('lazyload')

              lazyImages = lazyImages.filter(function (image) {
                return image !== lazyImage
              })

              if (lazyImages.length === 0) {
                document.removeEventListener('scroll', lazyLoad)
                window.removeEventListener('resize', lazyLoad)
                window.removeEventListener('orientationchange', lazyLoad)
              }
            }
          })

          active = false
        }, 200)
      }
    }
    lazyLoad()
    document.addEventListener('scroll', lazyLoad)
    window.addEventListener('resize', lazyLoad)
    window.addEventListener('orientationchange', lazyLoad)
  })
}
