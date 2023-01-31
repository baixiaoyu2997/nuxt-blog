---
title: vue自定义组件v-model使用方法
category: 分享
tags:
- vue
date: 2019-03-21
vssue-title: vue自定义组件v-model使用方法
---
## vue自定义组件v-model使用方法  

先来看一下vue官方文档 [自定义组件的v-model](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model) 介绍  

![vue自定义组件v-model使用方法_2020-3-13-12-40-10.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/vue自定义组件v-model使用方法_2020-3-13-12-40-10.png)

## 实际DEMO演示
1. 首先写一个最简单的elementUI select封装组件
```vue
<template>
  <el-select
    :value="selectValue"  // value中的值、props、model.prop中的值应该为一个，可以和父元素v-model绑定的变量名不同
    @change="$emit('change', $event)" // 这个触发事件对应元素自身的事件，比如输入框就是input
  >
    <el-option v-for="(item, index) in options" :key="index" label="label" value="value" />
  </el-select>
</template>
<script>
export default {
  name: 'meta-select',
  model: { // 负责将对应的事件值传给父组件v-model绑定的变量
    prop: 'selectValue', 
    event: 'change' // 这个触发事件对应元素自身的事件，比如输入框就是input
  },
  props: {
    selectValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>

```
2. 调用meta-select组件
```vue
// 父组件
<MetaSelect v-model="selectValue" :options="options" />

data() {
    return {
      selectValue: '选项2',
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ]
    }
  },
```
## 简单介绍
1. 父组件`v-model`绑定的变量值赋值给子元素接收的prop属性里，子组件绑定值为`model.prop`中的值
```js
 model: { 
    prop: 'selectValue', 
    event: 'change'
  },
```

2. 当组件触发更改值的事件时（change、input）会触发元素绑定的对应事件，并把新值赋值给父元素绑定的`v-model`变量
```vue
<el-select
    :value="selectValue" 
    @change="$emit('change', $event)" 
>
```
3. 子元素中的值更新事件同样可以在父元素中接收到
```vue
<MetaSelect v-model="selectValue" :options="options" @change="test"/>

methods:{
  test(value){
    console.log(value)
  }
}
```