---
title: vscode插件编写
category: 工具
tags:
- vscode
date: 2019-06-13
vssue-title: vscode插件编写
---
## 你的第一个扩展
1. 安装Yeoman和VS Code Extension Generator：
`npm install -g yo generator-code`
1. 命令行输入`yo code`运行脚手架，并进行自定义:  
![20190613161441.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20190613161441.png)  
此时的目录结构如下：  
![20190614103801.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20190614103801.png)  
1. 此时在新项目中按`F5`会打开调试模式，在新弹窗中输入命令`Hello World`,会弹出弹窗，这是初始项目自带的命令  
<video src="https://code.visualstudio.com/api/get-started/your-first-extension/launch.mp4"
controls="controls" autoplay="autoplay" loop="loop" width="700"></video>
## 开发插件(未完成)
以上只是演示官方demo,现在开始走一下开发流程，首先让我们修改一下提示信息：
- 在`extension.js`中修改`Hello World`为`Hello VS Code`
- 在debugger窗口中按`ctrl+r`刷新页面,或者运行`reload window`
- 再次输入指令`Hello World`  

应该看到如下效果：  
<video src="https://code.visualstudio.com/api/get-started/your-first-extension/reload.mp4"
controls="controls" autoplay="autoplay" loop="loop" width="700"></video>

### extension.js
```js
// 模块'vscode'包含VS Code扩展API
const vscode = require('vscode');

// 您的扩展将在第一次执行命令时被激活
// 当你的扩展被激活时，触发activated方法,activated方法只执行一次
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "git-watch" is now active!');

	// 该指令被定义在package.json文件contributes属性中
	// 现在使用registerCommand注册命令
	// registerCommand的第一个参数必须与package.json中的command匹配
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello VS Code');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// 当你的扩展停用时会调用该方法
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

```
### package.json
```json 
{
	"name": "git-watch",
	"displayName": "git-watch",
	"description": "",
	"version": "0.0.1",
	"engines": {
		"vscode": "^1.35.0"
	},
	"categories": [
		"Other"
	],
	"activationEvents": [
		"onCommand:extension.helloWorld"
	],
	"main": "./extension.js",
	"contributes": {
		"commands": [{
            "command": "extension.helloWorld",
			"title": "Hello World"
		}]
	},
	"scripts": {
		"postinstall": "node ./node_modules/vscode/bin/install",
		"test": "node ./node_modules/vscode/bin/test"
	},
	"devDependencies": {
		"typescript": "^3.3.1",
		"vscode": "^1.1.28",
		"eslint": "^5.13.0",
		"@types/node": "^10.12.21",
		"@types/mocha": "^2.2.42"
	}
}

```
### 文章

1. [vscode插件开发](https://hellogithub2014.github.io/2019/06/09/vscode-plugin-development/)

## 扩展包合集

安装了`Yeoman`和`VS Code Extension Generator`之后，输入`yo code`,选择`New Extension Pack`,然后有一个选项是扩展包基于当前安装的所有扩展，选择该选项。

项目生成后，查看`package.json`文件，其中：

```json
"extensionPack": [
        "publisherid.extensionName"
    ]
```

包含的扩展需要在`extensionPack`添加`发布者.扩展名`

> 提示：可以在vscode插件市场的url末尾看到该插件的`publisherid.extensionName`

### 更新

扩展包安装之后会展示所有的扩展和该合集pack，删除合集中的包，更新该包之后，被删除包会自动被删掉。

### 文章

1. [How do I make an Extension Pack?](https://code.visualstudio.com/blogs/2017/03/07/extension-pack-roundup)
2. [Extension Packs](https://code.visualstudio.com/api/references/extension-manifest#extension-packs)

## 打包发布

1. 首先安装vsce cli:`npm i vsce -g`
2. `vsce login [publishername] `，需要[personal access token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)
3. `vsce publish`
4. 发布之后扩展不会立刻在market上显示，需要等待[系统审核](https://marketplace.visualstudio.com/manage/publishers/)

