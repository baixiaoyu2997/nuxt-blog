---
title: MongoDB指南
category: 分享
tags:
  - MongoDB
date: 2020-11-13
vssue-title: MongoDB指南
---

# 介绍

MongoDB 是非关系型数据库。

MongoDB 的存储结构 以前我们的关系型数据库的数据结构都是顶层是库，库下面是表，表下面是数据。但是 MongoDB 有所不同，库下面是集合，集合下面是文档

## 下载

地址： https://www.mongodb.com/try/download/community

## 安装

参考官方文档：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition

安装完毕后，使用`mongod --config /usr/local/etc/mongod.conf --fork`命令启动,想要手动关闭使用命令`db.shutdownServer()`

如果成功了，那么会输出如下日志：

```diff
{"t":{"$date":"2020-11-13T14:22:31.986+08:00"},"s":"I",  "c":"CONTROL",  "id":23285,   "ctx":"main","msg":"Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'"}
{"t":{"$date":"2020-11-13T14:22:31.991+08:00"},"s":"W",  "c":"ASIO",     "id":22601,   "ctx":"main","msg":"No TransportLayer configured during NetworkInterface startup"}
{"t":{"$date":"2020-11-13T14:22:31.991+08:00"},"s":"I",  "c":"NETWORK",  "id":4648602, "ctx":"main","msg":"Implicit TCP FastOpen in use."}
+ {"t":{"$date":"2020-11-13T14:22:31.991+08:00"},"s":"I",  "c":"STORAGE",  "id":4615611, "ctx":"initandlisten","msg":"MongoDB starting","attr":{"pid":2926,"port":27017,"dbPath":"/data/db","architecture":"64-bit","host":"2997"}}
{"t":{"$date":"2020-11-13T14:22:31.991+08:00"},"s":"I",  "c":"CONTROL",  "id":23403,   "ctx":"initandlisten","msg":"Build Info","attr":{"buildInfo":{"version":"4.4.1","gitVersion":"ad91a93a5a31e175f5cbf8c69561e788bbc55ce1","modules":[],"allocator":"system","environment":{"distarch":"x86_64","target_arch":"x86_64"}}}}
{"t":{"$date":"2020-11-13T14:22:31.991+08:00"},"s":"I",  "c":"CONTROL",  "id":51765,   "ctx":"initandlisten","msg":"Operating System","attr":{"os":{"name":"Mac OS X","version":"19.6.0"}}}
{"t":{"$date":"2020-11-13T14:22:32.000+08:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{}}}
{"t":{"$date":"2020-11-13T14:22:32.006+08:00"},"s":"I",  "c":"STORAGE",  "id":22315,   "ctx":"initandlisten","msg":"Opening WiredTiger","attr":{"config":"create,cache_size=7680M,session_max=33000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000,close_scan_interval=10,close_handle_minimum=250),statistics_log=(wait=0),verbose=[recovery_progress,checkpoint_progress,compact_progress],"}}
{"t":{"$date":"2020-11-13T14:22:32.539+08:00"},"s":"I",  "c":"STORAGE",  "id":22430,   "ctx":"initandlisten","msg":"WiredTiger message","attr":{"message":"[1605248552:539974][2926:0x116f06dc0], txn-recover: [WT_VERB_RECOVERY | WT_VERB_RECOVERY_PROGRESS] Set global recovery timestamp: (0, 0)"}}
{"t":{"$date":"2020-11-13T14:22:32.540+08:00"},"s":"I",  "c":"STORAGE",  "id":22430,   "ctx":"initandlisten","msg":"WiredTiger message","attr":{"message":"[1605248552:540061][2926:0x116f06dc0], txn-recover: [WT_VERB_RECOVERY | WT_VERB_RECOVERY_PROGRESS] Set global oldest timestamp: (0, 0)"}}
{"t":{"$date":"2020-11-13T14:22:32.585+08:00"},"s":"I",  "c":"STORAGE",  "id":4795906, "ctx":"initandlisten","msg":"WiredTiger opened","attr":{"durationMillis":579}}
{"t":{"$date":"2020-11-13T14:22:32.585+08:00"},"s":"I",  "c":"RECOVERY", "id":23987,   "ctx":"initandlisten","msg":"WiredTiger recoveryTimestamp","attr":{"recoveryTimestamp":{"$timestamp":{"t":0,"i":0}}}}
{"t":{"$date":"2020-11-13T14:22:32.626+08:00"},"s":"I",  "c":"STORAGE",  "id":22262,   "ctx":"initandlisten","msg":"Timestamp monitor starting"}
{"t":{"$date":"2020-11-13T14:22:32.627+08:00"},"s":"W",  "c":"CONTROL",  "id":22120,   "ctx":"initandlisten","msg":"Access control is not enabled for the database. Read and write access to data and configuration is unrestricted","tags":["startupWarnings"]}
{"t":{"$date":"2020-11-13T14:22:32.627+08:00"},"s":"W",  "c":"CONTROL",  "id":22140,   "ctx":"initandlisten","msg":"This server is bound to localhost. Remote systems will be unable to connect to this server. Start the server with --bind_ip <address> to specify which IP addresses it should serve responses from, or with --bind_ip_all to bind to all interfaces. If this behavior is desired, start the server with --bind_ip 127.0.0.1 to disable this warning","tags":["startupWarnings"]}
{"t":{"$date":"2020-11-13T14:22:32.627+08:00"},"s":"W",  "c":"CONTROL",  "id":22184,   "ctx":"initandlisten","msg":"Soft rlimits too low","attr":{"currentValue":8192,"recommendedMinimum":64000},"tags":["startupWarnings"]}
{"t":{"$date":"2020-11-13T14:22:32.631+08:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"initandlisten","msg":"createCollection","attr":{"namespace":"admin.system.version","uuidDisposition":"provided","uuid":{"uuid":{"$uuid":"6d53eaa2-0afd-4322-aa09-15203edca039"}},"options":{"uuid":{"$uuid":"6d53eaa2-0afd-4322-aa09-15203edca039"}}}}
{"t":{"$date":"2020-11-13T14:22:32.677+08:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"initandlisten","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"admin.system.version","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
{"t":{"$date":"2020-11-13T14:22:32.679+08:00"},"s":"I",  "c":"COMMAND",  "id":20459,   "ctx":"initandlisten","msg":"Setting featureCompatibilityVersion","attr":{"newVersion":"4.4"}}
{"t":{"$date":"2020-11-13T14:22:32.680+08:00"},"s":"I",  "c":"STORAGE",  "id":20536,   "ctx":"initandlisten","msg":"Flow Control is enabled on this deployment"}
{"t":{"$date":"2020-11-13T14:22:32.682+08:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"initandlisten","msg":"createCollection","attr":{"namespace":"local.startup_log","uuidDisposition":"generated","uuid":{"uuid":{"$uuid":"e1c9416f-df99-4ab4-8566-618b90fed819"}},"options":{"capped":true,"size":10485760}}}
{"t":{"$date":"2020-11-13T14:22:32.718+08:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"initandlisten","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"local.startup_log","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
{"t":{"$date":"2020-11-13T14:22:32.718+08:00"},"s":"I",  "c":"FTDC",     "id":20625,   "ctx":"initandlisten","msg":"Initializing full-time diagnostic data capture","attr":{"dataDirectory":"/data/db/diagnostic.data"}}
{"t":{"$date":"2020-11-13T14:22:32.720+08:00"},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"/tmp/mongodb-27017.sock"}}
{"t":{"$date":"2020-11-13T14:22:32.720+08:00"},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"127.0.0.1"}}
{"t":{"$date":"2020-11-13T14:22:32.720+08:00"},"s":"I",  "c":"NETWORK",  "id":23016,   "ctx":"listener","msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
{"t":{"$date":"2020-11-13T14:22:32.722+08:00"},"s":"I",  "c":"CONTROL",  "id":20712,   "ctx":"LogicalSessionCacheReap","msg":"Sessions collection is not set up; waiting until next sessions reap interval","attr":{"error":"NamespaceNotFound: config.system.sessions does not exist"}}
{"t":{"$date":"2020-11-13T14:22:32.722+08:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"LogicalSessionCacheRefresh","msg":"createCollection","attr":{"namespace":"config.system.sessions","uuidDisposition":"generated","uuid":{"uuid":{"$uuid":"f33a4f9e-c6ea-439d-a042-89ef5c27a705"}},"options":{}}}
{"t":{"$date":"2020-11-13T14:22:32.782+08:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"config.system.sessions","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
{"t":{"$date":"2020-11-13T14:22:32.782+08:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"config.system.sessions","index":"lsidTTLIndex","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
```

代码高亮部分显示服务启动在端口`27017`上

### 连接数据库

现在数据库已经启动了，我们可以通过新打开一个命令行来对其操控：

```
$ mongo
> show dbs
admin 0.000GB
config 0.000GB
local 0.000GB

> db.version()
4.4.1
```

### 可执行文件

通过 shell 可以运行命令，但是太过于麻烦，`mongo`可以执行 js 文件（对的，你没看错，越来越像 node 了）,编写 js 文件：

```js
// goTask.js
const userName = "L.Rain";
const timeStamp = Date.parse(new Date());
const jsonDdatabase = { loginUnser: userName, loginTime: timeStamp };
const db = connect("log");
db.login.insert(jsonDdatabase);
print("[demo]log pritn success");
```

使用 mongo 调用：

```sh
mongo goTask.js
```

#### 连接数据库

在`js`文件中需要使用`connect(db)`来连接到指定数据库,如果指定的数据库不存在，则创建该数据库：

```js
const db = connect("company");
```

## mongo shell

> https://docs.mongodb.com/manual/reference/method/ > https://docs.mongodb.com/manual/reference/command/nav-administration/

- show dbs:显示已有数据库，默认会有`admin、config、local`，这些名字是不允许使用的
- show users:显示该库下所有用户
- `use <db>`: 进入数据库，如果该数据库不存在则新建。
- show collections:显示数据库中的集合（关系型中叫表）
- db: 显示当前所在数据库,当刚从`mongo`命令进入时，默认应该返回`test`
- load: 执行 已存在 js 文件并
- `mongod --auth`:使用账户密码登陆，再次登录时需要使用`mongo -u <用户名> -p <密码> <ip:port>/admin`的形式才能登录。

### 换行

> https://docs.mongodb.com/manual/mongo/#multi-line-operations-in-the-mongo-shell

如果第一行是以`(`或者`{`或者`[`那么回车就会出现换行

## 备份

```
mongodump
  --host 127.0.0.1
  --port 27017
  --out D://databack/backup
  --collection myCollections
  --db test
  --username username
  --password password
```

## 恢复

```
mongostore
  --host 127.0.0.1
  --port 27017
  --username username
  --password password
  <path to the backup>
```

## Mongoose

Mongoose 是在 node.js 异步环境下对 mongodb 进行便捷操作的对象模型工具。简化编写 MongoDB 验证，转换和业务逻辑，Mongoose 为模型提供了一种直接的，基于 schema 结构去定义你的数据模型。它内置数据验证， 查询构建，业务逻辑钩子等，开箱即用。

Mongoose 会缓冲所有命令，直到它连接到数据库为止。这意味着你不必等到它连接到 MongoDB 即可定义模型，运行查询等。

Mongoose 有两个特点：

- 通过关系型数据库的思想来设计非关系型数据库
- 基于 mongodb 驱动，简化操作

### api

https://mongoosejs.com/docs/api.html

### 中间件

Mongoose 4.x 有四种中间件： document 中间件，model 中间件，aggregate 中间件，和 query 中间件。  
所有中间件支持 pre 和 post 钩子

pre 钩子分串行和并行两种

### connect

连接数据库：

```js
const mongoose = require("mongoose");

// 用户名密码形式登录
mongoose
  .connect("mongodb://test:test123456@ds119210.mlab.com:19210/koa-restful-api")
  .then(() => {
    console.log("连接成功");
  })
  .catch((err) => {
    console.log(err);
  });
```

连接本地数据库的话就是连接改成`mongodb://localhost:27017/<DATABASE_NAME>`

### Schema
每个schema就会映射到mongodb中的集合，对数据库表的定义，不具备对数据库的操作能力，Schema 有多个[中间件](http://www.mongoosejs.net/docs/middleware.html)

```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: Number,
});
```

#### 设置索引

普通索引,只需要添加`index:true`：

```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: Number,
  sn: {
    type: String,
    index: true,
  },
});
```

#### 添加 Model 自定义静态方法

```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: {
    type: Number,
    default: 1,
  },
});
UserSchema.statics.findBySn = function (sn, cb) {
  // this指向当前的Model类
  this.find({ sn: sn }, (err, doc) => {
    cb(err, doc);
  });
};
// 使用
UserModel.findBySn('sdf12312',(err,data)=>{
  console.log(data)
})
```
#### 添加Model实例方法
```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: {
    type: Number,
    default: 1,
  },
});
UserSchema.methods.print = function () {
  // this指向当前的model实例
  console.log(this.name)
};
// 使用
const u=new User({
  name:'李四7',
  age:'123',
  status:1
})
u.print() // 李四7
```\
#### 数据校验
内置的数据校验有：
- required:必传
- max：用于Number类型，最大值
- min：用于Number类型，最小值
- enum：用于String类型，枚举类型，要求数据必须满足枚举值，例如：enum:['0','1','2']
- match:用于String类型，数据必须复合match（正则）的规则
- maxlength：用于String类型，最大长度
- minlength：用于String类型，最小长度
```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: {
    type: Number,
    required:true
  },
});
```
自定义的验证方法,加入`validate`函数，可以使用在任意类型里：
```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: {
    type: Number,
    validate(status){
      return status===0
    }
  },
});
```
### SchemaType

Schema 支持的类型有：

```
String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
Decimal128
Map
Schema
```

定义类型时可以直接赋值为字符串形式，定义类型：

```js
const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: Number,
});
```

也可以用对象形式添加额外的选项：

```js
const schema = new Schema({
  updated: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 65 },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  decimal: Schema.Types.Decimal128,
  array: [],
  ofString: [String],
  ofNumber: [Number],
  ofDates: [Date],
  ofBuffer: [Buffer],
  ofBoolean: [Boolean],
  ofMixed: [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays: [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true },
  },
  map: Map,
  mapOfString: {
    type: Map,
    of: String,
  },
});
```

常用额外参数：

- type 类型
- default 默认值

#### 预定义模式修饰符

对增加的数据进行一些格式化。例如：`lowercase、uppercase、trim`

```js
const NewsSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
});
```

#### 自定义修饰符

除了内置的修饰符还可以使用 set 修饰符在增加数据的时候对数据进行格式化。也可以通过 get（不建议使用）在实例获取数据时对数据进行格式化。

```js
const NewsSchema = mongoose.Schema({
  title: {
    type: String,
    set(title) {
      return title;
    },
  },
});
```

### Model

由 Schema 发布生成的模型，具有抽象属性和行为的数据库操作对,可以对集合进行删、改、查，新增应该放到`Document`中`save()`

```js
var db = mongoose.connect("mongodb://127.0.0.1:27017/test");
// 创建Model
var TestModel = db.model("Test1", TestSchema);
```

`Mongoose.prototype.model()`参数解析：

- 第一个参数是 model 的 name 或者是要继承的 Model，如果没有第三个参数，那么表示该 model 对第一个参数名+s 的集合生效,如果第一个参数本身就是带`s`的话，那么找到的就是同名的集合。集合首字母小写。
- 第二个参数是 schema
- 第三个参数是集合名称
- 第四个参数是 skipInit
#### model.save(callback)
保存数据，首先初始化model:
```js
const news=new News({
  title:'我是新闻',
  author:'张三',
  content:'我是内容',
  status:1
})
news.save(callback)
```
#### model.updateOne(query,params，callback)
修改数据
#### model.deleteOne(query,callback)
删除数据
#### model.aggregate([],callback)
聚合管道
### Document

由 Model 创建的实体，他的操作也会影响数据库，相当于`Model.create(req.body)`

```js
const u = new User({
  name: "李四6",
  age: "123",
  status: 1,
});
```

Model 实例化时会做以下几件事：

- 尝试转换参数类型，比如定义`User model`时，`age`类型为`Number`,那么会转化`'123'`为`123`,如果转化失败则`u`中不会包含`age`属性。
- 如果添加没有在 Model 中定义的字段，那么实例化时生成的的 document 不会包含该字段。
- 如果没有传入定义时的字段，则该字段不会被添加到数据库。

#### 常用方法

1. save() 保存数据

## 最佳实践

### 批量插入性能

循环单个插入和批量一次插入，速度会差很多，优先使用批量插入。

## 问题

### Address already in use

说明端口已经被占用，可以使用另外一个端口：

```sh
mongod --port 27018
```

或者杀掉所有 mongod 进程：

```sh
sudo killall mongod
```

### Attempted to create a lock file on a read-only directory: /data/db

导致这个问题的原因是该文件夹的用户权限问题，检查该目录的所属：

```sh
cd /data/
ls -l
```

发现输出是`root`,不是当前用户，所以修改成当前用户就 ok 了：

```sh
sudo chown -R xxx /data/db/
```
# 基础知识
## 关系数据库中表与表的3中关系
1. 一对一
1. 一对多
1. 多对多，一般通过中间表对双方的信息进行保存
# API

## Database Methods

### use <DATABASE_NAME>

创建数据库

### db.auth(<username>, <password>)

用户建权，建权成功返回 1，失败返回 0

### db.createUser(user,writeConcern)

数据库创建用户和权限

参数 user：

```
{
  user: "<name>",
  pwd: passwordPrompt(),      // Or  "<cleartext password>"
  customData: { <any information> },
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ],
  authenticationRestrictions: [
     {
       clientSource: ["<IP>" | "<CIDR range>", ...],
       serverAddress: ["<IP>" | "<CIDR range>", ...]
     },
     ...
  ],
  mechanisms: [ "<SCRAM-SHA-1|SCRAM-SHA-256>", ... ],
  passwordDigestor: "<server|client>"
}
```

其中`<role>`的内置可选值为：

1. 数据库用户角色：read、readWrite；
1. 数据库管理角色：dbAdmin、dbOwner、userAdmin;
1. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManage；
1. 备份恢复角色：backup、restore；
1. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
1. 超级用户角色：root
1. 内部角色：\_\_system 
### db.updateUser()
修改用户
### db.dropUser()
删除用户
### db.dropDatabase()

删除当前数据库

### db.runCommand()

提供帮助程序以运行指定的数据库命令。这是发出数据库命令的首选方法，因为它在 shell 和程序之间提供了一致的接口。

## collection Methods(集合)

在对数据进行修改的时候不能只修改对应的属性，应该返回整个新的文档。
### db.collection.explain()
返回有关以下查询方法的信息：
- aggregate
- count 
- find
- remove
- update
- distinct
- findAndModify
- mapReduce

参数：`"queryPlanner" (Default)|"executionStats"｜"allPlansExecution"`  

#### 查看是否命中索引
可以通过传入executionStats参数，查看返回信息中的`indexBounds`来判断是否命中索引

### db.collection.insert

插入数据，当集合不存在时，新建集合,注意一次插入不要超过 48M，向.zip 和大图片什么的尽量用静态存储，MongoDB 存储静态路径就好，这也算是一个规则。

### db.collection.remove

第一个参数是查询，第二个参数是选项是否只删除一个。

### db.collection.drop

清空当前集合

### db.collection.update

```js
update(query,update, {upsert:<boolean>,multi: <boolean>,writeConcern: <document>,collation: <document>, arrayFilters: [ <filterdocument1>, ... ],hint: <document | string>// Available starting in MongoDB 4.2})
```

修改文档，,query 为查询，update 参数为修改为，options：

- multi 为 true 时，修改所有匹配的文档，默认值为 false
- upsert 为 true 时，如果不存在该数据，则插入该条数据，默认值为 false

### db.collection.findAndModify

修改并返回文档，平时工作中更多是用这个方法来进行数据库的修改，因为有返回状态，虽然性能没有直接使用命令快，但是更安全。  
参数：

```
db.collection.findAndModify({
    query: <document>, // 需要查询的条件/文档
    sort: <document>,  // 进行排序
    remove: <boolean>,
    update: <document or aggregation pipeline>, // Changed in MongoDB 4.2
    new: <boolean>, // 是否返回修改后文档
    fields: <document>, // 需要返回的字段
    upsert: <boolean>,  // 没有要修改的值时是否新增这个值
    bypassDocumentValidation: <boolean>,
    writeConcern: <document>,
    collation: <document>,
    arrayFilters: [ <filterdocument1>, ... ]
});
```

例子：

```js
var myModify = {
  findAndModify: "workmate",
  query: { name: "JSPang" },
  update: { $set: { age: 18 } },
  new: true, //更新完成，需要查看结果，如果为false不进行查看结果
};
var ResultMessage = db.runCommand(myModify);

printjson(ResultMessage);
```

### db.collection.find

参数：

- query, 查询参数,如果参数为{}则返回所有
  - 如果查询数组，那么使用`[]`则精确查询，例如：`{interest:['看电影']}`,如果使用字符串，则为查询包含该值的数据，例如：`{interest:'看电影'}`
- projection，要返回的字段，不传递参数则全部返回，设置参数后默认返回`_id`
  - 取消默认返回`_id`，可以添加参数`{_id:false}`,值也可以是`0或1`,例如：`{name:true,"skill.skillOne":true,_id:false}` 返回：
- cursor 游标,可以使用游标的方法来对返回做处理

对返回游标进行遍历：

```js
var db = connect("company"); //进行链接对应的集合collections
var result = db.workmate.find(); //声明变量result，并把查询结果赋值给result
//利用游标的hasNext()进行循环输出结果。
result.forEach(function (result) {
  printjson(result);
});
```

### db.collection.findOne

查找第一个

### db.collection.createIndex(keys, options, commitQuorum)

为数据建立索引。索引是特殊的数据结构，索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构。无论是在关系型数据库还是文档数据库，建立索引都是非常重要的。索引会消耗硬盘和内存资源，所以还是要根据程序需要进行建立。MongoDB 也给我们进行了限制，只允许我们建立 64 个索引值。

参数：

- keys 表示需要建立所以的属性，例如：`{text:1}`,值为 1 表示升序，值为-1 表示降序
- options

#### 索引中的问题：

- 数据不超万条时，不需要使用索引。性能的提升并不明显，而大大增加了内存和硬盘的消耗。
- 查询数据超过表数据量 30%时，不要使用索引字段查询。实际证明会比不使用索引更慢，因为它大量检索了索引表和我们原表。
- 数字索引（即值为数字的 key），要比字符串索引快的多，在百万级甚至千万级数据量面前，使用数字索引是个明确的选择。
- 把你经常查询的数据做成一个内嵌数据（对象型的数据），然后集体进行索引。

#### 复合索引
在 find 中使用多个建立索引的 key 时，按照建立 getIndexes()中的顺序查找。 

#### 全文索引
- key 值为 text 则创建全文索引：`db.info.createIndex({textContent:'text'})`
- 搜索全文索引：`db.info.find({$text:{$search:"programmer"}})`,使用\$text 表示使用全文索引搜索 
  - 查找多个词：`db.info.find({$text:{$search:"programmer family diary drink"}})`,搜索出来的结果是`或`的关系,会把包含这些字的数据都查出来，
  - 如果不想查带有`drink`文字的数据，那么使用`-`表示：`db.info.find({$text:{$search:"programmer family diary -drink"}})`
  - 查找带有空格的词语,使用转义符：`db.info.find({$text:{$search:"\"love PlayGame\" drink"}})`
#### 唯一索引
在缺省情况下创建的索引都不是唯一索引，在第二个参数中添加`{unique:true}`则创建唯一索引
### db.collection.getIndexes()

查看现有索引

### db.collection.dropIndex(index)

删除索引，参数为索引 name 或者索引 key 值：

```js
db.test.dropIndex("catIdx");
db.test.dropIndex({ cat: -1 });
```
### db.collection.aggregate([])
聚合管道，通过聚合管道可以对集合进行变幻组合，实际项目中通常用作：表关联查询、数据的统计。
#### 管道操作符
|名称|说明|类型|
| -- | -- | -- |
|$project|增加、删除、重命名字段||
|$match| 条件匹配。只满足条件的文档才能进入下一阶段||
|$limit| 限制结果的数量||
|$skip| 跳过文档的数量||
|$sort| 条件排序||
|$group| 条件组合结果、统计、分组||
|$lookup| 用以引入其他集合的数据（表关联查询）||
#### $project
```sh
db.order.aggregate([
  {
    $project:{trade_no:1,all_price:1} // 返回的数据只包含`trade_no`和`all_price`
  }
])
```
#### $match
```sh
db.order.aggregate([
  {
    $project:{trade_no:1,all_price:1}
  },
  {
    $match:{"all_price":{$gte:90}} // 返回的数据只包含`trade_no`和`all_price`，并且all_price大于等于90
  }
])
```
#### $group 
```sh 
db.order_item.aggregate([
  {
    $group:{_id:'$order_id',total:{$sum:"$num"}} // 使用order_id字段分组，返回的数据中包含`_id`和`total`字段，`total`字段值为分组后的num字段之和
  }
])
```
#### $sort
```sh
db.order.aggregate([
  {
    $project:{trade_no:1,all_price:1}
  },
  {
    $match:{"all_price":{$gte:90}}
  },
  {
    $sort:{"all_price":-1}  // 返回的数据只包含`trade_no`和`all_price`，并且all_price大于等于90，按照降序排序
  }
])
```
#### $lookup
```
db.order.aggregate([
  {
    $lookup:{
      from:'order_item',  // 关联的集合
      localField:'order_id', // 主表（order）字段
      foreignField:'order_id', // 关联表（order_item）字段
      as:"items" // 查询出来的数据作为`items`字段返回
    }
  }
])
```
## 操作符

https://docs.mongodb.com/manual/reference/operator/update/

### \$set

用`$set`操作符就可以实现单独新增、修改属性：

```js
db.workmate.update({ name: "MinJie" }, { $set: { sex: 2, age: 21 } });
```

如果嵌套文档可以是用属性的形式进行修改：

```js
db.workmate.update(
  { name: "MinJie" },
  { $set: { "skill.skillThree": "word" } }
);
```

修改数组时，如果不知道具体值，只知道位置，可以通过 index 修改：

```js
db.workmate.update({ name: "xiaoWang" }, { $set: { "interest.2": "Code" } });
```

### \$unset

使用`$unset`可以删除键值对：

```js
db.workmate.update({ name: "MinJie" }, { $unset: { age: "" } });
```

### \$inc

对数字进行计算：

```js
db.workmate.update({ name: "MinJie" }, { $inc: { age: -2 } });
```

### \$push

对数组文档进行操作，如果该数组不存在则创建新数组，如果修改属性不为数组，则什么都不做。支持内嵌属性格式。

```js
db.workmate.update({ name: "MinJie" }, { $push: { interest: "draw" } });
```

### \$addToSet

相当于`<update>`版的$ne，平时更多是使用$addToSet 而不是\$ne

### \$pop

删除数组的起始值或者末尾值，根据参数决定

- 1:从数组末端删除
- -1:从数组开头删除

```js
db.workmate.update({ name: "xiaoWang" }, { $pop: { interest: 1 } });
```

### \$in

用于搜索一键多值，值为数组形式，值满足其中一项即可，比如搜索同事中年龄是 25 岁或 33 岁的信息：

```js
db.workmate.find(
  { age: { $in: [25, 33] } },
  { name: 1, "skill.skillOne": 1, age: 1, _id: 0 }
);
```

### \$nin

与\$in 相反，匹配 值不等于输入的文档

### \$or

查询多个键值，与$in不同的是，$in 是用来查询等于，\$or 可以进行比较查询：

```js
db.workmate.find(
  { $or: [{ age: { $gte: 30 } }, { "skill.skillThree": "PHP" }] },
  { name: 1, "skill.skillThree": 1, age: 1, _id: 0 }
);
```

### \$nor

与\$or 相反

### \$and

用来查找几个 key 值都满足的情况,语法同\$or

### \$not

它用来查询除条件之外的值，比如我们现在要查找除年龄大于 20 岁，小于 30 岁的人员信。

```js
db.workmate.find(
  {
    age: {
      $not: {
        $lte: 30,
        $gte: 20,
      },
    },
  },
  { name: 1, "skill.skillOne": 1, age: 1, _id: 0 }
);
```

### \$all

用于数组多项查询,需要满足所有条件：

```js
db.workmate.find(
  { interest: { $all: ["看电影", "看书"] } },
  { name: 1, interest: 1, age: 1, _id: 0 }
);
```

### \$size

根据数组的长度查询出结果。

```js
db.workmate.find(
  { interest: { $size: 5 } },
  { name: 1, interest: 1, age: 1, _id: 0 }
);
```

### \$where

它可以让我们在条件里使用 js 的方法来进行复杂查询：

```js
db.workmate.find(
  { $where: "this.age>30" },
  { name: true, age: true, _id: false }
);
```

this 指向 workmate 集合本身，虽然强大和灵活，但是这种查询对于数据库的压力和安全性都会变重，不推荐使用。

## Projection 操作符

> 用于对返回数据进行操作

### \$slice

指定返回数据的长度：

```js
db.workmate.find({}, { name: 1, interest: { $slice: 2 }, age: 1, _id: 0 });
```

## cursor 游标

### cursor.limit(number)

控制返回值数量，参数为 0 时不做限制。此方法对分页有用。

### cursor.skip(number)

指定从何处开始返回结果，此方法对分页有用。

### cursor.sort(<document>)

对返回值排序，可以指定属性按照升序还是降序排序,升序值为 1，降序为-1：

```
db.users.find({ }).sort( { age : -1, posts: 1 } )

```

### cursor.hasNext()

如果 db.collection.find()查询返回的游标可以进一步迭代以返回更多文档，则返回 true。  
使用 while 遍历:

```js
var db = connect("company"); //进行链接对应的集合collections
var result = db.workmate.find(); //声明变量result，并把查询结果赋值给result
//利用游标的hasNext()进行循环输出结果。
while (result.hasNext()) {
  printjson(result.next()); //用json格式打印结果
}
```

### cursor.hint(index)

调用此方法来覆盖默认的索引顺序：

```js
// 使用randNum0进行索引查找
db.randomInfo
  .find({ usename: "zkcvjlsdkfjslf", randNum0: 908274 })
  .hint({ randNum0: 1 });
```

## 修饰符

> 比较大小可用于数字格式、时间格式

### \$each

批量操作，可与`$addToSet`和`$push`一起使用

```js
var newInterset = ["Sing", "Dance", "Code"];
db.workmate.update(
  { name: "xiaoWang" },
  { $addToSet: { interest: { $each: newInterset } } }
);
```

### \$lt

小于，全称`less-than`

### lte

小于等于，英文全称`less-than-equal`

### \$gt

大于，英文全称`greater-than`

### \$gte

大于等于，英文全称`greater-than-equal`

### \$ne

不等于，\$ne 用于`<query>`，查找是否不存在值。

当用于对象时，判断的值应为整个对象：

```js
db.workmate.update(
  {
    name: "MinJie",
    skill: {
      $ne: {
        skillOne: "PhotoShop",
        SkillTwo: "UI",
        SkillThree: "Word+Excel+PPT",
      },
    },
  },
  { $push: { interest: "talk4" } }
);
```

当用于数组时，判断是否包括该值：

```js
db.workmate.update(
  { name: "xiaoWang", interest: { $ne: "playGame" } },
  { $push: { interest: "Game" } }
);
```
