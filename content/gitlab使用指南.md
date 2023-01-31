---
title: gitlab使用指南
category: 分享
tags:
  - gitlab
date: 2021-06-28
vssue-title: gitlab使用指南
---

## 文档

官方线上的文档不会展示所有版本，如果需要特定版本可以下载离线的docker镜像查看，https://docs.gitlab.com/archives/

中文文档：https://docs.gitlab.cn/

### 查看历史重要改动

https://gitlab-com.gitlab.io/cs-tools/gitlab-cs-tools/what-is-new-since/?tab=features

## 问题

### 发布gitlab npm报错？

1. 首先公司使用的是12.9版本，而gitlab是在至少`13.3`才免费提供`packages`给企业版
2. `13.5`版本之前，想要`npm publish`，必须手动编写`.npmrc`文件，添加发布地址,参考官方issue：https://gitlab.com/gitlab-org/gitlab/-/issues/220985
3. [I have the exact same issue, if the project is more than 1 group level deep (foor/bar/test) it will fail.](https://gitlab.com/gitlab-org/gitlab/-/issues/12936)
4. 启用包功能后，默认情况下，所有新项目都可以使用存储库。要为现有项目启用它，用户必须在项目的设置中明确这样做:http://localhost:4000/13.5/ee/administration/packages/index.html#enabling-the-packages-feature
5. 我测试的是gitlab 13.5，至少在这个版本要想发布npm包，scope必须是顶级目录才行，无法在group下的project中发布包,这个问题在13.10中修复，https://gitlab.com/gitlab-org/gitlab/-/issues/215043

### 如何解除不能强制推送master的权限问题？

项目设置中选择`仓库>Protected Branches>master分支上选择Unprotect`,推送完毕后再开启protect即可。

## scoped package

### 设置企业级别scoped npm包

`gitlab package`区分`project-level`和`instance-level`,想要`publish`只能使用project-level`，所以下面只写项目级的使用方式

### gitlab设置

gitlab为私有库时需要设置以下之一的访问权限:

1. ` personal access token`
2. `deploy token`
3. `CI job token`
4. npm包name必须格式为`@scope/package-name`

设置代码：

```sh
// 设置registry
npm config set @xxx:registry https://git.xxx.io/api/v4/projects/<your_project_id>/packages/npm/
// 设置密钥
npm config set -- '//git.xxx.io/api/v4/projects/<your_project_id>/packages/npm/:_authToken' "<your_token>"

```

这里推荐使用deploy token，因为这个是跟库相关联的，以后走人了也方便交接。

### 下载npm包

```
// gitlab下载npm包需要设置scoped registry 
npm config set @foo:registry https://gitlab.example.com/api/v4/projects/<your_project_id>/packages/npm/

// 设置personal access token 或者 deploy token以提供下载能力
npm config set -- '//git.yeeyun.io/api/v4/projects/94/packages/npm/:_authToken' "hzxxMeZYNsCcyZ5hk3EF" -g

// 如果需要上传包，那么还需要设置
npm config set '//gitlab.com/api/v4/projects/<your_project_id>/packages/npm/:_authToken' "<your_token>"
```



