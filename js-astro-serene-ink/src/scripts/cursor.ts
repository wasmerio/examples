let cursor: HTMLElement | null = null;
let targetX = 0,
  targetY = 0;
let currentX = 0,
  currentY = 0;
let scale = 1;
let isLoopRunning = false;
let isCursorEnabled = true;

const HALF_OF_CURSOR = 6;
const LERP_FACTOR = 0.15;

function updateCursor() {
  if (isCursorEnabled) {
    currentX += (targetX - currentX) * LERP_FACTOR;
    currentY += (targetY - currentY) * LERP_FACTOR;
    if (cursor) {
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`;
    }
  }
  requestAnimationFrame(updateCursor);
}

let onMouseMove: ((e: MouseEvent) => void) | null = null;
let onMouseOver: ((e: MouseEvent) => void) | null = null;
let onCursorToggleClick: ((e: MouseEvent) => void) | null = null;

// cleanup
document.addEventListener("astro:before-swap", () => {
  if (onMouseMove) {
    window.removeEventListener("mousemove", onMouseMove);
    onMouseMove = null;
  }
  if (onMouseOver) {
    document.removeEventListener("mouseover", onMouseOver);
    onMouseOver = null;
  }
  if (onCursorToggleClick) {
    const toggleBtn = document.getElementById("cursor-toggle");
    if (toggleBtn) toggleBtn.removeEventListener("click", onCursorToggleClick);
    onCursorToggleClick = null;
  }
});

function getCursorPreference(): boolean {
  try {
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("cursor-disabled") === "true"
    ) {
      return false; 
    }
  } catch (_) {}
  return true; 
}

function setCursorPreference(enabled: boolean) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("cursor-disabled", enabled ? "false" : "true");
    }
  } catch (_) {}
}

document.addEventListener("astro:page-load", () => {
  const isDesktop = matchMedia("(pointer: fine)").matches;
  if (!isDesktop) return;

  isCursorEnabled = getCursorPreference();
  cursor = document.getElementById("cursor");

  const toggleBtn = document.getElementById("cursor-toggle");
  if (toggleBtn) {
    toggleBtn.classList.remove("hidden");
    
    const updateIconState = () => {
      if (isCursorEnabled) {
        toggleBtn.classList.remove("opacity-50");
      } else {
        toggleBtn.classList.add("opacity-50");
      }
    };

    updateIconState();

    onCursorToggleClick = () => {
      isCursorEnabled = !isCursorEnabled;
      setCursorPreference(isCursorEnabled);
      updateIconState();

      if (isCursorEnabled) {
        document.documentElement.classList.add("has-custom-cursor");
      } else {
        document.documentElement.classList.remove("has-custom-cursor");
        if (cursor) cursor.style.opacity = "0";
      }
    };
    toggleBtn.addEventListener("click", onCursorToggleClick);
  }

  if (isCursorEnabled) {
    document.documentElement.classList.add("has-custom-cursor");
  } else {
    document.documentElement.classList.remove("has-custom-cursor");
  }

  if (!isLoopRunning) {
    updateCursor();
    isLoopRunning = true;
  }

  onMouseMove = (e) => {
    if (!isCursorEnabled) return;
    targetX = e.clientX - HALF_OF_CURSOR;
    targetY = e.clientY - HALF_OF_CURSOR;
    if (cursor && cursor.style.opacity !== "1") {
      cursor.style.opacity = "1";
    }
  };

  onMouseOver = (e) => {
    if (!isCursorEnabled) return;
    if (e.target instanceof Element && e.target.closest("a, button")) {
      scale = 1.8;
    } else {
      scale = 1;
    }
  };

  window.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseover", onMouseOver);
});
