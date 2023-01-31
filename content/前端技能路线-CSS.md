---
btdtitle: 前端技能路线-CSS
category: 前端技能路线
tags:
  - css
date: 2019-10-12
vssue-title: 前端技能路线-CSS
---

> 标题参考[前端技能路线系列](https://roadmap.sh/frontend)  
> 副标题参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS)  
> 文章内容来源 [表现](https://juejin.im/post/5dafa3d35188257b1549bad1#heading-1)

## 规范

1. [CSSWG](https://drafts.csswg.org/)
   
   > CSS Working Group Editor Drafts 承担主要的 CSS 规范开发工作

2. [FX Task Force](https://drafts.fxtf.org/)
   
   > FX Task Force Editor Drafts 主要是一些图形图像方面的规范，比如遮罩、滤镜

3. [Houdini](https://drafts.css-houdini.org)
   
   > CSS 新方向，浏览器暴露出更多 API，使 CSS 可以控制更多底层的东西，目前主要是 Chrome 团队在主导。

4. [w3c css](https://www.w3.org/Style/CSS/)

5. [caniuse](https://caniuse.com/)

6. [cssdb](https://cssdb.org/)
   
   > css 新特性阶段

## 伪类

伪类用于在页面中的元素处于某个状态时，为其添加指定的样式。  
最常规的区分伪类和伪元素的方法是：实现伪类的效果可以通过添加类来实现，但是想要实现伪元素的等价效果只能创建实际的 DOM 节点。

[区分伪类和伪元素？](#区分伪类和伪元素？)

### :hover

hover 元素要是想控制其他元素样式，除非是该元素的子元素，或者是兄弟元素，子元素直接在 :hover 后加空格加选择器，兄弟元素:hover 后加空格在加+

## 伪元素

伪元素会创建一个抽象的伪元素，这个元素不是 DOM 中的真实元素，但是会存在于最终的渲染树中，我们可以为其添加样式。  
伪元素可以分为排版伪元素、突出显示伪元素、树中伪元素三类

### 排版伪元素

1. `::first-line`伪元素
2. `::first-letter`伪元素

### 突出显示伪元素

突出显示伪元素表示文档中特定状态的部分，通常采用不同的样式展示该状态。如页面内容的选中。  
突出显示伪元素不需要在元素树中有体现，并且可以任意跨越元素边界而不考虑其嵌套结构。

1. `::selection`与`::inactive-selection`

### 树中伪元素

这类伪元素会一直存在于元素树中，它们汇集成源元素的任何属性。

1. 内容生成伪元素：`::before/::after`

2. 列表项标记伪元素（只有 safari 支持）：`::marker`

3. 输入框占位伪元素：`::placeholder`
   
   ## aspect-ratio

**`aspect-ratio`** [CSS](https://developer.mozilla.org/en-US/docs/CSS) 属性为box容器规定了一个**期待的纵横比**，这个纵横比可以用来计算自动尺寸以及为其他布局函数服务。还可以用作媒体查询

## content

CSS的 content CSS 属性用于在元素的  ::before 和 ::after 伪元素中插入内容。使用content 属性插入的内容都是匿名的可替换元素。  

值可以为attr，取元素上的属性值,例如：`content:attr(data-placeholder)`

## clamp()

设置最小值和首选值、最大值，`font-size: clamp(1rem, 2.5vw, 2rem); `

## display

### inline-flex

元素宽度由子元素撑起

### block

#### 块级元素的宽度

1. 块级元素宽度未设置时，宽度始终等于父元素宽度。
2. 如果设置了左右margin，则宽度等于父元素减去两边边距。
3. 如果有设置宽度，并且有一个边距有值，另一个边距值为auto时，则auto自动填充剩余宽度。
4. 如果设置了宽度，并且也设置了左右边距，那么在从左往右阅读的语言中，会把右外边距的值重置为`auto`。
5. 当设置了宽度，两边边距为auto时，块级元素居中

## line-height

line-height 取值的区别（100%、1em、1）：

1. 百分比和 em 根据父元素 font-size 进行计算
2. 值为数字时，根据子元素的 font-size 进行计算

## var()

使用css变量，**`var()`**函数可以代替`元素`中任何`属性`中的值的任何部分。**`var()`**函数不能作为属性名、选择器或者其他除了属性值之外的值。

## vertical-align

vertical-align 使用条件:父元素必须含有 line-height（inline 元素有无皆可），子元素中的 vertical-align 才能起作用。 ​​​​

## border-collapse

border-collapse CSS 属性是用来决定表格的边框是分开的还是合并的。在分隔模式下，相邻的单元格都拥有独立的边框。在合并模式下，相邻单元格共享边框。

## Grid

> 注意，设为网格布局以后，容器子元素（项目）的 flot、display:inline-block、display:table-cell、vertical-align 和 column-\*等设置都将失效。

## position

### absolute

相对于最近的非`static`定位祖先元素的偏移

### sticky

## flex

[flex不为人知的细节 ](https://mp.weixin.qq.com/s/KIqcUSxhCYEcfGVHPf5Gkg)

## font-size

原生端对于字体大小限制不一样，ios并没有限制字体大小，而android在小于8px之后不再变小（只测试了一台android）

可以在这个[链接](https://output.jsbin.com/nurileroge)进行测试。

## font-weight

默认为normal，当值为normal时与400等值

## @font-face

### font-display

font-display 属性决定了一个@font-face 在不同的下载时间和可用时间下是如何展示的。  
[font-display 用法](https://www.hexuanzhang.com/2026608131.html)

### unicode-range

指定字体使用的范围，比如该字体只应用在数字、英语、汉字中。

### 注意

1. 不能在css选择器中定义font-face，这是无效的:

```
.className {
  @font-face {
    font-family: MyHelvetica;
    src: local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"),
        url(MgOpenModernaBold.ttf);
    font-weight: bold;
  }
}
```

2. 隐藏的元素不会加载字体。
3. 同名字体不会重复加载，即使字体本身内容不一样。

### font-variant-numeric

`font-variant-numeric: tabular-nums;`像是倒计时这种数字经常变化的情景，推荐使用。整齐的对齐数字。



## @media

媒体查询语法。max-width是小于指定值，而min-width是大于等于指定值

## calc()

calc 函数是基本的表达式计算，它支持加减乘除四则运算。在针对维度进行计算时，calc() 函数允许不同单位混合运算，这非常的有用。例如：

```css
section {
  float: left;
  margin: 1em;
  border: solid 1px;
  width: calc(100% / 3 - 2 * 1em - 2 * 1px);
}
```

## overscroll-behavior-x

这个CSS属性用来控制当滚动到区域的水平边界时的浏览器行为。设置为`contain`效果为:

默认的滚动溢出行为将被内部的元素观察到，(例如: “bounce”效果或者刷新)，但是相邻的区域不会产生连续滚动效果，例如: 在下面的元素不会被滚动。

## svg

svg是内联元素，也会像span那样存在间距问题。 svg的宽高比不会被background-size拉伸，需要修改svg的preserveAspectRatio属性

```css
.page-home-wrap {
  height: 100vh;
  background: no-repeat
    url('~/assets/svg/202104_bg.svg#svgView(preserveAspectRatio(none))');
  background-size: 100% 100%;
}
```

多个svg有可能会互相影响，具体请看[svg之间还能互相影响](https://juejin.cn/post/6844903876210999303#heading-2)

## scroll-snap-type

滚动容器中的一个临界点如何被严格的执行，配合`scroll-snap-align`使用

## scroll-snap-align

控制元素滚动结束时，是浏览器会滚动到元素的哪个位置，有三个选项`start\end\center`

## img

### srcset

指定img备用图片资源

### sizes

只有在srcset值存在时才有效，指定在不同屏幕尺寸使用的图片资源。

## z-index

基本概念：

1. z-index是深度属性，设置元素在z轴上面的堆叠顺序。
2. z-index为负值时会隐藏到正常文档流下边，所以也无法触发点击事件。
3. 只有dom的position` 属性值不是 `static时才生效
4. 堆叠上下文：当前dom往上级找，如果该级设置了z-index属性值(非auto)，那么该级别dom就是堆叠上下文；如果往上级一直找不到，那么根级别dom就是堆叠上下文。

z-index优先级别比较：

1. 有postion属性的dom(脱离文档流的dom)会在没有position属性的dom(文档流内的dom)的上面。
2. 文档流内容的堆叠遵循后来居上的原则。(后面的如果和前面的dom重叠了，后面盖在前面)
3. 同级的dom，它们的堆叠上下文一定相同。所以直接z-index比较，大的在上面，小的在下面，相同的遵循后来居上的原则。
4. 非同级的dom，就比较他们堆叠上下文的z-index。(dom的z-index受父级的约束，父级如果小的话，子级再大也没用!)

> 参考：https://blog.csdn.net/qq_36333750/article/details/89893652 

## zoom

傲娇怪firefox不支持zoom，和transform:scale的区别是：

1. zoom的缩放是相对于左上角的；而scale默认是居中缩放；
2. zoom的缩放改变了元素占据的空间大小；而scale的缩放占据的原始尺寸不变，页面布局不会发生变化；
3. 性能问题，zoom是实际改变元素大小，所以性能没有scale好
4. zoom只是实验性支持,不同浏览器表现不一致
5. 设置了`<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>`之后，android端zoom无效

## BFC(块级格式化上下文)

比如说 BFC, BFC 是 block formatting context，也就是块级格式化上下文，是用于布局块级盒子的一块渲染区域。

### 如何触发 BFC？

即如何让某元素内形成 BFC 环境。  
下列方式会创建块格式化上下文：

- 根元素(`<html>`)
- 浮动元素（元素的 `float` 不是 `none`）
- 绝对定位元素（元素的 `position` 为 `absolute` 或 `fixed`）
- 行内块元素（元素的 `display` 为 `inline-block`）
- 表格单元格（元素的 `display`为 `table-cell`，HTML 表格单元格默认为该值）
- 表格标题（元素的 `display` 为 `table-caption`，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 `display为 table、table-row、 table-row-group、table-header-group、table-footer-group`（分别是 HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- `overflow` 值不为 `visible` 的块元素
- `display` 值为 `flow-root` 的元素
- `contain` 值为 `layout、content或 paint` 的元素
- 弹性元素（`display`为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（`display`为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 `column-count` 或 `column-width` 不为 `auto`，包括 `column-count` 为 1） `column-span` 为 `all` 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

### BFC 布局规则

1. 内部的 Box 会在垂直方向，一个接一个地放置。
2. Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
3. 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC 的区域不会与 float box 重叠。
5. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算 BFC 的高度时，浮动元素也参与计算

### BFC 有哪些作用？

1. 自适应两栏布局

```html
<style>
  .wrapper div {
    height: 200px;
  }

  .left {
    float: left;
    width: 200px;
    background: gray;
  }

  .right {
    float: right;
    width: 200px;
    background: gray;
  }

  .main {
    /* 中间栏创建 BFC */
    /* 由于 盒子的 margin box 的左边和包含块 border box 的左边相接触 */
    /* 同时 BFC 区域不会和浮动盒重叠，所以宽度会自适应 */
    overflow: auto;
    background: cyan;
  }
</style>
<div class="wrapper">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>
```

2. 可以阻止元素被浮动元素覆盖

```html
<!-- 文字浮动效果 -->
<div class="p">
  <div class="c1"></div>
  <div class="c2">对双方来说肯定附件是快乐的附件是领导看速度</div>
</div>
<style>
  .p {
    overflow: hidden;
    width: 5em;
    height: 200px;
  }
  .c1 {
    background: red;
    width: 100px;
    float: left;
    height: 100px;
  }
  .c2 {
    background: green;
  }
</style>
```

3. 可以包含浮动元素——清除内部浮动

```html
<!-- 父元素高度被flot子元素撑起 -->
<style>
.p {
  overflow: hidden;
  background: deepskyblue;
}
.c1 {
  background: red;
  float: left;
  width: 10%;
  height: 100px;
}
<style>
<div class="p">
  <div class="c1"></div>
</div>
```

4. 分属于不同的 BFC 时可以阻止 margin 重叠
   
   > 引用： [可能是最好的 BFC 解析了](https://juejin.im/post/5e6afcc9e51d45270f52d462)

## 动画

几种动画的解决方案：

1. gif，缺点是透明背景有毛边，显示不清楚，体积大
2. css关键帧动画，只能做简单的，比如随机函数做不了。
3. 使用AE的制作的动画，然后用Lottie转换成svg或者canvas，缺点：目前不支持wiggle path函数。也可以去物料库 [lottiefiles.com/](https://lottiefiles.com/)找一个`json`动画
4. 一些css动画库：https://juejin.cn/post/7026867467783766047?utm_source=gold_browser_extension

## CSS NEXT

### CSS Nesting Module

css原生嵌套语法，有两种写法：`直接嵌套`和`@nest`规则。嵌套必须由`选择符`开始

```
.foo {
  color: blue;
  & { padding: 2ch; }
}

.foo {
  color: red;
  @nest & > .bar {
    color: blue;
  }
}
```

### env()

环境变量，目前支持的`user-agent`变量有：1. safe area inset 2. viewport-segment。除了`UA`变量还支持用户自定义变量，用户定义变量目前只能通过引用插件时定义，不能定义在css文件中

## 问题

### 如何禁止移动端长按选中？

```css
-webkit-touch-callout: none; // 禁用长按菜单，只有ios支持
  user-select: none; // 禁止选中文字
  pointer-events: none; // 禁止点击
```

### 文字超出省略？

```css
overflow:hidden;//隐藏文字
text-overflow:ellipsis;//显示 ...
white-space:nowrap; // 不换行
```

### 多行文字超出省略

```css
display: -webkit-box; /*重点，不能用block等其他，将对象作为弹性伸缩盒子模型显示*/
      -webkit-box-orient: vertical; /*从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）*/
      -webkit-line-clamp: 3; /*行数，超出三行隐藏且多余的用省略号表示...*/
      line-clamp: 3;
      word-break: break-all;
      overflow: hidden;
      max-width: 100%;
```

### 如何处理小于12px的文字？

在有些PC浏览器中font-size无法小于12px，现有的几种解决办法：

1. 使用zoom，但是兼容性和性能都不行,移动端会出问题。
2. 使用transform:scale()来缩小，但是还是会占用实际空间

```css
display:inline-block; // transform:scale只对有宽高的元素生效
font-size: 16px;
transform: scale(0.5);
transform-origin: bottom left; 
line-height:8px; // line-height为font-size一半
margin-right: -宽度一半px;
```

3. 使用svg替代文本，例子：https://www.zhangxinxu.com/wordpress/2018/03/svg-text-font-size-auto-scale/   使用图片替代文本

### A 标签中包含嵌套 img 后，高度为什么多了几个像素?

a 元素下有一个匿名文本，这个文本外有一个匿名行级盒子，它有的默认 vertical-align 是 baseline 的，而且往往因为上文 line-height 的影响，使它有个 line-height，从而使其有了高度。而 img 是行内元素，即默认 display: inline; 所以，由于行级盒的对齐问题（baseline 对齐）的原因，a 标签下匿名盒子就会下沉，往下撑开一些距离，所以把 a 撑高了。解决办法一：  
消除掉匿名盒子的高度，也就是将 a 标签的 display 设置为 block 或者 inline-block，并且 a 设置 line-height:0 或 font-size:0;

这个方法，作者测试发现 display:inline-block;line-heihgt:0px;的情况下，多出的 7 像素会跑到 a 标签的父标签里去，不知道为啥。而使用 display:block 则不会出现这种情况

解决办法二：  
a 标签和 img 标签都设置 vertical-align:top，让其 top 对齐，而不是 baseline 对齐

解决办法三（推荐）：  
给 img 设置 display:block，让它和 a 标签下的匿名行级盒子不在一个布局上下文中，也就不存在行级盒的对齐问题。

> [参考](http://www.atdevin.com/2242.html?cqxmhm=ytlzy)

### 如何选择第一个指定的class元素？

没有类似`:first-of-class`这种选择器，但是可以使用其他办法：

```css
.home > .red {
    border: 1px solid red;
}
.home > .red ~ .red {
    border: none;
}
```

### 块级元素宽度不会被撑开？

块级元素被子元素撑开时，如果没设置宽度，宽度就是这个块级元素的父元素的100%

块级元素的宽度等于其父元素内容区的宽度，
所以跟儿子撑不撑没关系。

浮动元素和行内块级元素这种失去了天生宽度的元素，才有被儿子撑开一说

### box-shadow显示不全？

有可能是被相邻的overflow:hidden裁剪，添加边距可以解决。

### sticky定位失效?

1. 祖先元素设置了`overflow:hidden;`

### rgba 和 opacity 的不同？

rgba 只是背景颜色有透明效果，内容不会透明，opacity 是所有后代都变透明

### 文字超出隐藏？

```css
.hideText{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### flex 布局中文本超出隐藏无效？

1. 在 flex 布局中使用文本超出隐藏时会遇见 bug,给该文本的父元素增加 min-width:0 可以解决。 ​​​​1. 设置文本元素宽度100%

### 元素全屏后，弹窗元素不能显示？

- 原因：  
  使用 elementUI 时`notify`组件无法在全屏中显示出来，因为 notify 渲染在 body 下，全屏元素不与 notify 在同一层级下，如果 notify 组件为全屏元素的子元素，那么就会正常显示了。
- 解决思路：
  - 把弹窗元素移到全屏元素下。
  - 把 body 全屏，把之前的全屏元素设置为：

```css
.fullscreen {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: black;
}
```

### 防止滚动穿透？

1. css方法：
   1. 设置滚动的元素pointer-events：none
   2. 设置overflow:hidden
2. js方法：

```
// //阻止防止滚动、缩放。

// $(".sliders,.modals").on("touchmove",function(event){
// event.preventDefault();
// });
```

### 区分伪类和伪元素？

- 最常规的区分伪类和伪元素的方法是：实现伪类的效果可以通过添加类来实现，但是想要实现伪元素的等价效果只能创建实际的 DOM 节点。
- 可以通过`:`和`::`来区分，，`:`表示伪类，`::`表示伪元素
- 伪元素与伪类的根本区别在于：操作的对象元素是否存在于原来的 dom 结构里。

::before 伪类搭配 vertical-align:middle 实现垂直居中的原理？

- https://segmentfault.com/a/1190000020646920

### before和after伪类无法作用于img？

对于 img 这种自闭和标签，似乎不存在 content （内容或后代元素）在标签中，所以选择器没有生效

> https://www.cnblogs.com/goodbeypeterpan/p/9620114.html

### 如何单独为after和before设置点击事件？

首先屏蔽父元素的点击事件`pointer-events: none;`，因为继承的原因，所以还有为伪类添加点击事件`pointer-events: auto;`

### 垂直水平居中？

> 参考：[CSS 实现元素水平垂直居中的 N 种方式](https://mp.weixin.qq.com/s/QNHE-WDSdcl7wETLak0GEg)

```html
<div class="parent">
  <div class="child"></div>
</div>
```

1.

```css
div.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

2.

```css
div.parent {
  position: relative;
}
div.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* 或者 */
div.child {
  width: 50px;
  height: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -25px;
  margin-top: -5px;
}
/* 或 */
div.child {
  width: 50px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

3.

```css
div.parent {
  display: grid;
}
div.child {
  justify-self: center;
  align-self: center;
}
```

4.

```css
div.parent {
  font-size: 0;
  text-align: center;
  &::before {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }
}
div.child {
  display: inline-block;
  vertical-align: middle;
}
```

5.

```css
div.parent {
  /* display:grid; 也可以*/
  display: flex;
}
div.child {
  margin: auto;
}
```

6. 用于 ifc

```css
/* line-height + text-algin */
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.child {
}
```

7. 最简单方式,使用flex布局和`margin:auto`
   
   ```css
   .parent{
   height:100px;
   display:flex;
   }
   .child{
   margin:auto;
   }
   ```
   
   ### 杯布局和双飞翼布局的好处？

杯布局和双飞翼布局可以让重要的文档流提前渲染 ​​​​

### 清除浮动？

对于子元素设置 float：right 后脱离文档流的问题，可以对父元素设置 overflow:hidden 来解决 ​​​​

### less如何在每个样式文件中都引入共通样式？

这时候我们经常会使用类似于 `less-loader` 的 `additionalData` 在每个样式文件头部引入相应的全局文件，从而避免在每个文件中都写 `@import "@/styles/mixins.less"` 语句

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        additionalData:
          '@import "@/styles/variables";\n@import "@/styles/mixins";\n',
      },
    },
  },
});
```

### 自适应布局?

1. [自适应方案场景选择](https://juejin.cn/post/6867874227832225805)
2. 自适应rem计算公式。`font-size:calc(100vw/设计图总宽度)`,这样可以用rem替代设计图中的px

### border圆角渐变如何实现？

参考：https://www.cnblogs.com/imgss/p/11237170.html

### 如何实现虚线渐变？

> 参考：https://www.zhangxinxu.com/wordpress/2018/08/css-gradient-dashed-border/

```css
.collapse__line {
  border-top: 1px dashed #e2e2e2;
  transform: scaleY(0.5);
  box-sizing: border-box;
}
@supports (-webkit-mask: none) or (mask: none) {
  .collapse__line {
    height: 1px;
    border: none;
    background: linear-gradient(
        90deg,
        rgb(226 226 226 / 0%) 0%,
        #e2e2e2 50%,
        rgb(226 226 226 / 0%) 100%
      )
      no-repeat;
    mask: linear-gradient(to right, #000 6px, transparent 6px) repeat-x,
      linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y,
      linear-gradient(to right, #000 6px, transparent 6px) repeat-x 0 100%,
      linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y 100% 0;
    mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
  }
}
```

### margin:0 auto失效？

居中block元素没有设置宽度

### 如何在元素滚动结束时规定元素item的位置和对齐方式？

```
scroll-snap-type: x mandatory;
```



## 最佳实践

### content-visibility

值为`auto`时，网页只渲染可见区域内容，跳过不可见区域的元素。

### border

1. 当动态 border（比如 hover 时显示 border）破坏布局,可以提前设置一个透明的 border，或者使用 outline,outline 不会影响布局，但是 outline 不能拆分成 top、bottom、left、right。

### color

1. css 颜色值要使用小写 ​​​​

### url

书写 css 时去除 url 引用资源的引号，这是没有必要的，影响阅读. ​​​​

### transform

1. 在移动端开发中，直接使用 transition 动画会让页面变慢，甚至变卡顿，所以我们通常添加 transform:translate3D(0，0，0)或 transform:translateZ(0)来开启移动端动画的 gpu 加速，让动画过程更流畅。 ​​​​
2. 在拖拽这种高性能需求场景，应该用 transform 替换`left top`来实现元素的移动

### /deep/

不要使用/deep/选择器，将要不被支持

### 字体

1. 字体文件使用woff2格式的，体积小。为了进一步压缩字体大小，还可以使用fontmin来提取需要的文字。

2. `-webkit-font-smoothing`：抗锯齿渲染

### 间距

本人认为只有在元素存在时，间距才应生效，视情况优先使用`margin-top、margin-left`等遵循文档流方向的方案，能使用padding则优先使用padding，因为margin有可能在垂直方向上产生bfc

### img

设置最大宽度`max-width:100%;`

### 滚动元素

设置滚动结束时，元素的位置：

```css
.carousel {
  scroll-snap-type: x mandatory;
}
.carousel .item {
   scroll-snap-align: start;
}
```



## 兼容 IE

> [其他垫片补全插件](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills)

### css hack

CSS hack 是通过在 CSS 样式中加入一些特殊的符号，让不同的浏览器识别不同的符号（什么样的浏览器识别什么样的符号是有标准的，CSS hack 就是让你记住这个标准），以达到应用不同的 CSS 样式的目的。

### IE8

1. 由于 ie8 不支持 transform，所以有人特意写了个网站来自动转换成 IE 语法. [CSS3 2D transforms](http://www.useragentman.com/IETransformsTranslator/)

2. 对于 IE8 及以下浏览器可以使用 PIE.htc 来使用一些 CSS3 的特性，[PIE 下载地址](https://github.com/lojjic/PIE/downloads)
- border-radius

- box-shadow

- border-image

- multiple background images

- linear-gradient as background image
1. 支持背景图片自适应：

```
  filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='./dist/image/background.png', sizingMethod='scale') ​​​
```
