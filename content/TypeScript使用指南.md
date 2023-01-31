---
title: TypeScript使用指南
category: 分享
tags:
- TypeScript
date: 2020-05-19
vssue-title: TypeScript使用指南
---
## 项目配置
### tsconfig.json

|属性|详细|
| - | - |
|files|设置要编译的文件的名称|
|includes|设置需要进行编译的文件，支持路径模式匹配；|
|exclude|设置无需进行编译的文件，支持路径模式匹配；|
|compilerOptions|编译流程相关配置，详情看下边的列表|

### compileOptions

| 属性 | 详细 |
| ---- | ---- |
|target| 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'|
|module                  | 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'|
|lib                              | 指定要包含在编译中的库文件|
|allowJs                        | 允许编译 javascript 文件|
|checkJs                       | 报告 javascript 文件中的错误|
|jsx                    | 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'|
|declaration                  | 为ts和js项目生成.d.ts声明文件 |
|sourceMap                     | 生成相应的 '.map' 文件|
|outFile                        | 将输出文件合并为一个文件|
|outDir                         | 指定输出目录|
|rootDir                        | 用来控制输出目录结构 --outDir.|
|removeComments                 | 删除编译后的所有的注释|
|noEmit                        | 不生成输出文件|
|importHelpers                  | 从 tslib 导入辅助工具函数|
|isolatedModules                | 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.|
|strict                         | 启用所有严格类型检查选项|
|noImplicitAny                  | 在表达式和声明上有隐含的 any类型时报错|
|strictNullChecks            | 启用严格的 null 检查|
|noImplicitThis                 | 当 this 表达式值为 any 类型的时候，生成一个错误|
|alwaysStrict                   | 以严格模式检查每个模块，并在每个文件里加入 'use strict'|
|noUnusedLocals                 | 有未使用的变量时，抛出错误|
|noUnusedParameters             | 有未使用的参数时，抛出错误|
|noImplicitReturns              | 并不是所有函数里的代码都有返回值时，抛出错误|
|noFallthroughCasesInSwitch     | 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）|
|moduleResolution             | 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)|
|baseUrl                        | 用于解析非相对模块名称的基目录|
|paths                            | 模块名到基于 baseUrl 的路径映射的列表|
|rootDirs                         | 根文件夹列表，可以指定多个路径为根目录，甚至是不存在的路径，在导入时非常有帮助 |
|typeRoots                        | 包含类型声明的文件列表|
|types                            | 需要包含的类型声明文件名列表|
|allowSyntheticDefaultImports   | 允许从没有设置默认导出的模块中默认导入。|
|sourceRoot                     | 指定调试器应该找到 TypeScript 文件而不是源文件的位置|
|mapRoot                        | 指定调试器应该找到映射文件而不是生成文件的位置|
|inlineSourceMap                | 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件|
|inlineSources                  | 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性|
|experimentalDecorators         | 启用装饰器|
|emitDecoratorMetadata           | 为装饰器提供元数据的支持|



## 介绍

### 类型

类型是一个统称，包括`interface`和`type`等，类型不能使用`test.xxx`语法，应该使用`test['xxx']`

### 类型推断

TypeScript 会根据上下文环境自动推断出变量的类型，无须我们再写明类型注解,比如

```ts
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button);   //<- OK
    console.log(mouseEvent.kangaroo); //<- Error!
};
```

这里通过`onmousedown`函数的类型来推断参数的类型，如果没有上下文归类，则参数为`any`类型

### 类型守卫

1. 类型判定，一个函数接收类型，并返回一个类型谓词(`parameterName is Type`),parameterName必须是这个函数的参数
2. in操作符
3. typeof，只支持两种形式`typeof v==="xxx"`或者`typeof !=="xxx"`
4. instanceof

### 联合类型(union type)

联合类型表示取值可以为多种类型中的一种，使用 `|` 分隔每个类型。联合类型的扩展直接用`|`就可以了，例:

```ts
type Num =1 |2 | 3
type Num2 = Num | 4
```

### 类型别名

类型别名就是type，类型别名不会创造新的类型，只是对其他类型的引用:

```ts
type Message = string | string[];
```



### 类型拓宽(Type Widening)

所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```ts
  let str = 'this is string'; // 类型是 string
  let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
  const specifiedStr = 'this is string'; // 类型是 'this is string'
  let str2 = specifiedStr; // 类型是 'string'
  let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
```

除了字面量类型，`null`和`undefined`也会进行拓宽

```ts
let x = null; // 类型拓宽成 any
let y = undefined; // 类型拓宽成 any
```

> 在严格模式下，一些比较老的版本中（2.0）null 和 undefined 并不会被拓宽成“any”

### 类型缩小(Type Narrowing)

> typescript不支持使用可选链做类型收窄

通过判断语句可以缩小类型范围比如：

```ts
{
  type Goods = 'pen' | 'pencil' ;
  const getPenCost = (item: 'pen') => 2; // 只接收单一类型`pen`
  const getCost = (item: Goods) =>  {
    if (item === 'pen') {                // 通过语句判断缩小类型范围，所以getPenCost函数不会类型报错
      return getPenCost(item); // item => 'pen'
    }
  }
}
```

不要使用`falsy`进行判断，可能导致类型拓宽

```ts
function foo(x?: number | string | null) {
  if (!x) {
    x; // Type is string | number | null | undefined\
  }
}
```

还有一种常用的缩小类型的方法，就是在他们上放置一个明确的标签，这种模式也被称为 ”标签联合“ 或 ”可辨识联合“：

```ts
interface UploadEvent {
  type: "upload";
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: "download";
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case "download":
      e; // Type is DownloadEvent 
      break;
    case "upload":
      e; // Type is UploadEvent 
      break;
  }
}
```



### 签名的种类

1. 字符串索引签名
2. 数字索引签名
3. 调用签名，用来描述接口或者type可被调用

### ts中的几种符号

#### []

`string[]`表示数组类型，`any[string]`表示获取any类型的`string`索引类型

#### <>

一般用于表示泛型，`type NameOrId<T extends number | string> = T extends number ? IdLabel: nameLabel;`

还可以表示映射类型

```ts
type Num = GetReturnType<() => number>;
```



## Everyday Types

### any

any类型允许访问变量的任何属性和方法

变量定义时如果没有指定类型，不管之后值的类型如何推断该变量的类型都为`any`

## 枚举

枚举很特殊，既可以做变量又可以做类型。枚举分为数字枚举和字符串枚举还有常量枚举，数字枚举成员还具有了_反向映射_，枚举可以通过`keyof typeof`来创建联合类型,例：

```js
enum Test {
    a,
    b,
    c
}
type Test2 = keyof typeof Test  // "a"|"b"|"c"
```

### 常量枚举

使用const定义，不同于常规的枚举，它们在编译阶段会被删除。 常量枚举成员在使用的地方会被内联进来

## Class

限制`Class`类型的方法，目前已经找到的有`implements`,通过`implements`可以限制class的属性类型等

## Functions

### 函数声明方式

有两种方式，一种是：

```ts
type LongHand = {
    (a:number):number
}
```

还有一种是内联声明，但是只有第一种方式可以使用重载

```ts
type ShortHand = (a:number) => number;
```

函数注解还支持箭头函数：`const simple: (foo: number) => string = foo => foo.toString();`

函数可实例化：

```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```



### Overloads(重载)

当函数参数有多个类型值和多个类型的返回值时，需要使用重载来声明对应的各个类型, 

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

解决了什么问题？如果合并参数类型的话，那么最终函数返回值类型不是固定的，也就有可能会导致不存在某类型方法，比如`split`等

### 可选参数

```js
function f(x?: number) {
  // ...
}
```

如果为函数参数提供默认值，则推断其为可选参数,此时就不受「可选参数必须接在必需参数后面」的限制了：

### 剩余参数

ts中剩余参数不会自动推断出类型，隐式类型为`any[]`

```
type a=(...args)=>any  // args的类型为any[]
```

通过将回调函数作为类型变量传入泛型，为回调函数添加参数类型：

```ts
const useTest = <T>(cb: T) => {
  return {
    cb,
  }
}
const callback = (name: string, age: number) => {}
const { cb } = useTest<typeof callback>(callback)
cb('nihao', 90)
```



### 扩展参数

假如定义了一个函数

```
function test(a:number,b:string){
	return a+b
}
```

直接调用`test(...[1,'2'])`是不可以的，解决办法是，要么断言告知函数参数肯定为固定个数：

```
test(...[1,'2'] as [number,string]) 
test(...[1,'2'] as const) // 这样也可以
```

要么设置函数的参数时，使用扩展参数类型, rest 参数只能是最后一个参数

```
function test(...args:any[]){
}
```

再或者使用元祖定义变量：

```
const params:[number,string]=[1,'2']
test(...params)
```

## void

表示没有任何类型，不能赋值给其他类型，一般用在函数返回值上，虽然没有返回时，函数返回的是`undefined`，但是我们不能声明为`undefined`，否则报错，不返回值情况ts会自动推断出其返回类型为`void`

## never

nerver表示永远不会存在的值的类型，有两种情况会产生：

1. 函数抛出异常
2. 死循环

never同`undefined`和`null`一样都是任何类型的子类型，可以赋值给任何类型。只有`never`可以给`never`赋值

never可以赋值给一个不可修改的空数组`never[]`，而`[] extends never[]`是成立的。参考:

1. pr:https://github.com/microsoft/TypeScript/pull/8944
2. https://www.explainprogramming.com/typescript/never-type/

## unknow

任何类型的值都可以赋值给`unknow`，但是只能为`unknow`和`any`赋值,`unknow`不允许定义的值有任何操作，如`new`或者方法执行等，但`any`可以

## Object

小写 `object`表示所有非原始数据类型。大写`Object`代表所有拥有 toString、hasOwnProperty 方法的类型，在严格模式下，null 和 undefined 类型也不能赋给 Object。

大 Object 不仅是小 object 的父类型，同时也是小 object 的子类型

`{}`空对象类型和`Object`类型行为一致

对象类型中的属性定义时，被视为同`let`声明变量一样，具有拓宽行为

### 索引类型(Index Signatures)

用于表示任意类型的属性,一个接口或者type中最多只能定义一个string`索引类型`和一个number索引类型

```ts
interface Person {
  	age?: number;
    [propName: string]: any;
}	
```

一旦定义了索引类型，那么确定属性和可选属性的类型都必须是它的类型的子集

```ts
interface Person {
  name: string;
  age?: number;  // 这将会提示类型“number | undefined”的属性“age”不能赋给“string”索引类型“string”
  [propName: string]: string; // 把这里修改成string|number|undefined就可以了，因为是可选属性，所以还要支持undefined
}

let tom: Person = {
  name: 'Tom',
  age: 26,
  gender: 'male'
};
```

ts中支持两种类型的索引签名，一个是数字类型的还有一个是string类型的。

```ts
interface StringArray {
  // 字符串索引 -> keyof StringArray => string | number
  [index: string]: string; 
}

interface StringArray1 {
  // 数字索引 -> keyof StringArray1 => number
  [index: number]: string;
}
```

为了同时支持两种索引类型，就得要求数字索引的返回值必须是字符串索引返回值的子类，这是因为当使用`number`来索引时，JavaScript 会将它转换成`string`然后再去索引对象。 也就是说用`100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致：

```ts
type TupleToObject<T extends readonly any[]> = {
    [K:string]:string|number;
    [B:number]:number;
}
```



### 交叉类型(Intersection Types)

通过`&`定义的`type`,只能用于`type`。如果属性有重合部分，但是类型不相同，相当于是取两个类型的交集：

```
type a = { a: string; b: number };
type aa = { a: string; b: string };
type aaa = a & aa;

const newA:aaa = {
  a: "你好",
  b: 1,
};
```

这里的`newA.b`类型为`never`

如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，合并后 name 属性的类型就是两者中的子类型。

如果同名属性是非基本数据类型的话可以成功合并

```ts
nterface A {
  x:{d:true},
}
interface B {
  x:{e:string},
}
interface C {
  x:{f:number},
}
type ABC = A & B & C
let abc:ABC = {
  x:{
    d:true,
    e:'',
    f:666
  }
}
```

交叉类型优先级高于联合类型`1|2|3 & 4`类型为`1|2`

### Array

定义一个非空数组

```
type NonEmptyArray<T> = [T, ...T[]]
```

展开数组,`[...T]`

### ReadonlyArray Type

只读数组类型

### Tuple(元组)

类似于数组，一般用来定义长度固定的数据，`let x:[string,number]`,在长度和类型都不确定时，应使用`any[]`

通过使用剩余元素也可以用元祖标识不固定长度数据，`type RestTupleType= [number,...string[]]`

在ts 3.4中引入了只读元素的支持:

```ts
const point:readonly [number,number] =[10,20];
```

元祖类型可以通过`tupleType[number]`转换为联合类型

当添加越界的元素时，它的类型会被限制为元祖中，每个类型的联合类型

## Generics（泛型）

泛型的使用场景，一个函数可以接收任意类型的值，返回也是该类型的值，笨一点的方法是使用方法重载，这样可以保证返回值类型的方法可用,但是这样就需要js有多少类型，就要定义多少个函数

```ts
type idBoolean = (arg: boolean) => boolean;
type idNumber = (arg: number) => number;
type idString = (arg: string) => string;
```

或者使用`any`,但是这样就会导致类型判断丢失，这个时候使用泛型`<T>`，`<T>`是一个抽象类型，只有在调用时才知道类型是什么

```ts
function identity<T>(arg: T): T { // 使用泛型必须要先用`<T>`语法定义一个泛型给后边使用
  return arg;
}
const test2 = <T,B>(arg:T, arg2: B): B => {
  return arg2
}
```

其实`T`可以用任何有效名称代替，除了`T`之外还有常见的泛型变量约定:

- K(Key):表示对象中的键类型；
- V(Value):表示对象中的值类型;
- E(Element):表示元素类型；

由泛型定义的函数，在执行时可以指定泛型的类型,也可以省略:

```ts
const test2 = <T,B>(arg: T,arg2:B): B => {
  return arg2
}
test2<number,number>(1,2)
```

### 类型操纵

#### 映射类型

根据旧的类型创建出新的类型, 我们称之为映射类型

```ts
interface TestInterface{
    name:string,
    age:number
}
```

```ts
// 我们可以通过+/-来指定添加还是删除

type OptionalTestInterface<T> = {
  [p in keyof T]+?:T[p]
}

type newTestInterface = OptionalTestInterface<TestInterface>
```



### Generic Constraints(泛型约束)

因为泛型可以表示任意类型的值，那么我们在调用该泛型的具体类型方法时，需要约束它的类型，通过使用extends对`T`进行约束，让`T`去实现这个接口

```ts
interface Sizeable {
  size: number;
}
function trace<T extends Sizeable>(arg: T): T {
  console.log(arg.size);
  return arg;
}
```

### T[number]

如果T为数组类型，则可以通过该语法获取数组中的所有元素的联合类型

## keyof操作符

将一个类型映射为它所有成员名称的联合类型

```typescript
interface Person {
  name: string;
  age: number;
  gender: string;
}
type P = keyof Person; // "name" | "age" | "gender"
```

keyof也支持基本数据类型：

```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "toString" | "toFixed" | "toExponential" | ...
let K3: keyof symbol; // let K1: "valueOf"
```

使用场景是当我们需要明确的约束使用对象上存在的属性时，比如：

```ts
function prop(obj: object, key: string) {
  return obj[key];
}
// 这里约束obj为对象类型，然后key为obj的属性联合类型的子类
function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

## 条件类型

语法与js中的条件表达式一样， `SomeType extends OtherType ? TrueType : FalseType;`



与泛型一起使用时，当传入联合类型，条件类型将作用于联合类型中的每一个类型

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>; // type StrArrOrNumArr = string[] | number[]
```

这种行为是默认行为，如果想避免出现这种情况，那么需要将`extends`的两侧用`[]`括起来：

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
type StrArrOrNumArr = ToArrayNonDist<string | number>; // type StrArrOrNumArr = (string | number)[]
```



## Type Assertions（类型断言）

### as 断言

当ts无法推断出类型的更多信息时，使用断言可以提供更多的信息，比如：

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

还可以使用尖括号语法（不可以与`.tsx`一起使用）：

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

与类型注释一样，类型断言会被编译器删除，不会影响代码的运行时行为。

> 因为类型断言在编译时被移除，所以没有与类型断言相关联的运行时检查。如果类型断言错误，则不会产生异常或空值。

断言只能用于父集或者子集，以下这种会报错：

```typescript
const x= "hello" as number;
```

### const 断言

确保定义的变量及子属性都为只读，不可修改。

```javascript
const buttonProps = {
  type: {
    type: String as PropType<Type>,
    default: 'default'
  },
  dashed: Boolean,
  iconPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  attrType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  bordered: {
    type: Boolean,
    default: true
  }
} as const
```

### 非空断言

添加后缀表达式操作符`!`，表示断言操作对象是非`null`和`undefined`类型的

```ts
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString(); // ok
mayNullOrUndefinedOrString.toString(); // ts(2531)
```

### 确定赋值断言

允许实例属性和声明变量后边添加`!`，从而告诉ts该属性会被明确地赋值：

```ts
let num!: number;
export const test = () => {
  num = 2;
};
test();
console.log(num * 2);
```



### 双重断言

通常情况下，我们可以使用`cat as any `来为cat定义成任意类型，如果使用双重断言，那么就可以把一个类型断言成一个另一个不兼容的类型`cat as any as Fish`.

**除非迫不得已，千万别用双重断言**。

## 操作符

### in

用来遍历联合类型

```ts
type Keys ="a"|"b"|"c"
type Obj = {
  [p in Keys]: any
} // -> {a:any,b:any,c:any}
```

### infer

在条件类型语句中，可以用`infer`声明一个新的泛型并且对它进行使用

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
```

无法在正常类型参数的约束子语句中使用`infer`声明：

```
type GetReturnType<Type extends (...args: never[]) => infer Return ? Return : any> 
```

### typeof

获取变量的类型

```typescript
let s = "hello";
let n: typeof s; // string
```

## 字面量类型

字面量不仅可以表示值，还可以表示类型

目前支持4种字面量类型：字符串字面量类型、模板字面量类型、数字字面量类型、布尔值字面量类型

其作用是缩小类型范围，提高代码可读性

```ts

  let specifiedStr: 'this is string' = 'this is string';
  let specifiedNum: 1 = 1;
  let specifiedBoolean: true = true;
	type World= 'world'
  type Greeting =`hello ${World}` // hello world
```

### 模板字符串字面量

如果模板中变量是联合类型，则结果类型为每个联合类型成员构成的字符串字面量的集合

```ts
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

多个替换字符串的位置上的多个联合类型会进行交叉相乘

### 例子

定义单个的字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型，用来描述拥有明确成员的实用的集合

如下代码所示，我们使用字面量联合类型描述了一个明确、可 'up' 可 'down' 的集合，这样就能清楚地知道需要的数据结构了。

```
type Direction = 'up' | 'down';

function move(dir: Direction) {
  // ...
}
move('up'); // ok
move('right'); // ts(2345) Argument of type '"right"' is not assignable to parameter of type 'Direction'
```



## namespace

命名空间同样具有合并的特性

## 模块

### 全局模块
在默认情况下，当你开始在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中。如在 foo.ts 里的以下代码。
```js
const foo = 123;
```
如果你在相同的项目里创建了一个新的文件 bar.ts，TypeScript 类型系统将会允许你使用变量 foo，就好像它在全局可用一样：
```
const bar = foo; // allowed
```
### 文件模块
如果我们在ts文件中使用`export`或者`import`，那么这个文件就会被标记为一个模块，文件内定义的声明也不会“污染”全局命名空间
## 接口（interface）
理解：接口是用来描述对象可以做什么的，可以看做是一种协议，它约束了一类相似的”东西“都应该具有的属性,通常定义一个变量实现`interface`的时候需要严格按照`interface`中定义的属性来实现。

一般情况下，接口首字母大写

描述函数时的写法:

```ts
interface SetPoint {
  (a:string,b:string):void;
}
```

### 鸭式辨型法

ts的类型会根据是否实现这个接口，来判断是否通过类型检测,这种方法叫做`duck type`，例如：

```
interface Config{
    a:string
}
function test(config:Config){
    console.log(config)
}
test({a:'1',b:2}) // 报错

const obj={a:'1',b:2}
test(obj) // 不报错
```
在函数参数里写对象就相当于是直接给`config`赋值，这个对象有严格的类型定义，所以不能多参或少参。但是我们在外部定义一个变量再传给函数，此时根据类型的兼容性，两种类型对象，参照`鸭式辨型法`,因为都具有`a`属性，所以可以绕过类型检查

### 声明数组

```ts
interface test = {
    [index:number]:any
}

```

### 声明函数

```ts
interface f = {
    (a:string,b:number):string
}
```



## 类型声明

### let vs const

const声明时，该变量为值的字面量类型，而let声明时，是该值的父类型

```ts
  const str = 'this is string'; // str: 'this is string'
  const num = 1; // num: 1
  const bool = true; // bool: true
  
  let str = 'this is string'; // str: string
  let num = 1; // num: number
  let bool = true; // bool: boolean

```



## 工具类

### Partial Type

映射一个接口或者类型别名的所有第一层属性为可选：

```ts
type NewUserInfo = Partial<UserInfo>;
```

实现原理：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### DeepPartial Type

深层映射属性可选，实现原理：

```
type DeepPartial<T> = {
     // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object
      ? DeepPartial<T[U]>
      : T[U]
};
```

### Required Type

映射类型属性为必选

```ts
type Required<T> = { 
    [P in keyof T]-?: T[P] 
};
```

### Readonly Type

`Readonly<T>` 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。

实现原理：

```ts
type Readonly<T> = {
 readonly [P in keyof T]: T[P];
};
```

### Pick Type

Pick 从某个类型中挑出一些属性出来

定义：

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

例子：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### Record Type

`Record<K extends keyof any, T>` 的作用是将 `K` 中所有的属性的值转化为 `T` 类型。`K extends keyof any`部分为联合类型，联合类型中的值作为属性，`T`作为这些属性的值类型。

定义：

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

```

例子：

```ts
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```

### ReturnType

用来得到一个函数的返回值类型

定义：

```
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

例子：

```ts
type Func = (value: number) => string;
const foo: ReturnType<Func> = "1";
```

### Exclude Type

只能作用于联合类型，把第一个类型中与第二个类型有交集的类型全部排除掉，如果第一个类型为第二个类型的子集，则返回never

定义：

```ts
type Exclude<T, U> = T extends U ? never : T;
```

例子：

```ts
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
```

### Extract Type

把第一个类型中与第二个类型有交集的类型提取出来，没有交集则返回never

定义：

```ts
type Extract<T, U> = T extends U ? T : never;
```

例子：

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

### Omit Type

忽略掉类型中的某些属性，第二个参数为第一个参数的联合类型

定义：

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

例子：

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### NonNullable Type

过滤类型中的`null`和`undefined`类型

定义：

```ts
type NonNullable<T> = T extendsnull | undefined ? never : T;
```

例子：

```ts
type T0 = NonNullable<string | number | undefined>; // string | number
```

### Parameters Type

用于获取函数中的参数的元祖类型

定义：

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
? P : never;
```

例子：

```ts
type A = Parameters<() =>void>; // []
type B = Parameters<typeofArray.isArray>; // [any]
type C = Parameters<typeofparseInt>; // [string, (number | undefined)?]
type D = Parameters<typeofMath.max>; // number[]
```



## DOM操作

1. [DOM type definitions](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts)

## 最佳实践

### 避免出现新增联合类型没有对应的实现？

使用`never`只可以赋值给自己的特性：

```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

如果有一天`Foo`新增了`boolean`类型，那么会编译报错

### 永远不要使用`Number、String、Boolean、Symbol、Object

这些类型是js中的非原始封装对象类型，使用`number`, `string`, `boolean`, and `symbol`

### 不要把逻辑相斥的属性写在一个类型中

比如这里的`isLoading`和`errorMsg`

```ts
interface State {
  pageContent: string;
  isLoading: boolean;
  errorMsg?: string;
}
```

### 使用function替代箭头函数

在ts中函数类型的定义需要用到`=>`，使用`function`可以减少混淆

## 声明文件

为ts提供类型，一般是`d.ts`文件，使用`declare`声明外部变量或文件导入，如果是声明文件，则使用`module`：

```
declare module '*.css'
```

更多声明文件用法：https://ts.xcatliu.com/basics/declaration-files.html

### declare

声明语句，只能用来声明类型，不能定义具体实现,`declare namespace`用来表示一个对象

### 声明合并

假如 jQuery 既是一个函数，可以直接被调用 `jQuery('#foo')`，又是一个对象，拥有子属性 `jQuery.ajax()`（事实确实如此），那么我们可以组合多个声明语句，它们会不冲突的合并起来

```ts
declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

### 声明导出commonjs包

`export =`

### 默认导出

只有`function`、`class` 和 `interface`可以和`export default`一起使用，其他的变量需要先定义出来，再默认导出

### 扩展已有模块类型

先导入，再使用`declare module`进行扩展

```ts
// types/moment-plugin/index.d.ts

import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
```

### 三斜线指令

同`import`导入其他模块类型差不多，当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 `import`：

- 当我们在**书写**一个全局变量的声明文件时
- 当我们需要**依赖**一个全局变量的声明文件时

在全局变量的声明文件中，是不允许出现 `import`, `export` 关键字的，一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了

```ts
// types/jquery-plugin/index.d.ts

/// <reference types="jquery" />

declare function foo(options: JQuery.AjaxSettings): string;
```

三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。

在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 `import` 导入，当然也就必须使用三斜线指令来引入了.

```ts
// types/node-plugin/index.d.ts

/// <reference types="node" />

export function foo(p: NodeJS.Process): string;
```

reference中types表示对一个库的依赖，而path表示对一个文件的依赖

## 编译

1. `tsc`是官方提供的编译器，可以提供类型声明，类型检查，转换插件等功能
2. 还可以使用babel，但是有些语法不支持，好处是按需打包，不会整个引入`core-js`

### tsc

1. `--lib` ,使用这个参数可以将`lib`与`--target`解耦
1. `--traceResolution`可以查看路径引用，会显示导入的名字和位置，还有编译器使用的策略，从哪加载的type文件，最终是否加载成功
1. `--noResolve`,编译时，指定只解析哪些文件，比如`app.ts`中引入了`a`和`b`，那么使用命令`tsc app.ts a.ts --noResolve`则不会解析模块`b`

## 学习

1. [Typescript入门教程](https://ts.xcatliu.com/)
1. [TypeScript 使用手册](http://www.patrickzhong.com/TypeScript/)
1. ~~深入理解 TypeScript~~不推荐，没有阅读顺序，且已过时，翻译很糟糕

## 问题

### ts类型声明中遍历的几种方式？

1. 对象中属性的循环，使用`in`操作符
2. 类型的自调用

### 如何在已知肯定有某属性，但是该类型定义没有时，进行调用？

比如`window.foo`,我们可以使用`any`的特性，`(window as any).foo`

### 定义类型的时候如何写判断语句？

1. 不能在定义类型时写`typeof`判断
2. 不能写`===`
3. 可以写`extends`进行三元运算符判断

### 如何绕过类型检查？

1. 鸭式辨型法

2. 类型断言`as`, 虽然不会报错，但是在使用`p.girl`的时候还是会报错

   ```ts
   interface Props { 
     name: string; 
   }
   
   let p: Props = {
     name: "兔神",
     girl: false 
   } as Props;
   
   ```

3. 索引类型

3. 当函数接受参数超过声明类型时，可以通过把参数写成一个变量，而不是参数语句时，可以绕过检查,这种方法只有在有共同属性的时候才可以

### 如何根据对象实例创建类型？

一般我们都是通过定义接口或者类型别名，然后为对象赋类型，那么如何反过来操作呢，根据对象实例创建类型？

使用`typeof`操作符即可：

```ts
const Message = {
    name: "jimmy",
    age: 18,
    address: {
      province: '四川',
      city: '成都'   
    }
}
type message = typeof Message;
```



### TypeScript 引入文件报错

TypeScript引入文件时，不能引入`index.ts`文件，应该改成`index.js`或者`index`
### webpack打包报错
原因是先进行了编译，产生了js文件，然后代码import中并没有指定文件后缀名，webpack中resolve优先引用js文件导致，改成优先引用ts文件可以解决这个问题
```diff
resolve: {
-    extensions: [".js", ".ts", ".json"],
+    extensions: [".ts", ".js", ".json"],
},
```

### interface和type的区别

主要区别：

1. type可以定义原始数据类型、联合类型、交集类型、元祖类型，而interface不可以，一般interface用来描述对象类型

2. interface和type扩展方式不同。interface通过`extends`，type通过交集类型`&`进行扩展。类型别名为对象类型时，interface和type可以互相使用对方进行扩展

   ```typescript
   interface Animal{
     name:string
   }
   interface Bear extends Animal {
     honey: boolean
   }
   type Animal = {
     name: string
   }
   type Bear =Animal & {
     honey: Boolean
   }
   ```

3. 接口可以定义多个，会自动合并，而类型别名不行

   ```typescript
   // 同名接口自动合并
   interface Window {
     title: string
   }
   interface Window {
     ts:import("typescript")
   }
   // 同名类型会报错
   type Window ={
     title: string
   }
   type Window ={
     ts:import("typescript")
   }
   ```

到底是使用type还是interface？

ts中能用interface的尽量用interface，其他情况使用type，type更适合用在定义function的时候

### 类型声明和类型断言的区别？

类型声明：`const a:People = {name:"zhangsan"}`,类型断言：`const a = {name:"zhangsan"} as People`,类型声明更加严格，是单边兼容，需要值兼容类型，而类型断言则是两边有一个兼容即可

### 类型兼容？

1. 不同枚举类型之间是不兼容的

2. 对于没指定泛型参数时，所有的泛型都当做`any`进行比较

   ```ts
   let identity = function<T>(x: T): T {
       // ...
   }
   
   let reverse = function<U>(y: U): U {
       // ...
   }
   
   identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
   
   ```

   

### 为什么在`exclude`列表里的模块还会被编译器使用?

要从编译列表中排除一个文件，你需要在排除它的同时，还要排除所有对它进行`import`或使用了`/// <reference path="..." />`指令的文件。