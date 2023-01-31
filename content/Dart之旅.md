---
title: Dart之旅
category: 分享
tags:
- Dart
date: 2020-02-03
vssue-title: Dart之旅
---
## 变量
### var
在dart中可以使用var来替代具体类型的声明，会自动推导变量的类型，这是因为var并不是直接存储值，而是存储值的对象引用，所以var可以声明任何变量。  
但是在使用var声明变量的时候，需要注意的是: 如果var声明的变量开始不初始化，不仅值可以改变它的类型也是可以被修改的，但是一旦开始初始化赋值后，它的类型就确定了，后续不能被改变。
## 类
### 构造函数
声明一个与类名一样的函数即可声明一个构造函数（对于命名式构造函数还可以添加额外的标识符）。大部分的构造函数形式是生成式构造函数，其用于创建一个类的实例：
```
class Point {
  num x, y;

  Point(num x, num y) {
    // 还会有更好的方式来实现此逻辑，敬请期待。
    this.x = x;
    this.y = y;
  }
}
```
> 使用 `this` 关键字引用当前实例。  

对于大多数编程语言来说在构造函数中为实例变量赋值的过程都是类似的，而 Dart 则提供了一种特殊的语法糖来简化该步骤:
```
class Point {
  num x, y;

  // 在构造函数体执行前用于设置 x 和 y 的语法糖。
  Point(this.x, this.y);
}
```
如果父类没有匿名无参数构造函数，那么子类必须调用父类的其中一个构造函数，为子类的构造函数指定一个父类的构造函数只需在构造函数体前使用（:）指定。
```
class GalleryApp extends StatefulWidget {
  const GalleryApp({
    Key key,
    this.updateUrlFetcher,
    this.enablePerformanceOverlay = true,
  }) : super(key: key); // 调用父类构造函数

  final UpdateUrlFetcher updateUrlFetcher;
  final bool enablePerformanceOverlay;
}

```
### new关键字
在Dart2.0中`new`变成了可选项
## 重要的概念
### 私有变量
dart语言中没有public、protected和private这些关键字。但是在dart里面，以下划线开头的变量自动识别为私有变量
## 运算符
### 类型判定运算符
类型判定运算符
`as`， `is`， 和 `is!` 运算符用于在运行时处理类型检查：

| Operator |	Meaning|
|---|---|
|as|	Typecast (也被用于指定库前缀)|
|is|	True if the object has the specified type|
|is!|	False if the object has the specified type|
例如， `obj is Object` 总是 true。 但是只有 `obj` 实现了 `T` 的接口时， `obj is T` 才是 true。

使用 `as` 运算符将对象强制转换为特定类型。 通常，可以认为是 `is` 类型判定后，被判定对象调用函数的一种缩写形式。 请考虑以下代码：

```js
if (emp is Person) {
  // Type check
  emp.firstName = 'Bob';
}
```
使用 `as` 运算符进行缩写：

```js 
(emp as Person).firstName = 'Bob';
```
> 提示： 以上代码并不是等价的。 如果 `emp` 为 null 或者不是 Person 对象， 那么第一个 `is` 的示例，后面将不回执行； 第二个 `as` 的示例会抛出异常。
### List
构造器
|名称|详情|参数|
|-|-|-|
|List.generate| 创建一个长度为length的列表 | (int length,E generator(int index), {bool growable: true)|
## LIBRARIES
### dart:isolate（后台运行）
有时候你需要处理大量的数据，这会导致你的 UI 挂起。在 Flutter 中，使用 Isolate 来发挥多核心 CPU 的优势来处理那些长期运行或是计算密集型的任务。
Isolate 是分离的运行线程，并且不和主线程的内存堆共享内存。这意味着你不能访问主线程中的变量，或者使用 setState() 来更新 UI。正如它们的名字一样，Isolate 不能共享内存。

### dart:convert(转换格式)
引用：`import 'dart:convert'`;  

JSON  
解码(JSON String->Object)
```
// NOTE: Be sure to use double quotes ("),
// not single quotes ('), inside the JSON string.
// This string is JSON, not Dart.
var jsonString = '''
  [
    {"score": 40},
    {"score": 80}
  ]
''';

var scores = jsonDecode(jsonString);
assert(scores is List);

var firstScore = scores[0];
assert(firstScore is Map);
assert(firstScore['score'] == 40);
```  
编码(Object->JSON String)  
支持int, double, String, bool, null, List, Map (with string keys)  
```
var scores = [
  {'score': 40},
  {'score': 80},
  {'score': 100, 'overtime': true, 'special_guest': null}
];

var jsonText = jsonEncode(scores);
assert(jsonText ==
    '[{"score":40},{"score":80},'
    '{"score":100,"overtime":true,'
    '"special_guest":null}]');
```
UTF-8  
解码
```
List<int> utf8Bytes = [
  0xc3, 0x8e, 0xc3, 0xb1, 0xc5, 0xa3, 0xc3, 0xa9,
  0x72, 0xc3, 0xb1, 0xc3, 0xa5, 0xc5, 0xa3, 0xc3,
  0xae, 0xc3, 0xb6, 0xc3, 0xb1, 0xc3, 0xa5, 0xc4,
  0xbc, 0xc3, 0xae, 0xc5, 0xbe, 0xc3, 0xa5, 0xc5,
  0xa3, 0xc3, 0xae, 0xe1, 0xbb, 0x9d, 0xc3, 0xb1
];

var funnyWord = utf8.decode(utf8Bytes);

assert(funnyWord == 'Îñţérñåţîöñåļîžåţîờñ');

```
解码stream  
```
var lines = inputStream
    .transform(utf8.decoder)
    .transform(LineSplitter());
try {
  await for (var line in lines) {
    print('Got ${line.length} characters from stream');
  }
  print('file is now closed');
} catch (e) {
  print(e);
}
```
编码
```
List<int> encoded = utf8.encode('Îñţérñåţîöñåļîžåţîờñ');

assert(encoded.length == utf8Bytes.length);
for (int i = 0; i < encoded.length; i++) {
  assert(encoded[i] == utf8Bytes[i]);
}

```
> 引用自 [Flutter学习笔记5-dart:convert](https://www.jianshu.com/p/0dbb26f58eb4)
### Maps
如果检索的 Key 不存在于 Map 中则会返回一个 null：  
```
var gifts = {'first': 'partridge'};
assert(gifts['fifth'] == null);
```
### Function
箭头函数不能像js中那样用于多语句函数，只能在有一个表达式时，才能使用箭头函数