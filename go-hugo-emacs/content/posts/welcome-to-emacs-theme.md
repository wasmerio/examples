---
title: "Welcome to the Emacs Hugo Theme"
date: 2024-01-15
draft: false
---


Welcome to the Emacs Hugo theme! This theme transforms your Hugo blog into an authentic Emacs-like experience.

## Getting Started

Try these keyboard shortcuts:

- Press `n` and `p` to navigate between articles
- Press `RET` or `o` to open an article
- Press `q` to go back to the list
- Press `t` to toggle between dark and light themes
- Press `?` to see all available shortcuts

## Window Management

Just like in Emacs, you can split your view:

- `C-x 3` - Split horizontally (side by side)
- `C-x 2` - Split vertically (stacked)
- `C-x 0` - Close current window
- `C-x 1` - Close other windows
- `C-x o` or `Tab` - Switch between windows

## Code Highlighting

The theme includes syntax highlighting that matches Emacs:

```elisp
(defun hello-world ()
  "A simple greeting function."
  (interactive)
  (message "Hello, World!"))
```

```python
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
