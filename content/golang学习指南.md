---
title: golang学习指南
category: 分享
tags:
-  golang
date: 2020-11-10
vssue-title: golang学习指南
---

## 介绍

官方文档：https://golang.org/ref/spec

查看每个版本的golang api: https://github.com/golang/go/tree/master/api

## 学习资源

1. ~~[go tour](https://tour.go-zh.org/basics/1):简单上手，熟悉语法~~
2. [Go语言编程快速入门](https://www.bilibili.com/video/BV1fD4y1m7TD?p=1)视频教程，适合初学者

[go web开发](https://www.bilibili.com/video/BV1gJ411p7xC)

4. [Go编程时光](http://golang.iswbm.com/en/latest/index.html):学习基础知识（个人博客）
2. [Go入门指南](https://github.com/unknwon/the-way-to-go_ZH_CN)：正式学习书籍
3. [《Go语言标准库》](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/),学习官方库的使用

## 安装

https://golang.org/dl/

## 编辑器

1. 安装vscode插件`Go`

2. 安装go tools，`f1>Go:Install/Update Tools`,全选，然后确定，这个需要配置代理，否则会安装报错

3. 使用包，需要初始化`go mod`，输入指令`go mod init main`

4. debug时总是需要按f5来看结果，这很不方便，可以安装插件`watch-run`，并添加debug task：

   ```json
   {
     // See https://go.microsoft.com/fwlink/?LinkId=733558
     // for the documentation about the tasks.json format
     "version": "2.0.0",
     "tasks": [
       {
         "label": "go debug",
         "type": "shell",
         "command": "go run ${file}",
       }
     ]
   }
   ```

   vscode配置文件添加：

   ```json
   "watch-run.targetList": [
       {
         "target": "**/*.go",
         "task": "go debug"
       }
     ]
   ```

   

## 名词解释

### 类型别名

同一个类型的另一个名字，可以自定义类型别名：

```go
type byte=uint8
type rune=int32
```

### 环绕行为

当值超过该类型最大值时，会从最小值重新开始累计

### goroutine

独立的任务叫做goroutine。约定：如果代码文档中没有明确说明，那么我们假定这个方法在并发访问的时候是不安全的

### worker

长时间使用的goroutine被称为工作进程，一般使用以下方式达到事件循环的目的

```go
for {
  select {
    case c:=<-r.commandc:
    ...
  }
}
```



## 文档

### Type Assertion

类型断言，使用方法有两种：

1. `t:=i.(T)` 断言一个接口对象i里不是nil,并且接口对象存储的值类型时T，如果断言成功，就会返回值给t，断言失败会触发panic
2. `t, ok:= i.(T)`失败不回触发panic，而是ok值为false

### Errors

自定义错误类型：错误是一个内部的接口，只要包含一个Error() string方法的类都属于该接口。错误类型约定应以`Error`结尾

声明变量为错误时，约定以`Err`开头

panic比os.Exit更好，panic后会执行所有defer的动作，而Exit不会

在defer函数中调用recover可以防止panic，程序正常执行。

### Statements（声明）

#### Defer

延迟处理，所有deferred的动作可以在函数返回前执行。

#### go

启动goroutine,只需要再调用前面加一个go关键字，只能用在函数前。

计算机处理器会使用“分时”技术，再多个goroutine上轮流花费时间

在使用goroutine时，各个goroutine的执行顺序无法确定

即使已经停止等待goroutine，但只要main函数还没返回，仍在运行的goroutine将会继续占用内存。

#### select 

与switch类似，哪个chanl先返回哪个先执行。

不包含任何case的情况下，将永远等下去。

### 词汇元素

#### Rune literals

字符用单引号表示`''`

### Declarations and scope

#### type

type可以声明一个新的类型，使用新类型可以提高代码可读性和可靠性，值得注意的是，尽管新的类型基于旧类型，但是这两个类型无法混用。

通过添加方法可以为新类型添加行为

### package

1. 包名与导入路径的最后一个元素一致。例如，`"math/rand"` 包中的源码均以 `package rand` 语句开始

   ```go
   package main
   
   import (
   	"fmt"
   	"math/rand"
   )
   
   func main() {
   	fmt.Println("My favorite number is", rand.Intn(2))
   }
   
   ```

2. 在 Go 中，如果一个名字以大写字母开头，那么它就是已导出的。在导入一个包时，你只能引用其中已导出的名字。任何“未导出”的名字在该包外均无法访问。

### 函数

函数的零值为`nil`

#### 参数

函数需要为参数添加类型，如果多个类型值一致，那么可以省略除了最后一个参数的类型声明

```go
x int, y int

x, y int
```

多个参数使用`...`表示，例如：`main(a...int)`

函数的参数总是传递参数的副本

#### 返回值

函数可以返回任意数量的返回值，只有一个返回值时可以省略括号，但是如果是命名返回值，则必须带括号。

```go
func swap(x, y string) (string, string) {
	return y, x
}
```

命名返回值： `return`空时， 返回已命名的返回值。也就是 `直接` 返回。

```go
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}
```

#### 方法关联类型

```go
type test float64
func (k test) celsius(n int, b float64) int{
  return 1
}
```

此处的k称为接收者，每个方法只能有一个接收者,接收者传入类型为test类型，方法调用方式：

```go
test.celsius(2.1,1,3.5) // test也可以为test类型的变量
```

celsius方法接收到的参数第一个为接收者k，剩下的为函数声明参数

#### 方法的转发

还可以在方法中调用接收者中的字段的方法

```go
func (t temp) average() celsius{
  return (t.high+t.low)/2
}
func (r report) average() celsius{
  return r.temp.average() // 调用report类型中temp字段的方法
}
```

这种写法比较繁琐，可以使用struct的嵌入，类型自动关联字段的方法

#### 方法的接收者与指针

方法的接收者处理指针是与函数的参数基本类似的，会解引用，但是接收类型要为指针类型。如果有一个方法接收指针类型，那么其他方法也应该如此

### 基本类型

1. 变量使用var定义，可以出现在包或者函数级别

2. 同时声明多个变量时，如果类型相同，可以只给最后一个变量添加类型定义

3. 初始化，初始化时有值的情况可以省略类型定义

4. 短声明，在**函数**中，简洁赋值语句，`:=`可在类型明确的地方代替`var`声明。短声明只能用在函数内

5. 函数外的每个语句都必须以关键字开始，`var,func`等等

6. 变量声明也可以像导入语句一样分组成一个语法块

   ```go
   var (
   	ToBe   bool       = false
   	MaxInt uint64     = 1<<64 - 1
   	z      complex128 = cmplx.Sqrt(-5 + 12i)
   )
   ```

7. 类型转换：表达式 `T(v)` 将值 `v` 转换为类型 `T`。Go 在不同类型的项之间赋值时需要显式转换

8. 值为单引号和双引号的区别，单引号为一个字符，惯上用它来区别字符值和整数值，双引号表示字符串字面量，支持转义，不想转义使用反引号`

#### 整数

1. int，int和uint都是与架构有关的
2. uint,无符号整数类型 
3. unit8,可以用来表示css颜色，因为取值范围相同（0-255）

![image-20210630161106786](https://blog-pic.oss-cn-beijing.aliyuncs.com/image-20210630161106786.png)

#### 常量

使用`const`声明，不能使用`:=`声明。常量可以是字符、字符串、布尔值或数值,甚至也可以没有类型(untyped)

常量不能修改

#### 零值

没有明确初始值的变量声明会被赋予他们的零值。零值是：

- 数值类型为 `0`，
- 布尔类型为 `false`，
- 字符串为 `""`（空字符串）。

#### int

`int`, `uint` 和 `uintptr` 在 32 位系统上通常为 32 位宽，在 64 位系统上则为 64 位宽。 当你需要一个整数值时应使用 `int` 类型，除非你有特殊的理由使用固定大小或无符号的整数类型。

#### int32

int32的类型别名为`rune`

#### uint8

uint8的别名是`byte`,目的是用于二进制数据 

#### boolean

布尔值只有true和false

#### float

浮点类型可以表达的值大于uint64最大值

#### string

string可以看做是一种特殊的slice类型，获取长度可以使用len

### 其他类型

#### Big

一旦使用了big.int，那么等式里其他部分也必须使用`big.int`

```go
num:=new(big.Int)
num.SetString('12312311231232113123123',10)
```

无类型数字常量是由big来处理

#### 结构体

类似于ts中的`interface`，结构体中的属性称为结构体字段

#### 数组

数组长度由创建时定义，不可再改变。

使用复合字面值初始化数组：`dwarfs :=[5]string{"dfs","dfs","dfs","dfs","dfs"}`,还可以使用`...`作为数组的长度，go编译器会为你算出数组的元素数量`dwarfs :=[...]string{"dfs","dfs","dfs","dfs","dfs"}`

使用`len(arr)`可以查看数组的长度，使用`cap(arr)`可以查看数组的容量,数组的零值为`nil`

数组赋值给新的变量或者传递给函数时都会产生一个新的数组副本，所以性能会比较低，一般使用切片作为参数而不是数组。

**切片**

数组支持切片操作，切片只是对引用的描述，修改值会影响原数组，以下切片写法是等价的：

```
a[0:10]
a[:10]
a[0:]
a[:]
```

切片的默认值是`nil`

切片的索引不能是负数

切片添加值使用`append`

切片操作也可以用于字符串

使用3索引可以限制切片的容量，例如：`ter:=planets[0:4:4]`

可以单独声明slice:`dwarfs :=[]string{"test","test","test","test"}`,也就是没有长度的数组形式。

> 文章：[Go 切片：用法和本质](https://blog.go-zh.org/go-slices-usage-and-internals)

#### map

map默认值为`nil`, map声明`map[string]int`,这里的string表示key的类型，而int表示值的类型。访问key只能通过`[]`,在访问map中的key时，如果不确定是否有值，那么可以通过返回值的第二个值进行判断：

```go
moon:=map[string]int
if moon,ok:=moon['test']; ok {
  fmt.Printf("存在")
}else{
  fmt.Printf("不存在")
}
```

可以使用make指定map的容量`m := make(map[string]int, 99)`

#### struct

结构体，类似于class,不是引用类型。访问字段使用`.`，声明结构体变量

```go
var curiosity struct{
  a int64
}
```

声明struct类型

```go
type location struct{
  a int64
  b int64
}
```

通过复合字面值初始化struct

```go
test:=location{b:2,a:1} // 键值对形式可以不按照顺序赋值
test:=location{1,2} // 按照结构体字段顺序赋值
```

转换成json，默认只转换出大写开头的，如果想要自定义，那么需要在后边加上额外内容(tag)：

```go
type location struct {
  Lat float64 `json:"latitude"xml:"latitude" binding:"-"` // -表示忽略该校验
  Long float64 `json:"longitude" binding:"required"` // binding required表示必须传该值
}
```

约定，如果方法以`new`开头，后边是结构体，那么通常是用来构造数据的，例如`newPerson`

**嵌入**

struct中通过组合的方式拆分关联度比较高的字段成为一个新类型：

```go
type location struct{
  style style
  color unit8
}

type style struct{
  width int64
  height int64
}
```

还有一种简写的写法，叫做嵌入：

```go
type location struct{
  style
  color unit8
}

type style struct{
  width int64
  height int64
}
```

使用嵌入的写法会将组合字段的方法加入struct，比如style 有个`calculation`方法，这个时候location也可以直接使用：`location.calculation()`，还可以直接使用字段`location.width`,这种行为称为转发。

当命名冲突时，不能使用这种简写，还是要使用`location.style.width`,当最外层struct中有同名方法时，则程序会优先使用该方法。

#### interface

声明为接口类型的变量默认值为`nil`,接口类型的变量只有在类型和值都为nil时才 等于`nil`

接口关注与类型可以做什么，而不是储存了什么。

接口通过列举类型必须满足的一组方法来进行声明。

不需要显示声明接口。

通常声明interface类型的时候习惯使用`er`结尾

#### 指针

为什么要用指针？

1. 指针可以帮助函数在内部修改外部变量的值，还可以帮助我们在任何地方修改其指向数据的值。
2. 传递指针参数可以节省拷贝大结构体的内存开销



通过&操作符可以获取变量的内存地址。

**内部指针**：`&`不仅可以获得结构体的内存地址，还可以获得其中字段的内存地址。

`*`放在类型前面表示指针类型，指针不能直接赋值给其他类型，只能赋值给`*type`

`*`放在变量前面表示解引用,只能用在值为指针类型的变量上,或者复合字面量：`timmy:=&person{name:"Timothy",age:10}`,访问字段时，对结构体进行解引用不是必须的。数组在执行索引或切片操作时会自动解引用。slice和map的复合字面值没有自动解引用的功能。

**隐式指针**：go语言里有一些内置的集合类型就在暗中使用指针。map在被赋值或者作为参数传递的时候不回被复制。

对`nil`解引用会引起程序恐慌，导致报错 

> 文章：[什么时候使用指针？](https://studygolang.com/articles/32103)

#### Channel

通道可以在多个goroutine之间安全的传值

通道可以用作变量、函数参数、结构体字段等等

创建通道用make函数`c:=make(chan int)`。不使用make初始化通道，那么通道变量的值就是nil。对nil通道进行发送或接收不回引起panic，但会导致永久阻塞。对nil通道执行close函数，那么会引起panic。

向通道发送或者接收值使用`<-`符号，发送值例子：`c<-99`，从通道接收值例子：`r:=<-c`

接收或者发送值到通道时会阻塞当前线程运行。

**缓冲channel**

通过在make创建channel时，添加缓冲区，可以在之后才阻塞线程：`cha:=make(chan int,4)`

### 流程控制语句

#### for循环

Go只有一种循环结构：for循环。

基本的 `for` 循环由三部分组成，它们用分号隔开：

- 初始化语句：在第一次迭代前执行,可选
- 条件表达式：在每次迭代前求值
- 后置语句：在每次迭代的结尾执行，可选

还可以省略掉`;`，只使用for，当 作`while`使用：

```go
func main() {
	sum := 1
	for sum < 1000 {
		sum += sum
	}
	fmt.Println(sum)
}
```

数组和字符串、channel遍历都可以使用：`for i := range arr `。

range还可以用来遍历chanl，直到通道关闭位置

#### if语句

`if`支持简短语句，在表达式之前执行一个简单的语句，该语句声明的变量作用域仅在`if`之内,或者else。

```go
func pow(x, n, lim float64) float64 {
	if v := math.Pow(x, n); v < lim {
		return v
	}
	return lim
}
```

#### switch

只运行选定的case，不需要break，除非以 `fallthrough` 语句结束，否则分支会自动终止。case 无需为常量，且取值不必为整数。

`switch`可以没有条件，同switch true一样

#### defer

defer 语句会将函数推迟到外层函数返回之后执行。

推迟的函数调用会被压入一个栈中。当外层函数返回时，被推迟的函数会按照后进先出的顺序调用。

### 结构体

类似于js中的class，结构体字段使用点号来访问：

```go
package main

import "fmt"

type Vertex struct {
	X int
	Y int
}

func main() {
	v := Vertex{1, 2}
	v.X = 4
	fmt.Println(v.X)
}
```

### 内置函数

内置函数不需要`import`

#### len

查看字符串字节长度 

#### cap

查看切片容量，如果append后超过原容量，那么会产生一个新数组，容量为之前容量的2倍

#### append

添加slice，`test=append(a,1)`,合并其他slice，使用`...` ，`test=append(a,anthorSlice...)`

#### delete

删除map中的key

#### make

动态创建切片、map、channel,make返回类型的引用。make和new都是用来分配内存的内建函数，且在堆上分配内存，make即分配内存，也初始化内存。new只是将内存清零，new返回的是指向类型的指针，new可以分配任意类型。

#### Close

关闭chanl

## mod

init指令后边指定的是该项目的包名称,执行之后生成`go.mod`文件,该文件包含包名和使用的go的版本：

```
module main
go 1.16
```

### go get

已有项目如果想安装所有的包，那么使用`go get`获取

## package

大写字母开头的函数、变量或其他标识符都会被导出。小写字母开头的就不行,当导入包后。

包的入口函数为`main`,如果没有在程序中使用，则会触发`init`函数

`import`本地包时使用的是目录位置，比如说：`main/dao`，则是导入`dao`这个文件夹下的所有包

一个文件夹下的所有包的`package`必须同名

### embed

文件嵌入到程序中，可以使用在web开发时的静态资源打包。需要`go v1.16`

```go
package main

import (
	"embed"
	"html/template"
	"io/fs"
	"net/http"

	"github.com/gin-gonic/gin"
)

//go:embed static/* templates/*
var f embed.FS

func main() {
	fsys, _ := fs.Sub(f, "static")
	r := gin.Default()
	templ := template.Must(template.New("").ParseFS(f, "templates/*.tmpl", "templates/home/*.tmpl"))

	r.SetHTMLTemplate(templ)
	r.StaticFS("/static/", http.FS(fsys))

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.tmpl", nil)
	})
	r.GET("/search", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"query": c.Query("q"),
		})
	})
	r.Run()
}

```



### strings

#### Join(arr []string, sep string) string

根据片段拆分成字符串

#### Compare(str1,str2) int

比较两个字符串，如果相等则返回0，str1小于str2则返回-1，大于返回1

#### EqualFold(str1,str2) bool

计算 s 与 t 忽略字母大小写后是否相等。


### strconv

实现转换相关功能

### fmt

```go
printf("%c",a)；输出单个字符。

printf("%d",a)；输出十进制整数。

printf("%f",a)；输出十进制浮点数.

printf("%o",a)；输出八进制数。

printf("%s",a)；输出字符串。

printf("%u",a)；输出无符号十进制数。

printf("%x",a)；输出十六进制数。

Printf("%v", a)；输入a的值
Printf("%+v", a)；输入a的声明值，包含key

Printf("%T", a)；输入a的类型

Sprintf("./%s",f.Filename) // 格式化拼接字符串
Fprintf(w,"hello astaxie!"), 将第二个参数写入到第一个参数，第一个参数为`io.Writter`类型
```

### unicode

#### utf8

`utf8.RuneCountInString`可以用来查看字符串中字符个数

#### math

math.[Trunc](https://golang.org/src/math/floor.go?s=933:962#L38) 返回float64的整数值

### encoding

#### json.Marshal

把任何类型转换为byte类型

#### json.Unmarshal(body, &result)

转换第一个参数为json格式，赋值给resutl变量

### http

#### client

可以统一为其他请求进行预设，一般为header的设置。client.Get和client.Post是对client.NewRequest的包装

设置好client后，需要client.Do()发送请求

#### type Request

**Request.ParseForm()**

 解析原始请求query，默认不解析，解析后request.Form为map类型的query,value的值为数组

如果不解析Form，则Form值为`[]` 

Request本身也提供了FormValue函数来获取参数，例如`r.Form["username"]`也可以写成`r.FormValue("username")`。调用`r.FormValue`时会自动调用`r.ParseForm`,所以不用提前调用。`r.FormValue`只会返回同名参数中的第一个，若不存在则返回空字符串。

`r.Form` 对不同类型的表单元素的留空有不同的处理， 对于空文本框、空文本区域以及文件上传，元素的值为空值，而如果是未选中的复选框和单选按钮，则根本不会在 r.Form 中产生相应条目，如果我们用上面例子中的方式去获取数据时程序就会报错。所以我们需要通过 r.Form.Get() 来获取值，因为如果字段不存在，通过该方式获取的是空值。但是通过 r.Form.Get() 只能获取单个的值，



#### ListenAndServe

启动服务，会阻塞程序运行。

### html

#### template

解析模版的几种方法：

1. Prase 
2. ParseFiles
3. ParseGlob
4. New

模版渲染：

1. Execute
2. ExecuteTemplate,当解析多个模版需要指定模版名称时，使用这个方法

> 由于vuepress的问题，所有双括号都变成单括号

**模版语法**

1. 变量：`{$ojb:=100}`
2. 去除左右空格： `{- .u1.Name -}` 
3. 判断：

```go
{if xxx}
{$v1}
{else}
啥都没有
{end}
```

4. 作用域：`with  `
5. 取数组索引：`index`
6. 遍历：`range`
7. 自定义函数：扩展原template，添加自定义函数时，如果两个参数，第二个一定是错误类型，添加自定义函数的时机一定要在解析模版之前。模版解析时会自动转义，如果不想自动转义那么使用`template.HTML()`处理

```go
t := template.New("f")
t.Funcs(template.FuncMap{
	"f": test,
})
t.ParseFiles("./f.tmpl")
```

8. 嵌套模版：`{template "ul.tmpl"}`，可以使用外部文件，也可以使用内部`define`定义的模版 ,嵌套模版解析时，一定要按照包含顺序解析。

9. 定义模版：

```go
{ define "ol.tmpl"}
	<ol>
		<li>吃饭</li>
	</ol>
{end }
```

10. 继承：如果很多页面中存在很多不变共通部分，类似于布局相关的元素，那么可以使用根模版`block`
11. 模板到模板：只能传递一个变量，但是可以通过自定义函数来合并多个参数。参考：https://stackoverflow.com/a/49475057/13082513

```go
func Wrap(shops []Destination, cityName, regionName string) map[string]interface{} {
    return map[string]interface{}{
        "Shops":      shops,
        "CityName":   cityName,
        "RegionName": regionName,
    }
}

{- template "data" (Wrap .Shops $city $region) -}
```

12. 模板传递对象参数,通过传递json字符串可以达到使用对象的效果：

```go
ParseJSON := func(jsonString string, prop string) string {
		var data map[string]string
		json.Unmarshal([]byte(jsonString), &data)
		return data[prop]
	}

{ template "component/block-title" `{"title":"你好"}`}
```

13. 修改默认标识符：`template.New("test").Delims("{[","]}").ParseFiles("./t.tmpl")`

> 1. [Go语言标准库之http/template](https://liwenzhou.com/posts/Go/go_template/)

### io

#### ioutil.ReadDir

读取当前目录

#### ioutil.ReadAll

一次性读取所有返回

### os

#### Create

创建文件

### sync

#### mutex

互斥锁,定义在被保护的变量之上，一个已经被锁定的goroutine再次被锁定则会引发死锁。

### time

#### Now()

当前时间

#### Since(time)

获取参数到当前时间之差

#### Sleep(time.Second)

睡眠几秒



## Gin框架

### 简介

web服务框架

#### 中间件

Gin中的中间件必须是一个`gin.HandlerFunc`类型,普通的请求方法参数中从第二个开始都是中间件，按照写入顺序执行。中间件一般会写成闭包的形式，这样写的好处在于，可以做一些准备工作或者接受配置，这样就不用在具体中间件中写一堆判断了。

如果要在gin中使用goroutine，那么不应该goroutine中修改gin的上下文，只能使用gin上下文的副本。

### 初始化

安装： `go get -u github.com/gin-gonic/gin`

引入：`import ("github.com/gin-gonic/gin")`

### Default()

默认使用了`Logger`和`Recovery`中间件，`Logger`将日志写入gin.DefaultWriter,即使设置了GIN_MODE=realease。

`Recovery`中间会recover任何panic。如果有panic的话，会写入500响应码

### New()

如果不想使用Default则使用New创建一个没有中间件的路由 

### Engine

Gin实例

#### MaxMultipartMemory

设置处理提交文件时默认的内存限制，小于这个限制的内容保存在内存中，大于这个限制的超出部分保存在本地临时文件中

#### Run(port)

启动服务

#### loadHTMLFiles(files)

加载模版 

#### SetFuncMap

添加自定义函数

#### Static(relativePath,root)

定义静态文件地址,第一个参数为代码中使用的假名，第二个参数为假名指向的服务器真实目录

#### Any(path,func)

除了`post、get`等方法处理请求，还可以使用Any处理所有方法,通过`context.Request.Method`判断该请求是哪种方法

#### NoRoute(func)

处理没有接收的请求 

#### Group(name)

路由组，管理不同业务类型的路由时，使用分组可以保证结构清晰，支持嵌套

```go
func main() {
	r := gin.Default()
	userGroup := r.Group("/user")
	{ // 代码块可以不加，添加是为了看着直观
		userGroup.GET("/index", func(c *gin.Context) {...})
		userGroup.GET("/login", func(c *gin.Context) {...})
		userGroup.POST("/login", func(c *gin.Context) {...})

	}
	shopGroup := r.Group("/shop")
	{
		shopGroup.GET("/index", func(c *gin.Context) {...})
		shopGroup.GET("/cart", func(c *gin.Context) {...})
		shopGroup.POST("/checkout", func(c *gin.Context) {...})
	}
	r.Run()
}

```

#### Use(middlerware...handleFunc)

全局注册中间件，先于请求中的中间件执行。所有请求都会触发该中间件

### Context

#### Copy()

创建一个当前上下文的副本

#### HTML(code,name,obj)

渲染模版,需要先加载模版后才能使用。参数：状态吗，模版名称，渲染参数

#### JSON(code,data)

传输json格式数据

#### Query(key)

获取请求对应key的querystring

#### DefaultQuery(key,defaultValue)

类似于Query，但是提供默认值

#### GetQuery(key)

类似于Query，返回参数多了一个是否存在，如果不存在返回false

#### Param(path)

当路由为动态路由时，使用Param(path)获取动态路由的id

```go
func main() {
	//Default返回一个默认的路由引擎
	r := gin.Default()
	r.GET("/user/search/:username/:address", func(c *gin.Context) {
		username := c.Param("username")
		address := c.Param("address")
		//输出json结果给调用方
		c.JSON(http.StatusOK, gin.H{
			"message":  "ok",
			"username": username,
			"address":  address,
		})
	})

	r.Run(":8080")
}
```

#### PostForm(key)

如果请求为post类型的form表单数据时，通过PostForm(key)获取value，`DefaultPostForm`还可以添加默认值

#### BindJSON

解析参数

#### ShouldBind(* struct)

简写取参数的动作，直接从结构体中绑定querystring中相对应的参数,参数接收指针类型的结构体，无论前端传的是哪种`Content-Type`,都会被解析。

```go
// Binding from JSON
type Login struct {
	User     string `form:"user" json:"user" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// 绑定JSON的示例 ({"user": "q1mi", "password": "123456"})
	router.POST("/loginJSON", func(c *gin.Context) {
		var login Login

		if err := c.ShouldBind(&login); err == nil {
			fmt.Printf("login info:%#v\n", login)
			c.JSON(http.StatusOK, gin.H{
				"user":     login.User,
				"password": login.Password,
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	// Listen and serve on 0.0.0.0:8080
	router.Run(":8080")
}
```

#### FormFile(name)

接收上传文件时使用。返回匹配到name的第一个值

#### SaveUploadedFile(file,path)

保存上传文件

#### Redirect(code,location)

重定向到外部链接，想要内部重定向使用：

```go
r.GET("/a",func(c *gin.Context){
  c.Request.URL.Path="/b" // 修改请求地址
  r.HandleContext(c) // 继续后续的处理
})
```

#### Next()

跳过当前中间件，将执行控制权交给下一个中间件，当后边的中间件执行完毕后，会继续执行当前上下文之后的代码

#### Abort()

阻止后续中间件的执行，会执行完当前上下文代码后继续执行上一层中间件。

#### Set(key,value)

在上下文中传递状态时用到，set值之后不同的中间件可以共享这个状态

#### Get(key)

获取上下文中定义的key

### H

gin内部提供了`map[string]interface{}`类型的简写：`gin.H`

## GORM

### 简介

安装：`go get -u gorm.io/gorm`,`go get -u gorm.io/driver/sqlite`,`go get -u gorm.io/driver/mysql`

代码中导入相关数据库驱动：

```go
import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)
```

数据表用结构体来表示

数据行用结构体实例来表示

字段用结构体字段表示

#### 立即执行方法

立即执行方法是指那些会立即生成sql语句病发送到数据库的方法，一般时CRUD方法，例如：`Create、Frist、Find、Take、Save、UpdateXXX、Delete、Scan、Row、Rows`

#### ORM

什么是orm，分别代表对象、关系、映射，也就是用代码中的对象来编写关系型数据库

orm的优点：提高开发效率

orm的缺点：牺牲执行性能、牺牲灵活性、弱化SQL能力

### Context

#### WithContext

关联上下文

### 高级查询

#### FindInBatches

批量查询并处理记录

#### FirstOrInit

获取第一条匹配的数据，如果没有则根据给定的条件(仅支持 sturct 和 map 条件)初始化一个实例,如果查询到则Attrs不生效。这些改动不会被保存到数据库。

```go
db.Where(User{name:"no_existing"}).Attrs(User{Age:20}).FirstOrInit(&user)
```

#### FirstOrCreate

与FirstOrInit不同，FirstOrCreate会将结果写会数据库。获取第一条匹配的记录，或者根据给定的条件（仅支持struct和map条件）更新一条新记录，不管是否找到记录`Assing`都会将属性赋值给struct。Assgin不管是否查询到都讲属性赋值给实例。

```go
db.Where(User{Name: "non_existing"}).Assign(User{Age: 20}).FirstOrCreate(&user)
```



### 声明模型

#### gorm.Model

GORM 定义一个 `gorm.Model` 结构体，其包括字段 `ID`、`CreatedAt`、`UpdatedAt`、`DeletedAt`,可以将它嵌入结构体中 

### 连接数据库

```go
DB, _ = gorm.Open(mysql.New(mysql.Config{
		DSN:"root:baixiaoyu2997@tcp(127.0.0.1:3306)/db1?charset=utf8mb4&parseTime=True&loc=Local"
	}), &gorm.Config{})
```

### 迁移

#### AutoMigrate

用于自动前一schema保持schema是最新的

### 创建

#### Create

通过数据的指针来创建一条记录，通过在结构体的tag中制定default来设置默认值。

```
type User struct{
	ID int64
	Name string `grom:"default:'张三'"`
}
```

当插入数据时，如果值显示设置为 零值，并且该字段设置了默认值，那么会优先使用默认值。

如果想解决上边的问题，那么有两种方法：

1. 使用指针
2. 使用Scanner/Valuer

#### 批量插入

Create支持使用slice批量插入

使用`CreateInBatches(users,100)`还可以指定数量

#### 关联创建

```go
db.Create(&User{
  Name: "jinzhu",
  CreditCard: CreditCard{Number: "411111111111"}
})
```

### 查询

#### First 

根据主键查询第一条记录

#### Find 

查询所有记录，第二个参数

#### Take

随机获取一条记录 

#### Last

根据主键查询最后一条数据

#### where

where方法有多种写法，第一种与普通sql的where一致，语法：

```
db.Where("name = ?","jinzhu").First(&user) // 查询name=jinzhu的数据
```

第二种使用Struct和Map查询：

```
db.Where(map[string]interface{}{"name":"jinzhu"}).Find(&users)
```

通过结构体进行查询时，将不会查询零值，想要查询零值的话使用map

#### Not

用法与where类似

#### Or

用法与where类似

#### Select

选择查询返回的列

#### Order

排序方式，可多个

#### Limit

限制条数，当值为-1时，消除之前Limit的影响

#### Offset

偏移量，当值为-1时，消除之前Offset的影响

#### Scan

返回结果至struct，与Find类似

#### Preload

想要查询关联表的数据，需要使用`Preload`预先加载，如果有关联表的关联表那么可以使用嵌套语法

### 更新

#### Save

保存所有字段，即使字段是零值，如果没有主键则直接插入数据

#### Update

更新单个列的值，使用Update时需要指定条件，Update支持struct和map类型参数。使用struct更新时，默认只会更新非零值的字段。

想要只更新指定的列，那么可以使用Select预先筛选出来

#### Updates

更新多列，支持struct和map，只会更新非零值,如果接收的数据有很多，但是只想更新部分，需要在语句前加`Select`选定要更新的列,或者添加Omit忽略要更新的列。如果更新的时候想跳过hooks，那么使用`UpdateColumn`或者`UpdateColumns`

#### Omit

如果更新的时候想要忽略某个字段，name使用Omit

#### RowsAffected

通过返回值的RowsAffected字段，可以获得更新的记录数。

#### 更新关联数据

```go
db.Session(&gorm.Session{FullSaveAssociations: true}).Updates(&user)
```

#### 使用SQL表达式

```go
db.Model(&product).Update("price", gorm.Expr("price * ? + ?", 2, 100)) // 价格变为原来的2倍+100
```

### 删除

#### Delete

给定主键时，删除一条记录，否则会批量删除

#### 软删除

如果模型中包含DeleteAt，它将自动获得软删除的能力。不通过gorm.Model，手动开启软删除在模型中添加:

```go
type User struct {
  ID      int
  Deleted gorm.DeletedAt
  Name    string
}
```

可以通过`Unscoped`方法找到软删除的记录。

#### 硬删除

```go
db.Unscoped().Delete(&order)
// DELETE FROM orders WHERE id=10;
```

#### Delete Flag

将 unix 时间戳作为 delete flag

```GO
import "gorm.io/plugin/soft_delete"

type User struct {
  ID        uint
  Name      string
  DeletedAt soft_delete.DeletedAt
}
```

### scope

复用逻辑，把共通的查询逻辑写成`func(*gorm.DB) *gorm.DB`函数使用。

```go
func AmountGreaterThan1000(db *gorm.DB) *gorm.DB {
  return db.Where("amount > ?", 1000)
}

func PaidWithCreditCard(db *gorm.DB) *gorm.DB {
  return db.Where("pay_mode_sign = ?", "C")
}

func PaidWithCod(db *gorm.DB) *gorm.DB {
  return db.Where("pay_mode_sign = ?", "C")
}

func OrderStatus(status []string) func (db *gorm.DB) *gorm.DB {
  return func (db *gorm.DB) *gorm.DB {
    return db.Where("status IN (?)", status)
  }
}

db.Scopes(AmountGreaterThan1000, PaidWithCreditCard).Find(&orders)
// 查找所有金额大于 1000 的信用卡订单

db.Scopes(AmountGreaterThan1000, PaidWithCod).Find(&orders)
// 查找所有金额大于 1000 的 COD 订单

db.Scopes(AmountGreaterThan1000, OrderStatus([]string{"paid", "shipped"})).Find(&orders)
// 查找所有金额大于1000 的已付款或已发货订单

```



### 表

#### 清空整个表

两种方法：

1. `db.Migrator().DropTable(&User{}) 删除表`
2. 清空表

```go
 db.Where("1 = 1").Delete(&User{})
 db.Exec("truncate table users")
 db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&User{})
```

参考：https://www.cnblogs.com/sss4/p/14163524.html

#### 重命名表

`db.Migrator().ReanameTable(&User{},&User2{})`

#### 是否存在表

`db.Migrator().HasTable(&User{})`

### 实例方法

#### SingularTable(bool)

禁用默认表名的复数形式，如果设置为true，则表名不带s 

#### Table(name)

制定要操作某一个表

#### Migrator().CreateTable(&type)

手动创建表

#### NewRecord(&type)

判断数据库该数据主键是否为空

#### Raw

原生sql查询

### Debug

在任何操作语句前面加上`Debug()`都会在控制台打印对应的`sql`命令

### 钩子

创建、查询、更新、删除等操作之前、之后调用的函数

#### 问题

1. 如何将零值存入数据库？

   > 1. 使用指针的方式
   > 2. 使用Scanner/Valuer
   > 3. Save

## Goquery

### Find

类似querySelectorAll，返回`Selection`，可以链式调用

### First

返回查找到的第一个

## puppeteer爬虫

### 动态页面

直接调访问的接口即可

### 静态页面

使用 `goquery` 库

### 静态文件处理

相对路径的文件都下载到本地，获取静态文件可以参考这个回答：https://github.com/chromedp/chromedp/issues/760#issuecomment-786340809,

可以通过监听`Network.responseReceived`事件，保存文件，参考：https://stackoverflow.com/questions/53640405/puppeteer-save-webpage-and-images

## 工程化

### 目录结构

#### 流程

`URL --> routers --> controller --> logic--> model -->  `

#### controller

负责解析路由的控制器方法

#### routers

路由相关绑定

#### templates

模板

#### dao

数据库初始化相关代码

#### static

模板静态文件

#### models

模型的定义及相关的增删改查操作

#### login

具体的业务功能



## 微服务

### RPC

远程过程调用（Remote Procedure Call，RPC）是一个计算机通信协议。

该协议允许运行一台计算机的程序调用另一台计算机的子程序

golang的rpc必须符合4个基本条件：

```
结构体字段首字母要大写，可以别人调用

函数名必须首字母大写

函数第一参数是接收参数，第二个参数是返回给客户端的参数，必须是指针类型

函数还必须有一个返回值error

```

微服务架构下数据交互一般是对内 RPC，对外 REST

## 最佳实践

### 浮点类型计算

未了尽量最小化舍入错误，尽量先做乘法，再做除法

### 时间变量类型

应该使用int64或者uint64,因为到2038年就会超过int32的最大数。

### 函数参数为数组

尽量使用切片而不是数组，这样性能会好点。

### 函数变量

检查函数值是否为`nil`,并在有需要时提供默认行为

### 错误处理

减少错误处理代码的一种策略时：将易错的代码和不会出错的代码隔离开

## 问题

### 如何判断数据类型？

1. 在业务代码中使用`reflect.TypeOf(xxx)`
2. 在print中使用`fmt.Printf("%T", p)`

### 如何把字符转换成int？

```go
int(r-'0')
```

### 数字转换成字符串乱码？

这个数字超出了code point范围

### 如何判断字符串都是中文？

```go
if m, _ := regexp.MatchString("^\\p{Han}+$", r.Form.Get("realname")); !m {
    return false
}
```

### 如何判断字符串都是英文？

```go
if m, _ := regexp.MatchString("^[a-zA-Z]+$", r.Form.Get("engname")); !m {
    return false
}

```

### 什么时候会触发panic

1. 对值为nil的map添加元素

### go爬虫需要注意什么？

流程：

1. 获取页面所有url
2. 去重、判断链接是否有效
3. timeout
4. 使用gorm时注意要使用UTF-8编码，如果不是需要转换

### https请求如何跳过证书？

```go
httpClient.Transport = &http.Transport{
  TLSClientConfig: &tls.Config{
    InsecureSkipVerify: true,
  },
}
```



## 其他

1. [Go语言设计和工具链核心团队成员介绍](https://zhuanlan.zhihu.com/p/75373075)
