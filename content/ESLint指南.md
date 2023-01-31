---
title: ESLint指南
category: 工具
tags:
- ESLint
date: 2020-05-29
vssue-title: ESLint指南
---
## 介绍

更多：https://segmentfault.com/a/1190000040160724

## extends

extend 提供的是 eslint 现有规则的一系列预设。  
### recommanded
recommanded相当于继承了plugin并且对其进行了规则配置：
```
{
  "extends": ["plugin:xxx/recommended"] // eslint-plugin-xxx + eslint-config-xxx
}
```
> 前提是已经安装了相关依赖
## plugins
plugins提供了除 eslint 规定之外额外的规则。plugins只提供规则，但是不会设置eslint配置。
添加plugin时，去掉前缀`eslint-plugin-*`,例如：
```
"plugins": [
    // 这里安装了 eslint-plugin-import
    "import"
]
```
## rules
rules是eslint规则配置，可以使用以下值之一：
- `off`或`0`：关闭规则
- `warn`或者`1`：将规则视为一个警告（不会影响退出码）
- `error`或者`2`：将规则视为一个错误 (退出码为1)
## 配置
### 配置级联和优先级
eslint会根据每个文件夹下的配置文件进行校验，所以`eslint`是支持不同文件夹对应不同配置的，具体内容查看[官网](https://eslint.bootcss.com/docs/user-guide/configuring#configuration-cascading-and-hierarchy)
## 代码中禁用eslint
可以使用vscode的智能提示`eslint-disable-next-line`来禁用此语句下的错误，如果该语句有多条错误，那么可以用`,分隔规则：
```
// eslint-disable-next-line import/no-mutable-exports,prefer-const
export let _axios = {}
```
## 最佳实践
- 在你项目根目录下的 `package.json` 文件或者 `.eslintrc.*` 文件里的 `eslintConfig` 字段下设置 `"root": true`。`ESLint` 一旦发现配置文件中有 `"root": true`，它就会停止在父级目录中寻找。
- 规则 :
```js
"complexity": [ // 代码圈层复杂度,最大复杂度如果超过10则应提醒，超过20则报错
  "error",
  {
    "max": 15
  }
],
"max-depth": "error", // 最多嵌套，默认4
"max-nested-callbacks": "error", // 最多嵌套callback个数，默认10
"max-lines": [ // 一个文件最多代码行数，默认300
  "error",
  {
    "max": 600,
    "skipComments": true,
    "skipBlankLines": true
  }
],
"max-lines-per-function": [ // 函数最多行数,默认50
  "error",
  {
    "skipComments": true,
    "skipBlankLines": true
  }
]
```



## 问题
### 设置.eslintignore无效？
VSCode无法识别每个项目下的.eslintignore文件所致，它默认只会识别根目录下这个文件。可以把忽略文件放到根目录下。
> 引用：https://juejin.im/post/6844904135733706760
### 如何查看当前eslint使用的规则？

eslint不能查看项目使用所有规则，但是可以查看对某个文件使用的规则。

例如：` npx eslint --print-config ./pages/deorderOld.vue`

## 参考
1. [2018年学习计划（eslint篇）](https://liaoyongfu.github.io/2018/10/11/javascript/2018%E5%B9%B4%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92%EF%BC%88eslint%E7%AF%87%EF%BC%89/)