--- 
title: Markdown测试文档
published: 2024-2-16 00:00:00
description: 本文档用于测试 Markdown 格式。
category: 测试
id: mdtest
---


## 文本样式

**加粗文本**
*斜体文本*
***加粗斜体***
~~删除线~~
`行内代码`
<u>下划线</u>（部分平台支持）


## 列表

### 无序列表

- 项目一
- 项目二
  - 子项目 A
  - 子项目 B
- 项目三

### 有序列表

1. 第一步
2. 第二步
   1. 子步骤 a
   2. 子步骤 b
3. 第三步

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 待办事项

## 引用


## Alert提示

> [!tip] 提示
> 这是一个提示语法

> [!IMPORTANT] 重点
> 这是一个重点语法

> [!NOTE] 标记一下
> 这是一个标记语法

> [!caution] 注意
> 这是一个注意语法

> [!warning] 警告
> 这是一个警告语法



## 隐藏文字

注意，这是一个:spoiler[隐藏]的行内文字

:::spoiler
注意，这一行都是隐藏文字
:::

> 这是一段引用
> > 这是嵌套引用
> > > 更深层的引用

## 代码


### 行内代码
使用 `console.log()` 输出日志

### 代码块

```javascript
function hello(name) {
  console.log(`Hello, ${name}!`);
}
```

## 链接与图片

[普通链接](https://www.example.com)
[带标题的链接](https://www.example.com "标题")
<https://www.example.com>  自动链接

![图片描述](https://bu.dusays.com/2026/08/30/6a93e96f31cf0.jpg "图片标题")


## 表格

| 左对齐 | 居中对齐 | 右对齐 |
| :----- | :------: | -----: |
| A      |    B     |      C |
| 数据1  |   数据2  |   数据3 |


## 分隔线

---
***
___


## 注脚

这是一个脚注引用[^1]。

[^1]: 这里是脚注的具体内容。

## HTML混排

<div align="center">居中文本</div>
<br>
<kbd>Ctrl</kbd> + <kbd>C</kbd>


## 数学公式

1. 块级公式
$$
\int_{a}^{b} f(x)\,dx = F(b) - F(a)
$$


2. 求和与连乘
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}, \qquad \prod_{k=1}^{n} k = n!
$$