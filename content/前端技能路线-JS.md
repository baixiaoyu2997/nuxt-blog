---
title: 前端技能路线-JS
category: 前端技能路线
tags:
  - js
date: 2019-03-18
vssue-title: 前端技能路线-JS
---

## 规范

1. [ecma262](https://github.com/tc39/ecma262)
   
   > ECMA-262 的状态、进程和文档

## 内置对象

### Array

1. Array.prototype.forEach() forEach 遍历的对象如果是基础数据类型，那么不会修改原数组，但是如果为引用数据类型，可以修改原数组

```js
var arr1 = [1, 2, 3, 4];

var arr2 = [{ a: 1 }, { a: 2 }, { a: 3 }];

arr1.forEach((item) => {
  item = item * item;
});

arr2.forEach((item) => {
  item.a = item.a * item.a;
});

console.log(arr1); // [1,2,3,4]

console.log(arr2); // [{a:1},{a:4},{a:9}]
```
### String
#### String.prototype.trim()
trim可以去除字符串中的回车符
### Object

`object`只接收两种类型的key值：`string`和`Symbol。从 ES6 开始，*String*和*Symbol*键是按顺序保存起来的，但是通过隐式转换保存成*String*的键就是乱序的

```js
const object = { };
object['key1'] = 'value1';
object['key0'] = 'value0';
object; // {key1: "value1", key0: "value0"}
object[20] = 'value20';
object; // {20: "value20", key1: "value1", key0: "value0"}

Object.keys(object).length; //3
```

- Object.keys()
  - 操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用 for...in 循环，而用 Object.keys()代替 ​​​​
### Map

`Map`类似于加强版的Object，不要将**「Map」**作为普通**「Object」**的替代品，而应该是普通对象的补充。相较于Object有以下几个区别：

1. 支持迭代，顺序与属性顺序一致
2. key值不受类型限制，可以输入任何类型
3. 可以通过size获取长度
4. 不会因为自定义键名导致与原型继承属性冲突
5. **「Map」**是一个纯哈希结构，而**「Object」**不是（它拥有自己的内部逻辑）。*Map* 在*频繁增删键值对*的场景下表现更好，性能更高。因此当你需要频繁操作数据的时候也可以优先考虑 *Map*
6. 不能通过JSON进行转化
7. 因为key值支持所有类型，那么可以通过将值设为正则去进行更简洁的逻辑判断。
7. 支持`clear`方法，删除对象中所有元素

### WeakMap

WeakMap的键必须是`Object`类型，因为key值是弱引用的，有可能被垃圾回收掉，所以WeakMap的key是不可枚举的，同样也没有size属性，也不支持clear方法

应用场景：

1. 以DOM节点作为键值，如果dom节点丢失，那么引用丢失。

2. 数据缓存

   ```js
   const cache = new WeakMap();
   function countOwnKeys(obj) {
     	// 只要对象没变那么就会命中缓存
       if (cache.has(obj)) {
           console.log('Cached');
           return cache.get(obj);
       } else {
           console.log('Computed');
           const count = Object.keys(obj).length;
           cache.set(obj, count);
           return count;
       }
   }
   ```

2. WeakMap 可用来部署类中的私有属性

### Set

相当于没有重复值的数组，可以用来去重

### WeakSet

类似于WeakMap，数组成员只能是对象

### Intl
Intl 对象是 ECMAScript 国际化 API 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化。
#### Intl.NumberFormat
Intl.NumberFormat是对语言敏感的格式化数字类的构造器类
```js
var number = 3500;

console.log(new Intl.NumberFormat().format(number));
// 如果在美国英语地区 → '3,500'
```
### Promise

new Promise 会立即执行，then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行

### Proxy

**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

#### 语法

```js
const a = {}
const b = new Proxy(a,{}) // 第二个参数为handler对象，包含多个对象捕捉器。必填
```

#### proxy的应用场景

1. 防止对象内部属性（私有属性）被外部改写，达到类型安全
2. 使用`has`方法隐藏某些属性，不被`in`运算符发现
3. 抽离校验模块，类型检查
4. 访问日志
5. 预警和拦截

### Reflect

作为proxy api的补充，可以解决一些原型方面的边际情况。js内置对象，提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。与大多数全局对象不同，`Reflect`不是一个构造函数。你不能将其与一个new运算符一起使用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像Math对象）。

### Error

创建错误对象：`const err=Error('这里是错误')`  
创建后，错误对象将包含三个属性：

- message：包含错误消息的字符串
- name:错误的类型
- stack⚠️ ：函数执行的堆栈追踪

除了 Error 对象还有：

- EvalError
- InternalError⚠️
- RangeError
- ReferenceError
- SyntaxError
- TypeError
- URIError

除了这些内置错误外，在浏览器中我们还可以找到：

- DOMException： DOMException 接口代表调用方法或访问 Web API 属性时发生的异常事件
- DOMError⚠️ ,已弃用，如今不再使用。

只有错误对象被抛出的时候才成为异常
### decodeURI()
解码encodeURI
### encodeURI()
转换为UTF-8编码
### Date

名词解释：

- UTC：格林威治标准时间，例如：也叫做 GMT 时间。由 UTC 时间还可以引申出本地时间，所谓本地时间流逝格林威治标准时间加上时区差，东为正，西为负。如，北京时间为 UTC+0800。获取 UTC 的方法:

```js
x = new Date();
var UTCseconds = (x.getTime() + x.getTimezoneOffset() * 60 * 1000) / 1000;

console.log("UTCseconds", UTCseconds);
```

- Unix 时间戳：Unix 时间戳是从 1970 年 1 月 1 日到`给定时间`所经过的秒数，所以跟本地时间还是 UTC 时间没有关系。在 js 中等于`var seconds = Math.floor(Date.now() / 1000);`

## 语句和声明

### for...of

**`for...of`语句**在[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)（包括 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)，[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)，[`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 对象等等）上创建一个迭代循环

### try...catch

try catch 中任何给定的异常只会被离它最近的封闭 catch 块捕获一次。如果从 finally 块中返回一个值，无论是否有 return 语句在 try 和 catch 中，这个值将会成为整个 try-catch-finally 的返回值。多个 try catch 嵌套时，先执行最里边的 try catch,当嵌套 try catch throw 一个新 error 时，会先运行它自己的 finally 块再执行外部的 catch 块  
不能用做捕获异步错误，因为 try...catch 是同步执行的。

### export

export 与 import 必须处于模块顶层，import 具有提升效果，导入多个相同模块时，其实相当于只导入一个，用\*可以导出所有模块的输出值，加载出来的模块不可修改  

## import

### 动态import

动态import返回`promise`,不需要依赖`type="module"`  ，使用场景：

- 当静态导入的模块很明显的降低了代码的加载速度且被使用的可能性很低，或者并不需要马上使用它。
- 当静态导入的模块很明显的占用了大量系统内存且被使用的可能性很低。
- 当被导入的模块，在加载时并不存在，需要异步获取
- 当导入模块的说明符，需要动态构建。（静态导入只能使用静态说明符）
- 当被导入的模块有副作用（这里说的副作用，可以理解为模块中会直接运行的代码），这些副作用只有在触发了某些条件才被需要时。（原则上来说，模块不能有副作用，但是很多时候，你无法控制你所依赖的模块的内容）  

请不要滥用动态导入（只有在必要情况下采用）。静态框架能更好的初始化依赖，而且更有利于静态分析工具和[tree shaking](https://wiki.developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)发挥作用

### class

class 不会变量提升

### var

- 通过 var 创建的全局变量（再任何函数体之外创建的变量）不能被删除。
- 没有用 var 创建的隐式全局变量（不考虑函数内的情况）可以被删除。
  
  > 在浏览器环境中，所有 js 代码都是在`window`作用域内的，所以在这种情况下，我们所说的全局变量其实都是`window`下的一个属性， 所以可以用`delete`删除，但在如 `nodejs`或`gjs`等非浏览器环境下，显示生命的全局变量无法用`delete`删除

### 变量

## async 和 await

任何函数之前加上async关键字，意味着该函数会返回promise，即使没有显示地这么样做，它也会在内部使它返回promise

不要在forEach中使用async，因为本身forEach源码中并没有await等待callback执行完毕，使用`for...of`替换

### error处理

当await后的函数内部reject时，该上下文会结束执行

```js
(async ()=> {
const test2=async()=>{
	return Promise.reject()
}
const test1=async()=>{
	console.log(1) // 只会输出1，不会输出3
	await test2()
	console.log(3)
}
const test3=async()=>{
	await test1() // 如果不使用await，会输出4
	console.log(4)
}

try {
  await test3()
  console.log(5) // 在try中console不会执行
} catch (err){}

console.log(6) // 会执行
   
})()

```

优雅的错误处理方式：

1. 不catch异步函数，那么自然下边的方法不会执行，结束当前上下文。
2. 捕获`catch`，那么就在`catch`中`return Promise.reject(err)`,一定要有`return`，结束当前上下文。

## 表达式和运算符

### in

检测属性是否包含在对象中。也可以用于symbol或者数组。非symbol类型，prop会被转换成字符串。

### Spread syntax

- 展开语法（...）内部使用 for...of 循环
- 可以通过扩展运算符将具有 Iterator 接口的 arrlike 转换成 array,Array.from()可以将带有 length 属性的对象转换成 array，相较与前者少了 Iterator 的限制。 ​​​​

### 按位操作符

1. 非位运算符~，简单的理解，对任一数值 x 进行按位非操作的结果为 -(x + 1)，那么, ~~x 就为 -(-(x+1) + 1)。判断数值中是否有某元素时，以前这样判断：

```js
if(arr.indexOf(ele) > -1){...} //易读
```

现在可以这样判断：

```js
if(~arr.indexOf(ele)){...} //简洁
```

对于浮点数，~~value 可以代替 parseInt(value)，而且前者效率更高些

```js
parseInt(-2.99); //-2
~~-2.99; //-2
```

### 可选链操作符

语法：`?.`  
**注意**

1. 可选链不能用于赋值
1. 可选链用作函数判断时，使用类似`someInterface.customMethod?.()`执行，如果`customMethod`存在，但是不为函数，还是会产生异常。

### 逻辑或赋值运算符

语法：`||=`

当左侧的值为`Falsy`时，才进行赋值（a.duration ||= 10;），等价于:`x || (x = y);`

### 空值合并运算符

语法：`??`

类似于`||`逻辑运算符。当左侧的操作数为`null`或`undefined`时，返回其右侧值。解决`||`左侧值为`Falsy`时容易判断出错的情况

### 逻辑空赋值

语法：`??=`

逻辑空赋值运算符 (`x ??= y`) 仅在 `x` 是 [nullish](https://developer.mozilla.org/zh-CN/docs/Glossary/Nullish) (`null` 或 `undefined`) 时对其赋值。等价于：`x ?? (x = y);`

## 函数

## 继承和原型链

### 原型

原型是一个普通的对象，你所创建的每一个函数会自动带有`prototype`属性，这个属性指向一个空对象，这个空对象包含一个`constructor`属性，它指向你新建的函数而不是内置的`Object()`。

1. prototype
   1. 构造函数的`prototype`等于实例对象的`proto`,指向的就是原型对象
   1. prototype 只有函数才有
2. proto
   1. 一个对象的`__proto__`总是指向它的构造函数的 prototype
   1. `Object.prototype.__proto__===null`,继承链的终点等于`null`
3. constructor
   1. 原型对象的`constructor`指向构造函数

用一张图来汇总他们之间的关系： ![JavaScript之旅_2020-3-3-8-47-54.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/JavaScript之旅_2020-3-3-8-47-54.png)

> 引用：[一篇文章看懂*proto*和 prototype 的关系及区别](https://www.jianshu.com/p/7d58f8f45557)

### new

内建对象函数都可以在前面加上 new 来被调用，这使函数调用成为一个 构造器调用（constructor call）。这是一个重要而微妙的区别：实际上不存在“构造器函数”这样的东西，而只有函数的构造器调用。

new 的原理很简单, 就是引擎内部新建一个空对象，然后将这个空对象的 proto 指向构造函数的 prototype.然后调用构造函数，去填充我们创建的空对象(如果有必要)。 最后将 this 指向我们刚刚创建的新对象。

如果用代码来表示，大概是这样的：

```js
function myNew(constructor, ...args) {
  const obj = {};
  obj.__proto__ = constructor.prototype;
  const ret = constructor.call(obj, ...args);
  return ret instanceof Object ? ret : obj;
}
```

> 引用:[大前端面试宝典 - 图解前端](https://lucifer.ren/fe-interview/#/topics/js/prototype?id=new)

## 并发模型与事件循环

[JS 中的单线程与多线程、事件循环与消息队列、宏任务与微任务](https://www.cnblogs.com/goloving/p/12790991.html)
### 调用栈
### 事件循环
### 消息队列
### 微任务队列（作业队列）
## 术语表

### Hoisting（变量提升）

变量和函数的声明会在编译阶段被放入内存中。`JavaScript` 仅提升声明，而不提升初赋值

1. 所有的声明都会提升到作用域的最顶上去。
1. 同一个变量只会声明一次，其他的会被忽略掉。
1. 函数声明的优先级高于变量申明的优先级，并且函数声明和函数定义的部分一起被提升。

例子：

```js
func(); // 1
var func;
function func() {
  console.log(1);
}
func = function () {
  console.log(2);
};
// 输出1，不会输出2。函数声明和变量声明都会被提升，但是需要注意的是函数会先被提升，然后才是变量。
```

等同于：

```js
function func() {
  console.log(1);
}
func(); // 1
func = function () {
  console.log(2);
};
```

> 引用：[js 中的变量提升和函数提升](https://blog.51cto.com/11871779/2119667)
## 设计模式
### 单例模式
限制类实例化次数只能一次，一个类只有一个实例，并提供一个访问它的全局访问点。
#### 特点
1. 类只有一个实例
1. 全局可访问该实例
3. 自行实例化（主动实例化）
4. 可推迟初始化，即延迟执行
#### 优缺点
1. 优点：适用于单一对象，只生成一个对象实例，避免频繁创建和销毁实例，减少内存占用。
1. 缺点：不适用动态扩展对象，或需创建多个相似对象的场景。
> 注意：多线程编程语言中，单例模式会涉及同步锁的问题。而js是单线程编程语言，没有该问题。
## 实现

### 数字转换

1. parseInt("08")
2. +'08'
3. Number('08')
   
   > 速度:1<2 和 3

## 最佳实践

### Map

当有频繁的对object进行增删改查时，使用map替换object性能会更好。

### 分解大型运算任务

分解为小任务可以使得运算能够适时释放，可以防止阻塞 I/O

### 转换数字为整数

使用非位运算符可以代替 parseInt(value)，而且前者效率更高些

```js
～～(-2.15) // 2
```

### export

1. ES6 编程风格：如果模块默认输出一个函数，函数名的首字母应该小写。如果模块默认输出一个对象，对象名的首字母应该大写。 ​​​​  
2. 为了更好的`tree-shaking`，不推荐使用`export default`。分两种情况：如果只是导出一个方法，那么没问题，但是如果导出一个对象，那么在导入时，其实和`import * from 'xxx'`是一样的。[原因](https://juejin.cn/post/6910009240053055496#heading-28)
3. 数组删除一个元素最高效的做法是使用filter过滤掉那一个值，并覆盖原数组。相比于`splice`遍历次数减少，并且数组修改次数变少。

### 可选链和空值合并

应尽可能的使用可选链`?.`, 空值合并操作符`??`替代代替`||`

## 问题

### 如何计算对象占用内存大小？

目前有npm支持这个操作，https://www.npmjs.com/package/object-sizeof

还有一个暴力的方法是在检查内存前使用alert(),在执行大量操作后再alert,查看两次的内存占用量

### 如何在html中使用module中的导出变量？

两种方法：1个是把所有内容绑定到window上，还有就是点击事件使用`addEventListener`绑定

### ES6 class 组合优先于继承,什么时候使用继承?

1. 你的继承表示"是一个"的关系而不是"有一个"的关系（人类->动物 vs 用户->用户详情）；

1. 你可以重用来自基类的代码（人可以像所有动物一样行动）；

1. 你想通过基类对子类进行全局的修改（改变所有动物行动时的热量消耗）；
   
   > 参考：[代码整洁的 JavaScript](https://github.com/beginor/clean-code-javascript#%E7%BB%84%E5%90%88%E4%BC%98%E5%85%88%E4%BA%8E%E7%BB%A7%E6%89%BF)

### 如何拆分class为多个子模块？

1. 一个文件继承另外一个文件（不推荐）
2. https://www.zhaixiaowai.com/Article/article-22.shtml
3. 把另一个模块的方法作为当前类的静态方法，例如`public getValue = getValue;`

### 怎么侦测当前代码是否在 es6 模块之中？

ES6 模块中顶层的 this 值为 undefined，利用这个语法点可以侦测当前代码是否在 ES6 模块之中。

### 什么时候this值为undefined?

1. 严格模式下全局作用域中普通函数中的this值都为undefined

2. ES6 模块中顶层的 this 值为 undefined(ES6模块默认启用严格模式)

3. 严格模式下自执行函数中的this

   ```html
   var obj = {
   
   　　fn:(function(i){
   
   　　　　// this->undefined
   
   　　　　return function () {
   
   　　　　　　// this->obj
   
   　　　　}
   
   　　})(0)
   
   }
   
   obj.fn();
   
   
   ```

   

### js 内存泄漏的几种原因？

js 可能出现内存泄漏的五种原因：闭包函数、全局变量、对象属性循环引用、DOM 节点删除时未解绑事件、Map 和 Set 的属性直接被删除。 ​​​​

### 为什么"2017-01-01">"2016-12-31"？字符串是怎么进行比较的？

其实是按每个字符的 charCode 大小逐个进行比较。例如："a11"<"a2"为 true。 ​​​​

### js原生语法实现UUID？

`URL.createObjectURL(new Blob()).substr(-36)`

### 千分符？

1. 通过Number.toLocaleString() 返回一个字符串
2. `new Intl.NumberFormat().format(3500)`，性能会比方案1好

### 如何实现js平滑滚动到顶部？

> 注意，如果设置了`scroll-behavior: smooth;`会导致滚动变慢

```js
function scrollToTop (y=0, duration = 150, element = document.scrollingElement) {
  // cancel if already on target position
  if (element.scrollTop === y) return;

  const cosParameter = (element.scrollTop - y) / 2;
  let scrollCount = 0, oldTimestamp = null;

  function step (newTimestamp) {
    if (oldTimestamp !== null) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
      if (scrollCount >= Math.PI) return element.scrollTop = y;
      element.scrollTop = cosParameter + y + cosParameter * Math.cos(scrollCount);
    }
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}
```

参考这个库：https://github.com/Robbendebiene/Sliding-Scroll

### Promise.all如何监听动态的数组？

代码如下，原理：promise.all执行后删除renderList中已经完成的值，这时判断renderList是否为空，不为空则继续迭代 ，为空则resolve该peomise

```js
const renderList = new Set()

// 动态监听renderList中的异步任务
const promiseAll = () => {
  return new Promise((resolve) => {
    const copyRenderList = [...Array.from(renderList)]
    Promise.all(Array.from(renderList)).then(async () => {
      copyRenderList.forEach((x) => {
        renderList.delete(x)
      })
      if (renderList.size !== 0) {
        await promiseAll()
      }
      resolve()
    })
  })
}

// 使用
await promiseAll()
```

### 如何防止数字显示为科学计数法？

js中，当数字大于21位时，会显示为科学计数法，使用Big.js，并设置`Big.PE=30`,默认是21，按需填写`PE`的值即可

### 如何正确判断变量类型？

1. `Object.prototype.toString.call(obj) === '[object Object]'`
2. `obj?.constructor === Object`


参考：https://www.cnblogs.com/a876459952/p/14703988.html

### 如何去除数组中动态扩展中的假值？

```js
const transpile = [...(true ? ['element-plus'] : []), 'chainapi']  // ['element-plus','chainapi']
const transpile = [...(false ? ['element-plus'] : []), 'chainapi']  // ['chainapi']
```

