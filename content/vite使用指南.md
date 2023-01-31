---
title: vite使用指南
category: 分享
tags:
- vite
date: 2021-06-05
vssue-title: vite使用指南

---

## 学习进度

https://cn.vitejs.dev/guide/features.html#build-optimizations

## 介绍

vite有几个比较重要的概念：

### 预构建

使用esbuild执行预构建，速度非常快。在服务器已经启动之后，如果遇到一个新的依赖关系导入，而这个依赖关系还没有在缓存中，Vite 将重新运行依赖构建进程并重新加载页面。

#### 为什么需要与构建？

1. 兼容性：因为vite对待所有js文件都当作es模块处理，所以需要先将cjs和umd转换为`es module`
2. 性能：Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。例如：当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器同时发出 600 多个 HTTP 请求！通过预构建 `lodash-es` 成为一个模块，我们就只需要一个 HTTP 请求了！

### 缓存

#### 文件缓存

Vite 会将预构建的依赖缓存到 `node_modules/.vite`，以下有变动时会重新构建：

1. `package.json` 中的 `dependencies` 列表
2. 包管理器的 lockfile，例如 `package-lock.json`, `yarn.lock`，或者 `pnpm-lock.yaml`
3. 可能在 `vite.config.js` 相关字段中配置过的

想重新构建可以在启动命令行后输入`--force`，或者手动删除`node_modules/.vite`

#### 浏览器缓存

解析后的依赖请求会以 HTTP 头 `max-age=31536000,immutable` 强缓存，以提高在开发时的页面重载性能。一旦被缓存，这些请求将永远不会再到达开发服务器

## 功能

### css

内置支持`@import`内联和变基、PostCSS、 CSS Modules。支持CSS 预处理器,`.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件都是内置支持的，需要手动安装相应依赖，例如：

```sh
npm install -D sass

# .less
npm install -D less

# .styl and .stylus
npm install -D stylus
```

### index.html

vite默认以当前目录为根目录作为服务启动，如果想切换位置，使用`vite serve dist`修改根目录，注意dist前不能有`/`

## 静态资源

vite默认支持的资源加载类型为：https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts#L49

## 配置文件

### 环境变量

vite提供loadEnv插件加载环境变量,只有`VITE_`开头的变量才会被暴露给客户端

## config

### resolve.dedupe

如果你在你的应用程序中有相同依赖的副本（比如 monorepos），请使用此选项强制 Vite 始终将列出的依赖项解析为同一副本（从项目根目录）。

### build.lib

目前lib不支持多入口模式,已有相关pr等待合并：https://github.com/vitejs/vite/pull/7047

### build.rollupOptions

#### external 

把导入包转成外部依赖

```js
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

### optimizeDeps.include

不在`node_modules`中的包vite默认不会预构建，通过添加这个强制预构建，底层是使用`@rollup/plugin-commonjs`这个插件实现的

## 插件

### vite-plugin-singlefile

内联js和css文件

### vite-plugin-imp

自动引入组件库样式文件

### vite-plugin-html

压缩html文件

### vite-plugin-inspect

检查文件在使用不同vite插件之后的变化

## 迁移指南

1. 从webpack迁移到vite是一个很繁琐的事情，好在有`wp2vite`这个包自动帮我们实现这些步骤

> 迁移参考：
>
> 1. https://cloud.tencent.com/developer/article/1819625

2. [vue-cli-plugin-vite](https://github.com/IndexXuan/vue-cli-plugin-vite)：vue-cli项目迁移到vite

## 最佳实践

1. 最好不要使用`@vitejs/plugin-legacy`,打包后文件大小会翻倍。
1. 为某些包跳过不必要的`pre-bundled`阶段，使用`optimizeDeps.exclude`

## 踩坑

1. 第三方库如果未遵守严格模式，则在必须使用`type=module`的vite中会报错。
2. 使用`vue-class-component`的项目中，如果使用了`@Component`装饰属性。build时会报错，提示不认识`@`符号。

## 问题

### vite运行dev报错：then it is likely the case that a known bug in npm v7 hascorrupted your package-lock.json file

这是`esbuild`的bug，针对`npm`版本大于7的解决办法：`node node_modules/esbuild/install.js`

问题链接：https://github.com/evanw/esbuild/issues/462

### 如何删除build后的hashname？

参考：https://github.com/vitejs/vite/issues/378#issuecomment-789366197

但是，资源assetFileNames无效，需要升级到`vite@2.5.0-beta.1`或更高，链接：https://github.com/vitejs/vite/issues/4354#issuecomment-895231516

```js
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,		// 作用于入口包装文件
        chunkFileNames: `assets/[name].js`,   // 作用于js文件
        assetFileNames: `assets/[name].[ext]` // 作用于css、图片等静态资源
      }
    }
  }
})
```

### 如何防止定义的web component组件被vue解析？

配置vite：

```js
export default defineConfig({
  plugins:[
    vue({
      template:{
        compilerOptions:{
          // vue将跳过my-vue-element解析
          isCustomElement:(tag)=>tag === "my-vue-element"
        }
      }
    })
  ]
})
```

### 语法转义?

默认vite只做语法转义，不包含任何polyfill。使用[@vitejs/plugin-legacy ](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Ftree%2Fmain%2Fpackages%2Fplugin-legacy%23polyfill-specifiers)或者[polyfill.io](https://link.juejin.cn/?target=https%3A%2F%2Fpolyfill.io%2Fv3%2F) 

## rollup

### 特性

1. v2.74开始支持删除函数中无用的默认参数
2. 长期缓存（long-term cache）不如webpack，不支持contenthash，原因是修改a.123123.js文件，打包后变成a.abcdef.js文件，导致引用a.123123.js文件的b.js文件hash也会修改

### input

#### 单入口

`input:'main.js'`

#### 多入口

多入口写法为对象格式：

```js
import path from "path";
import fs from "fs";

const inputObj = {};

// 读取该目录下所有文件
fs.readdirSync("./templates/").forEach((file) => {
  if (path.extname(file) === ".html") {
    inputObj[file.substring(0, file.length - 5)] = "templates/" + file;
  }
});

// ======
input: inputObj
```



### output

#### entryFileNames

修改入口包裹js文件的名称和位置

#### chunkFileNames

修改打包后js文件的名称和位置

#### assetFileNames

修改css、图片等资源打包后的名称和位置

#### paths

允许外部引入写入import，比如

```js
// app.js
import { selectAll } from 'd3';
selectAll('p').style('color', 'purple');
// ...

// rollup.config.js
export default {
  input: 'app.js',
  external: ['d3'],
  output: {
    file: 'bundle.js',
    format: 'amd',
    paths: {
      d3: 'https://d3js.org/d3.v4.min'
    }
  }
};

// bundle.js
define(['https://d3js.org/d3.v4.min'], function (d3) {
  d3.selectAll('p').style('color', 'purple');
  // ...
});

```

#### preferConst

使用const替换var

### treeshake

#### moduleSideEffects

该模块是否有副作用，默认为true

### plugins

#### rollup-plugin-copy

通过`hook`可以更改`copy`时机

```js
 copy({
          targets: [
            { src: "dist/static/js/entry/*.js", dest: "static/js/entry" },
            { src: "dist/static/css/entry/*.css", dest: "static/css/entry" },
            { src: "dist/templates/*.html", dest: "templates" },
          ],
          hook: "writeBundle", 
        }),
```

####  rollup-plugin-visualizer

打包分析工具

### 问题

1. 如何使用长期缓存，类似与webpack的`contenthash`？

   目前无法实现，参考：https://github.com/vitejs/vite/issues/6773和https://github.com/rollup/rollup/issues/4426

   将在rollup3中实现该功能
