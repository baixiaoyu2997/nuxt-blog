---
title: TheGraph学习之旅
category: dapp
tags:
  - the graph
date: 2022-01-14
vssue-title: TheGraph学习之旅
---

## 简介

目前只能初始化一个智能合约，有多个只能合约需要手动添加相关Manifest (subgraph.yaml) 、Schema (schema.graphql)、AssemblyScript Mappings (mapping.ts)

### Why The Graph ？

之前的写法是通过转换sol文件为ts文件，客户端实例化合约来获取数据，使用`The Graph`后相当于是把实例化的过程放到了它的网络上去执行，减少了前端的调用成本，并且是使用graphql语法编写，那么可以随心所欲的配置返回结果。

## hosted-service

这里负责创建和管理线上的subgraph,创建subgraph时如果想要使用组织而不是用户名，则需要先到github中允许该网站的请求权限，然后退出登录再重新登录`the graph`

### 创建账号

在使用hosted service之前需要[创建账号](https://thegraph.com/hosted-service/)

### 保存Access Token

跳转到[dashboard](https://thegraph.com/hosted-service/dashboard),复制token，然后运行`graph auth --product hosted-service <ACCESS_TOKEN>`

### 添加Subgraph

首先需要去[dashboard](https://thegraph.com/hosted-service/dashboard)添加一个subgraph，并填入一下信息：

```
Image - subgraph缩略图

Subgraph Name - 此名字将会和账户名字一起添加，例如`account-name/subgraph-name-style`,此字段无法修改

Account - 创建子图的账户，可以是个人或者组织

Subtitle - 将出现在子图卡片中的文本。

Description - 子图的描述，在子图详细信息页面上可见

GitHub URL - Link to the subgraph repository on GitHub.

Hide - Switching this on hides the subgraph in the Graph Explorer.


```

#### 部署Subgraph

部署子图将会把本地`build`之后的文件上传到IPFS，并且通知`Graph Explorer`开始索引。

部署指令：`yarn deploy`

部署的速度取决于链上需要提取的数据和历史事件，同步可能需要几分钟或几小时。子图的status变成`Synced`表示同步完成，并且会监听新块的产生

重新部署：只需要再次执行`yarn deploy`，会导致`Graph Node`重新索引，如果之前已经部署过，那么新版本会同步完之后再替换旧版本。如果旧版本仍在同步中，则会立即替换旧版本，开始同步新版本。

#### subgraph归档政策

A subgraph is defined as "inactive" if it was deployed to the Hosted Service more than 45 days ago, and if it has received 0 queries in the last 30 days.

如果被标记为不活跃，那么会在删除的7天前发邮件通知用户。

如果想要活跃，只需要发起查询就可以了。被删除也可以重新部署。

## GraphQL API

查询单一实体时，必须带有id字符串

```sql
{
  token(id: "1") {
    id
    owner
  }
}
```

### entites

所有类型为`@entity`指令的都作为实体（目前所有类型必须包含`@entity`，以后可能会去除这个限制），必须包含`ID`字段

### 排序

使用`orderBy`按照特定字段进行排序，`orderDirection`可以用来指定排序方式，`asc`或者`desc`

```sql
{
  tokens(orderBy: price, orderDirection: asc) {
    id
    owner
  }
}
```

### 分页

使用`first`参数，进行分页。默认排序是按id以数字升序排序，不是按照创建时间。`skip`参数可以指定`first`开始位置，也就是说如果`first:100,skip:100`，则从第101开始。应避免使用非常大的`skip`,因为它表现不佳

```sql
{
  tokens(first: 10) {
    id
    owner
  }
}
```

如果要查询大量数据，将查询基于属性并按该属性进行过滤会更高效。比如下边这个例子，第一次，它会发送带有 lastID = "" 的查询，并且对于后续请求，将 lastID 设置为上一个请求中最后一个实体的 id 属性。这种方法将比使用`skip`表现得更好。

```sql
{
  query manyTokens($lastID: String) {
    tokens(first: 1000, where: { id_gt: $lastID  }) {
      id
      owner
    }
  }
}
```

### 过滤

使用`where`属性过滤特定字段，也可以是多个字段。

```sql
{
  challenges(where: { outcome: "failed" }) {
    challenger
    outcome
    application {
      id
    }
  }
}
```

通过添加后缀`_gt、_lte`可以为查询字段添加比较

```sql
{
  applications(where: { deposit_gt: "10000000000" }) {
    id
    whitelisted
    deposit
  }
}
```

有些后缀只能用在特定类型上，所有支持的后缀如下：

```
_not
_gt
_lt
_gte
_lte
_in
_not_in
_contains
_not_contains
_starts_with
_ends_with
_not_starts_with
_not_ends_with
```

### 时间旅行查询

查询不只是在最后一个块查找数据，也可以查询在某个`block`之前的数据，参数可以为块`number`或者块`hash`,这种方式查询的结果不会随时间改变，除非查询的块位置非常靠近主网的头部区块，有可能最终这条数据没有并入主块。

```sql
{
  challenges(block: { number: 8000000 }) {
    challenger
    outcome
    application {
      id
    }
  }
}
```

### 全文搜索

> 从 specVersion 0.0.4 版本开始, fullTextSearch 必须在子图清单的 features 部分下声明。

全文搜索必须包含`text`参数，全文搜索还提供一些特殊的操作符：

1. `&`:用于将多个搜索词组合到过滤器中
2. `|`:或者
3. `<->`: 查找两个中间被隔开的单词
4. `:*`：以某个单位为开头

全文搜索需要添加一个`schema`，需要包含`_Scheam_`type和`@fulltext`指令。这个schema中包含了全文搜索的名称`bandSearch`，以及搜索中包含的字段`include`。每个全文搜索都有可能有多个`field`，但是他们都要来自同一个实体`entity`

```
type _Schema_
  @fulltext(
    name: "bandSearch"
    language: en
    algorithm: rank
    include: [{ entity: "Band", fields: [{ name: "name" }, { name: "description" }, { name: "bio" }] }]
  )

type Band @entity {
  id: ID!
  name: String!
  description: String!
  bio: String
  wallet: Address
  labels: [Label!]!
  discography: [Album!]!
  members: [Musician!]!
}
```



以下示例表示搜索以`lou`开头，后边有`music`的数据

```sql
{
  blogSearch(text: "lou:* <-> music") {
    id
    title
    body
    author
  }
}

```

### Validation

Graph Node implements [specification-based](https://spec.graphql.org/October2021/#sec-Validation) validation of the GraphQL queries it receives using [graphql-tools-rs](https://github.com/dotansimha/graphql-tools-rs#validation-rules), which is based on the [graphql-js reference implementation](https://github.com/graphql/graphql-js/tree/main/src/validation). Queries which fail a validation rule do so with a standard error - visit the [GraphQL spec](https://spec.graphql.org/October2021/#sec-Validation) to learn more.

## 部署

支持两种方式，一种是Ether主网使用subgraph statio，还有一种是其他类型，其他类型网络使用hosted service。

先创建subgraph,获取token`5e1b889bed4745858e7bfb4cf25788f9`,用于`graph auth`指令获取部署权限.

获取权限后就可以使用`yarn deploy`部署了。

部署之后，查看dashboard有一个进度条，显示 Syncing(x%)，这是在同步区块数据。

> cli init时的account和subgraph name一定要和hosted-service中的一致，否则无法部署

## 调试

目前没有什么好的方法，可以通过web3的getPastEvents方法获取事件

## 编写Graph

目前你the graph只支持`queries`定义

### 编写流程

1. 运行codegen会生成相关abi的type文件

1. 在schema.graphql中编写query实体，实体的字段类型应该为codegen生成后的合约文件中相关事件的params类型。然后运行codegen会生成对应字段的实体类
2. 然后在对应的mapping文件中的event函数中根据实体类创建该实体并保存

### Query

当我们查询的时候一般指的是查询实体`@entity`

### load

用来从`Graph Node store`中加载指定实体已经有的数据。

```
 let gravatar = Gravatar.load(id)
```

### 数据类型

the graph支持的数据类型有：

```
- Bytes:	Byte array, represented as a hexadecimal string. Commonly used for Ethereum hashes and addresses.
- ID:	Stored as a string.
- String:	Scalar for string values. Null characters are not supported and are automatically removed.
- Boolean:	Scalar for boolean values.
- Int	The GraphQL spec defines Int to have size of 32 bytes.
- BigInt	Large integers. Used for Ethereum's uint32, int64, uint64, ..., uint256 types. Note: Everything below - uint32, such as int32, uint24 or int8 is represented as i32.
- BigDecimal	BigDecimal High precision decimals represented as a signficand and an exponent. The exponent range is from −6143 to +6144. Rounded to 34 significant digits.
```

### 动态创建合约

除了source字段其他都跟data source相同，这适用于没有合约地址，abi相同的合约。

```
dataSources:
  - kind: ethereum/contract
    name: Factory
    # ... other source fields for the main contract ...
templates:
  - name: Exchange
    kind: ethereum/contract
    network: mainnet
    source:
      abi: Exchange
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      file: ./src/mappings/exchange.ts
      entities:
        - Exchange
      abis:
        - name: Exchange
          file: ./abis/exchange.json
      eventHandlers:
        - event: TokenPurchase(address,uint256,uint256)
          handler: handleTokenPurchase
        - event: EthPurchase(address,uint256,uint256)
          handler: handleEthPurchase
        - event: AddLiquidity(address,uint256,uint256)
          handler: handleAddLiquidity
        - event: RemoveLiquidity(address,uint256,uint256)
          handler: handleRemoveLiquidity

```

#### 实例化动态合约

在合约创建时，使用`create`来实例化,实例化之后才会开始索引该合约：

```
import { Exchange } from '../generated/templates'

export function handleNewExchange(event: NewExchange): void {
  // Start indexing the exchange; `event.params.exchange` is the
  // address of the new exchange contract
  Exchange.create(event.params.exchange)
}
```

新实例化的数据源只处理创建它的块和所有后续块的调用和事件，不会处理之前的历史数据。

#### 上下文

动态创建时还可以带入上下文环境到合约中

```
import { Exchange } from '../generated/templates'

export function handleNewExchange(event: NewExchange): void {
  let context = new DataSourceContext()
  context.setString('tradingPair', event.params.tradingPair)
  Exchange.createWithContext(event.params.exchange, context)
}
```

然后通过`context.getString`获取：

```
import { dataSource } from '@graphprotocol/graph-ts'

let context = dataSource.context()
let tradingPair = context.getString('tradingPair')
```



## 项目结构

cli init之后项目的目录结构为:

```
subgraph.yaml     #manifest文件，也是subgraph的入口点，很多信息都是在该文件中配置
schema.graphql    #schema主要定义了保存到Graph节点中的各种实体数据的数据结构
package.json
yarn.lock
abis              #合约的abi文件都放在这里
  - Contract.json
src               #主要编写对合约事件监听后的处理，处理逻辑一般就是创建或更新实体数据
  - mapping.ts
generated         #这是自动生成的，修改以上的文件后可用graph codegen命令重新生成
  - schema.ts
  - Contract
    - Contract.ts
```



### Manifest

Manifest 文件就是 **subgraph.yaml** 文件，是核心的入口点。

```
specVersion: 0.0.2
schema:
  file: ./schema.graphql // 表示graphql文件位置
dataSources:             // 数据源,可以配置多个
  - kind: ethereum       // 什么种类的数据
    name: HODLToken      
    network: bsc         // 所在网络
    source:
    	startBlock:15277512  // 可选的，推荐使用该合约的创建区块
      address: "0xB306b4DC1e1B23B1816F6730Dc60ed2c8372BA2b"  // 合约地址
      abi: HODLToken                                         // abi名称
    mapping:          // 映射链上数据和 schema entities
      kind: ethereum/events     // 映射事件类型
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      entities:      // 指定使用了哪些entites
        - Approval
        - OwnershipTransferred
        - Transfer
      abis:  // 指定abi位置，可以是多个
        - name: HODLToken
          file: ./abis/HODLToken.json
      eventHandlers:   // 绑定链上数据事件关联的本地文件file中的函数
        - event: Approval(indexed address,indexed address,uint256)
          handler: handleApproval
        - event: OwnershipTransferred(indexed address,indexed address)
          handler: handleOwnershipTransferred
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/mapping.ts    // 表示subgraph搜索使用的函数都在这里
templates: // 用于设置支持动态创建的合约(没有address)
  - kind: ethereum/contract
    name: Option
    network: bsctestnet
    source:
      abi: Option
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      entities:
        - Option
        - Trade
        - OptionAccount
        - User
        - ValueStore
      abis:
        - name: Option
          file: ./abis/Option.json
        - name: StakingPools
          file: ./abis/StakingPools.json
        - name: Sniper
          file: ./abis/Sniper.json
        - name: Bullet
          file: ./abis/Bullet.json
      eventHandlers:
        - event: EnteredOption(uint256,address,uint256)
          handler: handleEnteredOption
        - event: Exercised(uint256,uint256,uint256)
          handler: handleExercised
        - event: RedeemedToken(uint256,address,uint256,uint256)
          handler: handleRedeemedToken
      file: ./src/mapping/option.ts

```

### Mappings

mapping中的函数接收为事件，事件都继承ethereum.Event,其结构为：

```
export class Event {
  address: Address
  logIndex: BigInt
  transactionLogIndex: BigInt
  logType: string | null
  block: Block
  transaction: Transaction
  parameters: Array<EventParam>
}
```

用的最多的是`event.params.xxx`来获取参数

## cli

### codegen

1. 通过转化abi文件为ts代码
2. schema.graphql文件中的实体编译为ts文件

### create

本地的subgraph项目想要部署到私有节点的话，需要先在本地执行：

```
graph create <SUBGRAPH_NAME> --node http://<NODE_IP>:8020
```



## Graph Node

通过graph node我们可以自己部署私有节点

### 环境

1. 推荐使用docker，省去安装以下环境步骤
1. [安装Rust](https://www.rust-lang.org/zh-CN/tools/install)
2. [安装PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
3. [安装IPFS 命令行工具](https://formulae.brew.sh/formula/postgresql)

### docker

image地址：https://hub.docker.com/r/graphprotocol/graph-node

镜像使用文档：https://github.com/graphprotocol/graph-node/tree/master/docker

部署graph-node:https://medium.com/coinmonks/deploy-subgraphs-to-any-evm-aaaccc3559f

官方教程地址：https://thegraph.academy/developers/local-development/

https://figmentnetw-learnweb3da-usv89j8lq3g.ws-us46.gitpod.io/

https://docs.thegraph.academy/technical-documentation/testnet/guide

1. 服务器下载`graph-node`源码

### deorder成功案例

```
mkdir -p /root/graph
mkdir -p /mnt/data/graph
cp docker-compose.yaml /root/graph
cd /root/graph
docker-compose up -d
```

docker-compose.yaml

```
version: '3'
services:
  graph-node:
    image: graphprotocol/graph-node
    ports:
      - '8000:8000'
      - '8001:8001'
      - '8020:8020'
      - '8030:8030'
      - '8040:8040'
    depends_on:
      - ipfs
      - postgres
    environment:
      postgres_host: postgres
      postgres_user: graph-node
      postgres_pass: let-me-in
      postgres_db: graph-node
      ipfs: 'ipfs:5001'
      ethereum: 'bsctestnet:https://data-seed-prebsc-1-s1.binance.org:8545/'
      GRAPH_LOG: info
  ipfs:
    image: ipfs/go-ipfs:v0.4.23
    ports:
      - '5001:5001'
    volumes:
      - /mnt/data/graph/ipfs:/data/ipfs
  postgres:
    image: postgres
    ports:
      - '5432:5432'
    command: ["postgres", "-cshared_preload_libraries=pg_stat_statements"]
    environment:
      POSTGRES_USER: graph-node
      POSTGRES_PASSWORD: let-me-in
      POSTGRES_DB: graph-node
    volumes:
      - /mnt/data/graph/postgres:/var/lib/postgresql/data

```





## 参考

1. 链接：https://juejin.cn/post/6975499793976000525