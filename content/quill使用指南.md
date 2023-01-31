---
title: quill使用指南
category: 分享
tags:
  - quill
date: 2020-10-22
vssue-title: quill使用指南
---

## quill 介绍

一款跨平台的富文本编辑器

## 主题（themes）

Quill 官方提供两个有特色的主题：Snow and Bubble。如果都不想使用那么可以不设置，并设置使用`quill.core.css`样式

## 模块（modules）

需要引入模块的集合及它们各自的选项。

## formats

支持的格式设置有如下

### Inline

背景颜色 - background 加粗字体 - bold 字体颜色 - color 字体 - font 内联代码 - code 斜体 - italic 链接 - link 字体大小 - size，有效值['small','large','huge'] 删除线 - strike 上标/下标 - script 下划线 - underline

### 块

引用 - blockquote 标题 - header 缩进 - indent 列表 - list 文本对齐方式 - align 文本方向 - direction 代码块 - code-block

### 嵌入

公式 - formula 图片 - image 视频 - video

## API

api 中的名词讲解：

- `Source`：表示来源，有可能是从`user`，或者`api`,或者`silent`。

### getLength

返回编辑器内容的长度。注意，当 Quill 为空时，仍然包含一个由'\n'解析成的空行，所以 getLength 将返回 1。

### getText

返回编辑器的字符串内容。非字符串内容会被忽略掉

### setContents

覆盖编辑器 contents，末尾会自动插入`{ insert: '\n' }`

### setText

用给定的文本设置为编辑器的内容，返回代表对应变化的 Delta 数据。注意，Quill 文档必须以换行符结尾，如果没有则会自动添加。

### updateContents

让编辑器内容执行 Delta 数据方法，返回代表对应变化的 Delta 数据。如果给定的 Delta 没有无效的操作，返回值和传入的值相同。

### setSelection

给定范围设置用户的选区，同时焦点在编辑器上。作为选区传入 null，将会使编辑器失去焦点。

## 格式化(formattting)

### format

格式化选中或者光标之后的内容

## 增量(delta)

Delta 的指令总是从文档开头开始。因为有简单的 retain ，所以我们不需要再为 delete 或 insert 操作定义一个 index 值。

### 行格式编排

带有换行符的内容对应属性是描述一行的格式。

```
{
  ops: [
    { insert: 'The Two Towers' },
    { insert: '\n', attributes: { header: 1 } },
    { insert: 'Aragorn sped on up the hill.\n' }
  ]
}
//表示的内容：<h1>The Two Towers</h1><p>Aragorn sped on up the hill.</p>

```

## 问题

### 怎么动态修改 placeholder？

placeholder 是通过 css 实现的：

```css
.ql-editor::before {
  content: attr(data-placeholder);
}
```

所以可以通过元素的`data-placeholder`修改：

```js
quill.root.dataset.placeholder = "Your new placeholder";
```
### quill.clipboard.convert会产生多余的新行？
这个问题是当组件内部将html转换为文本时，任何段落都将转换为文本，并在末尾添加新行。因此，组件再次将内部文本转换为html，然后将任何文本放入段落中
这个
```js
html
      .replace(/<p><br><\/p>/g, '<br>')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '<br>')
```
> 参考：https://github.com/KillerCodeMonkey/ngx-quill/issues/357#issuecomment-606641746
### dangerouslyPasteHTML失去焦点？
使用其他方法替代：
```js
const html = '<p>Set HTML content <i>without</i> changing focus</p>'
const delta = quill.clipboard.convert(html);
quill.setContents(delta);
```