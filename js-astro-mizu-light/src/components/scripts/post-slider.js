import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'

Swiper.use([Autoplay])

export function initSwiper() {
	const swiperEl = document.querySelector('.swiper')
	if (!swiperEl || swiperEl.swiper) return

	new Swiper('.swiper', {
		slidesPerView: 'auto',
		loop: true,
		spaceBetween: 30,
		speed: 1000,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false
		}
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initSwiper)
} else {
	initSwiper()
}

document.addEventListener('astro:page-loaded', initSwiper)
document.addEventListener('astro:after-swap', initSwiper)
