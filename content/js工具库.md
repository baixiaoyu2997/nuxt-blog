---
title: js工具库
category: 工具
tags:
- js
date: 2019-05-31
vssue-title: js工具库
---
### 代码段大全
> [30 seconds of code](https://30secondsofcode.org/)
## Array
### 分支(bifurcate)
通过提供的数组和对应数组的过滤器，将值分为两组，如果过滤器中值为`true`,则将值分在第一个数组，反之亦然
```js
const bifurcate = (arr, filter) =>
  arr.reduce((acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc), [[], []]);
```
<details>
<summary>例子</summary>

```js
bifurcate(['beep', 'boop', 'foo', 'bar'], [true, true, false, true]); // [ ['beep', 'boop', 'bar'], ['foo'] ]
```
</details>

### 分支变种(bifurcateBy)
与分支相同，第二个参数变成函数
```js
const bifurcateBy = (arr, fn) =>
  arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [[], []]);
```
<details>
<summary>例子</summary>

```js
bifurcateBy(['beep', 'boop', 'foo', 'bar'], x => x[0] === 'b'); // [ ['beep', 'boop', 'bar'], ['foo'] ]
```
</details>

### 拆分(chunk)
将数组共同指定的数字进行拆分成多个数组内数组
```js
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
```
<details>
<summary>例子</summary>

```js
chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
```
</details>

### 压缩(compact)
从数组中移除假值
```js
const compact = arr => arr.filter(Boolean);
```
<details>
<summary>例子</summary>

```js
compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34]); // [ 1, 2, 3, 'a', 's', 34 ]
```
</details>

### 计数(countBy)
根据给定函数对数组的元素进行分组，并返回每个组中的元素数量。
```js
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
```
<details>
<summary>例子</summary>

```js
countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
```
</details>

### 出现次数(countOccurrences)
计算数组中值的出现次数。
```js
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
```
<details>
<summary>例子</summary>

```js
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
```
</details>

### 深压扁(deepFlatten)
深度压扁一个数组。
```js
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
```
<details>
<summary>例子</summary>

```js
deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
```
</details>

### 差值(difference)
返回两个数组之间的差值。
```js
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
```
<details>
<summary>例子</summary>

```js
difference([1, 2, 3], [1, 2, 4]); // [3]
```
</details>

### 差值by(differenceBy)
将提供的函数应用于两个数组的每个数组元素后，返回两个数组之间的差值。
```js
const differenceBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.map(fn).filter(el => !s.has(el));
};
```
<details>
<summary>例子</summary>

```js
differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x); // [2]
```
</details>

## String
### 获取字节长度(byteSize)
返回字符串的长度
```js
const byteSize = str => new Blob([str]).size;
```
<details>
<summary>例子</summary>

```js
initializeNDArray(1, 3); // [1,1,1]
initializeNDArray(5, 2, 2, 2); // [[[5,5],[5,5]],[[5,5],[5,5]]]
```
</details>
