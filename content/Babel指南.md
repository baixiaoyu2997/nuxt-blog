---
title: Babel指南
category: 工具
tags:
  - babel
date: 2020-06-03
vssue-title: Babel指南
---

## babel 到底做了什么？怎么做的？

简单来说把 JavaScript 中 es2015/2016/2017/2046 的新语法转化为 es5，让低端运行环境(如浏览器和 node )能够认识并执行。本文以 babel 6.x 为基准进行讨论。最近 babel 出了 7.x，放在最后聊。

### 运行方式和插件

babel 总共分为三个阶段：解析，转换，生成。

**babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面。因此当我们不配置任何插件时，经过 babel 的代码和输入是相同的。**

插件总共分为两种：

1. 语法插件（作用是让 babel 在解析的时候能够支持这种语法）
   
   > 比如 callFoo(param1, param2,) 这种最后带逗号就是非法的，添加`babel-plugin-syntax-trailing-function-commas`插件就可以支持了。
1. 转译插件
   
   > 比起语法插件，转译插件其实更好理解，比如箭头函数 (a) => a 就会转化为 function (a) {return a}。完成这个工作的插件叫做 `babel-plugin-transform-es2015-arrow-functions`。

同一类语法可能同时存在语法插件版本和转译插件版本。如果我们使用了转译插件，就不用再使用语法插件了。

### preset

比如 es2015 是一套规范，包含大概十几二十个转译插件。如果每次要开发者一个个添加并安装，配置文件很长不说，npm install 的时间也会很长，更不谈我们可能还要同时使用其他规范呢。  
为了解决这个问题，babel 还提供了一组插件的集合。  
preset 分为以下几种：

1. 官方内容，目前包括 env, react, flow, minify 等。这里最重要的是 env，后面会详细介绍。
1. stage-x，这里面包含的都是当年最新规范的草案，每年更新。
   1. Stage 0 - 稻草人: 只是一个想法，经过 TC39 成员提出即可。
   1. Stage 1 - 提案: 初步尝试。
   1. Stage 2 - 初稿: 完成初步规范。
   1. Stage 3 - 候选: 完成规范和浏览器初步实现。
   1. Stage 4 - 完成: 将被添加到下一年度发布。(stage-4 在下一年更新会直接放到 env 中，所以没有单独的 stage-4 可供使用。)
1. es201x, latest 这些是已经纳入到标准规范的语法。例如 es2015 包含 arrow-functions，es2017 包含 syntax-trailing-function-commas。但因为 env 的出现，使得 es2016 和 es2017 都已经废弃。所以我们经常可以看到 es2015 被单独列出来，但极少看到其他两个。 latest 是 env 的雏形，它是一个每年更新的 preset，目的是包含所有 es201x。但也是因为更加灵活的 env 的出现，已经废弃。

### 执行顺序

- Plugin 会运行在 Preset 之前。
- Plugin 会从前到后顺序执行。
- Preset 的顺序则 刚好相反(从后向前)。

preset 的逆向顺序主要是为了保证向后兼容，因为大多数用户的编写顺序是 ['es2015', 'stage-0']。这样必须先执行 stage-0 才能确保 babel 不报错。

### 插件和 preset 的配置项

简略情况下，插件和 preset 只要列出字符串格式的名字即可。但如果某个 preset 或者插件需要一些配置项(或者说参数)，就需要把自己先变成数组。第一个元素依然是字符串，表示自己的名字；第二个元素是一个对象，即配置对象。

```js
"presets": [
    // 带了配置项，自己变成数组
    [
        // 第一个元素依然是名字
        "env",
        // 第二个元素是对象，列出配置项
        {
          "module": false
        }
    ],

    // 不带配置项，直接列出名字
    "stage-2"
]
```

### env (重点)

因为 env 最为常用也最重要，所以我们有必要重点关注。

env 的核心目的是通过配置得知目标环境的特点，然后只做必要的转换。例如目标浏览器支持 es2015，那么 es2015 这个 preset 其实是不需要的，于是代码就可以小一点(一般转化后的代码总是更长)，构建时间也可以缩短一些。

如果不写任何配置项，env 等价于 latest，也等价于 es2015 + es2016 + es2017 三个相加(不包含 stage-x 中的插件)。env 包含的插件列表维护在[这里](https://github.com/babel/babel-preset-env/blob/master/data/plugin-features.js)

下面列出几种比较常用的配置方法：

```json
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions", "safari >= 7"]
        }
      }
    ]
  ]
}
```

将必要的代码进行转换。而这些版本已有的功能就不进行转化了。这里的语法可以参考[browserslist](https://github.com/browserslist/browserslist)

## 其他配套工具

### babel-node

babel-node 是 babel-cli 的一部分，它不需要单独安装。

它的作用是在 node 环境中，直接运行 es2015 的代码，而不需要额外进行转码。

可以说：babel-node = babel-polyfill + babel-register。那这两位又是谁呢？

### babel-register

`babel-register` 模块改写 `require` 命令，为它加上一个钩子。此后，每当使用 `require` 加载 `.js、.jsx、.es `和 `.es6` 后缀名的文件，就会先用 `babel `进行转码。使用时，必须首先加载 `require('babel-register')`。需要注意的是，`babel-register` 只会对 `require` 命令加载的文件转码，而不会对当前文件转码。  
另外，由于它是实时转码，所以 只适合在开发环境使用。

### babel-polyfill

> babel v7.4.0 不推荐使用,推荐直接导入`core-js`

babel 默认只转换 js 语法，而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法(比如 Object.assign)都不会转码。

使用时，在所有代码运行之前增加 require('babel-polyfill')。或者更常规的操作是在 webpack.config.js 中将 babel-polyfill 作为第一个 entry。因此必须把 babel-polyfill 作为 dependencies 而不是 devDependencies  
babel-polyfill 主要有两个缺点：

使用 babel-polyfill 会导致打出来的包非常大，因为 babel-polyfill 是一个整体，把所有方法都加到原型链上。比如我们只使用了 Array.from，但它把 Object.defineProperty 也给加上了，这就是一种浪费了。这个问题可以通过单独使用 core-js 的某个类库来解决，core-js 都是分开的。

babel-polyfill 会污染全局变量，给很多类的原型链上都作了修改，如果我们开发的也是一个类库供其他开发者使用，这种情况就会变得非常不可控。

因此在实际使用中，如果我们无法忍受这两个缺点(尤其是第二个)，通常我们会倾向于使用 babel-plugin-transform-runtime。但如果代码中包含高版本 js 中类型的实例方法 (例如 [1,2,3].includes(1))，这还是要使用 polyfill。

### babel-runtime 和 babel-plugin-transform-runtime (重点)

我们时常在项目中看到 .babelrc 中使用 babel-plugin-transform-runtime，而 package.json 中的 dependencies (注意不是 devDependencies) 又包含了 babel-runtime，那这两个是不是成套使用的呢？他们又起什么作用呢？

先说 babel-plugin-transform-runtime。

babel 会转换 js 语法，之前已经提过了。以 async/await 举例，如果不使用这个 plugin (即默认情况)，转换后的代码大概是：

```js
// babel 添加一个方法，把 async 转化为 generator
function _asyncToGenerator(fn) { return function () {....}} // 很长很长一段

// 具体使用处
var _ref = _asyncToGenerator(function* (arg1, arg2) {
  yield (0, something)(arg1, arg2);
});

```

这个 \_asyncToGenerator 在当前文件被定义，然后被使用了，以替换源代码的 await。但每个被转化的文件都会插入一段 \_asyncToGenerator 这就导致重复和浪费了。  
在使用了 babel-plugin-transform-runtime 了之后，转化后的代码会变成

```js
// 从直接定义改为引用，这样就不会重复定义了。
var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");
var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 具体使用处是一样的
var _ref = _asyncToGenerator3(function* (arg1, arg2) {
  yield (0, something)(arg1, arg2);
});
```

从定义方法改成引用，那重复定义就变成了重复引用，就不存在代码重复的问题了。  
但在这里，我们也发现 babel-runtime 出场了，它就是这些方法的集合处，也因此，在使用 babel-plugin-transform-runtime 的时候必须把 babel-runtime 当做依赖。

再说 `babel-runtime`，它内部集成了

1. core-js: 转换一些内置类 (Promise, Symbols 等等) 和静态方法 (Array.from 等)。绝大部分转换是这里做的。自动引入。

1. regenerator: 作为 core-js 的拾遗补漏，主要是 generator/yield 和 async/await 两组的支持。当代码中有使用 generators/async 时自动引入。

1. helpers, 如上面的 asyncToGenerator 就是其中之一，其他还有如 jsx, classCallCheck 等等，可以查看[babel-helpers](https://github.com/babel/babel/blob/6.x/packages/babel-helpers/src/helpers.js)。 在代码中有内置的 helpers 使用时(如上面的第一段代码)移除定义，并插入引用(于是就变成了第二段代码)。

`babel-plugin-transform-runtime` 不支持 实例方法 (例如 [1,2,3].includes(1))  
此外补充一点，把 helpers 抽离并统一起来，避免重复代码的工作还有一个 plugin 也能做，叫做 babel-plugin-external-helpers。但因为我们使用的 transform-runtime 已经包含了这个功能，因此不必重复使用。而且 babel 的作者们也已经开始讨论这两个插件过于类似，正在讨论在 babel 7 中把 external-helpers 删除，讨论在 [issue#5699](https://github.com/babel/babel/issues/5699) 中。

## babel7

### 查询

#### 支持 api 的各浏览器版本

https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.js

#### 当前 babel 默认支持哪些特性

> 指的是 preset-env，因为 babel 本身不具备转换的能力。

https://github.com/babel/babel/blob/main/packages/babel-compat-data/data/plugins.json

#### 图表形式 babel7 特性支持情况

https://kangax.github.io/compat-table/es2016plus/#babel7corejs3

### @babel/preset-env

> 默认转换 browserslist 文件中的版本

- useBuiltIns：为代码添加新 api 的 polyfill
  - entry: 使用 entry 会检测代码中`import "core-js";`或者`import "@babel/polyfill";`,如果有的话那么会把对应支持浏览器版本的所有新特性加载进来，即使没有使用该特性。如果 "corejs": 3, 则 import '@babel/polyfill' 需要改成:

```
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

- - usage（推荐）: 只导入我们代码中使用到的 polyfill

- targets：支持版本
  - esmodules:如果设置这个属性会覆盖掉 targets.browsers 和`.browserslistrc`文件，改为支持“es6.module”语法
  - 可以通过执行`import getTargets from '@babel/helper-compilation-targets'`,getTargets方法获取`browsers`配置文件中的值
- corejs：
  - version：版本，建议选择 3 以上
  - proposals：是否启用`esnext polyfill`,需要注意的是 corejs 的提案和 tc39 并不同步。
  - false:此时不对 polyfill 做操作。如果引入 @babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill。
- debug:展示使用的插件和所有支持浏览器列表
- include：强制加载某些插件
- configPath：从哪里开始寻找 browserslist
- ignoreBrowserslistConfig：是否忽略 browserslist 配置文件。
  
  > 引用：https://blog.csdn.net/vv_bug/article/details/107052867

### 升级 babel7

使用官方的`babel-upgrade`插件来帮助你快速平稳的迁移，使用方式：

```sh
# 不安装到本地而是直接运行命令，npm 的新功能
npx babel-upgrade --write

# 或者常规方式
npm i babel-upgrade -g
babel-upgrade --write
```

## 优化项

1. 使用`@babel/plugin-transform-runtime`,解决多个地方使用相同代码导致打包重复的问题

## 参考

1. [一口(很长的)气了解 babel](https://juejin.im/post/5c19c5e0e51d4502a232c1c6)
1. [Show me the code，babel 7 最佳实践！](https://juejin.im/post/6844903729188044814)
