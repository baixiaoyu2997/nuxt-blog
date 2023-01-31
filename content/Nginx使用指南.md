---
title: Nginx使用指南
category: 分享
tags:
  - nginx
date: 2021-07-16
vssue-title: Nginx使用指南
---

## 介绍

Nginx是一个高性能的HTTP和反向代理web服务器，负责服务器的转发和请求处理、负载均衡。

### 特点

内存占用少，并发能力强，可以不间断服务的情况下进行软件版本的升级。由`c`语言编写 

### 负载均衡

Nginx提供的负载均衡策略有2种：内置策略和扩展策略。

内置策略：轮询，加权轮询，ip hash。

扩展策略

### Session共享

推荐使用Redis来处理

### 动静分离

静态文件直接放在Nginx服务器上做缓存，不需要下放到其他服务器

## 安装

### mac

`brew install nginx`

### debian

```
sudo apt-get update
sudo apt-get install nginx
```

安装完成后会自动运行服务，默认的nginx html位置在`/usr/share/nginx/html/index.html`

## 命令行

1. -s stop 停止nu
2. -s quit 安全退出
3. -s reload 重新加载配置文件
4. `ps aux|grep nginx` 查看进程是否存在

## 配置

nginx的配置文件为`nginx.conf`， 每一个配置项以`;`结尾，修改完配置文件后，需要使用`reload`命令。

### 可视化配置网站

https://www.digitalocean.com/community/tools/nginx?domains.0.php.php=false&domains.0.routing.index=index.html&domains.0.routing.fallbackHtml=true&global.app.lang=zhCN

### 全局配置

`#`号开头的配置为全局配置

###  导入子配置文件

使用`include`可以导入其他配置文件

### 特殊单位

#### 字节单位

`1024、8k、1m`

#### 时间单位

```
ms milliseconds
s	seconds
m	minutes
h	hours
d	days
w	weeks
M	months, 30 days
y
```

值没有单位的表示秒。时间单位可以组合，例如`1h 30m`，使用空格分隔。

有些配置只能使用秒来指定。

### 结构

```
... #全局块
events { #events块
...
}

http #http块
{
    ... #http全局块

    server #server块
    { 
        ... #server全局块
        location [PATTERN] #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
     }

    server
    {
        ...
    }

    ... #http全局块
}
```

### 变量

使用`set`设置变量`set $geek_web_root "/Users/doing/IdeaProjects/backend-geek-web";`

#### 内置变量

除了手动设置变量，内部还提供了一些变量可以使用：

```
$args ：这个变量等于请求行中的参数，同$query_string
$content_length ： 请求头中的Content-length字段。
$content_type ： 请求头中的Content-Type字段。
$document_root ： 当前请求在root指令中指定的值。
$host ： 请求主机头字段，否则为服务器名称。
$http_user_agent ： 客户端agent信息
$http_cookie ： 客户端cookie信息
$limit_rate ： 这个变量可以限制连接速率。
$request_method ： 客户端请求的动作，通常为GET或POST。
$remote_addr ： 客户端的IP地址。
$remote_port ： 客户端的端口。
$remote_user ： 已经经过Auth Basic Module验证的用户名。
$request_filename ： 当前请求的文件路径，由root或alias指令与URI请求生成。
$scheme ： HTTP方法（如http，https）。
$server_protocol ： 请求使用的协议，通常是HTTP/1.0或HTTP/1.1。
$server_addr ： 服务器地址，在完成一次系统调用后可以确定这个值。
$server_name ： 服务器名称。
$server_port ： 请求到达服务器的端口号。
$request_uri ： 包含请求参数的原始URI，不包含主机名，如：”/foo/bar.php?arg=baz”。
$uri ： 不带请求参数的当前URI，$uri不包含主机名，如”/foo/bar.html”。
$document_uri ： 与$uri相同。
```



### 全局块

配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。

```
#配置用户或者组，默认为nobody nobody。
#user administrator administrators; 
#允许生成的进程数，默认为1
#worker_processes 2; 
#指定nginx进程运行文件存放地址
#pid /nginx/pid/nginx.pid; 
#制定错误日志路径，级别。这个设置可以放入全局块，http块，server块，级别依次为：debug|info|notice|warn|error|crit|alert|emerg
error_log log/error.log debug; 

```



### events

配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

```
#工作模式及连接数上限
events {
#设置网路连接序列化，防止惊群现象发生，默认为on
   accept_mutex on; 
#设置一个进程是否同时接受多个网络连接，默认为off
   multi_accept on; 
#事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
#use epoll; 
#单个work进程允许的最大连接数，默认为512
   worker_connections 1024; 
}
```

### http

可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。

```
#http服务器
http {
tcp_nopush on;
#文件扩展名与文件类型映射表。设定mime类型(邮件支持类型),类型由mime.types文件定义
#include /usr/local/etc/nginx/conf/mime.types;
   include mime.types; 
#默认文件类型，默认为text/plain
   default_type application/octet-stream;  // 默认未知类型

#取消服务访问日志
#access_log off;     
#自定义日志格式
   log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; 
#设置访问日志路径和格式。"log/"该路径为nginx日志的相对路径，mac下是/usr/local/var/log/。combined为日志格式的默认值
   access_log log/access.log myFormat; 
   rewrite_log on;

#允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。（sendfile系统调用不需要将数据拷贝或者映射到应用程序地址空间中去）
   sendfile on; 
#每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
   sendfile_max_chunk 100k; 

#连接超时时间，默认为75s，可以在http，server，location块。
   keepalive_timeout 65; 

#gzip压缩开关
#gzip on;

   tcp_nodelay on;

#设定实际的服务器列表
   upstream mysvr1 {   
     server 127.0.0.1:7878;
     server 192.168.10.121:3333 backup; #热备(其它所有的非backup机器down或者忙的时候，请求backup机器))
   }
   upstream mysvr2 {
#weigth参数表示权值，权值越高被分配到的几率越大
     server 192.168.1.11:80 weight=5;
     server 192.168.1.12:80 weight=1;
     server 192.168.1.13:80 weight=6;
   }
   upstream https-svr {
#每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题
     ip_hash;
     server 192.168.1.11:90;
     server 192.168.1.12:90;
   }

#error_page 404 https://www.baidu.com; #错误页

#HTTP服务器

# 静态资源一般放在nginx所在主机
   server {
       listen 80; #监听HTTP端口
       server_name 127.0.0.1; #监听地址  
       keepalive_requests 120; #单连接请求上限次数
       set $doc_root_dir "/Users/doing/IdeaProjects/edu-front-2.0"; #设置server里全局变量
       #index index.html;  #定义首页索引文件的名称
       location ~*^.+$ { #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
          root $doc_root_dir; #静态资源根目录
          proxy_pass http://mysvr1; #请求转向“mysvr1”定义的服务器列表
          #deny 127.0.0.1; #拒绝的ip
          #allow 172.18.5.54; #允许的ip           
       } 
   }

#http
   server {
       listen 80;
       server_name www.helloworld.com; #监听基于域名的虚拟主机。可有多个，可以使用正则表达式和通配符
       charset utf-8; #编码格式
       set $static_root_dir "/Users/doing/static";
       location /app1 { #反向代理的路径（和upstream绑定），location后面设置映射的路径 
           proxy_pass http://zp_server1;
       } 
       location /app2 {  
           proxy_pass http://zp_server2;
       } 
       location ~ ^/(images|javascript|js|css|flash|media|static)/ {  #静态文件，nginx自己处理
           root $static_root_dir;
           expires 30d; #静态资源过时间30天
       }
       location ~ /\.ht {  #禁止访问 .htxxx 文件
           deny all;
       }
       location = /do_not_delete.html { #直接简单粗暴的返回状态码及内容文本
           return 200 "hello.";
       }

# 指定某些路径使用https访问(使用正则表达式匹配路径+重写uri路径)
       location ~* /http* { #路径匹配规则：如localhost/http、localhost/httpsss等等
#rewrite只能对域名后边的除去传递的参数外的字符串起作用，例如www.c.com/proxy/html/api/msg?method=1&para=2只能对/proxy/html/api/msg重写。
#rewrite 规则 定向路径 重写类型;
#rewrite后面的参数是一个简单的正则。$1代表正则中的第一个()。
#$host是nginx内置全局变量，代表请求的主机名
#重写规则permanent表示返回301永久重定向
           rewrite ^/(.*)$ https://$host/$1 permanent;
       }

#错误处理页面（可选择性配置）
#error_page 404 /404.html;
#error_page 500 502 503 504 /50x.html;

#以下是一些反向代理的配置(可选择性配置)
#proxy_redirect off;
#proxy_set_header Host $host; #proxy_set_header用于设置发送到后端服务器的request的请求头
#proxy_set_header X-Real-IP $remote_addr;
#proxy_set_header X-Forwarded-For $remote_addr; #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
#proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
#proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
#proxy_read_timeout 90; #连接成功后，后端服务器响应时间(代理接收超时)
#proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
#proxy_buffers 4 32k; #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
#proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
#proxy_temp_file_write_size 64k; #设定缓存文件夹大小，大于这个值，将从upstream服务器传

#client_max_body_size 10m; #允许客户端请求的最大单文件字节数
#client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数


   }

#https
#(1)HTTPS的固定端口号是443，不同于HTTP的80端口；
#(2)SSL标准需要引入安全证书，所以在 nginx.conf 中你需要指定证书和它对应的 key
   server {
     listen 443;
     server_name  www.hellohttps1.com www.hellohttps2.com;
     set $geek_web_root "/Users/doing/IdeaProjects/backend-geek-web";
     ssl_certificate      /usr/local/etc/nginx/ssl-key/ssl.crt; #ssl证书文件位置(常见证书文件格式为：crt/pem)
     ssl_certificate_key  /usr/local/etc/nginx/ssl-key/ssl.key; #ssl证书key位置
     location /passport {
       send_timeout 90;
       proxy_connect_timeout 50;
       proxy_send_timeout 90;
       proxy_read_timeout 90;
       proxy_pass http://https-svr;
     }
     location ~ ^/(res|lib)/ {
        root $geek_web_root; 
        expires 7d;
#add_header用于为后端服务器返回的response添加请求头，这里通过add_header实现CROS跨域请求服务器
        add_header Access-Control-Allow-Origin *; 
     }
#ssl配置参数（选择性配置）
     ssl_session_cache shared:SSL:1m;
     ssl_session_timeout 5m;
   }

#配置访问控制：每个IP一秒钟只处理一个请求，超出的请求会被delayed
#语法：limit_req_zone  $session_variable  zone=name:size  rate=rate (为session会话状态分配一个大小为size的内存存储区，限制了每秒（分、小时）只接受rate个IP的频率)
   limit_req_zone  $binary_remote_addr zone=req_one:10m   rate=1r/s nodelay;
   location /pay {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#访问控制：limit_req zone=name [burst=number] [nodelay];
        limit_req zone=req_one burst=5; #burst=5表示超出的请求(被delayed)如果超过5个，那些请求会被终止（默认返回503）
        proxy_pass http://mysvr1;
   }

#可以把子配置文件放到/usr/local/etc/nginx/servers/路径下，通过include引入
   include /usr/local/etc/nginx/servers/*.conf;

} 

```

#### server

配置虚拟主机的相关参数，一个http中可以有多个server。

#### location

配置请求的路由，以及各种页面的处理情况。

try_files用来猜测路由

rewrite，重写路由，以下是一个通用的替换`/xxx.html = > /xxx` 的方案

```
types {
	application/javascript mjs cjs;
}
server {
  listen       9007;
  server_name  localhost;

  charset utf-8;

  location / {
	    charset utf-8;
      root   /Users/l.rain/Documents/workspace/deorderbook/.output/public;
      # try_files $uri
      rewrite ^(/.*)\.html(\?.*)?$ $1$2 permanent; // 替换html，保留query
      rewrite ^/(.*)/$ /$1 permanent;              // 斜线结尾时删除末尾斜线
      try_files $uri/index.html $uri.html $uri/ $uri =404;
  }
 }
```



##  实践

重定向分为301:永久重定向和302：临时重定向。301对seo更友好

## 问题

### 如何验证是本地提供的nginx服务？

如何确定就是本地 nginx 提供的服务呢？有 2 个方法：

- 方法一：**PING**

ping ip，看看是否解析到设置的url，比如[http://baidu.com](https://link.zhihu.com/?target=http%3A//baidu.com)等

- 方法二：**观察访问日志**

查看nginx 服务器的访问日志，看nginx 服务器是否能够正常提供服务。

### nging不支持`.mjs`?

修改`/etc/nginx/mime.types`中的`application/javascript`为`js mjs cjs;`

然后`sudo nginx -s reload`