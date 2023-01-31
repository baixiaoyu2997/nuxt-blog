---
title: webpack
category: 工具
tags:
- webpack
date: 2019-03-15
vssue-title: webpack
---

![20191002121033.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20191002121033.png)

## 原理

假设有代码如下:

```js
// index.js
var add= require('add.js').default
console.log(add(1,2))

// add.js
export.default=function(a,b){
  return a+b;
}
```

webpack会解析依赖树，都引用了哪些包和对应的代码:

```js
{
  "index.js":`
		var add= require('add.js').default
		console.log(add(1,2))
	`,
  'add.js':`
		export.default=function(a,b){
  		return a+b;
		}
	`
}
```

因为浏览器不认识export，那么需要生成一个export空对象：

```js
var export ={}
```

并生成一个模拟`require`的函数,把执行对应文件中的模板字符串代码:

````js
var require=function(file){
	 var export ={}
   // 防止变量污染
	 (function(file){
     eval(file)
   })(file)
 	 return export
}
````

最后传入依赖树并调用入口文件：

```js
(function(list){
  var require=function(file){
	 var export ={}
   // 防止变量污染
	 (function(file){
     eval(list[file])
   })(file)
 	 return export
	}
  require("index.js")
})({
  "index.js":`
		var add= require('add.js').default
		console.log(add(1,2))
	`,
  'add.js':`
		export.default=function(a,b){
  		return a+b;
		}
	`
})
```



## 特殊名词

### module，chunk 和 bundle

1. 普通文件属于 module
1. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 chunk 文件，webpack 会对这个 chunk 文件进行一些操作
1. 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。 ![webpack_2020-10-30-13-56-32](https://blog-pic.oss-cn-beijing.aliyuncs.com/webpack_2020-10-30-13-56-32.png) module，chunk 和 bundle 其实就是同一份逻辑代码在不同转换场景下的取了三个名字
   
   > 引用： [webpack 中，module，chunk 和 bundle 的区别是什么？](https://www.cnblogs.com/skychx/archive/2020/05/18/webpack-module-chunk-bundle.html)

### 文件指纹

文件指纹就是打包后输出的文件名的后缀  
Hash:和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会修改  
Chunkhash:和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值  
contenthash:根据文件内容来定义 hash，文件内容不变，则 contenthash 不变  
推荐使用 contenthash

> 文件缓存：
>
> 1. [webpack4之《缓存优化方案》](https://zhuanlan.zhihu.com/p/78331695?from_voters_page=true)
> 2. [[手摸手，带你用合理的姿势使用webpack4（下）](https://segmentfault.com/a/1190000015919928)](https://segmentfault.com/a/1190000015919928)

### 资源内联

使用场景：

1. 页面初始化需要做的的初始化脚本
2. css 内联避免页面闪动
3. 减少网络请求（小图片或者字体内联）

### tree shaking(摇树优化)

1. tree shaking 只能作用于 ES6 模块,Babel 的预置默认把任何模块转译成 CommonJS 模块,你可以简单设置 modules: false 来解决此问题。
2. production mode 的情况下默认开启
3. 在具有副作用的代码中 tree-shaking 会失效，可以使用 webpack-deep-scope-plugin 插件来优化，但是如果使用了 babel+代码具有副作用的情况下，这个插件还是会失效
4. webpack5 对 tree shaking 进行了进一步的优化，比如嵌套 tree-shaking,会对嵌套的 export 进行追踪，在生产模式下，默认启动`optimization.innerGraph`对 import 和 export 的依赖进行分析，这样会检测出未使用的 export，从而省略更多打包的代码。更多 tree-shaking 优化可以查看`sideEffects和usedExports`

## cli(命令行)

1. --profile --progress 可以展示百分比进度

## entry(入口)

### 单入口
entry 是一个字符串

```js
 module.exports={
    entry:'./path/file.js'
 }
```

### 多入口 
entry 是一个对象

```js
module.exports={
    entry:{
        app:'./src/app.js',
        adminApp:'./src/adminApp.js'
    }
}
```

### 多页面打包通用方案

动态获取 entry 和设置 html-webpack-plugin 数量  
利用 glob.sync
### entry高级用法
通过entry数组写法分离bundle,例如我们想要从应用程序文件中输出 home 页面的 home.js 和 home.css，为 account 页面输出 account.js 和 account.css：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    home: ['./home.js', './home.scss'],
    account: ['./account.js', './account.scss'],
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
```
## output(输出)

### 单入口配置

```
module.exports={
    output:{
        filename:'bundle.js',
        path:_dirname+'/dist'
    }
}
```

### 多入口配置

通过占位符确保文件名称的唯一

```js
module.exports = {
  output: {
    filename: "[name].js", // 在webpack5中，此设置是默认的
    path: _dirname + "/dist",
  },
};
```

## mode

指定当前的构建环境是：production、development 还是 none(什么都不做), 设置 mode 可以使用 webpack 内置的函数，默认值为 production ![20190911173248.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20190911173248.png)

## devServer

```js
devServer: {
    inline: true,
    open: true,       // 启动dev服务自动打开页面
    hot: true,      // 热更新,需要webpack-dev-server
    host: "0.0.0.0", // 默认webpack开发服务外部无法访问，设置host后可以通过ip访问
    useLocalIp: true, // 设置webpack使用ip打开页面
    stats: "errors-only", // 统计信息
},
```
### 统计信息 stats

| Preset        | Alternative | Description                    |
| ------------- | ----------- | ------------------------------ |
| 'errors-only' | none        | 只在发生错误时输出             |
| minimal       | none        | 只在发生错误或有新的编译时输出 |
| none          | false       | 没有输出                       |
| normal        | true        | 标准输出                       |
| verbose       | none        | 全部输出                       |

生产环境配置

```
module.exports = {
    stats:'errors-only'   // 推荐
}
```

开发环境配置

```
devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
},
```

优化命令行的构建日志，使用[friendly-errors-webpack-plugin](#friendly-errors-webpack-plugin)

### 热更新：webpack-dev-server

WDS 不刷新浏览器  
WDS 不输出文件，而是放在内存中  
使用的是 HotModuleReplacementPlugin 插件，设置 hot:true 之后会自动引用，不需要在 plugin 中添加

## watch

webpack 开启监听模式有两种方式：

- 启动 webpack 命令时，带上 --watch 参数
- 再配置 webpack.config.js 中设置 watch:true

文件监听的原理分析：轮询判断文件的最后编辑时间是否变化某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout

```js
module.export = {
  // 默认false,
  watch: true,
  // 只有开启监听模式时，watchOptions才有意义
  watchOptions: {
    // 默认为空，忽略文件夹，支持正则，支持数组
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 轮询间隔，默认每秒检查一次变动
    poll: 1000,
  },
};
```

## optimization

在 webpack4 中如果配置了`minimizer`属性，会导致覆盖默认优化配置。

### runtimeChunk

runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单, 模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含**模块信息的模块**(通常会被包含在最后一个 bundle 中)缓存失效

## loaders

webpack 开箱即用只支持 JS 和 JSON 两种文件类型，通过 Loaders 去支持其他文件类型并且把它们转化成有效的模块，并且可以添加到依赖图中。  
本身是一个函数，接受源文件作为参数，返回转换的结果。 test 对应匹配规则，use 匹配 loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\\.css$/,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: "style-loader" },
          // [css-loader](/loaders/css-loader)
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
```

- 使用 loader 的 3 种方式：

  - config 文件
  - inline，例:`require('raw'!../file.js)`
    - 内联 loader 的配置，例如`?key=value&foo=bar`,或者一个 json 对象，例如`?{"key":"value","foo":"bar"}`
    - 每个 loader 后边都要添加`!`来进行分隔。每个部分都会相对于当前目录解析。`import Styles from 'style-loader!css-loader?modules!./styles.css';`
    - 使用`!`作为内联 import 语句的前缀，将禁用所有已配置的 normal loader(普通 loader)
    - 使用 `!!` 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）
  - CLI

- loader 执行顺序：
  1.  webpack 配置文件中 loaders 配置项
      - use 中的 loader 从下到上地取值/执行
  2.  代码文件中 request 或者 import 请求中指定的 loaders

### url-loader

`url-loader`可以解析`import`或者`require`的文件，大于限制的文件可以转换成`base64 URIs`。  
url-loader 工作分两种情况：1.文件大小小于 limit 参数，url-loader 将会把文件转为 DataURL；2.文件大小大于 limit，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader。因此我们只需要安装 url-loader 即可。

内联图片：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
};
```

### style-loader

匹配所有 css 文件，内联到 html 中
### style-resources-loader
> https://www.npmjs.com/package/style-resources-loader 

配置样式全局变量，例如：`variables、mixins、functions`等。支持`css, sass, scss, less, stylus`  
```js
module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader', {
                loader: 'style-resources-loader',
                options: {
                    patterns: [
                        './path/from/context/to/scss/variables/*.scss',
                        './path/from/context/to/scss/mixins/*.scss',
                    ]
                }
            }]
        }]
    },
```
### postcss-loader

```js
{
    loader: 'postcss-loader',
    options: {
        plugins: () => [
            require('autoprefixer')({ // 自动添加 css 前缀
                browsers: ['last 2 version', '>1%', 'ios 7']
            })
        ]
    }
```

### px2rem-loader

需要在 html 文件中内联引入 lib-flexible，一起使用，可以添加 exclude 去掉不想转换的库，也可以添加/_no_/的语法去设置某一行样式不进行转换

```
{
    loader: 'px2rem-loader',
    options: {
        remUnit: 75,   // 如果是750的设计稿
        remPrecision: 8
    }
}
```

### raw-loader

> https://webpack.docschina.org/loaders/raw-loader/#root

允许以字符串形式`import`,有两种使用方式：

- 全局设置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: [
          {
            loader: "raw-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

- 单独使用：

```js
import txt from "raw-loader!./file.txt";
```

需要注意的是，如果被 import 的文件已经被其他 loader 加载，那么应该添加`!!`来禁用其他 loader：

```js
import css from "!!raw-loader!./file.txt";
```

### image-webpack-loader

Imagemin 的优点分析

- 有很多定制选项
- 可以引入更多第三方优化插件，例如 pngquant
- 可以处理多种图片格式

Imagemin 的压缩原理  
pngquant:是一款 PNG 压缩器，通过将图像转换为具有 alpha 通道（通常比 24/32 位 PNG 文件小 60-80%）的更高效的 8 位 PNG 格式，可显著减少文件大小。  
pngcrush: 其主要目的是通过尝试不同的压缩级别和 PNG 过滤方法来降低 PNG IDAT 数据流的大小。  
optipng:其设计灵感来自于 pngcrush。optipng 可将图像文件重新压缩为更小尺寸，而不会丢失任何信息。 tinypng:也是将 24 位 png 文件转化为更小有索引的 8 位图片,同时所有非必要的 metadata 也会被剥离掉

```
npm i image-webpack-loader -D

rules: [{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    },
  ],
}]
```
### thread-loader
webpack 官方维护插件。每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给 worker 线程中。安装:`npm install --save-dev thread-loader`。注意，目前为止无法与`extract-css-chunks-webpack-plugin`一起使用。
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          {
            loader:"thread-loader",
            options:{
              workers:3 // cpu核数*2-1
            }
          },  // thread-loader要写在loader最前面
          // your expensive loader (e.g babel-loader)
        ]
      }
    ]
  }
}
```
worker pool中的loader使用上是有限制的，例如无法使用自定义 loader api，无法获取webpack 配置项

### 过时loader
1. happypack
## Plugins

插件用于 bundle 文件的优化，资源管理和环境变量注入。作用于整个构建过程,本质是一个 js 函数或者 js 类，通过监听 webpack 事件钩子触发，功能万恒后调用 webpack 提供的回调。

```
module.exports={
    plugins:[new HtmlWebpackPlugin({template:'./src/index.html'})]
}
```

### html-webpack-plugin

压缩 html 文件，production mode 模式会删除所有注释

### html-inline-css-webpack-plugin

内联 css 插件，和 MiniCssExtractPlugin 一起使用时，应该使用`html-inline-css-webpack-plugin`

```js
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin")
  .default;
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

### html-webpack-inline-source-plugin

功能：内联 js 注意：`html-webpack-inline-source-plugin`之前的版本有问题，至少使用`1.0.0-beta.2`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: ".(js)$",
      template: Path.resolve(__dirname, "../src/index.html"),
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ],
};
```

### [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin)

增强html-webpack-plugin中的script部署选项,比如：`async、preload、prefetch、defer、module`和自定义属性，还有内联

```js
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

// 注意一定要在HtmlWebpackPlugin之后引用
// inline 的name 和你 runtimeChunk 的 name保持一致
new ScriptExtHtmlWebpackPlugin({
  //`runtime` must same as runtimeChunk name. default is `runtime`
  inline: /runtime\..*\.js$/
});
```



### html-webpack-externals-plugin

基础库分离（vue、react）,将基础包通过 cdn 引入，不打入 bundle 中

### DefinePlugin

注入全局变量

```js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object"),
});
```

### terser-webpack-plugin
多进程/多实例：并行压缩
```js
const TerserPlugin=require('terser-webpack-plugin');
module.exports={
    optimization:{
        minimizer:[
            new TerserPlugin({
                parallel:true, // 多进程
                cache:true // 开缓存
            })
        ]
    }
}
```
### mini-css-extract-plugin

作用与 css 压缩

### css-minimizer-webpack-plugin

> https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#getting-started

内部使用 cssnano 去优化 css。

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      ...,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
};
```

### purgecss-webpack-plugin
> https://purgecss.com/plugins/webpack.html
简单介绍下purge的tree-shaking原理：  
查找HTML中的classes，它不会尝试解析你的 HTML，寻找类属性或者动态执行你的 JavaScript，它只是在整个文件中寻找任何与这个正则表达式匹配的字符串。  
这意味着避免 在代码中避免动态字符串拼接创建 classes 这点非常重要，否则 PurgeCSS 不会知道保留这些 classes。  
不要使用字符串连接来创建 class 名:
```html
<!-- bad -->
<div :class="text-{{ error ? 'red' : 'green' }}-600"></div>
<!-- good -->
<div :class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```
只要类名完全出现在模板中，PurgeCSS 就不会删除它。  
purge配置项中会提供path，来映射所有包含class类名的文件。例如，如果您的项目中有一个 JS 文件可以动态切换 HTML 中的某些类，那么您应该确保将该文件包含在这个列表中。  

参考：https://xxholly32.github.io/tailwind-learning/#/doc/controlling-file-size
### speed-measure-webpack-plugin
- 可以查看每个loder和插件的执行耗时
- 红色字体表示时间过长，黄色还可以，绿色是ok的
```
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap({   // 用smp.wrap包裹配置文件

})
```
### friendly-errors-webpack-plugin

```
plugins:[
    new FriendlyErrorsWebpackPlugin()
],
stats:'errors-only'  // 需要搭配这条命令使用
```
### clean-webpack-plugin

```
const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ].concat(htmlWebpackPlugins)
```

### 过时的 plugin

- CommonsChunkPlugin（removed in webpack4）
- optimize-css-assets-webpack-plugin
- extract-text-webpack-plugin

## 常用配置

> webpack官方最新配置（文档不一定是最新的）：https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json

### HTML

> 只介绍使用的 plugin 和 loader，详情查看具体 plugin 和 loader

- 压缩:[html-webpack-plugin](#html-webpack-plugin)
- 删除注释:[html-webpack-plugin](#html-webpack-plugin)

### JS

- 压缩：[uglifyjs-webpack-plugin](uglifyjs-webpack-plugin)
- 内联：[html-webpack-inline-source-plugin](#html-webpack-inline-source-plugin)
- 第三方库分离：[html-webpack-externals-plugin](#html-webpack-externals-plugin)
- 公共包抽离：公共脚本分离（例：utils 中的工具）利用 webpack 内置的 [optimization.splitChunks](https://webpack.docschina.org/plugins/split-chunks-plugin/) 进行公共脚本分离

### CSS

- js 中提取：[mini-css-extract-plugin](#mini-css-extract-plugin)
- 压缩:[css-minimizer-webpack-plugin](#css-minimizer-webpack-plugin)
- tree shaking: [purgecss-webpack-plugin](#purgecss-webpack-plugin)
- 内联：
  - [style-loader](#style-loader)
  - [html-inline-css-webpack-plugin](#html-inline-css-webpack-plugin)
- px2rem: [px2rem-loader](#px2rem-loader)
- 将 px 单位转换为视口单位(vw, vh, vmin, vmax) 安装：`npm install postcss-px-to-viewport --save-dev`  
  使用方法：配置`postcss.config.js`：

```js
"plugins": {
    "postcss-px-to-viewport": {
    viewportWidth: 750,  //视窗的宽度，对应的是我们设计稿的宽度，一般是750
    viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
    unitPrecision: 3,       // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    viewportUnit: 'vw',     // 指定需要转换成的视窗单位，建议使用vw
    selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
    minPixelValue: 1,       // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
    mediaQuery: false       // 允许在媒体查询中转换`px`
    },
  }
```

- 添加 css 前缀:[postcss-loader](#postcss-loader)
- 全局变量：[style-resources-loader](#style-resources-loader)
### file

- 内联：[url-loader](#url-loader)
- 字符串形式导入：[raw-loader](#raw-loader)
- 图片压缩：[image-webpack-loader](#image-webpack-loader)
- 清除打包文件：[clean-webpack-plugin](clean-webpack-plugin)

## 优化打包

### 从何开始？

1. 速度分析：使用 [speed-measure-webpack-plugin](speed-measure-webpack-plugin)
2. 体积分析：使用 webpack-bundle-analyzer

```
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports={
    plugin:[
        new BundleAnalyzerPlugin()
    ]
}
```

构建完成后会在 8888 端口展示

> [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

### 打包后代码的优化

1. scope hoisting
   
   > production 模式默认开启

打包后有大量函数闭包包裹代码，导致体积增大，运行代码时创建的函数作用域变多，内存开销变大。 import 会被转换成\_\_webopack_require  
通过 scope hoisting 插件可以解决这个问题，webpack mode 为 production 时默认开启，必须是 ES6 语法

```
plugins:[
    new webpack.optimize.ModuleConcatenationPlugin()
]
```

### RuntimeChunk

提取runtimeChunk会防止资源缓存失效，又因为runtimeChunk通常很小，不值得做一次单独的请求，所以可以把它内联到html中去，内联使用`script-ext-html-webpack-plugin`插件

### 固定moduleId和chunkId

webpack 内部维护了一个自增的 id，每个 module 都有一个 id。所以当增加或者删除 module 的时候，id 就会变化，导致其它文件虽然没有变化，但由于 id 被强占，只能自增或者自减，导致整个 id 的顺序都错乱了。虽然我们使用 [chunkhash] 作为输出名，但仍然是不够的。
因为 chunk 内部的每个 module 都有一个 id，webpack 默认使用递增的数字作为 `moduleId`。
如果引入了一个新文件或删掉一个文件，都可能会导致其它文件的 `moduleId` 发生改变，
那这样缓存失效了。

这时我们设置：

```js
// webpack4
optimization: {
   moduleIds: 'hash',
},
plugins:[
  // 参考vue-cli的config：https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-webpack-4/index.js#L92
	new webpack.NamedChunksPlugin(chunk => {
  	if (chunk.name) {
      return chunk.name
    }

    const hash = require('hash-sum')
    const joinedHash = hash(
      Array.from(chunk.modulesIterable, m => m.id).join('_')
    )
    return `chunk-` + joinedHash
	});
]

// webpack5
optimization: {
   moduleIds: 'deterministic',
   chunkIds: 'deterministic',
}
```



### 动态分割和动态 import

适用场景：

1. 抽离相同代码到一个共享块
2. 脚本懒加载，使用初始下载的代码更小（首屏优化）懒加载 js 脚本的方式：
3. conmmonJS:require.ensure
4. ES6:动态 import(目前还没有原生支持，需要 babel 转换)  
   如何使用动态 import?
5. 安装 babel 插件

```
npm i @babel/plugin-syntax-dynamic-import --save-dev
```

2. 配置.babelrc 文件

```
    "plugin":["@babel/plugin-syntax-dynamic-import"]
```

### 选择devtool
https://webpack.docschina.org/configuration/devtool/#devtool
**这么多模式，到底使用哪个？**

1. 开发环境推荐：`eval-cheap-module-source-map`
2. 生产环境推荐：`cheap-module-source-map`
3. 相关解释：

- 大部分情况我们调试并不关心列信息，而且就算 sourcemap 没有列，有些浏览器引擎（例如 v8） 也会给出列信息，所以我们使用 cheap 模式可以大幅提高 souremap 生成的效率。
- 使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用）。
- 使用 eval 方式可大幅提高持续构建效率，参考 webapck devtool 速度对比列表，这对经常需要边改边调的前端开发而言非常重要
- 直接将 sourceMap 放入打包后的文件，会明显增大文件的大小，不利于静态文件的快速加载；而外联.map 时，.map 文件只会在 F12 开启时进行下载（sourceMap 主要服务于调试），故推荐使用外联.map 的形式。

> 引用：[[webpack] devtool 配置对比](https://www.cnblogs.com/hhhyaaon/p/5657469.html)

### 构建速度
- 升级 webpack 和 node 版本:
  1. 使用 webpack4：v8 带来的优化（for of 替代 forEach、Map 和 Set 替代 Object、includes 替代 indexOf）。默认使用更快的 md4 hash 算法，wepacks AST 可以直接从 loader 传递给 AST，减少解析时间  
  2. 使用字符串方法替代正则表达式  

- 多进程/多实例构建: [thread-loader](thread-loader)
- 多进程/多实例并行压缩代码: [terser-webppack-plugin](terser-webppack-plugin)
- 进一步分包-预编译资源模块:
  - 使用 html-webpack-externals-plugin 的缺点：每一个基础包都要引入并配置，splitchunk 也会再次解析
  - 思路：将 reat\react-dom\redux\react-redux 基础包和业务基础包打包成一个文件方法：使用 DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用,一般需要单独创建 webpack.dll.js 配置文件

```
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: [
            'react',
            'react-dom'
        ]
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.join(__dirname, 'build/library'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.join(__dirname, 'build/library/[name].json')
        })
    ]
};
```

在 webpack 中引用

```
module.exports={
    plugins:[
        new webpack.DllReferencePlugin({
            manifest:require('./build/library/manifest.json')
        })
    ]
}
```

> 在 webpack4 中性能方面提升不大，但在分包作用中还是有用的

- 缓存
  - 目的：提升二次构建速度  
  - 缓存思路：
    - babel-loader 开启缓存
    - terser-webpack-plugin 开启缓存
    - 使用 cache-loader 或者 hard-source-webpack-plugin(推荐 hard-source-webpack-plugin，配置更简单)

- 缩小构建目标
  - 目的：尽可能的少构建模块  
  - 比如：babel-loader 不解析 node_modules （各种 exclude 和 include）减少文件搜索范围
    - 优化 resolve.modules 配置（减少模块搜索层级）
    - 优化 resolve.mainFields 配置
    - 优化 resolve.extensions 配置
    - 合理使用 alias

```js
modules.exports={
    resolve:{
        alias:{
            react:path.resolve(__dirname,'./node_modules/react/dist/react.min.js'),
        },
        modules:[path.resolve(__dirname,'node_modules')], // 限定在本项目目录上，不会再向上至全局查找
        extensions:['.js'], // 省略后缀
        mainFields:['main'] // 读取package.json的main字段，入口文件
    }
}
```
loader配置：思路主要是优化搜索时间、缩小文件搜索范围、减少不必要的编译工作:

```js
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有 文件，就不要写成/\jsx?$/，以提升正则表达式的性能
        test: /\.js$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ["babel-loader?cacheDirectory"],
        // 只对项目根目录下 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, "src"),
        // 使用resolve.alias把原导入路径映射成一个新的导入路径，减少耗时的递归解析操作
        alias: {
          react: path.resolve(
            __dirname,
            "./node_modules/react/dist/react.min.js"
          ),
        },
        // 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理
        noParse: "/jquery|lodash/",
      },
    ],
  },
};
```


### 构建体积 
- 动态 polyfill,使用 Polyfill Service:
  - 原理：识别 User Agent,下发不同的 Polyfill 通过插入`https://polyfill.io/v3/polyfill.min.js`来实现动态 polyfill。国内可以使用阿里的服务`http://polyfill.alicdn.com/polyfill.min.js`,
  - 使用方法：html中插入`<script src="https://polyfill.io/v3/polyfill.min.js"></script>`

### 更多

1. [Webpack Guidebook](https://tsejx.github.io/webpack-guidebook/best-practice/optimization/collection)

## 其他

### 打包组件库和基础库

1. 在生成开发版文件和 min 版文件时，配置 mode:'none'来避免打包后文件都为压缩状态的情况

```js
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: "none",
  entry: {
    "large-number": "./src/index.js", // 测试环境代码
    "large-number.min": "./src/index.js", // 线上环境代码
  },
  output: {
    filename: "[name].js", // 在webpack5中，此设置是默认的
    library: "largeNumber",
    libraryTarget: "umd", // 用于多环境引入
    libraryExport: "default", // 去除引用时额外的.default
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // TerserPlugin插件支持压缩ES6代码
        include: /\.min\.js$/, // 匹配只压缩.min.js文件
      }),
    ],
  },
};
```
### 冒烟测试

1. 判断是否构建成功
2. 检测是否有内容输出：

- 是否有 js、css 等静态资源文件
- 是否有 HTML 文件
### 构建配置管理的可选方案

1. 通过多个配置文件管理不同环境的构建，webpack --config 参数进行控制
2. 将构建配置设计成一个库
3. 抽成一个工具进行管理，比如：create-react-app
4. 将所有的配置放在一个文件，通过--env 参数控制分支选择
## webpack 升级

### to v5 from v4

- cli 命令
  1. 不再支持`--colors`参数
- 运行时
  1. webpack 5 不再引入 Node.js 变量的 polyfill，导致 process 未定义

## 问题

### 如何防止static中的文件被打包？

不要在代码中使用`require`或者`import`来引入`static`目录中的资源文件，应该使用`http`请求来获取

```
axios.get('/static/data.json').then(res=>{
	// 获取资源
})
```

