---
title: window使用指南
category: 分享      
tags:
- window
date: 2022-04-25
vssue-title: window使用指南
---

# win11

## 子系统

安装的子系统位置在`C:\Users\L.Rain\AppData\Local\Packages\TheDebianProject.DebianGNULinux_76v4gfsz19hv4`

## 终端

> 注意: 使用此方法的终端，最好是把项目放到子系统中，否则性能会有问题

1. 安装Debian子系统：https://code.visualstudio.com/docs/remote/wsl-tutorial
2. 在cmd中设置使用root用户登录子系统：`debian config --default-user root`
3. 配置zsh:https://juejin.cn/post/7002413257906454564#comment
3. git,虽然vscode提供[共享git凭证功能](Sharing Git credentials between Windows and WSL)，但是只能用于`https`,目前解决办法，子系统用于window相同的用户名和邮箱创建一个`key`,然后删除，把window上的私钥和公钥复制过来，名称一定要和子系统创建的相同
3. vscode,扩展需要单独为`wsl`再安装一遍
3. 更多vscode关于wsl教程，https://code.visualstudio.com/docs/remote/wsl#_known-limitations
4. 一些可以共用的文件或配置可以使用符号链接来同步，例`mkdir ~/.configln -s /mnt/c/Users//.config/starship.toml ~/.config/starship.toml`

## 声音放大

[Equalizer APO](https://www.windowsdigitals.com/how-to-boost-volume-above-100-in-windows-11/)