---
title: Linux学习随笔
category: 分享
tags:
- linux
date: 2021-05-10
vssue-title: Linux学习随笔
---

## 术语

1. stdin：标准输入
2. stdout: 标准输出

## 指令

### &&

同步执行多个任务，比如`ls -l && echo "你好"`,前边的任务如果有错误，则不会运行后边的命令，如果想不管是否报错都执行，则需要使用`;`

### ；

同步执行多个任务，参考`&&`,语法：`ls -l; echo "你好"`

### <<

获取标准输入，并在EOF处结束标准输入，输出标准输出。将会覆盖原先文件内容，如果没有指定文件则会创建文件。

<<- 表示分界符（EOF）所在行的开头部分的制表符（Tab）都将被去除。

在我们使用cat <<EOF时，我们输入完成后，需要在一个新的一行输入EOF结束stdin的输入。EOF必须顶行写，前面不能用制表符或者空格。例如：

```SH
cat <<EOF
Hello,world!
EOF
```

如果后边的EOF没有顶头写则被认为是字符串的一部分。为了解决这个问题，使用`<<-`：

```sh
cat <<-EOF
Hello,world!
		EOF
```

## `!<number>`

通过运行`history`查看历史记录，然后运行,例如`!102`来快速访问`102`的指令

### !!

快速输入上一条指令

### alias

用户可利用 alias,自定指令的别名，单独使用可以查看所有的别名设置。alias 的效力仅及于该次登入的操作。若要每次登入是即自动设好别名,可在.profile 或.cshrc 中设定指令的别名。

`alias[别名]=[指令名称]`

### apt

替换国内源 `vim /etc/apt/sources.list `

```
deb http://mirrors.cloud.aliyuncs.com/debian stable main contrib non-free
deb http://mirrors.cloud.aliyuncs.com/debian stable-proposed-updates main contrib non-free
deb http://mirrors.cloud.aliyuncs.com/debian stable-updates main contrib non-free
deb-src http://mirrors.cloud.aliyuncs.com/debian stable main contrib non-free
deb-src http://mirrors.cloud.aliyuncs.com/debian stable-proposed-updates main contrib non-free
deb-src http://mirrors.cloud.aliyuncs.com/debian stable-updates main contrib non-free

deb http://mirrors.aliyun.com/debian stable main contrib non-free
deb http://mirrors.aliyun.com/debian stable-proposed-updates main contrib non-free
deb http://mirrors.aliyun.com/debian stable-updates main contrib non-free
deb-src http://mirrors.aliyun.com/debian stable main contrib non-free
deb-src http://mirrors.aliyun.com/debian stable-proposed-updates main contrib non-free
deb-src http://mirrors.aliyun.com/debian stable-updates main contrib non-free
```

然后运行`apt update`

### cat

cat（英文全拼：concatenate）命令用于连接文件并打印到标准输出设备上。

#### 查看系统信息

```sh
cat /etc/os-release
```

### cd

进入目录，通过使用`cd -`可以快速返回之前的目录,使用`cd`则可以直接回到主目录

### column

使输出列对其，更易于查看，通常与其他命令一起使用`mount | column -t`

### curl

文件传输。常被用来抓取网页和监控 Web 服务器状态。`curl [options] [url]`

1. `-o` 把输出写到该文件中,`curl -o outputfilename url`
2. `-I`：仅仅返回头部信息

curl可以做很多事情，常见的比如：

1. 调试请求
2. 查看头部信息

### cp

复制文件/目录：

```sh
cp [options] source dest
# or
cp [options] source... directory
```

参数：

1. -f：覆盖已存在的目标文件而不提示
2. -r：递归操作

### clear

清除屏幕

### export 

用于导出环境变量或者展示环境变量

### kill

关闭进程，`kill [-s <信息名称或编号>][程序]　或　kill [-l <信息编号>]`

常用的是使用`kill -9 xxx`

### find

查找文件或目录。`find   path   -option   [   -print ]   [ -exec   -ok   command ]   {} \;`

### grep

Linux grep 命令用于查找文件里符合条件的字符串。`grep 内容 文件`

### history

返回命令行历史记录,通过设置`HISTTIMEFORMAT`可以设置记录的格式，比如`%Y-%m-%d %T `,直接在命令行中输入，关闭后就会消失了，如果想永久使用，添加到`.zshrc`

### ls

显示指定目录的文件:`ls [-alrtAFR] [name...]`，默认不展示隐藏文件和`.`开头文件。参数：

1. -a：显示所有文件和目录包括隐藏文件和`.`开头文件
2. -A：同`-a`，但不现实当前目录`.`和父目录`..`
3. -R：若目录下有子文件夹，则递归显示
4. -l：显示档案的时间记录及权限，重命名不会导致该时间改变,还有一种简写形式`ll`

### make

通过makefile执行命令集合

### mkdir

创建目录，`mkdir [-p] dirName`,参数：

1. -p：创建目录时,如果目录不存在，则创建，同样适用于多级目录。有相同文件夹时，添加该参数不会报错。

### mv

文件移动或者重命名

```sh
mv [options] source dest
# or
mv [options] source... directory

```

参数：

1. -i：弱者丁目录已有同名文件，则先询问是否覆盖旧文件
2. -f：在mv操作要覆盖某已有的目标文件时不给任何指示

### open

打开文件,`-a`可以指定应用打开，比如`open -a /Applications/Visual\ Studio\ Code.app/`

### pushd

跳转到指定目录，但是会记住跳转前目录，无论之后你cd到哪个目录，使用`popd`都会跳转到之前记住的目录

### ping 

检测主机，参数：

1. -c：设置完成要求回应的次数,达到次数不再请求。

### pipe

管道符，用于执行多条命令。管道是一种通信机制，通常用于进程间的通信（也可通过 socket 进行网络通信），它表现出来的形式将前面每一个进程的输出（stdout）直接作为下一个进程的输入（stdin）。

1. 只能处理前一条指令的正确输出，不能处理错误输出。
2. 管道命令必须要能够接收来自前一个命令的数据成为standard input继续处理才行。

### pwd

输出当前目录绝对位置

### ps

查看当前进程状态，`ps [options]`,参数：

1. -e：显示所有进程
2. -f：全格式，显示更多字段

### read

用于从标准输入读取数值

### reset

重启命令行

### rm

删除文件或者文件夹：`rm [options] [name...]`,参数：

1. -i：删除前逐一确认
2. -r或者-R：递归处理子文件
3. -f：强制删除文件或目录

### rmdir

删除空的目录，`rmdir [-p] dirName`;参数：

1. -p：是当子目录被删除后如果该目录也为空的话一起删除。


### /usr/bin/time指令

这个指令比内置的time更加详细一些，使用的时候需要用绝对路径，而且要加上参数`-v`，`/usr/bin/time -v go run test2.go  `

### su

切换用户

### set

设置shell的执行方式

1. -e: 若指令传回值不等于0，则立即退出shell。
2. -x: 执行指令后，会先显示该指令及所下的参数。

### scp

scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。比如，从本地复制到远端：

```shell
scp local_file remote_username@remote_ip:remote_file 
```

> 更多使用方法：https://chinese.freecodecamp.org/news/scp-linux-command-example-how-to-ssh-file-transfer-from-remote-to-local/#:~:text=%E4%BD%BF%E7%94%A8SCP%20%E5%B0%86%E6%96%87%E4%BB%B6%E4%BB%8E%E8%BF%9C%E7%A8%8B%E5%A4%8D%E5%88%B6%E5%88%B0%E6%9C%AC%E5%9C%B0,%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8%E7%9A%84%E6%9C%AC%E5%9C%B0%E8%B7%AF%E5%BE%84%E3%80%82

### systemctl

系统和服务管理器

### ssh

用于链接远程计算机，简单使用`ssh [user]@[hostname]`

#### 使用其他端口

`ssh -p 10022 user@hostname`

#### 生成密钥	

`ssh-keygen  -t rsa -C "bxy2997@sina.com"`

#### 校验是否成功配置密钥

`ssh -T git@github.com`

### su

`switch user`的缩写，切换用户

### tar

用于备份文件

#### 解压

`tar -zxvf xxx`

### tail

查看文件的尾部内容：`tail [options][file]`,参数：

1. -f,循环读取，常用于查看日志

### tee

读取标准输入到标准输出中：例如：

```sh
tee file1 file2
```

执行完该命令会提示用户输入需要保存到文件的数据

### telnet

远程登入，还可以用来检测某个远端主机端口是否可以访问，`telnet [主机名称或IP地址] [端口	]`

### time

在执行程序前添加time，程序结束后，显示执行时长等信息

### truncate

缩小文件大小或者放大文件大小，常用于删除日志，或者不想删除文件但是想把文件清空，`truncate -s 0 hello.txt`

### touch

新建文件

### top

实时显示进程动态，`top`，参数：

1. -pid,指定进程id

### unzip

解压zip文件

### useradd

添加用户，参数-d指定主目录， -m创建目录,-s指定shell，默认用户shell是`/bin/sh`

```
 useradd -s /bin/bash -d /home/l.rain -m l.rain 
```

### userdel

删除用户，配合`-r`一同删除用户目录

### vi

进入vi编辑器模式

1. `:w `，保存
2. `:q`，退出
3. `i`，进入输入模式
4. `ctrl+c`，退出输入模式



### Here Document（内嵌文档/嵌入文档）

```shell
command <<END
    document
END
```

`command`是 Shell 命令，`<<END`是开始标志，`END`是结束标志，`document`是输入的文档（也就是一行一行的字符串）。  

这种写法告诉 Shell 把 document 部分作为命令需要处理的数据，直到遇见终止符`END`为止（终止符`END`不会被读取）。

分界符（终止符）可以是任意的字符串，由用户自己定义，比如 END、MARKER 等。分界符可以出现在正常的数据流中，只要它不是顶格写的独立的一行，就不会被作为结束标志。

### which

which 指令会在环境变量\$PATH 设置的目录里查找符合条件的文件。

`which [file...]`

### yum

包管理器，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。

yum 提供了查找、安装、删除某一个、一组甚至全部软件包的命令，而且命令简洁而又好记。

## 快捷键

1. `ctrl+l`：把当前行移动到窗口顶部，不会清除日志
1. `ctrl+z`: 当进入`vim`或者执行任务界面时，跳转到命令行界面,想要之前的界面回来，输入`fg`,如果想使界面可以在后台运行，则输入`bg`
1. `ctrl+r`: 进入命令行搜索模式，根据模糊搜索匹配之前的命令行记录
1. `commond + 加减`：放大缩小字体
1. `ctrl+u`: 删除整行
1. `ctrl+a`: 跳转到行首
1. `ctrl+e`: 跳转到行尾

## 云服务器

使用ssh连接阿里云服务器，配置密钥对，参考：https://www.alibabacloud.com/help/zh/doc-detail/51798.htm?spm=a2c63.p38356.b99.168.1499d1f0dUcojk#linux

## 问题

### 如何挂载ssd？

https://jingyan.baidu.com/article/9c69d48ff1f93313c8024e6f.html

开机自动挂载磁盘：http://yluo.name/2020/01/20/ubuntu-mount/

### 如何防止出现swp文件？

打开 /etc/vimrc 并添加 set noswapfile 后 OK

### 普通用户如何ssh登录？

创建用户后，切换到该用户创建`.ssh`目录，然后添加authorized_keys文件，把本地公钥添加到该文件中即可：

```
useradd -d /home/xxx -m xxx
su xxx
mkdir /home/xxx/.ssh/
touch authorized_keys
vim authorized_keys  // 输入公钥
```

注意： 为普通用户添加公钥的时候不能为root或者其他用户，应当是当前用户为自己添加公钥，否则权限认证有问题

### 如何设置使用shell？

1. 查看当前shell,`echo "$SHELL"`
2. `usermod -s /bin/bash l.rain`

### 如何安装python？

https://computingforgeeks.com/how-to-install-python-on-debian-linux/

## Ubuntu

### cd

使用cd root命令，需要先获取root权限

```
sudo -sH
cd /root
```

## vim

### 模式

1. 正常模式，任何模式下按`esc`（有时两下），都会进入正常模式
   1. 保存退出：`shift zz`
2. 插入模式，输入`i、a、o、I、A、O`键，都会进入插入模式
   1. 关闭文件：`q`退出，`!`强制，`w`保存,
3. 命令模式，正常模式下按下`:`符号会进入
4. 可视模式，正常模式下输入`v`或者`V`



### /etc/vimrc

所有用户配置文件：

```
  ：syntax    on    //语法高亮
  ：set    nu       //显示行号
```



### 行内跳转

1. 行首：正常模式下`0`
2. 行尾：正常模式下`$`

### 快速删除

1. 非输入模式下`dd`删除当前行
2. 非输入模式下`D`删除光标至行尾
3. 非输入模式下`d^`删除光标至行首

### 撤销

非输入模式下`u`
