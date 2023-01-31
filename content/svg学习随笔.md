---
title: svg学习随笔
category: 分享
tags:
  - svg
date: 2019-02-22
vssue-title: svg学习随笔
---
## svg简介-使用方式

* 浏览器直接打开
* 在HTML中使用img标签引用
* 直接在HTML中使用SVG标签
* 作为CSS背景
## 基本图形和属性
* 基本图形  
    rect(矩形)、circle(圆形)、elipse(椭圆)、line(直线)、polyline(折线)、polygon(多边形)
* 基本属性  
    fill、stroke、stroke-width、transform
### rect属性  
x、y、width、height、rx、ry
### circle属性  
cx、cy、r
### elipse属性
cx、cy、rx、ry
### line属性
x1、x2、y1、y2
### 填充、描边和变换
fill、stroke、stroke-width、transform

## 基本操作API
* 创建图形  
    document.createElementNS(ns,tagName)
* 添加图形 
    element.appendChild(childElement)  
* 设置/获取属性
    element.setAttribute(name,value)
    element.getAttribute(name) 

## SVG的世界、视野、视窗的概念
* width,height-控制视窗  
* svg代码-定义世界
* viewBox，preserveAspectRatio-控制视野  
## SVG中的图形分组
* <g>标签来创建分组
* 属性继承
* transform属性定义坐标变换
* 可以嵌套使用 
## 坐标系统概述
* 笛卡尔直角坐标系
* 原点
* 互相垂直的两条数轴
* 角度定义
## 四个坐标系
* 用户坐标系  
    * 世界的坐标系
* 自身坐标系
    * 每个图形元素或分组独立与生俱来
* 前驱坐标系
    * 父容器的坐标系  
* 参考坐标系
    * 使用其他坐标系来考究自身的情况时使用  
## 坐标变换
### 坐标变换定义
* svg中，[坐标变换]是对一个坐标系到另一个坐标系的变换的描述

## 认识RGB和HSL
## 渐变
* 让图形更丰满
* 线性渐变和径向渐变
### 线性渐变  
* <linearGradient>和<stop>
* 定义方向
* 关键点位置及颜色
* gradientUnits
### 径向渐变
* <radialGradient>和<stop>
* 定义方向
* 关键点位置及颜色gradientUnits
* 焦点位置
## 笔刷  
* 绘制纹理
* <pattern>标签  
* patternUnits和patternContentUnits
## Path概述
* 强大的绘图工具
* 规范 https://www.w3.org/TR/SVG11/paths.html
### Path概述-Path字符串  
```
<path d="M0,0L10,20C30-10,40,20,100,100" strole="red">
```
### Path概述-命令基本规律
* 区分大小写：大写表示坐标参数为绝对位置，小写则为相对位置
* 最后的参数表示最终要到达的位置
* 上一个命令结束的位置就是下一个命令开始的位置
* 命令可以重复参数表示重复执行同一条命令
## 移动和直线命令
* M(x,y)+ 移动画笔，后面如果有重复参数，会当做是L命令处理
* L(x,y)+ 绘制直线到指定位置
* H(x)+ 绘制水平线到指定的x位置
* V(y)+ 绘制竖直线到指定的y位置
* m、l、h、v使用相对位置绘制
## 压缩

1. 使用npm包`svgo`本地压缩
2. 线上工具：https://jakearchibald.github.io/svgomg/

## 问题
### 存在多个svg时显示有问题？

多个svg有可能会互相影响，具体请看[svg之间还能互相影响](https://juejin.cn/post/6844903876210999303#heading-2)

### svg如何转换成base64图片？

```js
  const svg = this.$refs.shareInvite.$el
  const s = new XMLSerializer().serializeToString(svg)
	const src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(s)))}` // unescape(encodeURIComponent(s))防止无法转换中文的问题，https://stackoverflow.com/a/26603875/13082513
  const img = new Image() // 创建图片容器承载过渡
  // 注意：需要在图片onload方法中执行
  img.onload = () => {
    // ↓ 第二部分
    setTimeout(() => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.mozImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.imageSmoothingEnabled = false // 防止缩放
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL('image/png')
      this.shareBase64 = base64
    }, 100) // 添加延迟修复ios图片丢失的问题
  }
  img.onerror = (e) => {
    console.log(e)
  }
  img.src = src
```

> 参考：https://stackoverflow.com/a/47151045/13082513

### svg转图片时丢失字体？

可以通过在svg中包含字体的base64文件来解决：

```html
<svg
    width="750"
    height="1334"
    viewBox="0 0 375 667"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <style type="text/css">
        @font-face{font-family:&apos;DINPro&apos;;src:url(&quot;data:font/woff2;charset=utf-8;base64,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&quot;) format(&apos;woff2&apos;);font-weight:400;font-style:normal}
      </style>
    </defs>
</svg>
```



### svg作为background引入时如何修改颜色？

当使用data url引入时做为静态文件无法进行修改，除非把svg嵌入到URL中,并修改fill
```css
.field__search::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 8px;
  width: 22px;
  height: 22px;
  background-image: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='16.687' height='16.688' viewBox='0 0 16.687 16.688'><path class='cls-1' d='M931.155,40.747H930.4l-0.264-.261a6.212,6.212,0,1,0-.675.675l0.263,0.262v0.755l4.773,4.76,1.423-1.422Zm-5.731,0a4.291,4.291,0,1,1,4.3-4.291A4.294,4.294,0,0,1,925.424,40.747Z' transform='translate(-919.219 -30.25)' fill='#fff' /></svg>");
  background-repeat: no-repeat;
  background-position: 0 0;
  opacity: 1;
}
```
或者另一个解决办法就是修改html结构，直接使用svg

### 如何动态修改svg颜色？

1. 单色svg：当把svg中的`fill`或者`stroke`都改成`currentColor`，那么svg使用当前文字颜色
2. 多色svg：可以在svg上使用class，提前为svg中的多个有fill的元素添加类名，这样可以在外部通过一个

## 优点

1. 放大不会失真，就算同等大小的svg和png，svg也更清楚
2. 体积相比png会更小，但是这个不是一定的。如果是复杂的图片svg可能更大。
3. 可以动态编辑
