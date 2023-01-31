---
title: GraphQL学习随笔
category: sql
tags:
  - GraphQL
date: 2022-01-13
vssue-title: GraphQL学习随笔
---

## 介绍

facebook出品

## 语法

### schema

定义要传给服务的数据结构，如果客户端定义了服务端不存在的属性，则返回`null`,如果想强制字段类型不能为空，则添加`!`,例如：`foo:string!`。当设置`!`后表示后端返回值也不能为空，如果为空则报错。

对于数组，可以在字段定义时在后边加入`!`表示该数组不能为空:`list:[String]!`

如果数组中的元素也不能为空，则`list:[String!]!`,该表达式的返回值可以为`[]`

语句最外层默认执行Query查询：

```
{
	user
}
# 与以下相等
query {
	user
}
```

使用其他内置类型时需要指定,例如： `mutation createArticle {}`

### 函数

 默认的对象类型都是返回所有值，查找单个数据时，需要配置函数类型：

```
type Query{
	article(id:ID!): Article // 该函数，id必填，Article为返回类型
}
```

当没有查询到结果时返回`null`

#### 参数

函数中使用where来进行条件查询

```
{
  markets(where: {borrowRate: 15}) {
    id
    name
    symbol
    borrowRate
    supplyRate
  }
}

```

除了where还支持：

```
id：指定 id 查询
orderBy：指定排序的字段
orderDirection：排序方向，asc | desc
first：查询条数，比如设为 10，则最多只查出 10 条记录
skip：跳过不查询的条数
block：指定区块查询，可以指定区块 number 或 hash
text：全文检索
```



#### 后缀

查询某个值大于特定值,在参数后加上`_gt`

```
{
  markets(where: {borrowRate_gt: 15}) {
    id
    name
    symbol
    borrowRate
    supplyRate
  }
}

```

GraphQL提供了多个后缀：

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



### type

使用`type`定义类型。

gql自带一组默认标量类型：

1. Int

2. Float

3. String

4. Boolean

5. ID，返回字符串

   

类型转换，就像js的隐式类型转换，如果可以转换为有效的类型，则可以使用



#### Query

内置对象类型，用来查找其他对象 ，比需要有Query类型，并且只能有一个。

写查询的schema时，如果该类型为对象类型，则一定要写其内部的属性。数组和普通类型写法一样，但是如果数组内值类型为对象，那么需要按照对象类型编写

#### Mutation

内置对象类型，用来修改数据

### input

输入参数类型。当函数的参数过多时，应该使用input定义的类型去接收参数：

```
input CreateArticleInput{
	title: String!
	body: String!
	tagList:[String!]
} 
type Mutation {
	createArticle(article: CreateArticleInput):Article
}
```

### 客户端

客户端发起请求时，需要拼写大量的字符串，可以通过传入变量简化操作：

```js
data:{
	query:`
	query getUser($id: ID!){ // 变量使用`$`号声明使用
		user(id:$id)
	}
	`,
	variables:{
		id:1 
	}
}
```



## vue3

与vue一起使用时，可以使用`@vue/apollo-composable`配合`graphql-tag`快速编写请求

```js
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
const {result ,loading}=useQuery(gql`
	query AllBlogs {
		blogs {
			id
			title
			content
		}
	}
`)
```

