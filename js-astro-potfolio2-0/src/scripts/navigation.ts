enum EMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  VISUAL = 'VISUAL',
  COMMAND = 'COMMAND',
  SEARCH = 'SEARCH',
}

let cursor: HTMLElement | null = document.getElementById('cursor');
let currentMode: EMode = EMode.NORMAL;
let commandBuffer = '';

const windowSize = {
  'width': window.innerWidth,
  'height': window.innerHeight,
  'vw': window.innerWidth / 100,
  'vh': window.innerHeight / 100,
}
let cursorPosition = {
  'x': windowSize.vw,
  'y': windowSize.vh,
}
let currentLine = 0;
let currentPageItems: NodeListOf<Element> = document.querySelectorAll('.nvim-line');

const firstItem = currentPageItems[0]?.getBoundingClientRect();

if (cursor) {
  cursor.style.top = `${firstItem?.y}px`;
  cursor.style.left = `${firstItem?.x - 18}px `;
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (currentMode === EMode.INSERT && e.key !== 'Escape') {
    return;
  }
  switch (e.key) {
    case ':':
      e.preventDefault();
      currentMode = EMode.COMMAND;
      commandBuffer = ':';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case '/':
      e.preventDefault();
      currentMode = EMode.SEARCH;
      commandBuffer = '/';
      window.updateStatusBar(currentMode, commandBuffer);
      break;
    case 'Escape':
      handleEscape();
      window.clearSearch()
      break;
    case 'Enter':
      if (currentMode === EMode.COMMAND || currentMode === EMode.SEARCH) {
        handleCommand(commandBuffer);
        handleEscape();
      }
      if (currentMode === EMode.NORMAL) {
        navigateTo();
      }
      break;
    case 'Backspace':
      if (currentMode === EMode.COMMAND || currentMode === EMode.SEARCH) {
        e.preventDefault();
        commandBuffer = commandBuffer.slice(0, -1);
        if (commandBuffer.length === 0) {
          handleEscape();
        } else {
          window.updateStatusBar(undefined, commandBuffer);
        }
      }
      break;
    default:
      if (currentMode === EMode.COMMAND || currentMode === EMode.SEARCH) {
        e.preventDefault();
        commandBuffer += e.key;
        window.updateStatusBar(undefined, commandBuffer);
      } else {
        handleNormalModeKey(e.key);
      }
  }
});

function handleEscape() {
  currentMode = EMode.NORMAL;
  commandBuffer = '';
  window.updateStatusBar(currentMode, '');
}

function handleCommand(command: string) {
  if (command.startsWith(':')) {
    const cmd = command.slice(1).toLowerCase();
    switch (cmd) {
      case 'proj':
        window.location.href = 'neovim/projects';
        break;
      case 'about':
        window.location.href = '/neovim/about';
        break;
      case 'hi':
        window.location.href = '/neovim/contact';
        break;
      case 'q':
        window.location.href = '/';
        break;
      case 'h':
        window.location.href = '/neovim/help';
        break;
      case 'b':
        const keyBindings = document.getElementById('key-bindings');
        if (keyBindings) {
          keyBindings.classList.toggle('hidden');
        }
        break
      default:
        console.log('Unknown command:', cmd);
    }
  } else if (command.startsWith('/')) {
    const searchTerm = command.slice(1);
    window.performSearch(searchTerm);
  }
}

function handleNormalModeKey(key: string) {
  switch (key) {
    case 'u':
      navigateUp();
      break;
    case 'j':
    case 'k':
      moveCursor(key)
      break;
    case 'g':
      moveCursorTop()
      break;
    case 'G':
      moveCursorBottom();
      break;
    case 'i':
      currentMode = EMode.INSERT;
      window.updateStatusBar(currentMode);
      break;
    case 'v':
      currentMode = EMode.VISUAL;
      window.updateStatusBar(currentMode);
      break;
  }
  
  updatePosition();
}

function updatePosition() {
  window.updateStatusBar(undefined, undefined, undefined, `${Math.floor(cursorPosition.y / 100) || 1}:${Math.floor(cursorPosition.x) || 1}`);
  
  if (cursor) {
    cursor.style.top = `${cursorPosition.y}px`;
    cursor.style.left = `${cursorPosition.x}px`;
  } else {
    cursor = document.getElementById('cursor');
  }
}

function moveCursor(direction: 'j' | 'k') {
  switch (direction) {
    case 'k':
      if (currentLine > 0) {
        currentLine--;
      }
      break;
    case 'j':
      if (currentLine < currentPageItems.length -1) {
        currentLine++;
      }
      break;
    default:
      console.log('Invalid direction');
  }
  
  const { y: screenVerticalPosition, x: screenHorizontalPosition } = currentPageItems[currentLine]?.getBoundingClientRect() ?? { y: 0, x: 0 };
  cursorPosition.y = screenVerticalPosition;
  cursorPosition.x = screenHorizontalPosition - 18;
}

function moveCursorTop() {
  currentLine = 0;
  moveCursor('k');
}

function moveCursorBottom() {
  currentLine = currentPageItems.length - 1;
  moveCursor('j');
}

function navigateUp() {
  const currentPath = window.location.pathname;
  if (currentPath === '/') return; // Already at root

  const pathParts = currentPath.split('/').filter(Boolean);
  if (pathParts.length === 1) {
    // If only one level deep, go to root
    window.location.href = '/';
  } else {
    // Remove the last part of the path
    window.location.href = "/" + pathParts.slice(0, -1).join("/");
  }
}

function navigateTo() {
  const currentItem : Element | undefined = currentPageItems[currentLine];
  const itemUrl: string | null = currentItem?.getAttribute('data-href');
  
  if (itemUrl) {
    window.location.href = itemUrl;
  }
}