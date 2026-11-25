// A random walk: one step up, down, left or right at a time, in the theme's accent colour. With reduced motion the
// whole walk appears at once.
const canvas = document.getElementById("walk");
const context = canvas.getContext("2d");
const step = 8;
const moves = [[step, 0], [-step, 0], [0, step], [0, -step]];
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
let frame;

function walk() {
  cancelAnimationFrame(frame);
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.strokeStyle = getComputedStyle(canvas).getPropertyValue("--accent");
  context.lineWidth = 2;
  context.lineCap = "round";
  let x = width / 2;
  let y = height / 2;
  let steps = 0;

  const draw = () => {
    for (let i = 0; i < (still ? 800 : 4); i++, steps++) {
      const [dx, dy] = moves[Math.floor(Math.random() * moves.length)];
      const nx = Math.min(Math.max(x + dx, step), width - step);
      const ny = Math.min(Math.max(y + dy, step), height - step);
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(nx, ny);
      context.stroke();
      [x, y] = [nx, ny];
    }
    if (steps < 800) frame = requestAnimationFrame(draw);
  };
  draw();
}

document.getElementById("walk-again").addEventListener("click", walk);
walk();
