+++  
title = 'Usage of code block style in markdown'  
date = 2025-01-15T16:22:16Z  
draft = false    
hidden = false
tags = ['morandyt','hugo','code block']  
categories = ['morandyt','hugo','test1','test2','test3']  
description = 'How to change code block style in morandyt theme?'  
tocStyle = 'order'  
author = 'pen'  
authorNote = ''  
authorImg = '/img/penlike.png'    
comments = false
+++  

## Folder
Head into your `/assests/` folder  

## Command
Run:
```bash
hugo gen chromastyles --style=github > assets/css/chroma-light.css
```
&
```bash
hugo gen chromastyles --style=github-dark > assets/css/chroma-dark.css
```
{{< warning "red" "Change `github` & `github-dark` to any style you like!" >}}

## Style
Style reference: https://gohugo.io/content-management/syntax-highlighting/#style

