---
title: Jest使用指南
category: 测试
tags:
- jest
date: 2022-03-10
vssue-title: Jest使用指南
---

## 介绍

Jest是facebook出品的单元测试框架, 请记住，测试是输入，功能和预期输出的问题

默认会去`__test__`中查找测试文件。

一个测试文件中至少要有一个`test`函数

### 执行顺序

先执行最外层的`describe`，然后是里层的`it`, 异步`it`会阻塞后边所有`describe`中的`it`块执行

## ESM

首先需要设置package.json中type=module

### yarn

使用yarn，需要运行指令`yarn node --experimental-vm-modules $(yarn bin jest)`替代`test`



## 快照测试

使用snapshot可以保存ui组件的快照，如果两个快照不匹配则报错，如果是修改了组件，则需要更新快照文件，`jest -u`,这个指令会更新所有快照。

如果想限制只重新生成一部分快照，则使用`-testNamePattern`来生成匹配想要生成的快照名字

### 交互式快照模式

进入交互模式后，失败的快照可以从命令行选择更新，使用指令`--watch`

### 属性匹配器

当存在动态属性时，则每次快照都会失败，Jest提供了非对称匹配器，在测试检查时，只判断知否满足某些条件，而不是具体的值：

```
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  };

  expect(user).toMatchSnapshot({
    createdAt: expect.any(Date), // 对于动态值，只判断是否满足条件
    id: expect.any(Number),      
  });
});

// Snapshot
exports[`will check the matchers and pass 1`] = `
Object {
  "createdAt": Any<Date>,        // 生成的快照中，值为特定类型
  "id": Any<Number>,
  "name": "LeBron James",
}
`;
```

### 最佳实践

1. 应该提交快照，并且使用prettier或者eslint等工具进行校验格式化
2. 测试应该是确定性的，尽量减少随机的东西，比如`Date.now`的数据，我们可以通过`mock Date.now`重写该方法，来返回确定值。`Date.now = jest.fn(() => 1482363367071);`
3. 合理的快照描述， 最好的描述名称是写出期望的返回内容。

## Globals

### describe

相当于一个块，describe(name, fn) 创建一个将几个相关测试组合在一起的块。describe中可以写钩子函数，比如`beforeAll、beforeEach`.执行顺序，是块中的代码最先执行，然后才是钩子函数

### test

> 还有一个假名叫 it(name,fn,timeout)

真正运行测试的函数，如果测试函数为promise，则应`return`返回

### beforeAll

在所有测试之前运行，相当于初始化,执行顺序早于`beforeEach`

### afterAll

在所有测试之后运行,执行顺序晚于`afterEach`

### beforeEach

每个`test`运行前都会运行该函数

## Expect

在编写测试时，您经常需要检查值是否满足某些条件。

### expect(value)

 expect 使您可以访问许多“匹配器”，使你可以验证不同的事物。

### assertions(number)

确定一个test中，调用了几次断言，这通常在异步函数中很有用

### .toEqual()

判断是否相等，使用`Object.is`

## The Jest Object

### Mock Modules

#### jest.mock

通过mock来模仿无法在node端执行的操作

## Configuring Jest

### testTimeout

默认异步测试会在超时5秒后结束，对于可能需要等待更长时间的测试需要修改此项

## Jest CLI Options

### `--coverage[=<boolean>]`

为测试代码添加代码覆盖率输出，代码覆盖率指是否测试函数中所有条件语句都走到了，如果要始终开启需要配置`package.json`:

```
"scripts": {
    "test": "jest"
  },
  "jest": {
    "collectCoverage": true,
    ""coverageReporters": ["html"]" //如果想生成html报告设置该项
  },

```

### --bail

别名：`-b`。在 n 个测试套件失败后立即退出测试套件。默认为 1。

## 最佳实践

1. 为了保证代码执行顺序，建议测试代码都写在钩子函数或者测试用例中

## 问题

### 如何单独指定一个文件运行？

只需要在test指令后添加测试文件名称即可，不需要全路径，jest会自动匹配。比如`npm test other.test.js`