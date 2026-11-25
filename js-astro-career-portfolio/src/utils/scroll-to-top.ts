export function setupScrollToTop(): void {
  const toTopBtn = document.getElementById('to-top');
  if (!toTopBtn) return;

  const progressCircle = document.getElementById('progress-circle');
  const circumference = 150.796; // 2 * pi * 24
  const arrowIcon = toTopBtn.querySelector('.absolute');

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = window.scrollY / scrollHeight;
    
    // Update the Circle Progress
    const offset = circumference - (scrollPercentage * circumference);
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = offset.toString();
    }

    // Visibility at 50% scroll
    if (scrollPercentage > 0.5) {
      toTopBtn?.classList.remove('translate-y-20', 'opacity-0');
      toTopBtn?.classList.add('translate-y-0', 'opacity-100');
    } else {
      toTopBtn?.classList.add('translate-y-20', 'opacity-0');
      toTopBtn?.classList.remove('translate-y-0', 'opacity-100');
    }

    // Bounce Logic at 98%
    if (scrollPercentage > 0.98) {
      arrowIcon?.classList.add('animate-bounce-twice');
    } else {
      arrowIcon?.classList.remove('animate-bounce-twice');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  toTopBtn.addEventListener('click', () => {
    arrowIcon?.classList.add('launching');

    const startPosition = window.scrollY;
    const duration = 750;
    let startTime: number | null = null;
    let requestID: number;

    const stopAnimation = () => {
      cancelAnimationFrame(requestID);
      arrowIcon?.classList.remove('launching');
      window.removeEventListener('wheel', stopAnimation);
      window.removeEventListener('touchmove', stopAnimation);
    };

    function easeOutQuad(t: number, b: number, c: number, d: number) {
      t /= d;
      return -c * t * (t - 2) + b;
    }

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeOutQuad(timeElapsed, startPosition, -startPosition, duration);
      
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestID = requestAnimationFrame(animation);
      } else {
        stopAnimation();
      }
    }

    window.addEventListener('wheel', stopAnimation, { once: true });
    window.addEventListener('touchmove', stopAnimation, { once: true });

    requestID = requestAnimationFrame(animation);
  });
}
