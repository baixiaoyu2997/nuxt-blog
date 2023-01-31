---
title: nuxt3学习随笔
category: 分享
tags:
  - nuxt
date: 2021-05-15
vssue-title: nuxt3学习随笔

---

## 介绍

### 新增功能

1. 增量式更新（ISR）
1. `hybrid rendering`：为不同的路由提供不同的渲染模式 ，`client-side`或者`universal`
1. `edge-side rendering`

### 通用渲染

`Universal Rendering`，相当于是`client-side`和`server-side`的结合，在服务端直出页面的基础上，能保证浏览器后台处理js执行，来达到单页跳转效果，减少服务器调用。这一过程称为`Hydration`

### hooks

nuxt通过hook系统来提供强大的扩展能力，支持的hook包括：https://github.com/nuxt/framework/blob/a0c4d6e7e32f490d6f375340bffdc1d3b68a42eb/packages/schema/src/types/hooks.ts#L62

除了`nuxt hooks`还有[runtime hooks](https://github.com/nuxt/framework/blob/a0c4d6e7e32f490d6f375340bffdc1d3b68a42eb/packages/nuxt3/src/app/nuxt.ts#L18):

```
app:created	vueApp	When initial vueApp instance is created
app:beforeMount	vueApp	Same as app:created
app:mounted	vueApp	When Vue app is initialized and mounted in browser
app:rendered	-	When SSR rendering is done
app:suspense:resolve	appComponent	On Suspense resolved event
page:start	pageComponent	On Suspense pending event
page:finish	pageComponent	On Suspense resolved event
meta:register	metaRenderers	(internal)
vue:setup	-	(internal)
vue:error
```

### payload

服务端渲染在激活阶段会将数据传递给客户端，这部分的数据储存在`nuxtApp.payload.data`中

## 数据获取

nuxt中的数据获取都会默认缓存，只有在参数修改才会重新获取，或者手动使用`refresh`或者`refreshNuxtData`

### key

通过使用`key`来防止数据获取混乱，key被存放在nuxt实例的payload中，还在调用过程中的接口被存放在`nuxt._asyncDataPromises`

### useAsyncData

支持页面、组件、plugin在服务器端获取异步数据：

```js
useAsyncData(key: string, fn: () => Object, options?: { lazy: boolean, server: boolean })
```

参数：

1. key：唯一key，确保获取正确的数据
2. fn: 返回一个异步函数的函数
3. options:
   1. lazy: 是否在解析 async 函数之前加载路由（默认为 false）,`useLazyAsyncData`是这个配置的语法糖写法
   2. server:是否在服务器端获取数据（默认为 true）
   3. *transform*: 获得结果后对结果进行转换
   4. pick:提供一个数组，其中的值为接口返回数据中要包含的key（这样可以减少页面的内存消耗）

> `script setup`支持顶级await

## useLazyAsyncData

即使是lazy也会在服务端预先获取数据，不需要写await

### useFetch

相当于useAsyncData的语法糖，不用再写key了

```js
useFetch(url: string, options?)
```

参数：

1. `key`: Provide a custom key

2. Options from  [ohmyfetch](https://github.com/unjs/ohmyfetch)
   1. `method`: Request method
   2. `params`: Query params
   3. `baseURL`: Base URL for request

3. options中还支持useAsyncData中的options，同样提供语法糖写法：`useLazyFetch`

   

key的生成规则:

```
const key = "$f_" + (opts.key || hash([request, { ...opts, transform: null }]));
```



## State

### useState

创建全局共享的只读数据，只有在初始化时可以赋值。可以使用在page、component、plugin中,只能用在setup和生命周期钩子中

```js
useState<T>(key: string, init?: (()=>T)): Ref<T>
```

永远不要在 <script setup> 或 setup() 函数之外定义 const state = ref() 。这种状态将在访问您网站的所有用户之间共享，并可能导致内存泄漏！ ✅ 改为使用 const useX = () => useState('x')

可以配合`auto imported composables`实现数据全局分享

```js
// composables/useColor.js
export const useColor = () => useState<string>('color', () => 'pink')



```

调用

```vue
<script setup>
const color = useColor() // Same as useState('color')
</script>

<template>
  Current color: {{ color }}
</template>
```



## Meta Tags

### useMeta

设置meta，支持的属性：`title`, `base`, `script`, `style`, `meta` and `link`,  `htmlAttrs` and `bodyAttrs`

### Meta组件

nuxt提供`<Title>`, `<Base>`, `<Script>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>` and `<Head>`组件。可以在 `<Body>` and `<Head>`中嵌套使用其他meta组件，这只是为了代码中的美观，并不会影响实际的渲染位置。

### head

option api还可以使用`head`

## NuxtApp

nuxt上下文，类似于nuxt2中的context，可以使用在可组合、插件和组件中:

```js
import { useNuxtApp } from '#app'

function useMyComposable () {
  const nuxtApp = useNuxtApp()
  // access runtime nuxt app instance
}
```

nuxtApp结构：

```js
const nuxtApp = {
  app, // the global Vue application: https://v3.vuejs.org/api/application-api.html

  // These let you call and add runtime NuxtApp hooks
  // https://github.com/nuxt/framework/blob/main/packages/nuxt3/src/app/nuxt.ts#L18
  hooks,
  hook,
  callHook,

  // Only accessible on server-side
  ssrContext: {
    url,
    req,
    res,
    runtimeConfig,
    noSSR,
  },

  // This will be stringified and passed from server to client
  payload: {
    serverRendered: true,
    data: {},
    state: {}
  }

  provide: (name: string, value: any) => void // 类似于nuxt2中的inject
}
```



## Auto Import

nuxt3和bridge支持自动导入，支持的范围包括`components、composables、plugins`

每个 Nuxt 自动导入都由 `#imports` 别名公开

## 目录结构

### components

#### Dynamic Imports

动态导入组件可以通过在组件名称前加`Lazy`实现，例如：`<LazyTheFooter />`

#### ClientOnly

仅在客户端渲染。还支持fallback插槽,用于在挂载之前显示，插槽会在服务端渲染

```html
<template>
  <div>
    <Sidebar />
    <ClientOnly>
      <!-- this component will only be rendered on client-side -->
      <Comments />
      <template #fallback>
        <!-- this will be rendered on server-side -->
        <p>Loading comments...</p>
      </template>
    </ClientOnly>
  </div>
</template>
```



### composables

自动导入该目录下的可组合函数

### layouts

在布局中需要设置`slot`来决定page显示位置:

```vue
<template>
  <div>
    Some shared layout content:
    <slot />
  </div>
</template>
```

如果不想使用layout，那么使用`<NuxtLayout>`组件，并且设置`layout: false`:

```vue
<template>
  <NuxtLayout name="custom">
    <template #header> Some header template content. </template>

    The rest of the page
  </NuxtLayout>
</template>

<script>
export default {
  layout: false,
};
</script>
```

### pages

该目录是可选的，如果不需要其他页面，可以直接使用`app.vue`，这样vue-router不会被引入，可以减少bundle体积。

#### 导航

nuxt项目内部导航应该统一使用`NuxtLink`组件，外部使用a标签

#### 动态路由

nuxt3中不再使用`_xxx.vue`方式创建动态路由，改为使用`[id].vue`，如果想要包含该路径下的所有路径，使用：`[...slug].vue`.

```
-| pages/
---| index.vue
---| users-[group]/
-----| [id].vue
```

上边例子中，通过router获取对应的group和id：

```
$route.params.group
$route.params.id 
```

### plugins

nuxt3中不需要在config文件中指定plugin属性，可以自动导入。通过文件名称`.server`和`.client`区分是否只在服务端和客户端使用。自动导入的文件包括`plugins`顶层目录，和其他子目录的`index`文件

plugin函数必须有一个默认导出

#### 执行时机

只会执行一次，异步plugin可以阻塞渲染

#### `vue plugins`使用

```js
// plugins/vue-gtag.client.js
import VueGtag from "vue-gtag-next";

export default (nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: "GA_MEASUREMENT_ID"
    }
  });
};
```

#### inject全局变量

通过返回一个provide对象，可以注入全局变量

```js
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: () => 'world'
    }
  }
})
```

使用

```html
<script setup>
// alternatively, you can also use it here
const { $hello } = useNuxtApp()
</script>
```





### server

#### Server Middleware

 `~/server/middleware`中的文件会被自动引入

### app.vue

`app.vue`是nuxt3应用的主组件，配合`pages/`使用时，使用`<NuxtPage>`组件：

```vue
<template>
  <div>
    <NuxtPage/>
  </div>
</template>
```

> 请记住，app.vue 是您 Nuxt 应用程序的主要组件，您在其中添加的任何内容（JS 和 CSS）都将是全局的并包含在每个页面中。

### nuxt.config

#### buildModule

只会运行在dev和build时候的构建module

#### runtimeConfig

使用时，在客户端是`reactive`的，但是在服务端为只读的。runtimeConfig的结构为
```js
runtimeConfig:{
  serverSideConfig:{},
  public:{
    xxx:123
  }
}
```

通过`.env`文件可以覆盖`runtimeConfig`中的配置，前提是runtimeConfig中必须已经有该字段，env文件的语法支持驼峰命名和对象格式，比如：`apiSecret`,对应`NUXT_API_SECRET`,对象也是用下划线分隔



通过`useRuntimeConfig`获取的值为`Proxy`类型的配置文件，格式为`{app:{},public:{}, ...serverSideConfig}`在服务端可以获取顶层的配置文件，而在客户端只能获取`public`中的配置文件

为ssg添加动态配置功能，首先添加获取配置`plugin`：

```js
// plugins/config.js
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfigJson = featch('/config.json').then(r=>r.json())
  const config = useRuntimeConfig()

  // 服务端时不可修改config
  if(process.server) return
  Object.assign(config, runtimeConfigJson[config.MODE || 'dev'])
})


```

然后nuxt配置文件中添加该插件，尽量保证该插件在第一个，保证其他插件获取配置正确

```js
export default {
  //....
  plugins: ['./plugins/config'],
  ///...
}
	
```

#### build

```
build:{
	transpile:[] // 转义cjs包为esm, 如果被转义的包还有其他cjs依赖，那么也需要添加到这里
}
```

#### ignore

可以通过设置这个属性，build时进行忽略`layout`, `pages`, `components`, `composables` 和 `middleware` 文件

## TypeScript

`nuxt3`会自动生成一些ts配置，通过`"extends": "./.nuxt/tsconfig.json",`就可以使用，覆盖`compilerOptions.paths `时会导致所有的path都被覆盖，可以通过添加`nuxt`配置中的`alias`来解决这个问题

## 迁移指南

1. 官方迁移教程：https://v3.nuxtjs.org/getting-started/migration
2. 为了更好的迁移nuxt3，不要从useContext中获取`route`, `query`, `from` 和 `params` 
3. 在nuxt3或者bridge中需要使用`defineNuxtModule`来兼容nuxt2中的自定义module
4. 使用nuxi替代所有的nuxt指令，`nuxt `使用`nuxi dev`，`nuxt start`使用`node .output/server/index.mjs`

### modules支持程度

https://github.com/nuxt/framework/discussions/751

### @nuxtjs/composition-api

使用`@nuxtjs/composition-api`可以在nuxt2基础上提前体验nuxt3特性和语法。该包内部依赖`@vue/composition-api`。

#### 配置

安装之后需要在`nuxt.config.js`中进行配置：

```js
buildModules: [
    '@nuxtjs/composition-api/module',
],
```

#### store

该插件会在vuex3基础上提供vuex4的使用语法,通过使用`useStore`返回`this.$store`,在模版中可以直接使用`$stores`:

```js
import {
  useStore,
  computed,
  defineComponent
} from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'Login',
  setup() {
    
    const store = useStore()
		const blockBack = computed(() => store.state.blockBack) // 需要computed包裹才有响应性
    
    return {
      blockBack,
    }
  },
})

```

#### route

通过使用`useRoute`返回`this.$route`,模版中可以直接使用`$route`。`useRouter`同理:

```JS
import { computed, defineComponent, useRoute，useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const route = useRoute()
    const id = computed(() => route.value.params.id) // 注意，route的值需要从.value中获取，Nuxt3中会删除这个特性
    const router = useRouter()
    router.push('/')
  },
})
```



#### head

head属性在options中依旧有效，想要替换成`composition-api`语法，需要使用`useMeta`:

```js
import {
  useMeta,
  defineComponent
} from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'Login',
  head:{}, // 必须有一个空的head对象
  setup() {
    // useMeta必须包裹在defineComponent中，否则无效
    useMeta({ // useMeta有很多写法，可以参考官方文档
      script: [
        {
          src: 'https://ssl.captcha.qq.com/TCaptcha.js',
          body: true,
        },
      ],
    })
    
    return {}
  },
})
```

配合`unplugin-vue2-script-setup`使用时`useMeta`无效，暂时使用普通`option api`替代。

#### useFetch

功能同nuxt2中的fetch一致。注意点：

1. 必须在setup中同步调用,或者生命周期钩子

1. 不需要在setup中返回`fetch`和`fetchState`,实例已经提供`$fetch`和`$fetchState`。

#### useContext

获取nuxt上下文，https://nuxtjs.org/docs/2.x/concepts/context-helpers

#### useAsync

`asyncData`的替代品，只能调用一次，除非提供唯一的`key`,@nuxt/bridge中替换为`useAsyncData`

### unplugin-vue2-script-setup

支持`script setup`写法

### nuxt/bridge

该包是官方迁移的整合包，包含以上几个包

#### 使用

1. useContext:替换成`useNuxtApp()`，还提供`nuxt2Context`访问nuxt2的上下文，但不建议使用，nuxt中没有这个属性。

2. setup标签中完成大部分vue和nuxt的自动导入，可以删除部分import

3. bridge中的useRoute返回值不再需要`.value`

4. 配置nuxt.config.js中的build属性，解决`Can't resolve 'fs'`的问题：

   ```js
   extend(config, { isDev, isClient }) {
         config.node = {
           fs: 'empty'
         }
       }
   ```

5. `useMeta`底层用的是`@vueuse/head`，不要和nuxt2的head一起使用，nuxt2使用的是`vue-meta`。如果要使用`useMeta`，需要在config中设置bridge。并且把config中的`head`替换为`meta`。head虽然和meta实现不同，但是里边的配置写法是一样的。

   ```js
   bridge:{
     meta:true
   }
   ```

6. 不再支持`useStore`,使用`useNuxtApp().$store`替代。推荐使用`pinia`

7. bridge中使用auto import会导致编写代码时DX很差，没有方法名提示和类型提示。使用以下方式引入类型提示:

   ```json
   {
     "extends": "./.nuxt/tsconfig.json",
     "exclude": ["node_modules",".output", "dist"],
     // 添加volar IntelliSense支持,还需要安装`yarn add @vue/runtime-dom -D`
     "vueCompilerOptions": {
       "experimentalCompatMode": 2,
       "experimentalTemplateCompilerOptions": {
         "compatConfig": { "Mode": 2 } // optional
       }
     }
   }
   
   
   ```
   
   
   
   #### postcss
   
   nuxt3内置postcss8
   
   #### useAsyncData和useFetch
   
   无法在bridge中使用
   
   #### webpackHotUpdate is not defined
   
   > 参考： https://github.com/nuxt/framework/issues/1309#issuecomment-987935463
   
   此方法已失效
   
   ```json
   build: {
       optimization: {
         runtimeChunk: true,
         splitChunks: {
           name: true,
           cacheGroups: {
             styles: {
               name: 'styles',
               test: /.(css|vue)$/,
               chunks: 'all',
               enforce: true
             }
           }
         }
       }
     }
   ```
   
   

## 最佳实践

### 静态资源

不要在代码中`import`静态目录中的文件，否则会被打包，可以改用`fetch`请求

### 组件

1. 页面组件都使用`defineComponent`包裹，nuxt单独为`defineComponent`做了特殊处理，比如`useMeta`就必须依赖`defineComponentLazy`
2. 使用`Lazy`导入异步组件，减小bundle size

### 接口

1. 使用useFetch或者useAsyncData时指定你只需要的data的`keys`。否则返回的数据都会被缓存到浏览器中。(原理是nuxt ssr会把服务端数据都存在window对象中)
2. ssr阶段不要通过外网域名访问接口，应访问内网接口，csr阶段再用外网接口。否则ssr调用接口时会变慢。

## 问题

### 如何设置跳转页面滚动位置？

添加文件`app/router.options.ts`:

```ts
import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      return savedPosition
    if (to.hash)
      return { selector: to.hash }
    return { left: 0, top: 0 }
  },
}
```



### SSG如何使用动态配置文件？

编写一个`plugin`，负责`fetch`静态文件目录`static`中的配置文件`config.json`，不能使用`import()`或者`require`来获取配置文件，这样会被打包进js中，即使是`static`目录也如此

```js
import { useAppStore } from '~/store'

export default defineNuxtPlugin(async (nuxtApp) => {
  // // 服务端时不可修改config
  if (!process.server) {
    const globalConfig = await fetch(
      '/config.json'
    ).then((res) => res.json())
    const config = useRuntimeConfig()
    Object.assign(config, globalConfig[config.MODE || 'dev'])
  }
})

```

### nuxt三种构建模式的区别？

> 引用：https://kontent.ai/blog/demystify-nuxt-target-mode-and-ssr-properties

1. Static application (`target: 'static'` and `ssr:'true'`),nuxt中ssg渲染的页面跳转依旧是spa模式
2. SPA Aplication (`target: 'server'` and `ssr:'false'`)
3. SSR Aplication (`target: 'server'` and `ssr:'true'`)，ssr其实还是属于spa，只有首屏的数据是在服务端渲染，其他页面跳转时还是csr

### 如何使用不在node_module中的第三方包？

使用alias对应该包：

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  alias: {
    'sample-library': ['sample-library/dist/sample-library.cjs.js']
  }
})
```

### 如何查看nuxt最终的config？

当前版本没有提供extend，可以去@nuxt/config-edge/dist/config.js中log查看

### build时配置文件？

nuxt-bridge在build时会在nuxt/webpack中自动添加配置。比如babel的默认presets为`@nuxt/babel-preset-app-edge`

### client-side rendered virtual DOM tree is not matching server-rendered？

使用`client-only`组件包裹不支持ssr的组件

### 如何打包spa模式代码？

目前bridge 打包spa有bug，所以需要关闭`nitro`,等待修复：https://github.com/nuxt/framework/issues/886

1. config:

```
// nuxt.config.js
const config = defineNuxtConfig({
  ssr:false,
  target:"static",
  bridge: {
      nitro:false,
   },
})
```

2. command:

```
nuxi generate
```

3. check dir `/dist/`

### `module`和`plugin`的区别

1. 运行时机不同，module要早与plugin,包括打包等时机，而plugin只在nuxtApp运行时生效
2. module无法访问`nuxtApp`
3. plugin是用来扩充`runtime context`的，而module是用来扩充`build context`的

### 静态生成配置的优先顺序？

设置`ssr`为`false`，则`prerender`无效
