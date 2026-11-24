---
title: 'Shortcodes'
date: 2024-07-20T22:53:59+05:30
showBreadcrumbs: false
summary: "in addition to all the default hugo shortcodes, kayals adds a few extras for additional functionality."
---


In addition to all the default Hugo shortcodes, Kayals adds a few extras for additional functionality.

## Callout

`callout` outputs its contents as a stylised message box within your article. It's useful for drawing attention to important information that you don't want the reader to miss.

| Parameter   | Description |
| ---- | ---- |
| `icon` | **Optional.** the icon to display on the left side.<br>**Default:** `triangle-exclamation` (Check out the [icon shortcode](#icon) for more details on using icons.) |
| `iconColor` | **Optional.** the color for the icon in basic CSS style.<br>Can be either hex values (`#FFFFFF`) or color names (`white`)<br>By default chosen based on the current color theme. |
| `cardColor` | **Optional.** the color for the card background in basic CSS style.<br>Can be either hex values (`#FFFFFF`) or color names (`white`)<br>By default chosen based on the current color theme. |
| `textColor` | **Optional.** the color for the text in basic CSS style.<br>Can be either hex values (`#FFFFFF`) or color names (`white`)<br>By default chosen based on the current color theme. |

**Example 1**
```markdown
{{</* callout */>}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum diam in lectus efficitur, in consequat purus ultricies.
{{</* /callout */>}}
```
Rendered as:
{{< callout >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum diam in lectus efficitur, in consequat purus ultricies.
{{< /callout >}}

**Example 2**
```markdown
{{</* callout github */>}}
Feel free to show your support by giving a star 🌟 on [GitHub](https://github.com/mnjm/kayal)
{{</* /callout */>}}
```
Rendered as:
{{< callout github >}}
Feel free to show your support by giving a star 🌟 on [GitHub](https://github.com/mnjm/kayal)
{{< /callout >}}

## Code Importer

`codeimport` can be used for importing code from external sources easily without copying and pasting.
