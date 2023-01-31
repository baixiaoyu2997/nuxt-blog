---
title: github使用指南
category: 分享
tags:
- github
date: 2020-05-08
vssue-title: github使用指南
---
## 模版仓库（Template repository）
如果想以某仓库为模版快速创建一个新仓库，那么可以在这个仓库的`setting>options`中勾选`Template repository`
![github使用指南_2020-05-08-10-31-34](https://blog-pic.oss-cn-beijing.aliyuncs.com/github使用指南_2020-05-08-10-31-34.png)
在代码（Code）里面找到按钮"Use this template"，点击后会进入生成新仓库的"Create a new repository from..."页面。
![github使用指南_2020-05-08-10-31-59](https://blog-pic.oss-cn-beijing.aliyuncs.com/github使用指南_2020-05-08-10-31-59.png)
在"Create a new repository..."页面输入新的`Repository`名称，点击按钮"Create repository from template"即可创建。
![github使用指南_2020-05-08-10-32-54](https://blog-pic.oss-cn-beijing.aliyuncs.com/github使用指南_2020-05-08-10-32-54.png)
注意，每个选中了"Template repository"的`repository`，在其URL的尾部加上`/generate`然后跳转，就会直接进入"Create a new repository from..."页面，就像点击了按钮"Use this template"。  

这个`Template repository`的功能避免了创建源项目代码库分支的`fork`，即使不是开发者也能在所有项目中重用代码。这使得资源类的东西，比如文档啊，模板什么的，分享变得非常方便。
## 组织
1. 要想下载组织下的仓库，那么需要配置密钥，方法：`组织>项目>settings>Deploy keys>Add deploy key`
## github packages
创建包和下载包都需要先创建一个带有读写权限的`token`
然后进行登录验证`npm login --registry=https://npm.pkg.github.com`  
登录过程中输入password时，输入的不是github的密码，而是你创建的token  
上传和下载时`npm`的`registry`必须为`https://npm.pkg.github.com`
### 组织邀请成员
> 如果其他人想要下载package，必须加入该包的组织：

1. 先用组织拥有者账号邀请成员：组织>setting>developer settings>github apps>邀请成员
1. 成员本地npm设置包源为github：`https://npm.pkg.github.com/`,输入`password`时，值为组织拥有者的`token`
1. 成员接受邀请后，本地登录：`npm login --registry=https://npm.pkg.github.com`

完成以上步骤后组织成员就可以下载`github packages`了
## workflows



## API

### 头像

添加额外的`?s=xx`可以设置图片大小

1. `https://avatars.githubusercontent.com/<username> `
2. `https://avatars.githubusercontent.com/u/<userid>`

## 问题

### 如何在已推送的仓库中添加LICENSE？
项目主页选中`create new file`,在文件名中输入`LICENSE`,这时右侧会出现`choose a license template`按钮，然后选择一个LICENSE

### 如何为github加速？

https://juejin.cn/post/7090190514028937230?share_token=3e5c0591-151c-4cf4-95b2-03cfb8fa9d50

#### linux解决方案

https://github.com/521xueweihan/GitHub520