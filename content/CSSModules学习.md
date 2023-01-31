---
title: CSSModules学习
category: 工具
tags:
- CSS Modules
date: 2020-04-10
vssue-title: CSSModules学习
---
## 简介
### 什么是CSS Modules？
CSS 模块就是所有的类名都只有局部作用域的 CSS 文件。  

定义一个普通的css文件
```css
/* style.css */
.className {
  color: green;
}
```
引入css模块
```js
import styles from "./style.css";

element.innerHTML = '<div class="' + styles.className + '">';
```
一张图理解CSS Modules原理：
![CSSModules学习_2020-04-10-16-40-15](https://blog-pic.oss-cn-beijing.aliyuncs.com/CSSModules学习_2020-04-10-16-40-15.png)
### 为什么使用CSS Modules？
1. 解决全局命名冲突问题 css modules只关心组件本身，命名唯一
2. 解决选择器嵌套层次过深的问题
3. 模块化，JS和CSS可以共享变量
### 如何使用CSS Modules？
修改webpack4配置文件`webpack.config.js`如下，css modules更多配置项参考[css-loader](https://https://github.com/webpack-contrib/css-loader#modules)
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          modules: true, // 启用css modules
        },
      },
    ],
  },
};
```
## 命名
建议使用`camelCase`命名规则，但不强制，尝试以点表示法访问style.class-name时，kebab-casing可能会导致意外行为。
### 本地作用域
默认就是本地作用域：
```css
.normal {
 color: green;
 }
```
或者指定本地作用域
```css
:local(.normal) {
  color: green; 
}
```
css引用：
```html
<App className={style.normal} />        // green
```
### 全局作用域
css文件定义
```css
:global(.box){
  color:blue;
}
```
css引用：
```html
<App className="box" />        // blue
```
## class组合（composes）
### 同一个css文件
```css
/* 同一个css文件中通过composes复用类*/
.bg {
    background-color:blue;
}
.title {
    composes:bg;
    color:white;
}
```
### 多个css文件
```css
/* 不同css文件中复用类*/ 
/* color.css */
.red {
    color: red;
}

.blue {
    color: blue;
}

/* index.css */
.red {
    color: red;
}

.header {
    font-size: 32px;
}

.title {
    color: green;
    composes: blue from './color.css'; // 从color.css文件中引用.blue类
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
}    
```
### 组合全局class
```css
.otherClassName {
  composes: globalClassName from global;
}
```
### 预处理器中使用
```css
:global {
  .global-class-name {
    color: green;
  }
}
```
## 输入变量
### JS中引入CSS变量
```css
/* index.scss */
$primary-color: #f40;

:export {
    primaryColor: $primary-color;
}

/* app.js */
import style from 'index.scss';

// 会输出 #F40
console.log(style.primaryColor);
```
## 问题 
### 如何修改ui库局部样式？
在组件足外层套一个class类名，然后在内部编写global样式：
```css
.commentList{
  :global{
    .ant-drawer-title span{
      width: 100%;
    }
  }
}
```
## 参考
1. [css-modules](https://github.com/css-modules/css-modules)
1. [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
1. [CSS Modules](https://segmentfault.com/a/1190000019538288)