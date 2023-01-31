---
title: Solidity学习之旅
category: 分享
tags:
- solidity
date: 2022-02-27
vssue-title: Solidity学习之旅
---
## 介绍

Solidity是一门面向合约的，为实现只能合约儿创建的高级编程语言，设计的目的是能在以太坊虚拟机上运行

Solidity是静态类型语言，支持继承，库和复杂的用户定义类型等特性。

## 开发

1. Remix，在线的web浏览器ide，包括开发部署等功能。
2. solcjs：命令行编辑器

## 函数

函数的默认可见性是`public`

### pure

表示纯计算函数，不涉及变量的读取操作

### view

表示只读变量，不修改变量

### returns

定义返回值得类型和变量名,可以返回多个值,逗号分割

### public

公共函数，外部可以访问

### constructor

构造函数，负责为初始值赋值.该方法为部署时触发

## 变量

变量的默认可见性是`internal`

### public

public声明的变量，部署后可以生成一个同名方法获取。

### indexed

修饰事件将参数作为topic存储，使用indexed的参数才能被过滤，最多三个参数可以接收indexed属性
