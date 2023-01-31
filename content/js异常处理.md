---
title: js异常指南
category: js
tags:
- 异常处理
date: 2020-09-18
vssue-title: js异常指南
---

## 什么是异常？
多数开发人员认为错误和异常是同一回事。实际上，一个错误对象只有在被抛出时才成为异常。
## 当我们抛出异常时会发生什么？
异常就像在上升的电梯：一旦抛出一个，它就会在程序栈中冒泡，除非它在某个地方被捕获。  
如果不尽兴捕获则程序会崩溃
## 同步错误处理
同步异常可以使用`try/catch/finally`:
```js
try {
  toUppercase(4);
} catch (error) {
  console.error(error.message);
  // or log remotely
} finally {
  // clean up
}
```
## 生成器函数的错误处理
生成器函数的返回值 是 迭代器（iterator）对象。为了 从生成器中提取值，我们可以使用两种方法：
- 在迭代器对象上调用 next()。
- for...of 的 迭代。

除了 next() 之外，从生成器返回的迭代器对象还具有 throw() 方法。
使用这种方法，我们可以将异常注入生成器来暂停程序：
```js
function* generate() {
  yield 33;
  yield 99;
}
const go = generate();
const firstStep = go.next().value; // 33
go.throw(Error("Tired of iterating!"));
const secondStep = go.next().value; // never reached

```
要捕获此类错误，你可以使用 try/catch 将代码包装在生成器：
```
function* generate() {
  try {
    yield 33;
    yield 99;
  } catch (error) {
    console.error(error.message);
  }
}
```
## 异步错误处理
异步错误处理使用`Promise、then、catch`来进行处理：
```js
function toUppercase(string) {
  if (typeof string !== "string") {
    return Promise.reject(TypeError("Wrong type given, expected a string"));
  }
  const result = string.toUpperCase();
  return Promise.resolve(result);
}
```
`Promose.reject`的最佳实践是传入一个Error对象，这样，你可以在代码库中保持错误处理的一致性。其他团队成员总是能访问 error.message，更重要的是你可以检查堆栈跟踪。  
除了 Promise.reject，我们还可以通过 抛出 异常来退出 Promise 链：
```js
Promise.resolve("A string").then(value => {
  if (typeof value === "string") {
    throw TypeError("Expected a number!");
  }
});
```
`reject`和`throw`都使用`.catch()`来进行处理
### Promise.all 错误处理
与普通的异步处理一样，在后边加`catch`:
```js
const promise1 = Promise.resolve("All good!");
const promise2 = Promise.reject(Error("No good, sorry!"));
const promise3 = Promise.reject(Error("Bad day ..."));
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results))
  .catch(error => console.error(error.message));
```
### Promise.any 中的错误处理
如果 所有 传递给 Promise.any 的 Promise 都拒绝，则产生的错误是 AggregateError。考虑以下示例：
```
const promise1 = Promise.reject(Error("No good, sorry!"));
const promise2 = Promise.reject(Error("Bad day ..."));
Promise.any([promise1, promise2])
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Always runs!"));
```
AggregateError 对象具有与基础的 Error 相同的属性，外加一个 errors 属性：
```js
AggregateError: No Promise in Promise.any was resolved
Always runs!
```
此属性是由拒绝产生的各个错误组成的数组：

```
 .catch(error => console.error(error.errors))

```
### Promise.race 中的错误处理
<!-- Promise.any如果第一个返回的结果是`reject`，那么需要用catch处理，如果第一个不是`reject`，之后的有 -->

## 参考
1. [JavaScript错误处理完全指南](https://mp.weixin.qq.com/s/I9ZrCsoNo7jrOHj8a9UW1A)