---
title: Shell学习随笔
category: 分享
tags:
- shell
date: 2021-05-10
vssue-title: Shell学习随笔
---

## Shell

### Shell是什么？

Shell是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务, Shell脚本（shell script），是一种为Shell编写的脚本程序。我们经常说的shell通常都是指shell脚本。

### Shell和Base

sh: Bourne shell，POSIX（Portable Operating System Interface）标准的shell解释器，它的二进制文件路径通常是/bin/sh

bash: Bash是Bourne shell的替代品，属GNU Project，二进制文件路径通常是/bin/bash

### 指定解释器

shell的第一行代码通常是`#!/usr/bin/env bash`	,`#!`是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行 /env 是系统的PATH目录中查找

### 变量

定义变量时，`=`号前后不能有空格：`my_name='jack'`,可以用单引号，也可以用双引号。

单引号字符串的限制：

- 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
- 单引号字串中不能出现单引号（对单引号使用转义符后也不行）

双引号：

- 双引号里可以有变量
- 双引号里可以出现转义字符

#### 使用已经定义过的变量

```shell
echo $my_name
echo ${my_name}
```

变量名外面的花括号是可选的，加不加都行,建议使用第二种形式

#### 变量加双引号问题

大多数时候，虽然可以不使用括起字符串和字符串变量的双引号，但这并不是好主意。为什么呢？因为如果环境变量中恰巧有一个空格或制表键，bash 将无法分辨，从而无法正常工作。这里有一个错误的比较示例：

```shell
if [ $myvar = "foo bar oni" ]
then
     echo "yes"
fi
```

如果 myvar 等于 "foo"，则代码将按预想工作，不进行打印。但是，如果 myvar 等于 "foo bar oni"，则代码将因以下错误失败：`[: too many arguments`  

在这种情况下，"$myvar"（等于 "foo bar oni"）中的空格迷惑了 bash。bash 扩展 "$myvar" 之后，代码如下：

```shell
[ foo bar oni = "foo bar oni" ]
```

因为环境变量没放在双引号中，所以 bash 认为方括号中的自变量过多。可以用双引号将字符串自变量括起来消除该问题。请记住，如果养成将所有字符串自变量用双引号括起的习惯，将除去很多类似的编程错误。

### 字符串

1. 获取字符串长度：`echo ${#my_name}`
2. 截取字符串: `echo ${my_name:0:2}`

### 数组

shell中使用`()`来表述数组，数组元素用空格分割：`name=(name1 name2 name3)`,还可以通过索引来设置数组成员：

```shell
#可以不使用连续的下标，而且下标的范围没有限制
ary[0]=name1
ary[1]=name2
ary[3]=name3
```

#### 使用数组

可以通过`${array[下标]}`来使用，使用`@`获取所有数组元素：`${name[@]}`

#### 获取数组长度

```shell
# 取得数组元素的个数
length=${#name[@]}
echo $length

# 或者
length=${#name[*]}
echo $length

# 取得数组单个元素的长度
lengthn=${#name[n]}
echo $length

```



### 注释

以`#`开头便是注释，shell没有多行注释，只能每一行都加`#`

### for循环

#### 第一种写法

```shell
for ((i=0; i<3; i++)); do
    touch test_${i}.txt
    echo "shell很简单" >> test_${i}.txt
done

```

#### 第二种写法

```shell
for index in 1 2 3 4 5; do
    echo "index="$index
done
```



### if  else

- if else写法

```sh
#!/bin/sh
a=10
b=20
if [ $a != $b ]    # if与[ ]有空格，"["  、 "]"与字符都有空格
then echo "a is not equal to b"
else echo "a is equal to b"
fi
```

- if … elif … fi 语句可以对多个条件进行判断

```sh
#!/bin/sh
a=10
b=20
if [ $a == $b ];then
    echo "a is equal to b"
elif [ $a -gt $b ];then
    echo "a is greater than b"
elif [ $a -lt $b ];then
    echo "a is less than b"
else
    echo "None of the condition met"
fi
```

常用判断：
-e 文件是否存在

-f  文件是否是普通文件（不是目录、设备文件、链接文件）

-s  表示文件大小不为0

-d 表示文件是否是目录

-b 表示是块设备（光驱、软盘等）

-c  表示是字符设备（键盘、声卡等）

-p 表示是管道

-h 表示是符号链接

-S 表示是否是socket
-n 如果判断的string长度不为0则为真
-r、-w、-x表示文件是否有可读、可写、可执行权限（指运行这个测试命令的用户）

f1 -nt f2      f1是否比f2新（new than）

f1 -ot f2      f1是否比f2旧（old than）

f1 -ef f2      f1和f2是否是相同文件的硬链接

### while 语句

while循环用于不断执行一系列命令，也用于从输入文件中读取数据；命令通常为测试条件。

```shell
int=1
while(( $int<=5 ))
do
    echo $int
    let "int++"
done
```

### 特殊符号

1. `<`表示输入重定向
2. `>`表示输出重定向
3. $? 获取上一条命令的退出状态

### Shell结合系统命令

sh脚本结合系统命令便有了强大的威力，在字符处理领域，有grep、awk、sed三剑客，grep负责找出特定的行，awk能将行拆分成多个字段，sed则可以实现更新插入删除等写操作。

### 脚本暂停

`read -p "Press any key to continue." var`

### Shell传递参数

- 脚本内获取参数的格式为：$n。n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，以此类推,其中 $0 为执行的文件名

```js
deploy.sh first

// deploy.sh
$1=first
```



### `|`管道符

管道符用来把上一个指令的正确结果传递给下一个指令做为输入









## windows

1. 删除文件夹 rd /S /Q <文件夹>

### 查询占用指定端口进程的PID

#### window

打开cmd命令行，输入netstat -ano|findstr 8080(指定端口号)

最后一列即为占用该端口的进程的PID

#### mac

`lsof -i:3000`

### KILL指定PID的进程

紧接着在命令行输入taskkill /pid 21172（PID参数） -f

### 脚本退出

`exit 1`,可以是0~255的数字

```
0----------------命令运行成功
1----------------通知未知错误
2----------------误用shell命令
126-------------命令不可执行
127-------------没有找到命令
128-------------无效退出参数
128+x-----------linux信号x的严重错误
130--------------命令通过Ctrl+C终止
255--------------退出状态码越界
```

## 查看文件夹列表

`ls`，参数：

- `-a`，查看包括隐藏文件夹

