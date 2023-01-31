---
title: package.json使用指南
category: 分享
tags:
  - npm
date: 2020-10-22
vssue-title: package.json使用指南
---

## 介绍

主要属性介绍：

- name:包名称，必须少于 214 个字符，不能包含空格，只能包含小写字母、连字符`-`或下划线`_`,这是因为当软件包在 npm 上发布时，它会基于此属性获得自己的 URL。
- main:引用时，指定默认位置。
- private：设置 true 可以防止意外地发不到 npm
- engines：设置了该包使用了哪个版本的 node
- browserslist：用于告知要支持哪些浏览器
- version:版本号`x.x.x`，这些数字的含义是，金修复缺陷的版本是补丁版本，引入向后兼容的更改的版本是次版本，具有重大更改的是主版本。
- licennpmse：软件包的许可证
- keywords：关键字，便于搜索用

### package.json官方字段

[https://docs.npmjs.com/files/package.json](https://link.segmentfault.com/?enc=lNTI2P2gpyZUsPwGoCoRCQ%3D%3D.oPIVEtDyA%2BHrFUojrGINjSBTpdF%2FcoIdfx%2Bhd6e3cDaoSLLu%2B38pCLvSs%2BvrLS%2Bt)

### package.json非官方字段

https://segmentfault.com/a/1190000016365409

### 软件包版本

语法使用了 semver（语义版本控制），具有以下规则：

- `~`: 如果写入的是 〜0.13.0，则只更新补丁版本：即 0.13.1 可以，但 0.14.0 不可以。
- `^`: 如果写入的是 ^0.13.0，则要更新补丁版本和次版本：即 0.13.1、0.14.0、依此类推。
- `*`: 如果写入的是 \*，则表示接受所有的更新，包括主版本升级。
- `>`: 接受高于指定版本的任何版本。
- `>=`: 接受等于或高于指定版本的任何版本。
- `<=`: 接受等于或低于指定版本的任何版本。
- `<`: 接受低于指定版本的任何版本。

还有其他规则：

- 无符号：仅接收指定的特定版本。
- latest：使用可用的最新版本。

还可以在范围内组合以上大部分内容，例如：1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

## 入口

### main

定义了 `npm` 包的入口文件，browser 环境和 node 环境均可使用

#### bin

指定包指令

### module

非官方字段。定义 `npm` 包的 ESM 规范的入口文件，browser 环境和 node 环境均可使用

### exports

Node.js 12+ 支持它作为“main”的替代方案，可以支持定义子路径导出和条件导出，同时封装内部未导出的模块。路径必须使用"./"开头

```json
{
  "exports": {
    ".": {
      "import": "./dist/mymodule.mjs"
    }
  }
}
```



### resolutions

强行指定某个包的依赖包版本

```js
"resolutions": {
  "foo/bar": "1.0.0" // 这里的 key"foo/bar"表示foo的直接依赖bar，把版本区间重写成1.0.0。
  "foo/**/bar": "1.0.0" // 不是直接依赖时，可以使用这种写法
  "bar": "1.0.0" // 所有依赖这个包都指向这个版本
}
```



### browser

定义 `npm` 包在 browser 环境下的入口文件

### 优先级

**`browser` = `browser+mjs` > `module` > `browser+cjs` > `main`**

### 总结

如果 `npm` 包导出的是 ESM 规范的包，使用 module

如果 `npm` 包只在 web 端使用，并且严禁在 server 端使用，使用 browser。

如果 `npm` 包只在 server 端使用，使用 main

如果 `npm` 包在 web 端和  server 端都允许使用，使用 browser 和 main

其他更加复杂的情况，如`npm` 包需要提供 commonJS 与 ESM 等多个规范的多个代码文件，请参考上述使用场景或流程图

> 参考：https://juejin.cn/post/6844903862977953806

## files

files是一个文件数组，描述了将软件包作为依赖项安装时要包括的条目。如果在数组里面声明了一个文件夹，那也会包含文件夹中的文件。某些特殊文件和目录也被包括或排除在外，无论它们是否存在于文件数组中。

```
以下文件无论是否设置，总是包含：
*   `package.json`
*   `README`
*   `CHANGES`/`CHANGELOG`/`HISTORY`
*   `LICENSE`/`LICENCE`
*   `NOTICE`
*   The file in the “main” field

以下文件总是被忽略：
*   `.git`
*   `CVS`
*   `.svn`
*   `.hg`
*   `.lock-wscript`
*   `.wafpickle-N`
*   `.*.swp`
*   `.DS_Store`
*   `._*`
*   `npm-debug.log`
*   `.npmrc`
*   `node_modules`
*   `config.gypi`
*   `*.orig`
*   `package-lock.json`(use shrinkwrap instead)
```



##  dependencies

### Git URLs as Dependencies

Examples：

```
git+ssh://git@github.com:npm/cli.git#v1.0.27
git+ssh://git@github.com:npm/cli#semver:^5.0
git+https://isaacs@github.com/npm/cli.git
git://github.com/npm/cli.git#v1.0.27
```

实例：

```
{
  ...
  "dependencies": {
    "remember-scroll": "git+ssh://git@github.com:fengxianqi/remember-scroll.git#v0.1.1",
  },
  "devDependencies": {
    ...
  }
}
```

## publishConfig

设置推送时候的地址：`"publishConfig": {    "registry": "https://registry.npmjs.com/"}`

## type, typing(非官方字段)

就像 `main` 字段一样，定义一个针对 `TypeScript` 的入口文件。指定该字段后，vscode会自动引入类型提示。

