---
title: Nuxt3源码解析
category: 源码
tags:
  - nuxt3
date: 2022-03-19
vssue-title: Nuxt3源码解析
---

## pakcages

### nuxi

主文件cli.ts, index.ts文件为内部使用

#### cli

功能点：

1. 检查node版本
2. 全局handle错误
3. init:初始化项目，使用tiged从github下载模板
3. dev：启动开发模式

#### edge

通过`github workflow`执行脚本`release-edge`发布

## 流程图

### 创建项目

`nuxi init nuxt3-app`

### dev

1. nuxi启动命令行
1. 创建服务
1. 监听项目根目录变化
1. 加载`nuxt3、nuxt-edge、nuxt`之一：
   1. 加载config
   1. 创建nuxt对象，并返回

1. 创建nuxt对象，初始化hooks，返回nuxt对象
1. 等待ready(),也就是nuxt初始化：
   1. hooks添加config中的hooks
   1. 初始化nitro


## 外部依赖

### @nuxt/kid

nuxt创建module的工具库

### mri

解析命令行参数， minimist 和 yargs-parser 的快速轻量级替代方案。

### pathe

处理node路径相关，相关包还有`upath`

### [tiged](https://github.com/tiged/tiged)

脚手架工具

### chokidar

跨平台文件监视库

### jiti

ts和esm的运行时支持

### mlly

node中的esm增强工具库，可以模拟cjs模块导入

### unctx

管理上下文状态

## 问题

### 为什么使用了很多动态导入？

