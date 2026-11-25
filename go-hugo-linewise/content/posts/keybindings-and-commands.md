---
title: "Keybindings and Commands"
description: "A reference for keyboard shortcuts and command-line commands in Linewise."
date: 2026-06-05
tags: ["vim", "reference"]
---


Keyboard interaction is progressive enhancement. Links and forms still work without JavaScript.

The interface has three modes: **NORMAL**, **COMMAND**, and **SEARCH**.

## Keymap

| Key       | Action                                                        |
| --------- | ------------------------------------------------------------- |
| `j` / `k` | Move selection or scroll the active buffer                    |
| `g` `g`   | Jump to the top                                               |
| `G`       | Jump to the bottom                                            |
| `/`       | Open search palette                                           |
| `:`       | Open command mode                                             |
| `Enter`   | Open the selected row                                         |
| `q`       | Close the current buffer and navigate to the nearest buffer   |
| `b`       | Go to the homepage                                            |
| `Ctrl+d`  | Scroll down half a page                                       |
| `Ctrl+u`  | Scroll up half a page                                         |
| `Ctrl+b`  | Scroll up one page                                            |
| `?`       | Open help                                                     |
| `Esc`     | Return to normal mode, close help, or close the file explorer |

Linewise does not intercept `Ctrl+f`; browser page search keeps working.

## Commands

Type these in command mode after pressing `:`.

| Command                     | Action                   |
| --------------------------- | ------------------------ |
| `:ls`, `:buffers`, `:posts` | Open the buffer list     |
| `:archive`, `:oldfiles`     | Open the posts list      |
| `:tags`                     | Open the tag index       |
| `:search`, `:find`          | Open search              |
| `:help`, `:h`               | Open help                |
| `:q`, `:quit`               | Close the current buffer |
| `:explore`, `:ex`           | Toggle the file explorer |

