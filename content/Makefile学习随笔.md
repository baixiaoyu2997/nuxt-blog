---
title: Makefile学习随笔
category: 分享
tags:
  - makefile
date: 2021-09-03
vssue-title: Makefile学习随笔
---

## 介绍

概念：https://zhuanlan.zhihu.com/p/29910215

尽管make工具链非常流行，但仅限于UNIX平台。

make指令需要有`makefile`文件，Makefile文件由一系列规则（rules）构成。每条规则的形式如下：

```
<target> : <prerequisites> 
[tab]  <commands>
```

上面第一行冒号前面的部分，叫做"目标"（target），冒号后面的部分叫做"前置条件"（prerequisites）；第二行必须由一个tab键起首，后面跟着"命令"（commands）。

"目标"是必需的，不可省略；"前置条件"和"命令"都是可选的，但是两者之中必须至少存在一个。

每条规则就明确两件事：构建目标的前置条件是什么，以及如何构建。下面就详细讲解，每条规则的这三个组成部分。

## 基本语法

1. https://www.cnblogs.com/wang_yb/p/3990952.html

## 命令行

1. -f ，指定makefile文件

## Makefile

> makefile使用bash语法

1. `.PHONY`：伪目标，防止存在同名文件时不执行该指令

2. commands:多行命令间没有上下文关系。除非行尾添加换行符`\`,可以通过添加`.ONESHELL:`支持。

   1. 在命令前添加`@`可以防止在控制台输出命令

3. 通配符：`* 、？、...`

4. 变量：

   1. 定义：`text = Hello World`
   2. 使用:`$(text)`

5. 赋值运算符：

   ```
   VARIABLE = value
   # 在执行时扩展，允许递归扩展。
   
   VARIABLE := value
   # 在定义时扩展。
   
   VARIABLE ?= value
   # 只有在该变量为空时才设置值。
   
   VARIABLE += value
   # 将值追加到变量的尾端。
   
   ```

6. 自动变量

   1. `$@`:指代当前目标
   2. `$<`：指代第一个前置条件
   3. `$?`:比目标更新的所有前置条件，之间以空格分隔。
   4. `$^`:所有所有前置条件，空格分隔。
   5. `$(@D)和$(@F)`：当前目标所在的目录和文件名。

7. shell：使用shell函数来执行shell命令

8. `subst 函数`:替换文本。`$(subst from,to,text)`

9. 替换后缀名：`min: $(OUTPUT:.js=.min.js)`,将遍历康OUTPUT中的后缀名`.js`全部替换成`.min.js`

## 问题

### 如何一次性执行多个文件？

`source: file1 file2 file3`,source是一个伪目标，有三个前置文件。

## 参考

1. [Make 命令教程](https://www.ruanyifeng.com/blog/2015/02/make.html)

