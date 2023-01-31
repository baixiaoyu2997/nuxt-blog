---
title: Docker学习随笔
category: 分享
tags:
  - docker
date: 2020-08-12
vssue-title: Docker学习随笔
---

## Docker 是什么？

Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案。由`golang`编写。

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

总体来说，Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

## 为什么要用 docker？

用户计算机的环境都不相同，软件必须保证两件事：操作系统的设置，各种库和组件的安装，只有它们都正确，软件才能运行。  
环境配置如此麻烦，换一台机器，就要重来一次，旷日费时，所以产生了 docker。

1. 环境统一
1. 环境隔离
1. 便于回滚
1. 创建销毁容器高效

## docker 中的概念

### Registry

镜像仓库，存储大量镜像，可以从镜像仓库拉取和推送镜像。

### Docker 镜像

类似虚拟机快照，从仓库拉取，或者在现有工具镜像上创建新镜像。通过镜像可以启动容器。  
关于镜像的一些概念：

- 虚悬镜像：强制删除一个已经运行容器的镜像，或者使用 docker pull 命令更新镜像时，镜像的名称和标签会转移到新镜像中，旧的镜像就会变成虚悬镜像，另外，在使用 docker build 构建镜像的时候，如果构建失败也会产生虚悬镜像。一般来说虚悬镜像已经没有实际用处，可以随意删除。

#### 寻找镜像流程

1. 现在本地寻找
2. 有的话使用，没有去docker hub上下载
3. docker hub能否找到，如果没有返回错误
4. docker hub能找到，下载这个镜像

#### 联合文件系统（UnionFS）

docker镜像上系上由一层一层的文件系统组成，这种层级的文件系统称为UnionFs

### Docker 容器

从镜像中创建应用环境，以单进程的方式运行。对外公开服务。是一种短暂的和一次性的环境。

### Docker 数据卷

数据卷可以完成数据持久化和同步操作，数据卷是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

- 数据卷可以在容器之间共享和重用
- 对数据卷的修改会立马生效
- 对数据卷的更新，不会影响镜像
- 卷会一直存在，直到没有容器使用
- 删除容器，本地数据不会丢失

### Docker 网络

Docker 容器之间的网络交互，可以使用端口映射的方式，其他容器可以直接通过端口实现。除该方式外还有一个容器连接（linking）系统也可以达到容器交互。（本文中 node 连接 mongodb 使用的是端口映射的方式）

### Host 宿主机

指的是当前使用的真实操作系统

### Linux上安装docker

1. 卸载旧的版本:`yum remove docker`

2. 需要的依赖：`yum install -y yum-utils`

3. 设置镜像的仓库

   ```sh
   yum-config-manager \
   	--add-repo \
   	https://download.docker.com/linux/centosdpcker-ce.repo # 默认是国外的地址 
   	http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo #推荐使用阿里云的
   
   ```

4. 更新yum软件包索引：`yum makecache fast`

5. 安装docker：`yum install docker-ce docker-ce-cli containerd.io`

6. 启动docker：`systemctl start docker`

7. 使用`docker version`测试是否安装成功

8. 测试docker运行：`docker run hello-world`

9. 查看下载的镜像：`docker images`

10. 了解，删除docker:

    ```sh
    # 1.卸载依赖
    yum remove docker-ce docker-ce-cli containerd.io
    # 2.删除目录
    rm -rf /var/lib/docker
    # /var/lib/docker docker的默认工作路径
    ```

11.  为子用户添加权限：`sudo chmod 666 /var/run/docker.sock`

## docker 操作指令

### attach

| 名称   | 说明                                                     | 参数   |
| ------ | -------------------------------------------------------- | ------ |
| attach | 进入容器，查看正在执行的终端。可以用来查看正在输出的日志 | 容器id |

### build

| 名称  | 说明                                                         | 参数        |
| ----- | ------------------------------------------------------------ | ----------- |
| build | 构建镜像,`docker build -t myimages .`。`-t`表示打包出来镜像的名字，和可选的`tag`,最后的`.`表示需要打包的目录。 | -t name:tag |
| build | `-f`表示指定dockerfile名称，默认`dockerfile`                 | -f name     |

### container

| 名称      | 说明               | 参数  |
| --------- | ------------------ | ----- |
| container | 清空所有已停止容器 | prune |

### commit

| 名称   | 说明                                            | 参数                                                  |
| ------ | ----------------------------------------------- | ----------------------------------------------------- |
| commit | 提交容器成为一个新的镜像,可以通过该指令修改镜像 | -m=“提交的描述信息  -a=“作者” 容器id 目标镜像名:[TAG] |

### cp

| 名称 | 说明                             | 参数                             |
| ---- | -------------------------------- | -------------------------------- |
| cp   | 拷贝容器中的文件到目的地主机路径 | 容器id:容器内路径 目的地主机路径 |

### pull

| 名称 | 说明                          | 参数 |
| ---- | ----------------------------- | ---- |
| pull | 下载拉取镜像,此指令不需要登录 |      |

如果权限被拒绝，需要为docker.sock赋权限：

```
sudo chmod 666 /var/run/docker.sock
```

### push

推送镜像到远程仓库，需要本地镜像名等于`仓库名/镜像名`，不需要远程创建仓库也可推送

### history

| 名称    | 说明             | 参数     |
| ------- | ---------------- | -------- |
| history | 查看镜像构建过程 | <镜像id> |

### info

| 名称 | 说明       | 参数 |
| ---- | ---------- | ---- |
| info | docker信息 |      |

### inspect

| 名称    | 说明                                                 | 参数   |
| ------- | ---------------------------------------------------- | ------ |
| inspect | 查看容器的元信息（目前没有办法查看docker指令的记录） | 容器id |



### images

| 名称   | 说明                            | 参数                     |
| ------ | ------------------------------- | ------------------------ |
| images | 查看当前所有本地镜像            |                          |
| images | 查看当前所有本地镜像+中间层镜像 | -a                       |
| images | 只显示镜像的id | -q                       |
| rmi    | 删除镜像                        | `<image name>`           |
| rmi    | 强制删除镜像                    | -f `<image name>`        |
| rmi    | 删除所有镜像                    | -f $(docker images -aq)        |
| image  | 删除虚悬镜像                    | prune                    |
| image  | 创建镜像，并定义镜像名          | build -t <镜像名> <路径> |

### load

| 名称 | 说明     | 参数          |
| ---- | -------- | ------------- |
| load | 导入镜像 | -i <镜像.tar> |

### logs

| 名称 | 说明                                          | 参数                   |
| ---- | --------------------------------------------- | ---------------------- |
| logs | 显示日志,t表示时间戳，f表示输出，tail表示条数 | -tf --tail 10 <镜像id> |

### tag

| 名称 | 说明                                  | 参数                              |
| ---- | ------------------------------------- | --------------------------------- |
| tag  | 修改镜像名称和标签,此操作会保留原镜像 | <原镜像名：原标签> <镜像名：标签> |

### top

| 名称 | 说明               | 参数   |
| ---- | ------------------ | ------ |
| top  | 查看容器中进程信息 | 容器id |

### run

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| run | 新建并启动容器，设置容器名称,有多个参数存在时，一般镜像名保持在最后，除非后边跟命令。 | --name <容器名> <镜像名> |
| run | 新建并启动容器，`-t`配置一个伪终端，并绑定到容器的输入上，`-i`能让容器的标准输入保持打开状态，`-d`则可以让容器在后台保持运行，这三个参数可以合并为`-dit`，其顺序没有影响 | -dit <镜像名> |
| run | 容器停止后自动删除 | --rm |
| run | 指定容器的端口，例如`-p 3344:8080`,前边的3344是主机的端口，8080是容器内部的端口 | -p |
| run | 随机指定端口 | -P |
| run | 指定环境变量，例如：`docker run -e MYQSL_ROOT=my-secret-pw` | -e |

### ps

| 名称 | 说明               | 参数 |
| ---- | ------------------ | ---- |
| ps   | 查看当前运行的容器 |      |
| ps   | 查看所有容器 |   -a   |
| ps   | 显示最近创建的容器，`n`表示几个 |   -n=?   |

### exec

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| exec | 进入容器并打开一个新的终端,如果只是想执行容器中的命令，可以不输入`bash`，替换成命令名，退出容器，输入`exit`,与attach区别是退出终端不会结束容器 | -it <容器名字｜容器 id> bash |

### search

| 名称   | 说明     | 参数     |
| ------ | -------- | -------- |
| search | 查找镜像 | <容器名> |

### save

| 名称 | 说明     | 参数                               |
| ---- | -------- | ---------------------------------- |
| save | 导出镜像 | -o <输出文件名.tar> <待导出镜像名> |

### start

| 名称  | 说明                       | 参数     |
| ----- | -------------------------- | -------- |
| start | 启动容器,重启使用`restart` | <容器名> |

### stop

| 名称 | 说明     | 参数     |
| ---- | -------- | -------- |
| stop | 停止容器 | <容器名> |

### volume

| 名称   | 说明       | 参数 |
| ------ | ---------- | ---- |
| volume | 查看数据卷 | ls   |
| volume | 创建数据卷 | create   |
| volume | 删除所有未使用的本地数据卷 | prune   |
| volume | 删除一个或者所有数据卷 | rm   |

### kill

| 名称 | 说明         | 参数     |
| ---- | ------------ | -------- |
| kill | 暴力停止容器 | <容器名> |

### rm

| 名称 | 说明         | 参数        |
| ---- | ------------ | ----------- |
| rm   | 删除容器     | <容器名>    |
| rm   | 强制删除容器 | -f <容器名> |
| rm   | 强制删除所有容器 | -f $(docker ps -aq)|

### rename

修改容器名称

## Docker 数据卷

数据卷可以完成数据持久化和同步操作，语法：`docker run -it -v <主机目录>:<容器目录> centos /bin/bash`

运行之后通过`docker inspect <容器id>`指令查看返回结果中的`Mounts`，来检测是否挂载成功：

```json
"Mounts": [
            {
                "Type": "bind",
                "Source": "/Users/l.rain/Documents/workspace/DEMO/html/copy", // 主机路径
                "Destination": "/copy", // 容器路径
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
```

### 匿名挂载

如果在使用`-v`时未指定主机目录，只有容器目录:`docker run -it  /etc/test centos /bin/bash`，则在`docker volume ls`查看时，name为随机字符串。

### 具名挂载

如果在使用`-v`时主机目录不是`/`开头，则认为这是数据卷的名称:`docker run -it  juming:/etc/test centos /bin/bash`，在`docker volume ls`查看时，name为该名称。

### 查看挂载目录位置

使用指令`docker volume inspect jumin`，返回结果中查找`Mountpoint`属性为该数据卷挂载位置。所有的docker容器内的卷，没有指定目录的情况下都是在`/var/lib/docker/volumes/xxx/_data`文件夹中。

### 读写权限

容器位置尾部添加`:ro`或者`:rw`（默认值）添加只读或读写权限，例如：`docker run -it  juming:/etc/test:ro centos /bin/bash`。

 设置为`ro`后就说明这个路径只能通过宿主机来操作，容器内部是无法操作的。

### 数据卷容器

 把一个容器内的数据同步到其他容器中，使用指令`volumes-form`,语法：`volumes-form <容器名称>`例如:`docker run -it --name docker02 --volumes-from docker01 kuangshen/centos:1.0`

删除数据卷容器不会使其他容器中的数据丢失，原理是，各个容器间的数据卷是同步拷贝的关系，如果删除数据卷容器，只是停止拷贝。

## Dockerfile

```
# Dockerfile文件
FROM ubuntu:16.04
ENV WORK_DIR=/workspace
WORKDIR ${WORK_DIR}
COPY . ${WORK_DIR}
RUN npm start

```

Dockerfile 是一个文本文件，包含了镜像构建的所有命令，通过修改 Dockerfile 中的命令，就能定制化自己想要的镜像。Dockerfile 里面每一个指令都会构建一层镜像，层层叠加最终得到定制化镜像。

### ADD

`ADD` ADD 指令和 COPY 类似，但包含更多功能，比如可以从一个网址下载文件到目标目录中（下载后文件默认权限是 600），另外一个常用的功能是自动解压，支持 gzip、bzip2 和 xz 压缩格式，比如 ADD file.tar /会将压缩包解压到目标路径中。由于 ADD 指令语义不够清晰，除了需要自动解压的情况，我们一般都不推荐使用 ADD 指令。

### COPY

`COPY`指令可以将宿主机中的文件在构建镜像时复制到镜像存储中。COPY命令在拷贝文件夹时，目的地址应该加上该文件夹名，例如：`COPY logs /root/logs`
COPY命令可以一次拷贝多个文件：

```sh 
COPY README.md package.json gulpfile.js __BUILD_NUMBER ./
// 或者
COPY ["__BUILD_NUMBER", "README.md", "gulpfile", "another_file", "./"]
```

但是这种写法对文件夹无效，如果你写`COPY dir1 dir2 ./`,实际上等于：`COPY dir1/* dir2/* ./`

`.dockerignore` 指定的文件不会拷贝

### CMD 

CMD 指令可以用来指定容器启动后默认的运行命令。`CMD` 运行格式：CMD ["可执行文件", "参数 1", "参数 2"...]。

但能被`docker run`命令后面的命令行参数替换。比如：

```
# Dockerfile
CMD echo "Hello world"

# bash
docker run -it [image]将输出Hello world
# bash
docker run -it [image] /bin/bash 将会忽略掉CMD，什么也不输出。
```



### ENV

`ENV`设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。它有俩种写法：

```
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>
```

### ENTRYPOINT

与`CMD`的区别就是，当启动容器时，如果添加命令会覆盖掉CMD中的内容，而指定`ENTRYPOINT`后，添加的命令会出现在`ENTRYPOINT`的命令后，相当于追加到后边。

### EXPOSE

`EXPOSE` 声明将容器内的某个端口导出供外部访问，并没有实际功能，导出端口还是需要在命令行中添加`-p`

### FROM

`FROM`指令代表基于哪个镜像进行修改，第一条指令必须是 FROM 指令，若我们不想基于任何镜像，可以写 FROM scratch 即可完全从零开始构建镜像。

### MAINTAINER

镜像是谁写的，姓名+邮箱

### VOLUME 

挂载的目录

### WORKDIR

`WORKDIR`为`RUN、CMD、ENTRYPOINT` 指令配置工作目录。如果不存在则会创建该名录。如果之前有设置`WORKDIR`，则可以使用它的相对路径。在刚进入容器时，系统会自动转到工作目录，默认的工作目录是根目录/。 

可以使用多个 WORKDIR 指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径。例如:

```
WORKDIR /a

WORKDIR b

WORKDIR c

RUN pwd
# 则最终路径为 /a/b/c 。
```

### ONBUILD 

当构建一个被继承DockerFile这个时候就会运行ONBUILD的指令，触发指令。

### RUN

使用 RUN 指令安装应用和软件包，构建镜像。`dockerfile`可以有多个`RUN`指令。由于一条指令就会创建一层镜像，而镜像层数是有限制的，一般是 127 层，当我们需要执行多条命令时，一般都用&&连接多条命令，从而节省镜像层数。执行时机是在容器启动之前。

## docker-compose

### 介绍

是将你的多个 docker 容器服务整合起来的命令行工具，假设你有一个 MySQL 实例和一个 Node.js 实例分别部署在两个容器中，仅需一个`docker-compose.yml`文件，docker-compose 就可以为你完成从打包到运行的所有步骤。

docker-compose下启动的服务都在同一个网络下（域名访问）

### 安装

本地开发环境中docker内置了docker-compose，但是服务器环境需要安装依赖：

- 在 terminal 中运行 `sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-$(uname -s)-(uname -m) -o /usr/local/bin/docker-compose` 下载 docker-compose 的安装脚本
- 官方地址很慢，使用国内地址：`sudo curl -L "https://get.daocloud.io/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
- 为脚本添加执行权限`sudo chmod +x /usr/local/bin/docker-compose`
- 执行脚本`sh /usr/local/bin/docker-compose`

### 容器编排

docker-compose 使用目录下的`docker-compose.yml` 作为项目的配置文件， 以上述我们举的 MySQL 和 Node.js 应用的例子 `docker-compose.yml` 文件应该具有类似以下的结构：

```yml
services:
  mysql:
    image: mysql:latest
    ports:
      - '3306:3306'
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: '123456'

  webapp:
    build: .
    container_name: webapp
    restart: always
    depends_on:
      - 'mysql'
    environment:
      NODE_ENV: 'production'
    ports:
      - '80:8080'

```

### 流程

1. 创建网络
2. 执行`Docker-compose yaml`
3. 依据当前项目所在文件夹名+services中的服务名称+`n`,创建镜像名。
4. 启动服务
5. 如果提示镜像不存在，则再次运行`docker-compose build`

### 指令

#### up

启动服务，输入参数`-d`可以后台运行。

```sh
docker compose up -d
```

命名规则：用`docker compose`创建的容器，名字都会加入一个对应文件夹的名字，比如我在的文件夹叫做`test`,而我在`yaml`文件中起的名字是`my-wordpress`。最终容器的名字就是`test_my-wordpress_1`

这个前缀其实是可以改的，比如我们希望前缀加上`jspang`。就可以使用`-p`参数。

```sh
docker-compose -p jspang up -d
```

你也可以在`yaml`文件里指定这个名字,方法是使用`contaner_name: xxx`但是这样作就会完全省略前缀和后缀。

```SH
version: "3.8"

services:
  my-wordpress:
        container_name: jspang
    image: wordpress:latest
    ports:
      - 80:80
```

额外参数：

1. `--build`:重新构建

#### ps

查看`service`运行情况，使用`docker-compose ps`命令

#### down

停止，也可以`ctrl+c`

#### stop

停止service：`docker compose stop`

#### rm

删除容器，`docker compose rm`

命令会删除掉由`docker compose`所建立的容器，但用docker命令创建的容器不会被删除，对应的网络也不会被删除

### docker-compose.yml

使用yml文件时需要指定兼容的docker版本，具体对应版本在这里[查看](https://docs.docker.com/compose/compose-file/)

yml文件总共有3层：

1. version:
2. services:
   1. 服务:
      1. docker配置
3. 其他配置 网络/卷挂载、全局规则，`volumes、networks、configs`等

#### serverces

1. depends_on:依赖项，会决定容器的启动顺序
2. stdin_open: true|false，与`-i`相同
3. command:覆盖docker指令中的`CMD`

## docker发布镜像

1. 注册dockerhub账号
2. 命令行登录dockerhub：`docker login -u <用户名>`
3. 发布：`docker push <用户名>/<镜像名>:<版本号>`，如果需要版本号，需要先在本地使用`docker tag`打上标签，才能发布。

#### 阿里云发布镜像

1. 登录阿里云后找到容器镜像服务
2. 创建命名空间
3. 然后去镜像仓库创建 
4. 然后按照仓库中的操作指南一步一步走就可以了。

## 调试

1. 查看容器输出：`docker logs -f contianer_name/container_id `
2. 打印出容器的端口映射、目录挂载、网络等等：`docker inspect contianer_name/container_id `
2. build命令前加`DOCKER_BUILDKIT=0`可以查看更多信息

## docker 部署流程

1. 首先在项目根目录下创建`.dockerignore`文件，防止打包不必要的文件：

```
.git
node_modules
```

2. 项目根目录中创建`Dockerfile`文件：

```
FROM node:10.0

# 在容器中创建一个目录
RUN mkdir -p /usr/src/nodejs/

# 定位到容器的工作目录
WORKDIR /usr/src/nodejs/

# RUN/COPY/ADD 是分层的，package.json 提前，只要没修改，就不会重新安装包
COPY package.json /usr/src/app/package.json
RUN cd /usr/src/app/
RUN npm i

# 把当前目录下的所有文件拷贝到 Image 的 /usr/src/nodejs/ 目录下
COPY . /usr/src/nodejs/


EXPOSE 3000
CMD npm start
```

3. 构建镜像

```
docker build -t ubuntu_demo:latest .
```

4. publish镜像

   ```
   docker login
   docker tag [本地镜像] [doker hub远程仓库名称]
   docker push [doker hub远程仓库名称]
   ```

## docker网络

### docker0

mac环境下没有docker0，linux环境有，默认安装docker后都会产生一个docker0网卡。所有容器不指定网络的情况下，都是走docker0路由的，docker会给容器分配一个默认的可用ip

1. 每启动一个docker容器，docker就会给docker容器分配一个ip，因为使用了linux的`veth-pair`技术，就是一堆的虚拟设备接口，他们都是成对出现的，一段连着协议，一段彼此相连。正因为这个特性，veth-pair充当一个桥梁，链接各种虚拟网络设备的。
2. 因为上面的特性，docker容器之间可以相互ping通

![image-20210907164131824](/Users/l.rain/Library/Application Support/typora-user-images/image-20210907164131824.png)

Docker使用的是Linux的桥接，宿主机中是一个Docker容器的网桥docker0，docker中的所有的网络接口都是虚拟的。虚拟的转发效率高。

只要容器删除，对应网桥一对就没了。 

docker每次重启都会变更ip。

### --link （不建议使用）

容器之间是不可以通过服务名ping通的，如果想做到这一点，那么启动容器时使用`--link <容器名>`指定需要ping通的容器名，但是只能单向访问，不是双向的。

实质：是在相应容器中的hosts配置中添加了一个ip映射。

不建议使用：docker0无法自定义网络，不支持容器名链接访问。

### 自定义网络

#### 网络模式

1. bridge：桥接docker（默认，推荐）
2. none：不配置网络
3. host：和宿主机共享网络
4. container：容器网络联通（用得少，局限很大）

#### 测试

```sh
docker run -d -P --name tomcat01 tomcat #当我们执行这条语句时，相当于执行下边的默认值语句
docker run -d -P --name tomcat01 --net bridge tomcat 
```

因为docker0的特点：域名不能访问。我们可以自定义一个网络

```sh
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet
```

自定义的网络可以用来在docker创建镜像时指定，例如：`--net mynet`。

自定义网络的好处：

1. 不需要`--link`,就可以ping通其他容器。
2. 可以直接通过容器名ping通

#### 网络连通

如何把容器链接到一个网络上？把当前容器的网络放到另一个容器下，也就是一个容器两个ip地址。

使用`docker network connect <容器1> <容器2> `,依旧是单向连接的。

## Linux

### 启动docker

启动docker：`sudo systemctl start docker`

## 最佳实践

1. 选择更小的镜像，相较于其他发行版镜像，`Alpine`版更小，仅包含最小的必须的软件包
1. 减少 Docker 的层数。  
   COPY、ADD 和 RUN 会向镜像中添加新层，Docker 的层就像是 git 的提交一样，Docker 的层用于保存镜像的上一版本和当前版本之间的差异。当你向注册表请求镜像时，只是下载你尚未拥有的层。  
   层会占用空间，拥有的层越多，最终的镜像就越大
2. 镜像加速：如果使用阿里云镜像，那么可以在`镜像中心->镜像加速器`中查看如何配置加速器。
2. docker项目目录应使用一个全新的目录，防止其他问题出现
2. 前端优化：https://zhuanlan.zhihu.com/p/102853707

## 问题
### docker build与yarn一起使用

报错`Couldn't find the binary git`,原因是yarn必须依赖git,在安装包前使用`RUN apk add --no-cache git`安装git

### docker为什么`-d`后台启动容器后，容器停止了？

docker容器使用后台运行，就必须要有一个前台进程，，否则docker发现没有应用，就会自动停止。

### docker镜像挂载外部文件？

比如说想加载一个外部配置文件或者一个目录，那么可以通过以下方式指定：
```sh
docker run -it -v /test:/soft centos /bin/bash  
```
冒号":"前面的目录是宿主机目录，后面的目录是容器内目录。
> 参考 https://www.cnblogs.com/shix0909/p/11124466.html
### 删除所有none标签镜像

```
docker images | grep none | awk '{ print $3; }' | xargs docker rmi
```

### 删除所有 images

>删除镜像需要先删除一次镜像为基础的容器

`docker rmi --force $(docker images -q)`

### 删除所有镜像和容器

```text
docker system prune -a
```

### 删除名称中包含某个字符串的镜像

```
# 例如删除包含“some”的镜像
docker rmi --force $(docker images | grep some | awk '{print $3}')

```

### mac无法ping通容器中的ip？

因为mac在容器和主机中间有一层`docker vm`,所以ping不通，进到`docker vm`里就可以ping通了。

### 配置-p后公网ip无法访问？

原因有可能是服务器没有添加相关端口的防火墙规则

## 学习资源

1. [【狂神说Java】Docker最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1og4y1q7M4)

## 引用

[两个奇技淫巧，将 Docker 镜像体积减小 99%](https://www.cnblogs.com/ryanyangcs/p/12558727.html)
