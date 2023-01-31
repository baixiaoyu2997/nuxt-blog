---
title: npm和yarn
category: 工具
tags:
  - npm
date: 2019-05-24
vssue-title: npm和yarn
---

## npm

> [你所需要的 npm 知识储备都在这了](https://juejin.im/post/5d08d3d3f265da1b7e103a4d)

### 局部安装

在项目中局部安装包会在`node_modules\.bin`目录下创建软连接

### ssh或者http安装包

```
git+ssh://git@git.mydomain.com/Username/Repository#{branch|tag}
```

```
git+https://git@git.mydomain.com/Username/Repository#{branch|tag}
```

http和deploy token

```
git+https://<token-name>:<token>@gitlab.com/Username/Repository#{branch|tag}
```

### 设置淘宝镜像

```sh
 npm config set registry https://registry.npm.taobao.org
 npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```

可以通过 nrm 来管理 registry 地址

### 为scoped package设置 registry

`npm config set @yy:registry=https://registry.yeeyun.io/repository/npm-hosted/`

#### gitlab设置

gitlab为私有库时需要设置:

1. ` personal access token`
2. `deploy token`
3. `CI job token`
4. npm包name必须格式为`@scope/package-name`

gitlab发布npm包：

区分`project-level`和`instance-level`,由于公司使用的是`project-level`所以下面只写项目级的使用方式：

```sh
npm config set @foo:registry https://gitlab.example.com/api/v4/projects/<your_project_id>/packages/npm/
```

gitlab下载npm包：

```
npm config set @scoped:registry https://gitlab.example.com/api/v4/packages/npm/
```

### 登录私有库

`npm login --registry=http://localhost:8081/repository/npm-hosted/`

### 恢复镜像地址

```sh
npm config set registry https://registry.npmjs.org
```

### npm cli

#### init



#### link

npm link 用来在本地项目和本地 npm 模块之间建立连接，可以在本地进行模块测试

具体用法：

1. 项目和模块在同一个目录下，可以使用相对路径

- `npm link ../module`

2. 项目和模块不在同一个目录下

- cd 到模块目录，`npm link`，进行全局 link
- cd 到项目目录，`npm link 模块名(package.json中的name)`

3. 解除 link

- 解除项目和模块 link，项目目录下，`npm unlink 模块名`
- 解除模块全局 link，模块目录下，`npm unlink 模块名`

#### list

查看本地安装的所有包，如果要仅获取顶层的软件包可以添加参数：`--depth=0`  
也可以通过指定名称来获取特定软件包的版本：`npm list cowsay`,这也适用于查看软件包的依赖包

#### view

可以通过`npm view cowsay version`查看该包的最新版本，想要查看该包的所有版本，使用`npm view <package> versions`

#### install

可以使用`npm i <package>@<version>`来安装指定版本。  
在开发环境，应该添加`--production`参数来避免安装开发依赖。该命令遵循lock文件

> 在 npm5 之后，可以不用输入--save

#### uninstall

卸载软件包，如果添加`--save`或`-S`标志，会移除`package.json`中的引用，同理也可以使用`-D`

#### outdated

使用`npm outdated`查看可以更新的包。

注意，如果使用`taobao`镜像报错，那么需要切换回源镜像

#### update

update 会升级本地包版本，会修改 lock 文件中的次版本和补丁版本，而不会更新主版本。

#### ci

类似于`npm i`，但是`ci`更适合部署环境，不会更改`lock	`文件

#### publish

npm publish时始终忽略`.gitignore`文件，具体查看：https://docs.npmjs.com/cli/v8/commands/npm-publish#files-included-in-package

#### --prefix

指定npm指令执行的目录，例如`npm --prefix packages/components run dev ` ，这时package.json指向的也是该目录。

还可以指定`package.json`的位置:`npm --prefix ./server install ./ProjectName/package.json`

> 引用：https://www.codenong.com/44467600/ 

### npx
>npm 5.2版本可用

npx是一个非常强大的命令，可以使用node构建并通过npm仓库发布的代码。  
- npx解决了调用本地项目命令时，需要手输`bin`文件夹的痛苦
- npx的另一个重要的特性是，无需安装命令即可运行命令。
- npx执行的包如果之前不存在，那么在下载运行完之后会被删除
- npx可以直接从 URL 运行任意代码片段，例如：`npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32`

### 升级版本

- 升级补丁版本号：npm version patch
- 升级小版本号：npm version minor
- 升级大版本号：npm version major

### 生产环境

在生产环境中，应该使用`npm i --production`忽略开发依赖,只安装基本依赖

### 发布 npm 包

1. 创建 github 项目
2. 使用`npm publish`发布项目,
   
   > 需要注意的是 registry 必须使用的是 npm 官方的才可以。如果第一次发布 scoped 包则需要先注册对应的组织（填写组织名称的时候不需要添加@）
3. 升级版本包可以使用`npm version patch|minor|major`

```
npm version <update_type>
<update_type>为：
patch 0.0.*
major *.0.0
minor 1.*.0
```

4. 修改 npm 初始化时的信息

```
> npm set init.author.email "example-user@example.com"
> npm set init.author.name "example_user"
> npm set init.license "MIT"
```

5. 关于 scoped/unscoped 有的包名(@babel/cli)会带有`@`,这个`@scopename`就是 scoped 的限定，发布的时候需要加上一下参数：

```
npm publish -access publish
```

或者不用命令行的形式，通过在`package.json`中添加：

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

Scope 用以关联一系列的包，每个用户和组织都有自己的 Scope，可以在登陆的时候指定 scope 名称：

```
npm login --registry=http://reg.example.com --scope=@myco
```

也可以在 config 中配置指定源的 scope:

```
npm config set @myco:registry http://reg.example.com
```

6. 撤销发布撤销整个包

```
npm unpublish --force your-package-name
```

仅撤销某个版本

```
npm unpublish <package-name>@<version>
```

### 钩子

npm scripts 指令有 pre 和 post 两个钩子，运行顺序为 npm run prebuild && npm run build && npm run postbuild，这在你需要为命令提供参数时是非常有用的，可以把参数放到命令中，其他的操作交给 pre 或者 post. ​​​​

### lock 文件

npm7.0 版本中支持`yarn.lock`文件

### 文章

1. 前端组件库本地开发调试的自动化流程实现：https://hijiangtao.github.io/2020/05/21/A-Better-Library-Development-Workflow/?utm_source=tuicool&utm_medium=referral

## yarn

### 设置淘宝镜像

```sh
yarn config set registry https://registry.npm.taobao.org -g
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ -g
```

可以通过 yrm 来管理 registry 地址

### 恢复镜像地址

```sh
yarn config set registry https://registry.yarnpkg.com
```

## pakage-lock.json 和 yarn.lock

如果在一个项目中我们同时使用了`npm`和`yarn`(不建议这样做)，`npm`和`yarn`安装的包都会被记录在`package.json`中。但是他们会有各自的`lock`文件。如果你的项目中同时有`pakage-lock.json`和`yarn.lock`，你可以选择提交其中的任意的一个。如果你希望他人通过`npm`来进行依赖包的安装，你应该选择提交`pakage-lock.json`；如果你希望他人通过`yarn`来进行依赖包的安装，你应该提交`yarn.lock`。如果你希望他人自行决定是使用`npm`还是`yarn`，你应该提交`pakage-lock.json`和`yarn.lock`这两个文件，但是这有可能造成不同步的问题。  
`yarn`从`1.7.0`版本开始，`yarn import`命令可以利用`pakage-lock.json`来生成依赖包，详见官方文档。

### 使用工具转换 lock 文件

1. `npm install -g synp`
1. yarn.lock 转换成 package-lock.json `synp --source-file /path/to/yarn.lock`
1. package-lock.json 转换成 yarn.lock `synp --source-file /path/to/package-lock.json`
   
   > 参考：https://www.jianshu.com/p/9ae748598f1a

### 生产环境

`yarn install --production[=true|false]`

> 如果 NODE_ENV 环境变量设为 production，Yarn 将不安装任何列于 devDependencies 的包。 使用此标志指示 Yarn 忽略 NODE_ENV 并用它取代“生产”与否的状态。

## nvm

1. nvm 在 mac 上遇到 npm 不是有效指令的问题，原因是 default 版本为未知

- 解决办法：`nvm alias default <version> `，如果没有选择使用的版本，还需要选择版本`nvm use <version>`

1. `nvm use`指令不能持久化，在下一次打开时，nvm 版本又会变回去，可以使用`nvm alias default <version>`完成持久化，如果无效，可以删除 alias`nvm unalias default`,再重新添加。如果是在vscode终端打开，可能需要重新启动vscode才能生效。

### 卸载nvm

1. 移除nvm内容：

   ```sh
   cd ~
   rm -rf .nvm
   ```

2. 移除掉~/.profile, ~/.bash_profile, ~/.zshrc, ~/.bashrc文件中关于nvm的配置

3. 命令行输入nvm、npm，分别提示command not found，删除成功

## nvm-widnows

### 不能下载 npm

最近遇到了一个坑，nvm 安装新得 node 环境时不能自动安装 npm，在 [github issues](https://github.com/coreybutler/nvm-windows/issues/476#issuecomment-533693062)上找到了解决办法。  
原因：  
npm 迁移仓库导致地址改变，不能正常下载，但是 nvm-windows 作者一直没有修复这个 bug,目前只能手动解决  
解决方法：

1. 手动下载最新 npm，解压后把文件移动到`nvm\版本号\node_modules\npm\`
2. 然后在该目录下进入`bin`,复制`npm`和`npm.cmd`到`nvm\版本号\`
3. 切换到这个版本`nvm use 版本号`

## Volta

相较于nvm，Volta拥有更快的速度，并且跨平台。它可以让我们轻松地在项目中锁定 node，npm 和 yarn 的版本。你只需在安装完 Volta 后，在项目的根目录中执行 volta pin 命令，那么无论您当前使用的 node 或 npm（yarn）版本是什么，volta 都会自动切换为您指定的版本。

当您项目的 CLI 工具与全局 CLI 工具不一致时，Volta 可以做到在项目根目录下自动识别，切换到项目指定的版本，这一切都是由 Volta 默默做到的，开发者不必关心任何事情。

> 如果某些情况无法识别`node`，在`zshrc`中添加`export PATH=${PATH}:/Users/l.rain/.volta/bin/node`

### 安装

```sh
curl https://get.volta.sh | bash
```

该命令会自动执行`volta setup`来设置shell配置

### 命令行

#### install

可以使用该命令安装指定版本node、npm、yarn

#### pin

固定node、npm、yarn版本号。例如：`volta pin node@12`

### workspaces

monorepo项目中使用时需要配置根package.json：

```json
{
    "volta": {
      "node": "12.16.1",
      "yarn": "1.22.4"
    }
 }
```

然后其他package的package.json继承这个配置就可以了：

```json
// packages/cli/package.json
  {
    "volta": {
      "extends": "../../package.json"
    }
  }
```



