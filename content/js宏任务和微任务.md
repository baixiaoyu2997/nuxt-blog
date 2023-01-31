---
title: js宏任务和微任务
category: 分享
tags:
- js
date: 2019-06-19
vssue-title: js宏任务和微任务
---
首先看一段代码：  
```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```
打印顺序是什么？
正确答案是
script start, script end, promise1, promise2, setTimeout
