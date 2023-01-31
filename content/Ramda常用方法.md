---
title: Ramda常用方法
category: 工具
tags:
- Ramda
date: 2020-04-30
vssue-title: Ramda常用方法
---

## Object
### prop
取出对象中指定属性的值。如果不存在，则返回 undefined。
```js
// Idx → {s: a} → a | Undefined
// Idx = String | Int
R.prop('x', {x: 100}); //=> 100
R.prop('x', {}); //=> undefined
R.prop(0, [100]); //=> 100
```
### path
可以用来实现可选链
```js
// [Idx] → {a} → a | Undefined
// Idx = String | Int
R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
R.path(['c', 'b',0], {c: {b:[1,2,3,4,5]}})===5 //=> 1
R.path(['c', 'b','length'], {c: {b:[1,2,3,4,5]}})===5 //=> true
```
## Function
### tap
对输入的值执行给定的函数，然后返回输入的值。
```js
const sayX = x => console.log('x is ' + x); // logs 'x is 100'
R.tap(sayX, 100); //=> 100
```
## Relation
### sortBy
根据给定的函数对列表进行排序。