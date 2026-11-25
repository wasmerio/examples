---
title: "Markdown语法样例"
slug: markdown-yu-fa-yang-li
index: 2
description: "展示 Markdown 语法的各种类型和示例"
category: "示例"
tags: [Markdown]
published: 2025-06-03 00:44:37
updated: 2026-09-04 16:05:01
---

## 1. 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

效果：

### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

> 悬停标题会显示 `#` 锚点，点击可跳转到该标题。

## 2. 段落与换行

```markdown
这是第一段。  
这是第二段（行尾加两个空格实现换行）。

这是新段落（空一行分隔）。
```

效果：

这是第一段。  
这是第二段（行尾加两个空格实现换行）。

这是新段落（空一行分隔）。

## 3. 文字强调

```markdown
*斜体* 或 _斜体_
**粗体** 或 __粗体__
***粗斜体*** 或 ___粗斜体___
~~删除线~~
~单波浪删除线~
```

效果：

*斜体* 或 _斜体_  
**粗体** 或 __粗体__  
***粗斜体*** 或 ___粗斜体___  
~~删除线~~  
~单波浪删除线~

## 4. 列表

### 无序列表

```markdown
- 项目1
- 项目2
  - 嵌套项目（缩进2或4个空格）
* 也可以用星号
+ 或者加号
```

效果：

- 项目1
- 项目2
  - 嵌套项目（缩进2或4个空格）
* 也可以用星号
+ 或者加号

### 有序列表

```markdown
1. 第一项
2. 第二项
   1. 嵌套有序项（缩进）
3. 第三项
```

效果：

1. 第一项
2. 第二项
   1. 嵌套有序项（缩进）
3. 第三项

### 任务列表

```markdown
- [x] 已完成任务
- [ ] 未完成任务
```

效果：

- [x] 已完成任务
- [ ] 未完成任务

## 5. 链接

```markdown
[行内链接](https://example.com "可选标题")
[引用式链接][引用]
文章末尾添加：[引用]: https://example.com "标题" 
[空链接]<> 或 <https://example.com>（自动链接）
```

效果：

[行内链接](https://example.com "可选标题")  
[引用式链接][引用]  
<https://example.com>（自动链接）

> 外部链接自动在新窗口打开。

## 6. 图片

```markdown
![替代文字](https://xxxxx "可选标题")
![引用式图片][img]
[img]: https://xxxxx "标题"
# 或者本地图片
![本地图片](../images/logo.webp "本地图片")
```

效果：

![替代文字](../images/logo.webp "可选标题")

> 点击图片可打开灯箱放大预览。

## 7. 引用块

```markdown
> 这是一段引用。
> 可以跨多行。
>> 嵌套引用。
```

效果：

> 这是一段引用。
> 可以跨多行。
>> 嵌套引用。

## 8. 代码

### 行内代码

```markdown
使用 `print()` 函数输出。
```

效果：使用 `print()` 函数输出。

### 代码块

````markdown
```
普通代码块
```
```python
# 语法高亮
print("Hello, World!")
```
缩进4个空格或一个制表符：
    def foo():
        return "bar"
````

效果：

```
普通代码块
```

```python
# 语法高亮
print("Hello, World!")
```

### 差异对比（diff）

差异对比使用独立的 `:::diff` 容器语法，内容按原文原样渲染，不经过 Markdown 解析（`+`/`-` 开头的行不会被误认为列表）。容器名后可附标题（如文件名）：

````markdown
:::diff greet.ts
@@ -8,4 +8,5 @@ function greet(name) {
  const prefix = '你好'
-  const message = prefix + name
+  const message = `${prefix}, ${name}!`
+  console.log(message)
  return message
}
:::
````

效果（参考 VSCode 差异视图：整行红绿底色、`+/-` 符号列、行内词级高亮）：

:::diff greet.ts
@@ -8,4 +8,5 @@ function greet(name) {
  const prefix = '你好'
-  const message = prefix + name
+  const message = `${prefix}, ${name}!`
+  console.log(message)
  return message
}
:::

注意：代码块自带行号、复制按钮与语言标识；支持 python / bash / go / rust / sql / diff 等常用语言，未知语言按纯文本渲染。请勿使用缩进4个空格或一个制表符来创建代码块，因为不会显示。

## 9. 水平线
```markdown
--- 或 *** 或 ___
```
效果：

`---`：

---

`***`：

***

`___`：

___

## 10. 表格

```markdown
| 左对齐------ | ------居中------ | ------右对齐 |
|:-------|:----:|-------:|
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
```

效果：

| 左对齐------ | ------居中------ | ------右对齐 |
|:-------|:----:|-------:|
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

## 11. 脚注

```markdown
这是一个句子[^1]。
[^1]: 脚注内容。
```

效果：

这是一个句子[^1]。  
[^1]: 脚注内容。

## 12. 提示容器

````markdown
:::tip 提示标题
这是一个提示容器。
:::

:::warning
支持 info / tip / warning / danger / details 五种类型。
:::

:::details 点击展开
details 容器默认折叠，点击标题展开。
:::
````

效果：

:::tip 提示标题
这是一个提示容器。
:::

:::warning
支持 info / tip / warning / danger / details 五种类型。
:::

:::details 点击展开
details 容器默认折叠，点击标题展开。
:::

## 13. 内联 HTML

```markdown
<kbd>Ctrl</kbd> + <kbd>C</kbd>  
<span style="color:red;">红色文字</span>
```

效果：

<kbd>Ctrl</kbd> + <kbd>C</kbd>  
<span style="color:red;">红色文字</span>

## 14. 转义字符

```markdown
\*不会变成斜体\*
\# 不是标题
```

效果：

\*不会变成斜体\*  
\# 不是标题

## 15. 表情符号

```markdown
:smile: :heart: :+1:
```

效果：

:smile: :heart: :+1:

## 16. 自动链接

```markdown
<https://example.com>
<user@example.com>
www.example.com（GFM 自动识别）
```

效果：

<https://example.com>  
<user@example.com>  
www.example.com

## 17. 数学公式

```markdown
$E=mc^2$
$$
\int_{a}^{b} f(x) dx
$$
```

效果：

$E=mc^2$
$$
\int_{a}^{b} f(x) dx
$$

[引用]: https://example.com "标题"