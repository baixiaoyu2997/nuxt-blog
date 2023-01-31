---
title: vscode使用指南
category: 工具
tags:
- vscode
date: 2019-05-31
vssue-title: vscode使用指南
---
## 设置

1. 启用括号高亮：`editor.bracketPairColorization.enabled:true`,不再需要`Bracket Pair Colorizer 2`插件

## 命令

### 指定文件扩展名为特定语言

`F1>change language mode`

## snippets代码段

1. 如果想要智能提示中代码段排在最上面，需要设置`"editor.snippetSuggestions": "top"`
1. 输入特殊字符时需要使用`\\`转义
1. 换行`\n`
1. tab键制表符：`\t`
1. 如果想光标选中字符则`${1:test}`
## git
### autostash
设置git pull之前先stash，pull之后再pop掉。开启方法：`设置>扩展>git>勾选Auto Stash`
> 注意，需求git版本在`2.9`以上，在内置终端执行`git pull`是无效的，只能通过vscode的命令才能生效
### 代码段变量
[Variables](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variables)
## 命令行工具
### 用vscode新窗口打开当前文件夹
```sh
code .
```
### 用当前vscode窗口打开文件夹
```sh
code . -r
```
### 配置假名路径的智能提示和跳转
把`jsconfig.json`文件放到根目录下，记得添加到`.gitignore`上
```
// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 类型提示

### vscode引入类型提示的几种方式

1. vscode程序自带npm包`Visual Studio Code.app>Contents>Resources>app>extensions>node_modules>typescript>lib`包含一些
1. npm包通过设置`types`或者`typings`，来告知vscode类型声明文件`d.ts`的位置，这样就可以提供类型提示了。
1. 通过把类型文件与引入文件放在同一个路径中，并且文件名相同时，vscode也会添加类型提示。
1. 安装`@types/*`格式的包，则会自动加载类型提示

### js项目生成d.ts文件

> 参考：https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html

`package.json`添加`typescript`,然后添加tsconfig

```json
{
  // Change this to match your project
  "include": ["src/**/*"],
  "compilerOptions": {
    // Tells TypeScript to read JS files, as
    // normally they are ignored as source files
    "allowJs": true,
    // Generate d.ts files
    "declaration": true,
    // This compiler run should
    // only output d.ts files
    "emitDeclarationOnly": true,
    // Types should go into this directory.
    // Removing this would place the .d.ts files
    // next to the .js files
    "outDir": "dist",
    // go to js file when using IDE functions like
    // "Go to Definition" in VSCode
    "declarationMap": true
  }
}
```

运行命令 `tsc`进行编译

### 类型文件加载顺序

1. `types`
2. `main`
3. `./index.d.ts`

## 类型检查

vscode中可以通过添加`// @ts-check`注释来开启类型检查，除了这个方法，还可以通过配置全局开启，只需要勾选`Implicit Project Config: Check JS`,`jsoncofng.json`和`tsconfig.json`中的配置会替代此配置