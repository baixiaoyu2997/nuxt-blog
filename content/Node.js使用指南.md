---
title: Node.js使用指南
category: 分享
tags:
  - node
date: 2020-05-07
vssue-title: Node.js使用指南
---

## 学习顺序

1. Node 中文官网入门教程：http://nodejs.cn/learn
1. Node+Express+MongoDB：https://www.bilibili.com/video/BV1Gz4y1X7Uq?p=2
1. 《Node.js 实战》：node web 开发占了大部分篇幅
1. 《深入浅出 Node.js》：适合对 node 有一定上手程度的人学习

## 专用名词

1. `stdin` 标准输入：命令行从终端输入
1. `stdout` 标准输出:也就是 console.log()

## CLI 命令行

### 速查表

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| --max-old-space-size | number | 设置 v8 的老生代内存最大限制，只能在启动时设置。单位为 M |

## Buffer

它表示在 V8 JavaScript 引擎外部分配的固定大小的内存块（无法调整大小）。当流处理器接收数据的速度快于其消化的速度时，则会将数据放入 buffer 中。

### 如何创建 buffer？

使用 Buffer.from()、Buffer.alloc() 和 Buffer.allocUnsafe() 方法可以创建 buffer。

一个简单的场景是：当观看 YouTube 视频时，红线超过了观看点：即下载数据的速度比查看数据的速度快，且浏览器会对数据进行缓冲。  
也可以只初始化 buffer（传入大小）。 以下会创建一个 1KB 的 buffer：

```js
const buf = Buffer.alloc(1024);
//或
const buf = Buffer.allocUnsafe(1024);
```

### 访问 buffer

```js
const buf = Buffer.from("Hey!");
console.log(buf[0]); //72
console.log(buf[1]); //101
console.log(buf[2]); //121
```

这些数字是 Unicode 码，用于标识 buffer 位置中的字符（H => 72、e => 101、y => 121）。

## Events

### emitter.eventNames()

返回当前 EventEmitter 对象上注册的事件字符串数组

### emitter.on(eventName, listener)

添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。  
返回对 EventEmitter 的引用，以便可以链式调用。  
默认情况下，事件监听器会按照添加的顺序依次调用。`emitter.prependListener()` 方法可用于将事件监听器添加到监听器数组的开头。

### emitter.listenerCount(eventName)

查看事件的注册数量

### emitter.setMaxListeners()

设置监听器最大数量，没设置时默认为 10

## File System

### fs.access(path[, mode], callback)

检测文件是否存在，和测试用户对 path 指定的文件或目录的权限。

### fs.appendFile(data, options)

追加内容到文件末尾

### fs.createReadStream(path[, options])

创建可读的文件流

### fs.createWriteStream(path[, options])

创建可写的文件流

### fs.copyFile(src, dest[, mode], callback)

拷贝文件

### fs.existsSync(path)

判断路径是否存在

### fs.mkdirSync(path[, options])

同步地创建目录。 返回 undefined，或创建的第一个目录的路径（如果 recursive 为 true）。 这是 fs.mkdir() 的同步版本。

### fs.writeFileSync(file, data[, options])

当 file 是文件名时，则异步地写入数据到文件（如果文件已存在，则覆盖文件）。 data 可以是字符串或 buffer。

当 file 是文件描述符时，则其行为类似于直接调用 fs.write()（建议使用）。 参见以下关于使用文件描述符的说明。

如果 data 是 buffer，则 encoding 选项会被忽略。

```
const data = new Uint8Array(Buffer.from('Node.js 中文网'));
fs.writeFile('文件.txt', data, (err) => {
  if (err) throw err;
  console.log('文件已被保存');
});
```

返回 undefined。

### fs.open(path[, flags[, mode]], callback)

返回文件描述符，一旦获得文件描述符，就可以以任何方式执行所有需要它的操作，例如调用 fs.open() 以及许多与文件系统交互的其他操作。

### fs.readdir(path[, options], callback)

读取目录的内容

### fs.readFile(path[, options], callback)

读取文件，fs.readFile() 和 fs.readFileSync() 都会在返回数据之前将文件的全部内容读取到内存中。

### fs.rename(oldPath, newPath, callback)

把 oldPath 文件重命名为 newPath 提供的路径名。

注意：如果 path 不存在则报错，不会自动创建目录。

### fs.rmdir(path[, options],callback)

删除文件夹,设置 options 中的`recursive`为`true`则可以删除非空文件夹。

### fs.stat(path[, options], callback)

回调中返回文件属性，多用于判断，比如：

- 使用 stats.isFile() 和 stats.isDirectory() 判断文件是否目录或文件。
- 使用 stats.isSymbolicLink() 判断文件是否符号链接。
- 使用 stats.size 获取文件的大小（以字节为单位）。
### fs.unlink(path, callback)
删除文件
### fs.watchFile(filename[, options], listener)

监视 filename 的更改。 每当访问文件时都会调用 listener 回调

## http

### http.METHODS

列出所有支持的 http 方法

### http.STATUS_CODES

此属性列出了所有的 HTTP 状态代码及其描述：

```js
{ '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '226': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Unordered Collection',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required' }

```
### http.createServer([options][, requestListener])
注意：解析get、post请求时，是以流的方式。
## Modules

### module.paths

模块的搜索路径

### \_\_dirname

当前模块的目录名称， 这与\_\_filename 的 path.dirname()相同

## Modules: CommonJS modules

### modules 对象

#### exports

一个对与 module.exports 简写形式，既可以使用`module.exports`也可以使用`exports`导出对象，但是不能直接对`exports`进行赋值：

```js
//utils.js
let a = 100;

exports.a = 200;
console.log(module.exports); //{a : 200}
exports = { a: 300 }; //exports 指向其他内存区

//test.js

var a = require("./utils");
console.log(a); // 打印为 {a : 200}
```

用`module.exports`可以导出单个变量、函数或者对象。如果创建了一个既有 exports 又有 module.exports 的模块，那么它会返回`module.exports`，而`exports`会被忽略。

## Modules: Packages

### Package entry points

#### [Conditional exports](https://nodejs.org/docs/latest-v16.x/api/packages.html#conditional-exports)

通过设置`exports`字段，根据环境导入文件，可以根据环境选择`node`或者

```json
{
  "main": "./main.js",
  "exports": {
    ".": "./main.js",
    "./feature": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}

```



## net

net 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 IPC 服务器（net.createServer（））和客户端（net.createConnection（））

## os

### os.freemem()

系统可用内存

### os.hostname()

返回主机名

### os.platform()

返回为 node 编译的平台

### os.totalmem()

返回系统中总内存的字节数

## Path

### path.basename(path[, ext])

给定路径的文件全称（包含扩展名），如果提供第二个参数拓展名，那么返回的只有扩展名。

### path.dirname()

给定路径的目录路径

### path.extname()

给定路径的文件扩展名(后缀名)，例如`.txt`

### path.delimiter

作为路径定界符，在 Windows 上是 ;，在 Linux/macOS 上是 :

### path.isAbsolute(path)

判断路径是否为绝对路径

### path.join([...paths])

path.join() 方法使用平台特定的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。零长度的 path 片段会被忽略。 如果连接的路径字符串是零长度的字符串，则返回 '.'，表示当前工作目录。

### path.relative(from,to)

接受 2 个路径作为参数。 基于当前工作目录，返回从第一个路径到第二个路径的相对路径。

### path.resolve([...paths])

> 并不会校验路径是否存在

返回相对路径的绝对路径

```js
path.resolve("joe.txt"); //'/Users/joe/joe.txt' 如果从主文件夹运行。
```

如果指定第二个参数，则 resolve 会使用第一个作为第二个的基础：

```js
path.resolve("tmp", "joe.txt"); //'/Users/joe/tmp/joe.txt' 如果从主文件夹运行。
```

如果第一个参数以斜杠开头，则表示它是绝对路径：

```js
path.resolve("/etc", "joe.txt"); //'/etc/joe.txt'
```

### path.normalize()

> 并不会校验路径是否存在

path.normalize() 是另一个有用的函数，当包含诸如 .、.. 或双斜杠之类的相对说明符时，其会尝试计算实际的路径：

```js
path.normalize("/users/joe/..//test.txt"); ///users/test.txt
```

### path.parse(path)

解析路径为组成对象的片段：

- root: 根路径。
- dir: 从根路径开始的文件夹路径。
- base: 文件名 + 扩展名
- name: 文件名
- ext: 文件扩展名

```js
require("path").parse("/users/test.txt");
// {
//  root: '/',
//  dir: '/users',
//  base: 'test.txt',
//  ext: '.txt',
//  name: 'test'
// }
```

### path.sep

作为路径段分隔符，在 Windows 上是 \，在 Linux/macOS 上是 /

## process(进程)

`process` 对象是一个全局变量，提供了有关当前 `Node.js` 进程的信息并对其进行控制。 作为全局变量，它始终可供 `Node.js` 应用程序使用，无需使用 `require()`。 它也可以使用`require()` 显式地访问：

```js
const process = require("process");
```

### process.argv

- `<string[]>`

`process.argv` 属性会返回一个数组，其中包含当 `Node.js` 进程被启动时传入的命令行参数。 第一个元素是 `process.execPath`。 第二个元素是正被执行的 `JavaScript` 文件的路径。 其余的元素是任何额外的命令行参数。所有参数都为字符串。

可以创建一个排除了前两个参数的新数组来仅获取其他的参数：

```js
const args = process.argv.slice(2);
```

命令行中的参数可以为任意形式，例如：`node index.js a b`或者`node index.js a=1 b=2`。  
为了进行更好的解析。最好的方法是使用`minimist`库:

```js
const args = require("minimist")(process.argv.slice(2));
args["name"]; //joe
```

但是需要在每个参数名称之前使用双破折号：

```sh
node index.js --name=joe
```

没有使用`--`的参数会被`_`属性以数组形式按照从前往后的顺序接收：

```js
// node index.js c --b=2 a
args._ = ["c", "a"];
args.b = 2;
```

### process.exit()

退出 node 程序，默认情况下，退出码为 0，表示成功。不同的[退出码](http://nodejs.cn/api/process.html#process_exit_codes) 具有不同的含义.

### process.exitCode

可以提前设置 exitCode，这样 exit()可以省去参数。`process.exitCode=1`

### process.nextTick(()=>{})

会在当前事件循环结束，下一个事件循环开始之前调用该函数

### process.version

查看 node 版本号

## require

require 是同步 api,在`esm`中替代require:

```js
import { createRequire } from 'module'

export const require = createRequire(import.meta.url)
```

可以使用这个方法在es6中import json文件

### require.extentions

系统中已有的扩展加载方式，正常情况是`.js、.json、.node`,得到的结果：

```
{ '.js': [Function], '.json': [Function], '.node': [Function] }
```

### require.cache

加载模块的缓存路径映射，加速下一次加载

## stream

### 什么是流？

它们是一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换。  
所有的流都是 EventEmitter 的实例。

### 为什么是流

相对于使用其他的数据处理方法，流基本上提供了两个主要优点：

- 内存效率: 无需加载大量的数据到内存中即可进行处理。
- 时间效率: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。

### 流的种类

流分为 4 类：

- Readable: 可以通过管道读取、但不能通过管道写入的流（可以接收数据，但不能向其发送数据）。 当推送数据到可读流中时，会对其进行缓冲，直到使用者开始读取数据为止。
- Writable: 可以通过管道写入、但不能通过管道读取的流（可以发送数据，但不能从中接收数据）。
- Duplex: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合。
- Transform: 类似于双工流、但其输出是其输入的转换的转换流。

## url

url 处理模块

### url.parse()

弃用，使用 [the WHATWG URL API](https://developer.mozilla.org/zh-CN/docs/Web/API/URL) 解析 URL

## 问题

### 如何彻底卸载node？

https://juejin.cn/post/6844904051516112903

### 如何在文件改动时自动重启程序？

使用`nodemon`包即可,还有一个包叫`supervisor`,不过已经过时了，不推荐使用。

### node 中启用 import？

> 前置条件: `node`命令后添加`--experimental-modules`参数，例如：`node --experimental-modules test.js`

在`node v12`中有三种方法：

1. 文件以`.ejs`结尾
1. 最近的`package.json`中添加`'type':'module'`
1. Strings passed in as an argument to --eval or --print, or piped to node via STDIN, with the flag --input-type=module.

我使用的是第二种方法

node v14版本已经删除了esm实验性标签

### esm和cjs主要区别？

1. esm导出值是对值的引用，而cjs是对值的拷贝
2. cjs是运行时生成，而esm是编译时生成
3. cjs是同步加载，而esm是异步加载

### 当 type=‘module’时，就不能再使用 require？

如果type等于module，那么可以在esm中import `xxx.cjs`，但是不能反过来。

可以使用 module.createRequire()替代，更多关于 ES Modules 和 CommonJS 的用法区别，可以查看：https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs

```js
import { createRequire } from 'module'

export const require = createRequire(import.meta.url)	
```

### ESM和CJS互相引用？

1. cjs中不能使用esm，根本原因是 ESM 本质上是异步的，这意味着您不能在需要的同步上下文中导入异步模块。但是有一种例外情况，使用`import()`

   ```js
   // in CJS
   const { default: pkg } = await import('esm-only-package')
   ```


### \_\_dirname 和 process.cwd()的区别？

- process.cwd()返回调用 node 命令时的目录。
- \_\_dirname 返回源代码所在的目录。

对于`d:\dir\index.js`

| 命令                | `process.cwd()` | `__dirname` |
| ------------------- | --------------- | ----------- |
| `node index.js`     | `d:\dir`        | `d:\dir`    |
| `node dir\index.js` | `d:`            | `d:\dir`    |

### 如何获取命令行参数？

使用`minimist`库

### 如何从命令行输入?

使用核心模块`readline`：

```js
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question("你叫什么名字？", (name) => {
  console.log(`你好${name}!`);
  readline.close();
});
```

### 如何查看 npm 安装的全局包在哪里？

```sh
npm root -g
```

### 如何在esm中使用`__dirname`和`__filename`?

```js
const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;			
```

### 如何获取package的绝对路径？

```js
path.resolve(`node_modules/${pkgName}`)
```

### 如何在打包时进行日志输出？

```js
process.stdout.write('=====================================================');
```

