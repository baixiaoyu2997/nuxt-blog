---
title: go-micro学习指南
category: 分享
tags:
- go-micro
date: 2020-11-10
vssue-title: go-micro学习指南
---

## 微服务

### RPC

远程过程调用（Remote Procedure Call，RPC）是一个计算机通信协议。

该协议允许运行一台计算机的程序调用另一台计算机的子程序

golang的rpc必须符合4个基本条件：

```
结构体字段首字母要大写，可以别人调用

函数名必须首字母大写

函数第一参数是接收参数，第二个参数是返回给客户端的参数，必须是指针类型

函数还必须有一个返回值error

```

微服务架构下数据交互一般是对内 RPC，对外 REST

## go-micro

### 安装

`go get github.com/micro/micro/v2	`

