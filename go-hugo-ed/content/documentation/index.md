---
title: Documentation
author: Alex Gil
featuredImage: screenshot-home.png
---


{{< toc >}}

---

## Prerequisites

This documentation was built with beginners in mind, but has the necessary information for more seasoned producers.

To install and use Ed you will be using your terminal. If you need a refresher, I highly recommend "{{< link src="https://www.computervillage.org/articles/CommandLine.pdf" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}The Command Line Crash Course{{< /link >}}". Working knowledge of HTML and CSS is also taken for granted. If you're new to HTML and CSS, you may want to check out the relevant courses on {{< link src="https://www.codecademy.com/learn/web" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}codecademy.com{{< /link >}}.

---

## Installing Ed

Before starting, please be sure that you have {{< link src="https://gohugo.io/getting-started/quick-start/#step-1-install-hugo" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}installed Hugo{{< /link >}} and {{< link src="https://gohugo.io/getting-started/quick-start/#step-2-create-a-new-site" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}created a new site{{< /link >}}. After that, you are ready to install Ed.

Please note, to install Ed, you must have {{< link src="https://golang.org/dl/" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}Go >= 1.12{{< /link >}} installed on your computer. You probably have Go already, but if you don't, the easiest way is probably to install is to follow {{< link src="https://go.dev/doc/install" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}Go installation instruction{{< /link >}}. To check if Go is running on your system enter the following line on your terminal (remember to ignore the `$`):

```bash
$ go version
```

If you don't get an error, you're good to go. Using the `cd` command on your terminal, navigate to the folder where you keep your web projects. Once you're in the folder where project live, initialize the {{< link src="https://gohugo.io/hugo-modules" class="external" target="_blank" hreflang="en" rel="noopener noreferrer" >}}Hugo Modules{{< /link >}} system using the following line (replace `<your_user>` and `<your_project>` by real names):

_Note: If you have already initialized Hugo Modules for your site, you can skip this step._

```bash
$ hugo mod init github.com/<your_user>/<your_project>
```

If you haven't run this command before, your terminal output should
look similar to the following:

```
go: creating new go.mod: module github.com/<your_user>/<your_project>
go: to add module requirements and sums:
    go mod tidy
```
