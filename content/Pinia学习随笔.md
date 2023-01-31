---
title: Pinia学习随笔
category: 分享
tags:
  - Pinia
date: 2021-11-01
vssue-title: Pinia学习随笔
---

## 介绍

支持vue3，作为vuex5还没出现前的替代品，提供了同样方便的使用方式和对`composition-api`的支持，每个store为一个文件，这样更利于代码拆分和ts推理。

pinia中不再有mutations,所有动作由action完成

### 定义store

setup中没有`usestore`的话，那么这个store是没还有被创建的。

```js
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
})
```

### 语法

pinia支持option和setup语法，如果使用setup的话，则不支持`$reset`等方法

### 使用store

```js
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

store是被reactive包裹的对象，所以不能解构,直接访问它的值也不用写`.value`

同时使用多个同名store只会触发一次实例化

### 重置store

```js
store.$reset() // 只能用在option中，无法在setup中使用
```

### 修改多个值

```js
store.$patch({
  counter:store.counter+1,
  name:'Abalam'
})
```

或者使用下边这种写法修改数组中的值。

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})

```

### 整个替换store

```js
store.$state = { counter: 666, name: 'Paimon' }
```

或者

```js
pinia.state.value = {}
```

## 监听

### $subscribe()

状态订阅绑定到添加他们的组件，当组件卸载时，订阅自动删除。如果想在组件卸载时保持订阅，输入第二个参数为`true`,eg:`someStore.$subscribe(callback, true)`。与watch相比只会触发一次。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

### 监听action

监听action，可以在成功之后调用callback，或者在报错的时候执行函数，与监听state一样，可以传入第二个参数防止组件卸载后的默认行为。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // 这将在action执行之前执行
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 成功后执行
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 报错或者reject时触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听
unsubscribe()
```

## 插件

插件只能在创建pinia后才能使用。pinia很容易进行扩展，使用use接收一个函数的返回值为扩展内容。比如添加一个所有store都有的属性:

```js
import { createPinia } from 'pinia'

// add a property named `secret` to every store that is created after this plugin is installed
// this could be in a different file
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// give the plugin to pinia
pinia.use(SecretPiniaPlugin)

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```

扩展函数接收一个context参数：

```js
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

### 插件中的状态共用

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 每一个store都有一个独立的secret
  store.hello = ref('secret')
  // 自动解包
  store.hello // 'secret'

  // 所有store共用shared
  store.shared = sharedRef
  store.shared // 'shared'
})
```

### 添加新state

有两种方法：

1. 直接使用store.xxx设置新值
2. store.$state.xxx=xxx ，这种方法会被devtool检测到，在ssr期间会被序列化。

如果使用的是vue2，那么需要借助`set`设置新值

```js
import { set } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!store.$state.hasOwnProperty('hello')) {
    const secretRef = ref('secret')
    // If the data is meant to be used during SSR, you should
    // set it on the `$state` property so it is serialized and
    // picked up during hydration
    set(store.$state, 'secret', secretRef)
    // set it directly on the store too so you can access it
    // both ways: `store.$state.secret` / `store.secret`
    set(store, 'secret', secretRef)
    store.secret // 'secret'
  }
})
```

### 添加外部属性

添加外部属性或者不是响应式对象时，应该用markRaw包裹

```js
import { markRaw } from 'vue'
// adapt this based on where your router isj
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

### 监听state和action

插件内部也可以subscribe：

```js
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // react to store changes
  })
  store.$onAction(() => {
    // react to store actions
  })
})

```

### 读取store中的option

setup语法中，`defineStore`函数的第三个参数为`options`,插件中可以读取

```js
// use any debounce library
import debounce from 'lodash/debunce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // we are overriding the actions with new ones
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

### nuxt中使用plugin

```js
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }) {
  store.$subscribe((mutation) => {
    // react to store changes
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  return { creationTime: new Date() }
}

const myPlugin = ({ pinia }) {
  pinia.use(MyPiniaPlugin);
}
export default myPlugin
```

## 组件外使用

### spa

spa中必须要等待`createApp`之后才能使用`useStore`,还要注意使用顺序，比如router中：

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on the order of imports this will fail
const store = useStore()

router.beforeEach((to, from, next) => {
  // we wanted to use the store here
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})	
```

### ssr

#### vue和vite

> 详情查看https://pinia.esm.dev/ssr/#state-hydration

需要传递pinia实例给useStore：

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})	
```

pinia还提供了`$pinia`给当前应用实例：

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

#### nuxt

`$pinia`会被注入到`context`中：

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}	
```

