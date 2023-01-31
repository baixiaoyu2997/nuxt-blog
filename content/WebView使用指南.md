---
title: WebView使用指南
category: 工具
tags:
- WebView
date: 2021-02-27
vssue-title: WebView使用指南
---

## js于原生端通信的几种方式

https://mp.weixin.qq.com/s/PipKSnMQaTBhE5kSwG3DVQ

## 工具库

1. [DSBridge](https://github.com/wendux/DSBridge-Android/blob/master/readme-chs.md#%E4%BD%BF%E7%94%A8)

## 兼容性

1. caniuse
2. 这里介绍了在原生端webview具体的兼容性差异 https://ask.dcloud.net.cn/article/1318
3. android webview由于在v5之后变成了自动更新，所以可以使用最新特性。但是，国内手机厂商对webview进行了魔改，导致不一定会自动更新，那么最差的情况，用户的webview版本为37。

## 调试

https://mp.weixin.qq.com/s/4zR8sy3qASYsqjvdKQaLiQ

## 问题

### 为什么无法全屏播放video？

需要原生端配合，https://cloud.tencent.com/developer/article/1741520
