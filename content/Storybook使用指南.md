---
title: Storybook使用指南
category: 分享
tags:
- storybook
date: 2020-09-24
vssue-title: Storybook使用指南
---

## 介绍
Storybook是一个开源工具，用于为React，Vue，Angular等做隔离开发UI组件。它使构建UI变得井井有条，高效。可以实时预览组件的各种状态。还可以显示不同分辨率下的效果。

## 概念

### 故事（story）

每一个story代表一个组件形态

## 安装
使用命令行安装
```
npx sb init
```
该命令不应该执行在一个空项目里，而是应该执行在一个已有的项目上，因为在安装过程中，Storybook将调查项目的依赖项，并为您提供最佳的配置。
> sb v6.2支持vue3和vite

执行完后，检测是否成功：
```
npm run storybook
```

## 特点

1. 支持响应式测试
2. 支持可视化样式调试
