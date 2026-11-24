---
author: "Michael Henderson"
date: 2014-09-28
linktitle: Creating a New Theme
menu:
  main:
    parent: tutorials
next: /tutorials/github-pages-blog
prev: /tutorials/automated-deployments
title: Creating a New Theme
weight: 10
---



### **Introduction**

This tutorial will show you how to create a simple theme in Hugo. I assume that you are familiar with HTML, the bash command line, and that you are comfortable using Markdown to format content. I'll explain how Hugo uses templates and how you can organize your templates to create a theme. I won't cover using CSS to style your theme.

We'll start with creating a new site with a very basic template. Then we'll add in a few pages and posts. With small variations on that, you will be able to create many different types of web sites.

In this tutorial, commands that you enter will start with the "$" prompt. The output will follow. Lines that start with "#" are comments that I've added to explain a point. When I show updates to a file, the ":wq" on the last line means to save the file.

Here's an example:

```
package main

import "fmt"

func main() {
    fmt.Print("Hello")
}
```
 
> There are a few concepts that you need to understand before creating a theme.

### Skins

Skins are the files responsible for the look and feel of your site. It’s the CSS that controls colors and fonts, it’s the Javascript that determines actions and reactions. It’s also the rules that Hugo uses to transform your content into the HTML that the site will serve to visitors.

You have two ways to create a skin. The simplest way is to create it in the ```layouts/``` directory. If you do, then you don’t have to worry about configuring Hugo to recognize it. The first place that Hugo will look for rules and files is in the ```layouts/``` directory so it will always find the skin.

Your second choice is to create it in a sub-directory of the ```themes/``` directory. If you do, then you must always tell Hugo where to search for the skin. It’s extra work, though, so why bother with it?

The difference between creating a skin in ```layouts/``` and creating it in ```themes/``` is very subtle. A skin in ```layouts/``` can’t be customized without updating the templates and static files that it is built from. A skin created in ```themes/```, on the other hand, can be and that makes it easier for other people to use it.

The rest of this tutorial will call a skin created in the ```themes/``` directory a theme.

Note that you can use this tutorial to create a skin in the ```layouts/``` directory if you wish to. The main difference will be that you won’t need to update the site’s configuration file to use a theme.

### The Home Page
