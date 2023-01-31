---
title: ES6学习笔记
category: 分享
tags:
  - js
date: 2019-02-22
vssue-title: ES6学习笔记
---
# ES6
## String
charAt()  
includes(v,i)  
startsWith(v,i)  
endsWith(v,i)  
repeat()  
padStart(num,str)  
padEnd(num,str)  
${}  
fn``:标签模板  
raw()  
## Number
isFinite()    
isNaN()  
parseInt()  
parseFloat()  
isIneger()  
EPSILON  
isSafeInteger()  
**:指数运算符  
## Function
rest参数：...values  
尾调用优化  
## Array
扩展运算符: ...    
* 可以clone数组  
* 可以Str转Arr  
* arrLike(Iterator)转Arr  

from(al,fn)  
of()  
copyWithin(target,start,end)  
find(fn(v,i,arr),this)  
findIndex(fn(v,i,arr),this)  
fill(v,start,end)
entries()  
keys()  
values()  
includes(v,i)  
some(fn)
## Object
is(value1,value2)  
assign(target, source1, source2)  
super.[xxx] 引用原型对象的属性  
entries()  
keys()  
values()  
## Set  
new Set()  
add(value)  
delete(value)  
has(value)  
clear()  
.size  
keys()   
values()  
entries()  
forEach(fn(v,key),this)

## Map
new Map(arr)
.set(key,value)  
.get(key)  
.has(key)  
.delete(key)  
.clear()  
.size  

## Promise  
Promise.prototype.then()  
Promise.prototype.catch()  
Promise.all()  
Promise.race()