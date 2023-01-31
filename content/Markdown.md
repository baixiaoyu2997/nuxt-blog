---
title: Markdown
category: 分享
tags:
  - Markdown
date: 2020-02-19
vssue-title: Markdown
---

<!-- 标题参考 ：https://www.w3cschool.cn/lme/4mf31snh.html-->

## 基本语法

> 只写格式化工具支持的语法

### 标题

使用\#可以表示 1-6 级标题

### 加粗

`** dfd **`

### 水平线

`---`

### 图片

`![](imgurl)`

### 引用

语法：

```
> 第一层
> > 第二层
```

实例：

> 第一层
>
> > 第二层

## 扩展语法

### 文字颜色

```html
<font color="#ff0000"></font>
```

### diff

表示版本控制系统中的增减，用法，在代码块中加入 diff，并在需要增减的一行开头加入`+-`,实例：

```diff
const onClick=()=>{
+    console.log(1111)
}
```

### 删除线

`~~霓虹~~`

### 锚点

指定标题文字（title）,不论是几级标题，都只需写一个`#`

```
[text](#title)

### title
```

### 折叠

```html
<details>
  <!-- summary必须隔开一行 -->
  <summary>展开</summary>

  《现代前端技术解析》 《ES6 入门》
</details>

<!-- details下必须空出一行 -->
```

### iframe 嵌套页面

```
 <iframe src="https://codesandbox.io/embed/l9v2vyypm?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Element UI login page"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```

 <!-- <iframe  
 height=550 
 width=1000
 importance="low"
 src="https://baixiaoyu2997-github-io.now.sh/posts/2020/08/09/nuxt%E5%AD%A6%E4%B9%A0%E9%9A%8F%E7%AC%94.html"
 style="object-position:-50% -50%"
 >
 </iframe> -->
<iframe src="https://codesandbox.io/embed/l9v2vyypm?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Element UI login page"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 特殊符号处理

使用反斜杠`\`处理，主要有以下几种特殊符号：

```
\
`
*
_
{}
[]
()
#
+
-
.
!
```
