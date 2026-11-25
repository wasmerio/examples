export function initMatrixRain(): void {
  const container = document.getElementById('matrix-container');
  if (!container) return;

  const characters = "{}[]()<>/\=+*01;";
  const color = "var(--color-textrain)";

  function createLetter() {
    if (!container) return;

    const span = document.createElement('span');
    const char = characters[Math.floor(Math.random() * characters.length)];
    
    const left = Math.random() * 100; 
    const duration = 4 + Math.random() * 8; // 4s to 10s
    const size = 10 + Math.random() * 10; // 10px to 20px
    
    span.innerText = char;
    span.className = 'falling-letter';
    span.style.left = `${left}vw`;
    span.style.color = color;
    span.style.fontSize = `${size}px`;
    span.style.animationDuration = `${duration}s`;
    
    // Add a slight glow effect
    span.style.textShadow = `0 0 5px ${color}`;
    
    container.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, duration * 1000);
  }

  function createStaticLetter() {
    if (!container) return;

    const span = document.createElement('span');
    const char = characters[Math.floor(Math.random() * characters.length)];
    
    const left = Math.random() * 100; 
    const top = Math.random() * 90; // Random vertical position
    const size = 10 + Math.random() * 10;
    
    span.innerText = char;
    span.className = 'falling-letter'; // from global.css
    
    // Override animation for mobile 'none'
    span.style.animation = 'none'; 
    span.style.left = `${left}vw`;
    span.style.top = `${top}vh`;
    span.style.color = color;
    span.style.fontSize = `${size}px`;
    span.style.opacity = (0.1 + Math.random() * 0.3).toString();
    span.style.textShadow = `0 0 5px ${color}`;
    
    container.appendChild(span);
  }

  if (window.innerWidth > 768) {
    // Pause matrix rain while tab is hidden — stops needless DOM mutations.
    let rainInterval: ReturnType<typeof setInterval> | null = setInterval(createLetter, 250);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rainInterval) { clearInterval(rainInterval); rainInterval = null; }
      } else {
        if (!rainInterval) { rainInterval = setInterval(createLetter, 250); }
      }
    });
  } else {
    // Static scatter effect for mobile optimization
    const mobileCount = 20; 
    for (let i = 0; i < mobileCount; i++) {
      createStaticLetter();
    }
  }
}
