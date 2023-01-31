---
title: cordova学习
category:  工具
tags:
- cordova
date: 2019-09-12
vssue-title: cordova学习
---

## 安装
`npm i cordova`
## 创建项目
`cordova create hello com.example.hello HelloWorld`,create后边第一个参数是文件夹名，第二个是项目包名，第三个是打包后的app名
## 为cordova添加平台
`cordova platform add [platform]` 可选值为：android ios windows browser electron
## 检测必要环境
`cordova requirements`
## 问题
### cordova prepare很慢？
因为prepare是将当前www下的文件都复制到platform中的www下，所以当有node_modules时，复制是一个很慢的过程，只要把包都放在上层目录就解决了。 ​​​​