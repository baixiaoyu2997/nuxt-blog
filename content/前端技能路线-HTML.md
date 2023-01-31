---
title: 前端技能路线-HTML
category: 前端技能路线
tags:
  - HTML
date: 2020-03-13
vssue-title: 前端技能路线-HTML
---

## 规范

1. [whatwg](https://spec.whatwg.org/)
   
   > 网页超文本应用技术工作小组是一个以推动网络 HTML 5 标准为目的而成立的组织

## ruby ![html5](https://mdn.mozillademos.org/files/3843/HTML5_Badge_32.png)

> HTML `<ruby>` 元素 被用来展示东亚文字注音或字符注释。

### 示例

```html
<html>
  <ruby>
    汉
    <rp>(</rp>
    <rt>han</rt>
    <rp>)</rp>
    字
    <rp>(</rp>
    <rt>zi</rt>
    <rp>)</rp>
  </ruby>
  <ruby>
    明日
    <rp>(</rp>
    <rt>Ashita</rt>
    <rp>)</rp>
  </ruby>
</html>
```

### 预览

<html>
    <ruby>
        汉 <rp>(</rp><rt>han</rt><rp>)</rp>
        字 <rp>(</rp><rt>zi</rt><rp>)</rp>
    </ruby>
    <ruby>
        明日 <rp>(</rp><rt>Ashita</rt><rp>)</rp>
    </ruby>
</html>

## blockquote

> HTML `<blockquote>` 元素（或者 HTML 块级引用元素），代表其中的文字是引用内容。通常在渲染时，这部分的内容会有一定的缩进。若引文来源于网络，则可以将原内容的出处 URL 地址设置到 cite 特性上，若要以文本的形式告知读者引文的出处时，可以通过 `<cite>`元素。

### 示例

```html
<blockquote cite="https://www.huxley.net/bnw/four.html">
  <p>
    Words can be like X-rays, if you use them properly – they'll go through
    anything. You read and you're pierced.
  </p>
</blockquote>

<cite>– Aldous Huxley, Brave New World</cite>
```

### 预览

<html>
    <blockquote cite="https://www.huxley.net/bnw/four.html">
        <p>Words can be like X-rays, if you use them properly – they'll go through anything. You read and you're pierced.</p>
    </blockquote>
</html>
<html>
    <cite>– Aldous Huxley, Brave New World </cite>
</html>

## time ![html5](https://mdn.mozillademos.org/files/3843/HTML5_Badge_32.png)

> 代表日期 和时间 值；机器可读的等价形式通过 datetime 属性指定。

### 示例

```html
<p>
  The concert took place on
  <time datetime="2001-05-15 19:00">May 15</time>
  .
</p>
```

### 预览

<p>The concert took place on <time datetime="2001-05-15">May 15</time>.</p>

## pre

> 代表其内容已经预先排版过，格式应当保留。

## samp

> 代表程序或电脑的输出 。

## code

> 代表计算机代码 。

## figure ![html5](https://mdn.mozillademos.org/files/3843/HTML5_Badge_32.png)

> 代表一个和文档有关的图例。

### 示例

```html
<figure>
  <img
    src="http://www.w3school.com.cn/i/shanghai_lupu_bridge.jpg"
    alt="An awesome picture"
  />
  <figcaption>Fig1. MDN Logo</figcaption>
</figure>
```

### 预览

<figure>
  <img src="http://www.w3school.com.cn/i/shanghai_lupu_bridge.jpg" alt="An awesome picture">	
  <figcaption>Fig1. MDN Logo</figcaption>
</figure>

## dfn

> 代表一个术语包含在其最近祖先内容中的定义 。

## 其他

![其他](https://static001.geekbang.org/resource/image/96/9e/9684130e423b6734b23652f4f0b6359e.jpg)

## 通过 rel="preload"进行内容预加载

preload 提供了一种声明式的命令，让浏览器提前加载指定资源(加载后并不执行)，需要执行时再执行,这样做的好处在于：

1. 将加载和执行分离开，不阻塞渲染和 document 的 onload 事件
2. 提前加载指定资源，不再出现依赖的 font 字体隔了一段时间才刷出的情况

```html
<link rel="preload" href="/path/to/style.css" as="style" />
```

使用 preload 后，不管资源是否使用都将提前加载。若不确定资源是必定会加载的，则不要错误使用 preload，以免本末导致，给页面带来更沉重的负担  
Preload 有 as 属性，浏览器可以设置正确的资源加载优先级，这种方式可以确保资源根据其重要性依次加载， 所以，Preload 既不会影响重要资源的加载，又不会让次要资源影响自身的加载；浏览器能根据 as 的值发送适当的 Accept 头部信息；浏览器通过 as 值能得知资源类型，因此当获取的资源相同时，浏览器能够判断前面获取的资源是否能重用  
如果忽略 as 属性，或者错误的 as 属性会使 preload 等同于 XHR 请求，浏览器不知道加载的是什么，因此会赋予此类资源非常低的加载优先级  
Preload 的与众不同还体现在 onload 事件上。也就是说可以定义资源加载完毕后的回调函数

```html
<link rel="preload" href="..." as="..." onload="preloadFinished()" />
```

对跨域的文件进行 preload 时，必须加上 crossorigin 属性

```html
<link
  rel="preload"
  as="font"
  crossorigin
  href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff"
/>
```

preload 字体不带 crossorigin 会二次获取！ 确保对 preload 的字体添加 crossorigin 属性，否则字体文件会被下载两次，这个请求使用匿名的跨域模式。这个建议也适用于字体文件在相同域名下，也适用于其他域名的获取(比如说默认的异步获取)

prefetch

```html
<link rel="“prefetch”" />
```

它的作用是告诉浏览器加载下一页面可能会用到的资源，注意，是下一页面，而不是当前页面。因此该方法的加载优先级非常低，也就是说该方式的作用是加速下一个页面的加载速度.　  
所以，对于当前页面很有必要的资源使用 preload，对于可能在将来的页面中使用的资源使用 prefetch

> 引用：  
> [资源预加载 preload 和资源预读取 prefetch 简明学习](https://www.cnblogs.com/xiaohuochai/p/9183874.html)

## 全局属性

### contenteditable

元素是否可被用户编辑,可以使用这个属性配合`document.execCommand`来实现现代富文本编辑器

```
<div contenteditable="true">
    <p>Edit this content to add your own quote</p>
</div>
```

## img

### 属性

#### loading

懒加载，目前兼容性还比较差，不要使用loading-attribute-polyfill，体验不好，使用lazysizes。支持两个值。

1. 默认值：eager，立即加载图像，不管它是否在可视视口（visible viewport）之外。
2. lazy:延迟加载图像，直到它和视口接近到一个计算得到的距离，由浏览器定义。加载图片数量不仅与屏幕高度有关，还与网速有关
3. 使用lazysizes时应该所有的图片都加上lazyload，因为滚动之后刷新是保持滚动位置的，所以也可以保证顶部或其他区域的图片懒加载

## is

指定标准HTML元素像定义的内置元素一样工作,例如：

```html
// Create a class for the element
class WordCount extends HTMLParagraphElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Constructor contents ommitted for brevity
    ...

  }
}

// Define the new element
customElements.define('word-count', WordCount, { extends: 'p' });

<p is="word-count"></p>
```



### gif

通过通过重新设置img的src让gif重新播放

## Link_types（链接类型）

### canonical

link rel=canonical，当页面有不同参数传递的时候，可以告知搜索引擎这些地址为同一个地址。 ​​​​

### favicon

现代浏览器更推荐使用最小32*32，格式为png的图片,例如：

`<link rel="icon" type="image/png" href="/path/to/icons/favicon-32x32.png" sizes="32x32">`

## script

defer和async的区别：

1. defer是有序执行（规范是有序，但实际实现不一定是有序），而async是乱序执行
2. defer只能用在外部链接
3. defer不会阻塞页面解析，如下图所示



![preview](https://blog-pic.oss-cn-beijing.aliyuncs.com/view.png)



### 动态脚本

通过append添加到`document`中，默认情况下，动态脚本的行为是`异步`的。

### 模块脚本

`<script type="module"></script>`,总是被延迟的，类似于`defer`

## video

可以使用object-fit来使视频撑满容器

使用ios webview的时候在固定位置播放视频，需要修改webview的allowsInlineMediaPlayback属性，默认ios全屏播放视频

### 缓冲

边下边播。

### 分段加载

也就是把原视频分成多个段，它的特点：

1. 相比于缓冲拥有更快的初始播放速度，不需要加载整个mp4头部信息。
2. 会发起多次请求，分批次加载。不使用分段加载时会一次性加载全部视频，根据浏览器不同具体实现也不同，Safari是这样，但是chrome不是全部加载。
3. 视频回放时，只会触发初次加载，之后已经加载过的视频不会再次请求。

实现分段加载一般是由服务器端来进行,纯前端实现使用`xgplay.js`

### 流媒体

分段加载属于流媒体的技术实现，常见的流媒体有：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/15/1734ff41d79f0b50~tplv-t2oaga2asx-watermark.awebp)



## viewport（视口）

在移动端使用 viewport 固定屏幕渲染，可以加速页面渲染内容，同时可以设置禁用页面缩放

## Web Component

比较各个框架产出组件的性能和大小：https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/

这个网站罗列出业界前端框架对 Web Components 的兼容问题及相关 issues：https://custom-elements-everywhere.com/

### shadow dom

shadow dom 是 html 的一种规范，允许封装自己的 html 标签，实现 shadow dom 的技术就是 web Component.shadow root 为根节点，shadow tree 为包含的子节点树结构，shadow host 为容器元素。 ​​​​  
shadow dom 注意事项:1.shadow host 名称不能与原生标签名相同。2.注意样式模块的隔离。3.为了兼容可以通过打包来实现。 ​​​​  
css js 无法影响 shadow dom 里面的内容，例如 video 标签的 shadow dom. ​​​​

### 库

1. 目前来看有问题，react在使用web component时有一些bug，可以参考https://jelly.jd.com/article/5fed3d8a468efc014a4e5775和https://custom-elements-everywhere.com/
2. vue组件转web componenthttps://github.com/vuejs/vue-web-component-wrapper
3. web component转react：@lit-labs/react
4. omiu是一个选项

## 最佳实践

### img

1. 当 img src 获取不到图片时，我们可以设置一个默认图片来避免出现丑陋的样式 onerror="this.src='./defaultImg'"
1. html 中对图片进行缩放会导致页面重绘，应尽量减少。 ​​​​
1. picture 标签元素可以用来解决响应式图片的性能问题。但是大部分浏览器还不支持 picture 元素，可以使用 picturefill 来解决。也可以用模板来判断输出 img。还可以用图片服务器来判断输出图片。
1. 通过使用`video`替换`gif`，gif图片体积大,参考：https://juejin.cn/post/6844903893143388168

### 语义化标签

1. 语意化标签可以被搜索引擎解析，因此比都是 div 的页面更容易被检索到。 ​​​​

### 移动端点击延迟

在移动端，touchstart 事件比 click 快 300 毫秒，推荐使用 touchstart ​​​​，或者使用 npm 包抹平差异

### table

table 标签里的内容渲染是等表格内容全部解析完一次性渲染到页面上，如果表格内内容较多，会产生性能问题，可以通过无序列表来模拟表格。

### 移动端 meta 设置

强制让文档的宽度与设备的宽度保持 1:1，并且文档最大的宽度比例是 1.0，且不允许用户点击屏幕放大浏览。 ​​​​

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"
/>
```

但是某些移动端浏览器会强制缩放，这时只能通过 js 进行限制：

```js
document.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);
```

## 问题

### 页面乱码？

有几种情况：

1. html没有设置`charset utf-8`
2. 页面使用字体不包含乱码语言
3. nginx没有设置`charset utf-8`

### html如何转换成图片？

https://zhuanlan.zhihu.com/p/128935733

### 如何拦截所有图片的请求地址并替换？

一、serviceworker前端全局拦截
利用serviceworker可以拦截全局请求的功能，在前端实现全局拦截并替换。

核心逻辑如下：

```js
self.addEventListener("fetch", function(event) {
    if (
        // 拦截失效的cdn
        (_isImgph.test(event.request.url) ||
            _isImgSize.test(event.request.url)) &&
        event.request.method === "GET"
    ) {
        // 进行相应替换
        var url = scaleImage(event.request.url);
        // 新建request
        var req = new Request(url);
        event.respondWith(
            fetch(req).then(function(response) {
                return response;
            })
        );
    }
});

```

这种方法的缺点是：

1、兼容性问题，由于是相对较新的特性，ie全线和老版本移动wap不支持。

2、不能跨域，所以多域名产品需要每个域去注册。

> 原文链接：https://blog.csdn.net/mevicky/article/details/102547346



二、 通过重新定义Image对象的src属性来处理（推荐）

```js
/**
   *全局拦截Image的图片请求添加token
   *
   */
  function hookImg() {
    const property = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
    const nativeSet = property.set;

    function customiseSrcSet(url) {
      // do something
      nativeSet.call(this, url);
    }
    Object.defineProperty(Image.prototype, 'src', {
      set: customiseSrcSet,
    });
  }
```

> 参考：https://www.cnblogs.com/amiezhang/p/9984690.html

### 如何知道元素可以放置什么格式的子元素？

查看该网页：https://www.w3.org/TR/html4/sgml/dtd.html#inline

参考：https://stackoverflow.com/a/8696078/13082513

## 趣闻

2019 年 6 月 7 日  
[WHATWG 击败 W3C，赢得 HTML 和 DOM 的控制权](https://www.infoq.cn/article/bsvFxt96DOh-SBZphBwJ?utm_source=tuicool&utm_medium=referral)