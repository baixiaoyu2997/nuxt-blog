---
title: code-push使用指南
category: 工具
tags:
- code-push
date: 2020-04-22
vssue-title: code-push使用指南
---
## code-push是什么?
CodePush 是一个微软开发的云服务器。
## 为什么使用code-push？
支持Apache Cordova和React Native移动应用的热更新功能,本文只涉及cordova

## Appcenter
1. Cordova codepush 借助appcenter平台，首先要下载appcenter-cli
```
npm install -g appcenter-cli
```
2. 成功安装appcenter-cli后，执行`appcenter login`命令为您的App Center帐户详细信息配置CLI。   
1. 在[appcenter](https://appcenter.ms/)中创建应用 
1. 创建deployment key
```
appcenter codepush deployment add -a <groupName>/<appname> Staging //测试环境
appcenter codepush deployment add -a <groupName>/<appname> Production //生产环境
``` 
## appcenter-cli(非必要)
以下内容是appcenter-cli的扩展，并不是使用code-push的必要条件，不想看的可以直接查看`将CodePush添加到你的程序`  
### 创建应用
```
appcenter apps create -d <appDisplayName> -o <operatingSystem>  -p <platform> 
// 例如：
appcenter apps create -d MyApp-Android -o Android -p React-Native
appcenter apps create -d MyApp-iOS -o iOS -p Cordova

```
### 添加deployments(部署)
默认appcenter没有deployments,需要手动创建，没有数量限制。
```
appcenter codepush deployment add -a <ownerName>/<appName> Staging
appcenter codepush deployment add -a <ownerName>/<appName> Production
```
### 删除修改deployment
```
// 删除
appcenter codepush deployment remove -a <ownerName>/<appName> <deploymentName>
// 修改
appcenter codepush deployment rename -a <ownerName>/<appName> <deploymentName> <newDeploymentName>
```
### 查看应用已有的deployments
```
appcenter codepush deployment list -a <ownerName>/<appName>
```
尾部追加`-k`,可以查看所有的key
```
appcenter codepush deployment list -a <ownerName>/<appName> -k
```
### 修改应用名称
```
appcenter apps update -n <newName> -a <ownerName>/<appName>
```
该应用程序的名称仅旨在从管理方面进行识。由于更新查询是通过部署密钥进行的，因此它实际上不会影响正在运行的应用程序。
### 删除应用
```
appcenter apps delete -a <ownerName>/<appName>
```
### 查看所有应用
```
appcenter apps list
```
## 将CodePush添加到你的程序
需要:
- cordova5.0.0+
- Android (cordova-android 4.0.0+) 
- iOS (cordova-ios 3.9.0+) 

查看当前应用platform版本：
```
cordova platform ls
```
安装`cordova-plugin-code-push`插件:
```
cordova plugin add cordova-plugin-code-push@latest
```
设置`config.xml`文件：
```xml
<platform name="android">
    <preference name="CodePushDeploymentKey" value="YOUR-ANDROID-DEPLOYMENT-KEY" />
</platform>
```
为确保您的应用可以访问CodePush服务器,在index.html文件中添加`meta`标签如下：
```diff
// 官网提供的csp规则在调用第三方接口时会被禁止
- <meta http-equiv="Content-Security-Policy" content="default-src https://codepush.appcenter.ms 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *" />
// 推荐使用该规则
+ <meta http-equiv="Content-Security-Policy" content="default-src https://codepush.azurewebsites.net 'self' data: gap: cdvfile: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline' https: http: wss: ws:; style-src 'self' 'unsafe-inline'; img-src * filesystem: cdvfile: data:; media-src * blob:">
```
### 插件使用
最简单的方式，是在`deviceready`事件中添加：
```js
codePush.sync(); //静默更新
```
当然，更新的时机可以根据自己需求进行选择
## 发布更新
发布指令集成了`cordova prepare`操作，更新本地文件后就可以直接运行`release-cordova`
```
// 更新之后客户端会在下次启动时进行更新检测，这取决于你检测更新的时机。 
appcenter codepush release-cordova -a <ownerName>/MyApp -d Production  
```
```
//发布应用
appcenter code-push release-cordova -a <ownerName>/MyApp [options]
 Options参数:
[-t|--target-binary-version <targetBinaryVersion>]
[--is-release-build-type]
[-b|--build]
[-r|--rollout <rolloutPercentage>]
[--disable-duplicate-release-error]
[-k|--private-key-path <privateKeyPath>]
[-m|--mandatory] // 指定此版本是否为强制更新版本,从服务端下载完代码,会立即自动重启app
[-x|--disabled]
[--description <描述>]
[-d|--deployment-name <指定部署的类型>]
[-a|--app <ownerName>/<appName>]
[--disable-telemetry]
[-v|--version]
  注意:一般生产环境的app是压缩过的,所以在发布正式环境热更新之前,先压缩代码
```
> 客户端只能发现和下载deployment中最新的50条
## 查看发布历史
```
appcenter codepush deployment history -a <ownerName>/<appName> <deploymentName>
```
## 清除发布历史
此操作不可逆，不建议使用在生产环境
```
appcenter codepush deployment clear -a <ownerName>/<appName> <deploymentName>
```
## codePush API
> 其他API未记录，可以前往[API Reference](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cordova#api-reference)查看  

|属性|说明|参数|
|-|-|-|
|getCurrentPackage|获取当前版本，会返回俩种值，一种是null，在用户没有热更新过，或者安装了新客户端时出现，还有一种是`LocalPackage`| onSuccess,onError |
|checkForUpdate|询问CodePush服务是否已配置的应用程序部署具有可用的更新| onSuccess,onError |
> checkForUpdate onSuccess接受参数`remotePackage`,返回的具体数据 [参考](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cordova#properties-1)
## 问题
### 无法发起更新请求？
corodva创建的模板自身是带一个`http-equiv="Content-Security-Policy"`的meta标签的：
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
        
```
我在其之下添加了：
```html
<meta http-equiv="Content-Security-Policy" content="default-src https://codepush.appcenter.ms 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *" />
```
发现这样是无效的，把模板自带的那个去掉后可以正常使用。

也有可能是因为微软服务器不稳定导致的，可以添加`vconsole`在移动端应用查看网络调用返回
## 参考
1. [CodePush](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
1. [Cordova Client SDK](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cordova#getting-started)
1. [Releasing CodePush updates using the App Center CLI](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli)
1. [Cordova Appcenter 应用整理](http://peakcool.cn/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB/2019/04/25/cordova-with-appcenter.html)