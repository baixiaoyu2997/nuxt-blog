---
title: koa指南
category: 分享
tags:
  - koa
date: 2020-11-09
vssue-title: koa指南
---

## 前置知识

koa 基于 express 制作，而 exporess 的基础是 connect

### connect

最简单的 Connect 程序应该是这样的:

```js
const app = require("connect")();
app.use((req, res, next) => {
  3;
  res.end("Hello, world!");
});
app.listen(3000);
```

#### 工作机制

connect 中间件就是 js 函数。这个函数一般会有 3 个参数：请求对象、响应对象、next 回调函数。一个中间件完成自己的工作，要执行后续的中间件时，可以调用这个回调函数。

#### 组合中间件

connect 中的 use 方法就是用来组合中间件的，use()函数返回的是 connect 程序的实例，支持方法链。use 的调用顺序很重要。如果某个中间件不调用 next(),那链在它后面的中间件就不会被调用。

#### 可配置中间件

为了做到可配置，中间件一般会遵循一个简单的惯例：用一个函数返回另一个函数（闭包）：

```js
function setup(options) {
  // 设置逻辑，这里做中间件的初始化
  return function (req, res, next) {
    // 中间件逻辑，即使被外部函数返回了，仍然可以访问options
  };
}
```

这种中间件的用法如下：

```js
app.use(setup({ some: "options" }));
```

#### 错误处理中间件

1. connect 的默认错误处理器

因为函数 foo()没有定义，所以下面这个中间件会抛出错误 ReferenceError:

```js
const connect = require("connect");
connect()
  .use((req, res) => {
    foo();
    res.setHeader("Content-Type", "text/plain");
    res.end("hello world");
  })
  .listen(3000);
```

Connect 默认的处理是返回响应状态码 500，响应主体是文本 Internal Server Error 和错误的详 细信息。  
2. 自行处理程序错误

错误处理中间件函数必须有 4 个参数：err、req、res 和 next

```js
const env = process.env.NODE_ENV || "development";
function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  switch (env) {
    case "development":
      console.error("Error:");
      console.error(err);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(err));
      break;
    default:
      res.end("Server error");
  }
}
module.exports = errorHandler;
```

当 connect 遇到错误时，它会切换，只去调用错误处理中间件，connect 通过参数数量来区分是普通中间件还是错误处理中间件 ![koa指南_2020-11-09-14-34-01](https://blog-pic.oss-cn-beijing.aliyuncs.com/koa指南_2020-11-09-14-34-01.png)

### Express

极简的 express 程序：

```js
const express = require("exporess");
const app = exporess();

app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(3000);
```

通过`express-generator`可以自动生成程序模版

#### 变更 css 支持

```sh
npx express-generator -c css|sass|less
```

#### 添加对 ejs 的支持

```sh
npx express-generator -e
```

#### 配置环境变量

Express 有一个极简的环境驱动配置系统，这个系统由几个方法组成，全部由环境变量 NODE_ENV 驱动:

```js
app.set();
app.get();
app.enable(); // 设置boolean值时，使用
app.disable();
app.enabled(); // 检测环境变量
app.disabled();
```

#### 渲染视图

Express 中有两种渲染视图的办法:程序层面用 app.render()，在请求或响应层面用 res.render()，Express 内部用的是前一种。

#### 传递参数

按照优先级排序：

- res.render()的参数
- res.locals 传递请求层面的数据
- app.locals 传递程序层面的数据

默认情况下 express 只会向视图中传递一个程序集变量`settings`,这个对象中包含所有用`app.set()`设定的值。实际上 express 是像下面这样输出这个对象的：`app.locals.settings=app.settings`

#### 路由

可以使用中间件

## Koa2

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。
```
http pro + 中间件 = koa // koa相当于http模块的增强版加上中间件功能
```
### 学习顺序
基础：
1. 官网[api](https://koa.bootcss.com/) 先看一遍：了解一下koa都有什么。
1. [阮一峰博客](http://www.ruanyifeng.com/blog/2017/08/koa.html)：了解一下开发流程和koa生态

进阶：
1. Koa教程_Koa+Nodejs+MongoDb打造企业级CMS前后端全栈实战教程(大地-赞助）
### koa中间价
中间件的功能包括：
- 执行任何代码
- 修改请求和响应对象
- 终结请求-响应循环
- 调用堆栈中的下一个中间件

中间件分为：应用级中间件和路由级中间件
### koa 中间件的执行顺序

koa 的中间件和 express 不同，koa 选择了洋葱圈模型。 ![koa指南_2020-11-12-11-33-54](https://blog-pic.oss-cn-beijing.aliyuncs.com/koa指南_2020-11-12-11-33-54.png) 中间件的顺序很重要，也就是调用`app.use()`的顺序决定了 middleware 的顺序。

### koa 实例

#### app.listen

app.listen 方法只是以下方法的语法糖：

```js
const http=require('http);
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);

```

#### app.use(function)

将给定的中间件方法添加到此应用程序。app.use()返回 this,因此可以链式表达

#### app.context

app.context 是从其创建 ctx 的原型。您可以通过编辑`app.context`为 ctx 添加其他属性：

```js
app.context.db = db();

app.use(async (ctx) => {
  console.log(ctx.db);
});
```

ctx 上的许多属性都是使用 getter,setter 和`object.defineProperty()`定义的。你只能通过在`app.context`上使用`Object.defineProperty()`来编辑这些属性（不推荐）

### 上下文（Context）

#### ctx.req

Node 的 request 对象

#### ctx.res

Node 的 response 对象

#### ctx.request

koa 的 Request 对象

#### ctx.response

koa 的 Response 对象

#### ctx.state

推荐的命名空间，用于通过中间件船队信息和你的前端视图。

#### ctx.app

应用程序实例引用

- ctx.app.emit: koa 应用扩展了内部的 Eventemitter。

#### ctx.cookies

内部使用了`cookies`模块  

#### ctx.throw([status], [msg], [properties])

用来抛出一个包含 .status 属性错误的帮助方法，其默认值为 500。这样 Koa 就可以做出适当地响应。  
koa 使用 http-errors 来创建错误。status 只应作为第一个参数传递。

### Request 别名

- ctx.header
- ctx.headers
- ctx.method
- ctx.method=
- ctx.url
- ctx.url=
- ctx.originalUrl
- ctx.origin
- ctx.href
- ctx.path
- ctx.path=
- ctx.query
- ctx.query=
- ctx.querystring
- ctx.querystring=
- ctx.host
- ctx.hostname
- ctx.fresh
- ctx.stale
- ctx.socket
- ctx.protocol
- ctx.secure
- ctx.ip
- ctx.ips
- ctx.subdomains
- ctx.is()
- ctx.accepts()
- ctx.acceptsEncodings()
- ctx.acceptsCharsets()
- ctx.acceptsLanguages()
- ctx.get()

### Response 别名

- ctx.body
- ctx.body=
- ctx.status
- ctx.status=
- ctx.message
- ctx.message=
- ctx.length=
- ctx.length
- ctx.type=
- ctx.type
- ctx.headerSent
- ctx.redirect()
- ctx.attachment()
- ctx.set()
- ctx.append()
- ctx.remove()
- ctx.lastModified=
- ctx.etag=

### 响应（Response）

#### response.status

获取响应状态，默认 404，而不是像 node 的 res.statusCode 那样默认 200

### 错误处理

默认情况下，所有错误输出到 stderr，除非 app.silent 为 true,当 err.status 是 404 或 err.expose 是 true 时，默认错误处理程序也不会输出错误。要执行自定义错误处理逻辑，可以添加一个 error 事件监听器：

```js
app.on("error", (err) => {
  log.error("server error", err);
});
```
使用`ctx.throw()`外抛错误
### koa-router

koa本身是把router剥离出去了，所以需要引用`koa-router`包，使用方式：

```js
const Koa=require('koa')
const app=new Koa()
const router=require('koa-router')();

router.get('/hello/:name',async (ctx,next)=>{
    console.log(ctx.params.name)
    var name=ctx.params.name;
    ctx.response.body=`<h1>Hello,${name}!</h1>`
})
router.get('/',async (ctx,next)=>{
    ctx.response.body='<h1>Index</h1>';
})
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
console.log('app started at port 3000.....')
```
`router.allowedMethods()`的作用是什么呢？  
allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头
> 参考：https://www.jianshu.com/p/fef91266a44c  

注意：`'/news'`与`'/news/'`匹配的是不同的路由，需要单独匹配
#### 处理post
无论是node还是koa都没有提供解析request的body的功能。所以，我们需要引入`koa-body`来解析原始request请求。  
注意：`koa-bodyparser`应该在`routes()`之前被`use`
```js
const Koa=require('koa');
const app=new Koa();
const router=require('koa-router')()
const bodyParser=require('koa-body');

router.get('/',async (ctx)=>{
  ctx.body=`
  <form action="/signin" method="post">
    <p><label>用户名：</label><input type="text" name="name" ></p>
    <p><label>密码：</label><input type="password" name="password"></p>
    <button type="submit">submit</button>
  </form>
  `  
})
router.post('/signin',async (ctx)=>{
    const {name,password}=ctx.request.body
    if(name==='admin'&&password==='123456'){
        ctx.body='Welcome Admin!'
    }else{
        ctx.body=`
        <h1>Login failed</h1>
        <p><a href="/">Try again</a></p>
        `
    }
})
app.use(bodyParser())
app.use(router.routes())
app.listen(3000)
console.log('app started at port http://localhost:3000')
```
#### 重定向（redirect）
```js
router.post("/doAdd", async (ctx) => {
  ctx.redirect('/')
});
```
#### 嵌套路由
首先定义好子路由结构：
```js
router.get('/test',(ctx)=>{
  ctx.body="hello,test"
})
module.exports=router.routers()
```
然后定义父节点路由：
```js
const user=require('./routes/api/user')
router.use('/api/user',user)
```
#### 简写
```js
const router=require('koa-router')()  // 实例化简写（推荐）
```

### koa-static
对于静态资源如果要一个个去写路由就很麻烦，也没必要。直接使用`koa-static`
```js
const path = require('path');
const serve = require('koa-static');

app.use(serve('/static')); 
app.use(serve('/public')); // 静态资源中间件可以设置多个，依次查找
```
首先去定义的文件夹查找，如果没有文件则在内部执行`next()`
### koa-session
session配置文件：
```js
const session = require("koa-session");
const CONFIG={
  key:'koa.sess', // cookie key
  maxAge:86400000, // default is 1days
  overwrite:true,
  httpOnly:true,
  secure:true,
  sameSite:null, 
  autoCommit:true, // 自动提交headers
  signed:true, // 签名默认为true
  rolling:false, // 在每次请求时强行设置cookie，这将充值cookie过期时间（默认：false）
  renew:false, // 当session快过期时，重新设置session
}
app.use(session(CONFIG, app));

```
### koa-compose
合成中间件
```js
const compose = require('koa-compose');

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const main = ctx => {
  ctx.response.body = 'Hello World';
};

const middlewares = compose([logger, main]);
app.use(middlewares);
```
### koa-cors
跨域模块：
```js
const cors = require('koa-cors')

// 处理跨域，放到中间件的最前面
app.use(cors());
```
### koa-views
koa页面模版
## 工程化
### 目录结构
```
server
  controllers // 操作层 执行服务端渲染，json接口返回数据，页面跳转
  models // 数据模型层 执行数据操作
  routers // 路由层 控制路由
  services // 业务层 实现数据层model到操作层controller的耦合封装
  views // 服务端模版代码
```
### 自动生成项目
使用`koa-generator`
## 问题
### 如何区分路由还是请求？