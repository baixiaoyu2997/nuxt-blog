---
title: npm工具包整理
category: 分享
tags:
  - npm
date: 2020-05-11
vssue-title: npm工具包整理
---

## UI

### ora

包用于显示加载中的效果，类似于前端页面的 loading 效果

### didyoumean

通过用户输入猜测可能的选项

### commander

commander 是一款重量轻，表现力和强大的命令行框架，提供了用户命令行输入和参数解析强大功能。

### inquirer

inquirer 为交互式命令行工具,比如在列表中进行选择

### Enquirer（推荐）

vue3在使用。时尚的、用户友好的交互式命令行工具

### chalk

chalk 是用于修改控制台字符串的样式，包括字体样式（加粗），颜色以及背景颜色等。
### progress

显示进度条
## 运行时

### lerna

Lerna 是优化和管理 JS 多包项目的利器

### current-device

操作系统判断、横屏竖屏判断、设备类型判断（手机或者平板）

### validate-npm-package-name

给我一个字符串，我告诉你它是否是有效的 npm 包名称。

### moment

时间对象处理

### semver

semver 是 语义化版本（Semantic Versioning）规范 的一个实现，目前是由 npm 的团队维护，实现了版本和版本范围的解析、计算、比较。

### minimist

命令行参数解析

### globby

通配符匹配文件名

### fs-extra

对`fs`的扩展

### cross-env

这是一款运行跨平台设置和使用环境变量的脚本。

### download-git-repo

download-git-repo 是用于 从 GitHub, GitLab, Bitbucket 下载一个 git 仓库

### execa

execa 是可以调用 shell 和本地外部程序的 javascript 封装。会启动子进程执行，支持多操作系统，包括 windows，如果父进程退出，则生成的全部子进程都被杀死。它是在 Node.js 内置的 child_process.exec 基础上进行了提升，比如更好地支持 windows 平台，以及提供 Promise 的接口等等

### nodemon

在编写调试 Node.js 项目，修改代码后，需要频繁的手动 close 掉，然后再重新启动，非常繁琐。现在，我们可以使用 nodemon 这个工具，它的作用是监听代码文件的变动，当代码改变之后，自动重启。

### std-env

检测当前系统环境

### 日期

#### Day.js

中文网址：https://dayjs.gitee.io/zh-CN/，Moment不再维护，更推荐使用轻量级的Day进行替换，

### 计算

#### Big.js

官网：http://mikemcl.github.io/big.js/，防止计算精度出错的问题

## 代码质量

### commitlint

git 提交信息规范与验证

### husky

git hook，husky 能够防止不规范代码被 commit、push、merge 等等。

```
// package.json
"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "**/*.js": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
```

### lint-staged

是一个在 git 暂存文件上运行 linters 的工具。如果node目录被修改，则可能导致无法识别node。需要进入`.git/hooks/pre-commit`文件中修改`PATH`，例：

```js
export PATH="$PATH:/Users/l.rain/.volta/bin/"
```



### standard-version

standard-version 是一款遵循语义化版本（ semver）和 commit message 标准规范 的版本和 changlog 自动化工具

## 代码优化

### svgo

压缩svg

## 其他

### ngrok

将本地网络暴露给公网

### **[chokidar](https://github.com/paulmillr/chokidar)**

监听文件变更

### **[cjs-to-es6](https://github.com/nolanlawson/cjs-to-es6)**

转换cjs到esm语法