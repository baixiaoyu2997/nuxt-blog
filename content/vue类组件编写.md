---
title: vue类组件编写
category: 分享
tags:
- vue
date: 2020-07-09
vssue-title: vue类组件编写
---
## 简介
本文介绍如何使用`vue-class-component`来编写组件
## 类组件
使用`@Component`装饰vue类组件
```
import Vue from 'vue'
import Component from 'vue-class-component'

// HelloWorld class will be a Vue component
@Component
export default class HelloWorld extends Vue {}
```
### Data
初始数据可以写成类属性
```
<template>
  <div>{{ message }}</div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declared as component data
  message = 'Hello World!'
}
</script>
```
> 注意，如果初始值为`undefined`，类属性将不会响应，这意味着属性的变化将不会被检测到,为了避免这种情况，初始值可以设置成`null`
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // `message` will be reactive with `null` value
  message = null

  data() {
    return {
      // 如果通过`data hook`设置的值为undefined，那么值是动态的
      hello: undefined
    }
  }
}
```
### 方法
组件方法可以直接声明为类原型方法：
```
<template>
  <button v-on:click="hello">Click</button>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declared as component method
  hello() {
    console.log('Hello World!')
  }
}
</script>
```
### 计算属性
计算属性可以声明为类属性getter / setter
```
<template>
  <input v-model="name">
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  firstName = 'John'
  lastName = 'Doe'

  // Declared as computed property getter
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  // Declared as computed property setter
  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }
}
</script>
```
### Hooks
data、render和所有Vue生命周期钩子也可以直接声明为类原型方法，但是不能在实例本身上调用它们。在声明自定义方法时，应该避免使用这些保留名。
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declare mounted lifecycle hook
  mounted() {
    console.log('mounted')
  }

  // Declare render function
  render() {
    return <div>Hello World!</div>
  }
}
```
### 其他选项
除了上面的选项，所有其他的选项通过装饰器`@Component`传入
```
<template>
  <OtherComponent />
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import OtherComponent from './OtherComponent.vue'

@Component({
  // Specify `components` option.
  // See Vue.js docs for all available options:
  // https://vuejs.org/v2/api/#Options-Data
  components: {
    OtherComponent
  }
})
export default class HelloWorld extends Vue {}
</script>
```
## 额外的Hooks
如果你使用一些Vue插件(如Vue Router)，您可能需要类组件来解析它们提供的钩子。在这种情况下，`Component.registerhook`允许您注册这样的钩子:
```
// class-component-hooks.js
import Component from 'vue-class-component'

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
```
注册了钩子后，类组件将其实现为类原型方法:
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // The class component now treats beforeRouteEnter,
  // beforeRouteUpdate and beforeRouteLeave as Vue Router hooks
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    next()
  }

  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    next()
  }

  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    next()
  }
}
```
建议在单独的文件中编写此注册代码，因为您必须在任何组件定义之前注册它们。你可以通过将钩子注册的import语句放在主文件的顶部来确保执行顺序:
```
// main.js

// Make sure to register before importing any components
import './class-component-hooks'

import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App)
})
```
## 自定义装饰器
您可以通过创建自己的decorator来扩展此库的功能。Vue类组件提供了`createDecorator`方法来创建自定义decorator。`createDecorator`期望一个回调函数作为第一个参数，这个回调函数将收到以下参数:
- `options`: Vue组件选项对象。此对象的更改将影响所提供的组件。
- `key`: 应用decorator的属性或方法键。
- `parameterIndex`: The index of a decorated argument if the custom decorator is used for an argument.
```
// decorators.js
import { createDecorator } from 'vue-class-component'

// 声明 Log 装饰器.
export const Log = createDecorator((options, key) => {
  // 保留原来的方法供以后使用。
  const originalMethod = options.methods[key]

  // 为原方法包裹一层，添加自己的逻辑
  options.methods[key] = function wrapperMethod(...args) {
    // Print a log.
    console.log(`Invoked: ${key}(`, ...args, ')')

    // Invoke the original method.
    originalMethod.apply(this, args)
  }
})
```
使用它作为方法装饰器:
```
import Vue from 'vue'
import Component from 'vue-class-component'
import { Log } from './decorators'

@Component
class MyComp extends Vue {
  // It prints a log when `hello` method is invoked.
  @Log
  hello(value) {
    // ...
  }
}
```
## Extend 和 Mixins
### Extend
可以使用原生的继承语法进行继承:
```
// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Define a super class component
@Component
export default class Super extends Vue {
  superValue = 'Hello'
}
```
```
import Super from './super'
import Component from 'vue-class-component'

// Extending the Super class component
@Component
export default class HelloWorld extends Super {
  created() {
    console.log(this.superValue) // -> Hello
  }
}
```
注意，每个超类都必须是类组件,换句话说，它需要作为祖先继承Vue构造函数，并由`@Component`装饰器进行装饰
### Mixins
Vue类组件提供了mixin助手函数，以类的方式使用mixin。通过使用mixin helper, TypeScript可以推断mixin类型并在组件类型上继承它们。  

声明mixins文件：
```
// mixins.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare mixins as the same style as components.
@Component
export class Hello extends Vue {
  hello = 'Hello'
}

@Component
export class World extends Vue {
  world = 'World'
}
```
在类组件中使用mixins：
```
import Component, { mixins } from 'vue-class-component'
import { Hello, World } from './mixins'

// Use `mixins` helper function instead of `Vue`.
// `mixin`可以接收任意数量的参数。
@Component
export class HelloWorld extends mixins(Hello, World) {
  created () {
    console.log(this.hello + ' ' + this.world + '!') // -> Hello World!
  }
}
```
与超类一样，所有mixin都必须声明为类组件。