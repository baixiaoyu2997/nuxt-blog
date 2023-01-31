---
title: 《Node.js实战》随笔
category: 书单
tags:
  - node
date: 2020-11-06
vssue-title: 《Node.js实战》随笔
---

## 第 2 章 Node 编程基础

### 2.5 注意事项

Node 能把模块作为对象缓存起来。如果程序中的两个文件音容了相同的模块，第一个 require 会把模块返回的数据存到内存中，这样第二个 require 就不用再去访问和计算模块的源文件了。也就是说在同一个进程当中用 require 加载一个模块得到的是相同的对象。

### 2.7 用回调处理一次性事件

Node 中的大多数内置模块在使用回调时都会带两个参数:第一个用来放可能会发生的错误，第二个用来放结果。错误参数经常缩写为 err。

### 2.8

#### 2.8.2 响应只应该发生一次的事件

```js
const net = require("net");
const server = net.createServer((socket) => {
  socket.once("data", (data) => {
    socket.write(data);
  });
});
server.listen(8888);
```
#### 2.8.3 创建事件发射器
```js
const EventEmitter=require('events').EventEmitter
const test=new EventEmitter()
test.on('join',()=>{
  console.log('你好')
})
test.emit('join')
```