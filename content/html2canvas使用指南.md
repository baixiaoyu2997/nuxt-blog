---
title: html2canvas使用指南
category: 工具
tags:
- npm
date: 2021-06-18
vssue-title: html2canvas使用指南

---

## 介绍

html2canvas是目前最好用的dom截图工具库

## 问题

### 速度太慢解决方案？

1. 因为html2canvas需要clone整个dom树，所以当有长时间加载的资源时，会导致clone变慢，解决方法是可以为不需要复制的元素上添加`data-html2canvas-ignore`
2. 减小`scale`
3. 减小canvas体积

