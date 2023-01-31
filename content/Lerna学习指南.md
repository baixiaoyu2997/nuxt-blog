---
title: Lerna学习指南
category: 分享
tags:
- lerna
date: 2020-05-06
vssue-title: Lerna学习指南
---
## Lerna是什么？
Lerna是一个工具，它优化了使用git和npm管理多包存储库的工作流（这里会涉及到`monorepo`的概念）。`vue`,`babel`,`react`等都在用。
## lerna的优点？
- 方便管理子项目包依赖
- 发布便捷，自动更改版本号、打tag并上传
## 工作的两种模式
### Fixed/Locked mode (default)
vue,babel都是用这种，在`publish`的时候,会在`lerna.json`文件里面`"version": "0.1.5"`,依据这个号，进行增加，只选择一次，其他有改动的包自动更新版本号。
### Independent mode
`lerna init --independent`初始化项目。 `lerna.json`文件里面`"version": "independent"`,每次`publish`时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改。
![Lerna学习指南_2020-05-06-21-32-36](https://blog-pic.oss-cn-beijing.aliyuncs.com/Lerna学习指南_2020-05-06-21-32-36.png)

## Start init
```SH
$ npm install lerna -g
$ mkdir lerna-gp && cd $_
$ lerna init # 用的默认的固定模式，vue babel等都是这个

    # Add packages
$ cd packages
$ mkdir daybyday gpnode gpwebpack
...
#分别进入三个目录初始化成包
$ cd daybyday
$ npm init -y 
$ cd ../gpnode
$ npm init -y
$ cd ../gpwebpack
$ npm init -y

```
### 项目结构
```sh
➜  lerna-gp git:(master) ✗ tree
.
├── lerna.json
├── package.json
└── packages
    ├── daybyday
    │   └── package.json
    ├── gpnode
    │   └── package.json
    └── gpwebpack
        └── package.json

4 directories, 5 files

```
## Set up
### Set up git + npm
```sh
✗ git remote add origin git@gitlab.yourSite.com:gaopo/lerna-gp.git

#查看是否登录
✗ npm whoami
gp0320

#没有则登录 
npm login 
# 输入username password 
Logged in as gp0320 on https://registry.npmjs.org/. # succeed

```
### Set up yarn的workspaces模式
> 默认是npm下载包, 而且每个子package都有自己的node_modules，通过这样设置后，只有顶层有一个node_modules，lerna默认是通过`bootstrap`来关联子包依赖，但是使用yarn的workspaces效果更好，所以通常做法是通过yarn workspaces+lerna使用。
- 修改顶层 `package.json and lerna.json`
```json
# package.json 文件加入
 "private": true,
  "workspaces": [
    "packages/*"
  ],

# lerna.json 文件加入
"useWorkspaces": true,
"npmClient": "yarn",
```
`yarn`安装后，不会更新根目录的`package.json`,而是更新`yarn.lock`文件,并且所有子包的依赖项会安装到根目录下的`node_modules`,所有子包的`node_modules`只有`.bin`目录下的指令，指令的链接位置也是指到根目录下的`node_modules/xxx`
## Lerna Script
### lerna init
创建一个新的Lerna库或将现有库升级到Lerna的当前版本。
### lerna create < name > [loc]
> 在`packages`目录下创建一个包，name包名（必填、string），loc 包位置（string）
### Examples
```
# 根目录的package.json 
 "workspaces": [
    "packages/*",
    "packages/@gp0320/*"
  ],
  
# 创建一个包gpnote默认放在 workspaces[0]所指位置
lerna create gpnote 
# 在packages下创建test包，与直接使用create test的区别是，package.json的name会加上scoped
lerna create @scoped/test 
# 创建一个包gpnote指定放在 packages/@gp0320文件夹下，注意必须在workspaces先写入packages/@gp0320，看上面
lerna create gpnote packages/@gp0320

```
### lerna add [@version] [--dev] [--exact]
> 增加本地或者远程`package`做为当前项目`packages`里面的依赖，会添加到各个子包的`package.json`中
- `--dev` devDependencies 替代 `dependencies`
- `--exact` 安装准确版本，就是安装的包版本前面不带`^`, Eg: `"^2.20.0" ➜ "2.20.0"`
### Examples
```sh
# 添加module-1包到 带有'prefix-'前缀的文件夹
lerna add module-1 packages/prefix-*

# 安装 module-1 到 module-2
lerna add module-1 --scope=module-2

# 安装 module-1 到 module-2 ，并且修改为devDependencies
lerna add module-1 --scope=module-2 --dev

# 为所有子包安装module-1包，除了它自己
lerna add module-1

# 为所有包安装babel-core
lerna add babel-core

```
### lerna bootstrap
等同于 `lerna link` + `yarn install`。默认是npm i,因为我们指定过yarn，所以只需要运行`yarn`会把所有包的依赖安装到根`node_modules`.
### lerna list
列出所有的包，如果与你文夹里面的不符，进入那个包运行`yarn init -y`解决
```sh
➜  lerna-gp git:(master) ✗ lerna list
lerna notice cli v3.14.1
daybyday
gpnode
gpnote
gpwebpack
lerna success found 4 packages
```
### lerna import
导入本地已经存在的包,只能导入主分支，不能指定分支，尽量使用`--flatten`，否则会因为历史记录中有冲突导致代码导入不全，所有参数：

- `--flatten` 处理合并冲突
- `--dest` 指定引入包的目录
- `--preserve-commit` 保持引入项目原有的提交者信息


![Lerna学习指南_2020-05-06-21-41-55](https://blog-pic.oss-cn-beijing.aliyuncs.com/Lerna学习指南_2020-05-06-21-41-55.png)

#### 导入远程仓库

`lerna import`只会导入本地的项目，并且不支持导入项目的分支和标签。使用`tomono`来解决这个问题

### lerna run

```sh
lerna run < script > -- [..args] # 运行所有包里面的有这个script的命令
$ lerna run --scope my-component test
```
### lerna exec
运行任意命令在每个包
```sh
$ lerna exec -- < command > [..args] # runs the command in all packages
$ lerna exec -- rm -rf ./node_modules
$ lerna exec -- protractor conf.js
lerna exec --scope my-component -- ls -la
```
### lerna link
项目包建立软链，类似npm link，导入的时候还是使用`npm link @xxx`
### lerna clean
删除所有包的node_modules目录
![Lerna学习指南_2020-05-06-21-43-25](https://blog-pic.oss-cn-beijing.aliyuncs.com/Lerna学习指南_2020-05-06-21-43-25.png)
### lerna changed
列出下次发版lerna publish 要更新的包。  
原理： 需要先git add,git commit 提交。 然后内部会运行`git diff --name-only v`版本号，搜集改动的包，就是下次要发布的。并不是网上人说的所有包都是同一个版全发布。
```sh
➜  lerna-repo git:(master) ✗ lerna changed                                     
info cli using local version of lerna
lerna notice cli v3.14.1
lerna info Looking for changed packages since v0.1.4
daybyday #只改过这一个 那下次publish将只上传这一个
lerna success found 1 package ready to publish

```
### lerna publish
> [更多关于publish的用法](https://github.com/lerna/lerna/tree/master/commands/publish)

会打tag，上传git,上传npm。 如果你的包名是带scope的例如："name": "@gp0320/gpwebpack", 那需要在packages.json添加
```json
// 添加到相应的子包上
 "publishConfig": {
    "access": "public"
  },
```
```sh
lerna publish 
lerna info current version 0.1.4
#这句意思是查找从v0.1.4到现在改动过的包
lerna info Looking for changed packages since v0.1.4 

? Select a new version (currently 0.1.4) Patch (0.1.5)

Changes:
 - daybyday: 0.1.3 => 0.1.5 #只改动过一个

...

Successfully published:
 - daybyday@0.1.5
lerna success published 1 package

```
`publish`还有两个参数
```
lerna publish from-git   // 明确发布在当前提交中标记的软件包
lerna publish from-package // 明确发布npm远程库中没有的最新版本的软件包
```
## 本地npm仓库

使用`Verdaccio`可以创建本地npm仓库。

下载：`npm install --global verdaccio`

启动：`verdaccio`

即可通过 localhost:4837 访问您的本地代理 npm 仓库，别忘了在您的项目根目录创建 .npmrc 文件，并在文件中将 npm 仓库地址改写为您的本地代理地址：`registry="http://localhost:4873/"`

这样每次`publish`时，就可以发布到本地npm仓库中。

## 高级命令

1. `--concurrency <number>`:参数可以使 Lerna 利用计算机上的多个核心，并发运行，从而提升构建速度；
2. `--scope '@mono/{pkg1,pkg2}'`：`--scope` 参数可以指定 Lerna 命令的运行环境，通过使用该参数，Lerna 将不再是一把梭的在所有仓库中执行命令，而是可以精准地在我们所指定的仓库中执行命令，并且还支持示例中的模版语法
3. `--stream`：该参数可使我们查看 Lerna 运行时的命令执行信息；

## lerna.json

`lerna.json`的可配置项包括

```
{
  "version": "1.1.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```
## monorepo

### 问题

1. 幻影依赖？
2. 源码引用和产物引用混着来？

## 问题

### package内部包互相依赖如何引用？

同样是使用`lerna add @yy/nuxt-template --scope=@yy/cli `添加

## 参考

1. [Lerna 中文教程详解](https://juejin.im/post/5ced1609e51d455d850d3a6c)
2. [如何利用monorepo策略管理代码？](https://mp.weixin.qq.com/s/ZP2IigNVSIZKGuYxNYOYgw)