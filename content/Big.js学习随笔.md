---
title: Big.js学习随笔
category: 工具
tags:
  - big.js
date: 2022-04-13
vssue-title: Big.js学习随笔

---



## 介绍

js数字处理库



## 构造属性

DP，小数点后位数，默认值是20

RM，四舍五入方式，默认为1，代表向最近的整数取整。如果是0.5，那么向下取整。

NE：在转换为字符串时展示为科学计数法的最小小数位数。默认值是-7，即小数点后第7为才开始不是0。

PE：在转换为字符串时展示为科学计数法的最小整数位数。默认值是21，即数字长度超过21位。

strict：默认值为false。设置为true时，构造函数只接受字符串和大数。

## 实例方法

- abs，取绝对值。
- cmp，compare的缩写，即比较函数。
- div，除法。
- eq，equal的缩写，即相等比较。
- gt，大于。
- gte，小于等于，e表示equal。
- lt，小于。
- lte，小于等于，e表示equal。
- minus，减法。
- mod，取余。
- plus，加法。
- pow，次方。
- prec，按精度舍入，参数表示整体位数,保留第一个非0数字后几位
- round，最多几位小数，参数表示小数点后位数。
- sqrt，开方。
- times，乘法。
- toExponential，转化为科学计数法，参数代表精度位数。
- toFixed，小数补全位数，参数代表小数点后位数。
- toJSON和toString，转化为字符串。
- toPrecision，按指定有效位数展示，参数为有效位数。
- toNumber，转化为JavaScript中number类型。
- valueOf，包含负号（如果为负数或者-0）的字符串。





## 参考

1. https://juejin.cn/post/6900567809038745608#heading-4
