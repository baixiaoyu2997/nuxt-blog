---
title: git笔记
category: 工具
tags:
  - git
date: 2019-02-22
vssue-title: git笔记
---

> [git 更多小技巧可以点此查看](https://github.com/521xueweihan/git-tips#%E5%B1%95%E7%A4%BA%E5%BF%BD%E7%95%A5%E7%9A%84%E6%96%87%E4%BB%B6)

## 操作

### 分支

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git branch |  | 查看本地分支列表 |
| git branch | 分支名 | 创建分支 |
| git branch | -a 分支名 | 查询远程分支 |
| git brabch | -d 分支名 | 删除本地分支 |
| git brabch | -D 分支名 | 强行删除本地分支 |
| git branch | -v | 查看所有分支的最后一次操作 |
| git branch | -vv | 查看当前分支 |
| git branch | --no-merged | 查看未与当前分支合并的分支 |
| git branch | --merged | 查看别的分支和当前分支合并过的分支 |
| git branch | -m [new-brance-name]|修改本地分支名称  |
| git branch | --merged >/tmp/merged-branches && \<br/>  vi /tmp/merged-branches && xargs git branch -d </tmp/merged-branches | 删除远程分支不存在的本地分支,[参考](https://stackoverflow.com/a/28464339) |
| git merge | 分支名 | 合并分支到当前分支上 |
| git checkout |  | 切换分支,或者使用switch |
| git checkout | -b | 创建并切换到新建的分支上 |
| git checkout | -b 分支名 origin/分支名 | 创建远程分支到本地 |
| git push origin | :分支名称 | 删除远程分支 |
| git push        | origin --delete [branchname] | 删除远处仓库分支 |
| git switch | - | 切换分支,快速切换回上一个分支 |


### 克隆

| 指令      | 参数      | 介绍                                                 |
| --------- | --------- | ---------------------------------------------------- |
| git clone | xxx       | 克隆项目                                             |
|           | --depth=1 | 只克隆最后一次提交状态的项目，而不是整个文件夹的记录 |
### 获取

| 指令      | 参数        | 介绍                                         |
| --------- | ----------- | -------------------------------------------- |
| git fetch | --unshallow | 适用于git clone --depth 时，拉取整个项目记录 |
|           |             |                                              |

### 变基

| 指令       | 参数       | 介绍                                           |
| ---------- | ---------- | ---------------------------------------------- |
| git rebase | [分支]     | 变基                                           |
| git rebase | --abort    | 取消变基                                       |
| git rebase | --continue | 当变基遇到冲突时，解决冲突后输入该指令完成变基 |

### 暂存

> 没有在 git 版本控制中的文件，是不能被 git stash 存起来的。可以先 add，再 stash

| 指令      | 参数  | 介绍                                                         |
| --------- | ----- | ------------------------------------------------------------ |
| git stash |       | 暂存当前修改，不包括：1.在工作目录中新的文件 (untracked files) 2.被忽略的文件(ignored files) |
| git stash | -u    | 暂存当前修改,包括未追踪文件                                  |
| git stash | -a    | 暂存当前所有修改，包括忽略的文件                             |
| git stash | apply | 恢复最近的一次暂存，追加 –index 参数可以保留状态             |
| git stash | pop   | 恢复暂存并删除暂存记录                                       |
| git stash | list  | 查看暂存列表                                                 |
| git stash | drop  | 暂存名(例：stash@{0}) 移除某次暂存,只能删除单个stash         |
| git stash | clear | 清除所有暂存                                                 |

### 回退

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git reset |  | 回退 |
| git reset | --hard HEAD^ | 强制回退到上一个版本 |
| git reset | --hard HEAD^ 然后git push -f| 远程分支强制回退到上一个版本，前提是没有人更新此次提交 |
| git reset | --soft HEAD~ | 撤销上次提交 |
| git reset | HEAD^^^ | 回退到倒数第 3 个版本 |
| git reset | HEAD ～ 100 | 回退到倒数第 100 个版本 |
| git reset | --hard ahdhs1(commit_id) | 回退到某个版本 |
| git checkout | -- file 撤销修改的文件 | 如果文件加入到了暂存区，则回退到暂存区的，如果文件加入到了版本库，则还原至加入版本库之后的状态 |
| git checkout | hash 值 [文件名] | 只是将这个文件“重置”回旧版本而不是还原一个可能包含许多其他内容的提交 |
| git reset | HEAD file | 撤回暂存区的文件修改到工作区 |
| git reset --hard && git clean -df |  | 工作目录和缓存区回到最近一次 commit 的状态 |

### 还原

> 1. git revert是用一次新的commit来回滚之前的commit，git reset是直接删除指定的commit。
> 2. 在回滚这一操作上看，效果差不多。但是在日后继续merge以前的老版本时有区别。因为git revert是用一次逆向的commit“中和”之前的提交，因此日后合并老的branch时，导致这部分改变不会再次出现，但是git reset是之间把某些commit在某个branch上删除，因而和老的branch再次merge时，这些被回滚的commit应该还会被引入。
> 3. git reset 是把HEAD向后移动了一下，而git revert是HEAD继续前进，只是新的commit的内容和要revert的内容正好相反，能够抵消要被revert的内容。

### 撤销
| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git restore | path | 撤销工作区的操作，如果路径已被删除，则恢复之前状态 |
|  | path --staged\| -S | 把暂存区的文件撤销到工作区 |
|  | path --staged --worktree\|-W | 同时使用把暂存区文件撤销到没修改之前 |
|  | path --staged --source\|-s=<tree> | 从提交历史中撤销文件，`也可以为-s@`，表示`HEAD` |


### 导出

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git archive | -o update.zip HEAD \$(git diff oldID newID --name-only --diff-filter=d) | 导出打包两个版本的变动文件，--diff-filter=d 为过滤掉被删除的文件，否则压缩文件报错 |

### 合并

| 指令            | 参数      | 介绍                                 |
| --------------- | --------- | ------------------------------------ |
| git cherry-pick | commit id | 把另一个分支的 commit 合并到当前分支 |

### 提交

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git commit | -am"message" | add+commit 简写方式,该指令不会提交未追踪的文件 |
| git commit | --amend --no-edit | 这个命令会将文件加入上次提交，并且重新使用旧的提交信息，用于快速修正错误 |
| git commit | --amend -m "xxx" | 修改最后一次 commit 信息。还可以使用git commit --amend => c(进入 vim 编辑器) => ZZ(保存并退出) |
| git push | -u origin master -f | 强制 push 到远程 |
| git subtree push | --prefix=【www】 origin 【gh-pages】 | 将某一文件夹提交到 github 某分支 |
|  |  |  |

### 远程仓库

| 指令       | 参数                              | 介绍                    |
| ---------- | --------------------------------- | ----------------------- |
| git remote |                                   | 查看当前的远程仓库      |
| git remote | set-url [name] [url]              | 修改远程仓库地址        |
| git remote | rm [name]                         | 删除远程仓库            |
| git remote | rm [name] remote add [name] [url] | 删除远程仓库,再添加仓库 |
| git remote | prune origin | 删除远程分支已经删除的分支 |

### 拉取

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git pull | --autostash --rebase | 拉取前暂存所有修改，成功后还原，需要`git2.9`以上，关于 autostash 更多[信息](https://stackoverflow.com/a/30209750/13082513) |

### 标签

| 指令     | 参数                          | 介绍                      |
| -------- | ----------------------------- | ------------------------- |
| git tag  | -a v1.x.x -m "信息"           | 添加附注标签              |
| git tag  | v1.x.x                        | 添加轻量标签              |
| git tag  | -d [tagName]                  | 删除本地标签              |
| git push | origin --delete tag [tagName] | 删除远程标签              |
| git push | origin [tagName]              | 添加 tag 到远程服务器     |
| git push | origin --tags                 | 添加所有 tag 到远程服务器 |

### 状态

| 指令       | 参数 | 介绍                       |
| ---------- | ---- | -------------------------- |
| git status | -    | 返回是否有变动             |
| git status | -s   | 返回是否有变动，以精简形式 |

### 日志

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git log | - | 查看提交历史,参考[官网](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2) |
| git reflog | - | 参考日志，并不是仓库的一部分，它单独储存在本地,不包含`autostash`记录 |

### config

| 指令 | 参数 | 介绍 |
| --- | --- | --- |
| git config | --list | 查看配置文件 |
|  |  |  |
### 其他

#### 提交一个空的文件夹

在空文件夹下添加`.gitkeep`文件，内容：

```
# Ignore everything in this directory
*
# Except this file !.gitkeep
```

并且在`.gitignore`中添加

```
文件夹/*
!文件夹/.gitkeep
```

- `git clean <file-name> -f  `: 删除没有被追踪的文件,`file-name`可选，如果不指定，删除所有。
- `git clean -n` 是一次 clean 的演习, 告诉你哪些文件会被删除. 记住他不会真正的删除文件, 只是一个提醒
- `git clean <directory-name> -df` 删除当前目录下没有被 track 过的文件和文件夹，`directory-name`可选。

#### 获取最近一次提交的id？

`git rev-parse HEAD`,如果想获取简写的commit，就使用`git rev-parse --short HEAD`

#### 获取最近一次提交的message？

```
git log -1 --pretty=%s
```

## 最佳实践

1. 非公共分支使用`rebase`代替`merge`保持历史记录整洁

2. 合并非公共分支前使用`squash`,这样可以在其他分支中快速pick，同时保证历史记录整洁

3. 后端没有部署的分支，不要立马合并到dev，这样以后有紧急需求的时候部署dev会导致代码超前部署，应先在特性分支`rebase dev`再部署测试环境。等到可以部署时再合并到dev分支

4. push之前先`git pull`,这里有一条指令可以快速实现这个功能：`m="" && git pull --autostash --rebase && git --no-pager diff --check && git add . && git commit -m ${m} && git push`或者添加`pre-push`钩子，这样团队的人都可以使用

   ```sh
   #!/bin/sh
   git pull --autostash --rebase;
   git --no-pager diff --check
   if [ $? -ne 0 ]; then
     echo "⚠️  请先解决冲突再push"
     exit 1
   fi
   ```

5. 开启vscode `auto fetch` ,`git.rebaseWhenSync`,`git.autoStash`

## 问题

### 如何处理git不识别大小写问题？

`git config core.ignorecase false`

### 不同分支使用不同远程地址？

https://yugasun.com/post/git-config-for-different-remote.html
### 如何同步git fork的仓库？

首先添加原仓库地址到本地的远程仓库

```
git remote add upstream git@github.com:nuxt/framework.git
```

同步原仓库代码

```js
git fetch upstream
```

最后合并或者变基

```
git merge upstream/main
// 或者
git rebase upstream/main
```

### ignore无效？

参考https://stackoverflow.com/questions/7075923/resync-git-repo-with-new-gitignore-file

```
# rm all files
git rm -r --cached .
# add all files as per new .gitignore
git add .
# now, commit for new .gitignore to apply
git commit -m ".gitignore is now working"
```

### 怎么更新 mac xcode 中的 git？

把 git 的路径改成自己下载的 git 即可,在`.bash_profile`文件中添加：

```
// .bash_profile
 export PATH=/usr/local/git/bin:${PATH}
```

### 怎么在 mac 上配置多密钥？

生成步骤都是一样的：`ssh-keygen -t rsa -C '邮箱'`,文件名不重复就行  
重点是修改配置文件：`sudo vim /etc/ssh/ssh_config`:

```
// 在最后添加密钥路径
IdentityFile ~/.ssh/id_rsa
IdentityFile ~/.ssh/id_macbook
```

### git clone 权限拒绝，但是已配置公钥

查看密钥列表`ssh-add -l`是否为空,可能是公钥过期，重新添加，参考：[是否必须每次添加 ssh-add ](https://segmentfault.com/q/1010000000835302)：

```
ssh-add -K ~/.ssh/id_macbook
```

但是这种方法会过期，永久解决办法是`~/.ssh/config`中添加github host对应的私钥,假如github的私钥名称为`github_rsa`：

```
Host github.com 
 IdentityFile ~/.ssh/github_rsa
```

导致这种情况的原因是本地有多个私钥，参考：https://stackoverflow.com/questions/12940626/github-error-message-permission-denied-publickey/21938804#21938804



### git 报错 Git: client_loop: send disconnect: Broken pipe

mac:

```
// ./ssh/config
IPQoS=throughput
```

### Git fatal: Unknown index entry format xxxxx 

git目录下的索引损坏，解决办法,删除索引文件即可：

```
rm -f .git/index
git reset
```

### WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!    

远程主机密钥已更改,并且您已请求严格检查,远程主机发送的ECDSA密钥指纹信息是和本机的密钥指纹信息不一致

ssh链接的时候首先会验证公钥，如果公钥不对，那么就会报错。

解决办法：删除提示信息中`known_hosts`相关公钥。重新链接即可

### 如何用git打印今日的提交记录？

`git log --author="baixiaoyu" --pretty=%s --since=1day --no-merges`

### git autostash --rebase丢失代码问题？

使用以下指令打印`autostash`的hash,回退即可

```
git log --pretty='%cr: %h %s' $(git fsck --no-reflog \
  | grep '^dangling commit' | cut -f3 -d\ ) | grep ': autostash$'

```

参考：https://qa.1r1g.com/sf/ask/2649205961/