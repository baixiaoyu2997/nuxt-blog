---
title: nuxt学习随笔
category: 分享
tags:
  - nuxt
date: 2020-08-09
vssue-title: nuxt学习随笔
---

## 介绍

Nuxt.js 是一个基于 Vue.js 的通用应用框架。支持 spa 模式、ssr 模式、静态化模式  
nuxt=vue+ vue-router + Vuex + Vue.js Server-Side + Vue-Meta + webpack

### 特性

- 基于 Vue.js
- 自动代码分层
- 服务端渲染
- 强大的路由功能，支持异步数据
- 静态文件服务
- ES2015+ 语法支持
- 打包和压缩 JS 和 CSS
- HTML 头部标签管理
- 本地开发支持热加载
- 集成 ESLint
- 支持各种样式预处理器： SASS、LESS、 Stylus 等等
- 支持 HTTP/2 推送

### 安装

`npx create-nuxt-app <project-name>`

### 目录结构

```
// 小型项目
- assets // 资源目录
- components // 组件
- pages // 页面
- static // 静态文件，会被编译到服务端根目录
- nuxt.config.js // 配置文件
- package.json

// 大型项目可能还需要
- content
- layouts // 布局
- middleware // 中间件
- modules
- plugins // 插件
- store // 状态管理
```

### 命令

#### generate

如果想在发布时遇到错误停止，那么添加参数：`--fauil-on-error`

### 打包

1. 使用`nuxt build`打包后的文件中不包含ssr内容，只有在`nuxt start`后，html源码才算是真正的ssr
2. `nuxt build --spa`和`nuxt generate`很像，配置动态路由时都需要配置generate中的router



## nuxt.config.js
> nuxt默认配置有时不会同步到文档，可以去[github](https://github.com/nuxt/nuxt.js/tree/dev/packages/config/src/config)查看最新配置文件

### plugin

配置中如果为对象形式,`ssr:true`表示服务端和客户端都执行,plugin执行顺序，自上到下。
```js
plugins: [
    {
      src:'~/plugins/axios',
      ssr:true // 默认为true，会同时在服务端（asyncData（{$axios}））和客户端（this.$axios）同时拦截axios请求，设为false就只会拦截客户端
    }
  ]
```
如果使用的插件使用了es6语法，那么需要对其进行转义才能使用，否则会报错：
```
build:{
  transpile:['vue-tooltip']
}
```
### middleware
### extendRoutes
扩展路由，想动态添加可以:
```js
export default {
  router:{
    extendRoutes:(routes,resolve)=>{
      routes.push({
        name:"hahaha",
        path:'/hahaha/:id',
        component:resolve(__dirname,'pages/detail/_id.vue')
      })
    }
  }
}
```
全面接管路由：
```js
export default {
  router:{
    extendRoutes(routes, resolve){
     return [
       {
         name:"home",
         path:"/",
         component:resolve(__dirname,'pages/index'),
         meta:{
           title:"home"
         }
       }
       //...这里还可以继续写，一般如果要接管约定式路由的话，都会把它放到一个文件再引入
     ]
    }
  }
}
```
### loading

`loading`可以指定为自定义组件：

```js
export default {
  loading: '~/components/LoadingBar.vue'
}
```

LoadingBar :

```html

<template>
  <div v-if="loading" class="loading-page">
    <p>Loading...</p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
  }
</style>
```

## vuex

开启`vuex`方法：root 目录下新建 store 文件夹，按照目录自动生成。
```js
export const state => （{}）

export const getters = {}

export const actions = {}

export const mutations = {}

```
## 生命周期
`validate  =>  asyncData  =>  fetch  =>  head`

## context 上下文

存在于`asyncData、plugins、middleware、nuxtServerInit`，根据不同的环境，会提供不同的变量：

```js
function (context) {
  // 一直可访问
  const {
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
   $config
  } = context

  // 只有服务端可访问
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
  }

  // 只有客户端可以访问
  if (process.client) {
    const { from, nuxtState } = context
  }
}


```
### app 
`app` 是 `context` 中最重要的属性，就像我们 `Vue` 中的 `this`，全局方法和属性都会挂载到它里面。因为服务端渲染的特殊性，很多`Nuxt`提供的生命周期都是运行在服务端，也就是说它们会先于 `Vue` 实例的创建。因此在这些生命周期中，我们无法通过 `this` 去获取实例上的方法和属性。使用 `app` 可以来弥补这点，一般我们会把全局的方法同时注入到 `this` 和 `app` 中，在服务端的生命周期中使用 `app` 去访问该方法，而在客户端中使用 `this`，保证方法的共用。


## helper

### $nuxt

在客户端可以通过 window.$nuxt 获取，可以通过`isOffline`和`isOnline`检查网络连接状况

#### 刷新当前页面

`this.$nuxt.refresh()`,该命令会刷新data和出发asyncData和fetch

## asyncData服务端异步请求数据(pages)
asyncData不可以用在组件上
asyncData只在首屏被执行，如果是这时通过页面进入其他页面，比如详情页，那么详情页的数据还是在客户端执行接口调用。
## fetch
控制组件数据渲染，使用fetch可以帮助组件在服务端完成数据获取。执行时机可能为服务端或者客户端，可以用在组件上，需要返回`promise`，`nuxt.js`会等待`promise`完成后再渲染组件
```js
export default {
  fetch ({ store, params }) {
    return axios.get('http://my-api/stars')
    .then((res) => {
      store.commit('setStars', res.data)
    })
  }
}
```
## watchQuery
监听参数字符串的更改，如果发生变化，将调用所有组件方法，设置该属性的话，可以在使用浏览器前进后退时调用接口。
## pageTransition
修改页面级别的路由切换动画
## middleware
执行顺序，`nuxt.config => layout => page`
## plugin
`plugin`是挂载全局方法的主要途径，
```js
export default function (context, inject) {}

```
第二个参数inject可以将变量同时注入到`content、vue、vuex`
```js
export default ({ app }, inject) => {
  inject('myInjectedFunction', string => console.log('That was easy!', string))
}

```
注意：应该始终保证plugin中的逻辑处理放在导出函数中，这样会保证plugin的执行顺序  

## modules

### 编写自己的插件

nuxt配置中，modules数组中的配置和顶级配置都会被传到`this.options.axios`中

```
export default {
  modules: [['@nuxtjs/axios', { anotherOption: true }]],

  // axios module is aware of this by using `this.options.axios`
  axios: {
    option1,
    option2
  }
}


```



## generate

### 禁用生成路由名文件夹

修改生成静态文件目录结构，假如有页面`login`,生成的结构为`login/index.html`，如果不想要外部的文件夹直接使用路由名作为 html 名称，那么设置

```js
 generate: {
    subFolders: false,
  },
```
### exclude

config中设置exclude可以阻止与之匹配的路有，可以配合`fallback`一起使用,这时会以spa形式访问未生成的路有

## validate 参数验证(pages)

可以做页面级别的参数验证，通过`return true`或者`false`表示验证成功失败
## layouts

nuxt 布局分为 3 类：

- default：默认使用的布局，会作用于所有没有指定 layout 的 page
- error：error 算作页面，负责错误处理
- 其他布局:需要指定 layout：'xxx',不能指定 error 为布局

layouts 非必须项，可以不用添加

### 使用

创建布局,一定要包含`Nuxt`组件,`Nuxt`组件只能使用在layout中：

```html
<template>
  <div>
    <div>My blog navigation bar here</div>
    <Nuxt /> 
  </div>
</template>
```

```js
export default {
  layout: "xxx",
};
```

### 错误页面

当有错误发生时，显示 error 页面（不会在 ssr 触发），虽然`error.vue`是放在 layouts，但是应当当作 page 来对待。

## 模版

通过在根目录下创建`app.html`来创建模版，通常更推荐使用`nuxt.config.js`配置额外内容，除非有特殊需求。

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

## 路由

`Nuxt.js`会依据 `pages` 目录中的所有 `*.vue` 文件生成应用的路由配置。默认nuxt的路由都为异步加载。使用静态生成时动态路由不会被生成，需要配置generate

## 导航

通过`NuxtLink`组件在页面之间跳转，可以看做是`RouteLink`的替换，所有的 pages 应该都使用 NuxtLink 跳转，其他的外部页面应该使用`a`标签

## 插件

在`vue`应用程序执行之前，运行的 js 插件

### 插件编写

```
// plugins/vue-notifications.js
import Vue from 'vue'
import VueNotifications from 'vue-notifications'

Vue.use(VueNotifications)
```

### 启用插件

```
// nuxt.config.js
module.exports = {
  plugins: ['~/plugins/vue-notifications']
}
```

### ES6 插件

如果是插件是在`node_modules`的话，需要预先编译才能使用

```
module.exports = {
  build: {
    transpile: ['vue-notifications']
  }
}
```

## process

```
'process.env.NODE_ENV': ,
'process.mode': ,
'process.dev': ,
'process.static': ,
'process.target': ,
'process.env.VUE_ENV': ,
'process.browser': ,
'process.client': ,
'process.server': ,
'process.modern':
```
## 多语言i18n
nuxt/i18n
## SEO

1. 配置 page head

## cache

### 页面缓存

> 理论上，如果页面缓存了那么就不需要接口和组件缓存

参考：[浅谈 vue 前端同构框架 nuxt 及其性能优化](https://tflin.com/2020/05/13/%E6%B5%85%E8%B0%88%20vue%20%E5%89%8D%E7%AB%AF%E5%90%8C%E6%9E%84%E6%A1%86%E6%9E%B6%20nuxt%20%E5%8F%8A%E5%85%B6%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/#2-%E6%95%B0%E6%8D%AE%E7%9A%84%E7%BC%93%E5%AD%98)

## 日志

使用`nuxt-winston-log`,默认在根目录下自动创建`logs`文件夹，然后根据`NODE_ENV`创建 log 文件,例如:`./logs/{NODE_ENV}.log`

## 调试

添加eruda
```js
export default function ({ app, route, isDev }) {
  // 限制：query中包含debug=true,或者域名开头包含dev
  if (
    /debug=true/.test(window.location.href) ||
    window.location.href.split('//')[1].startsWith('dev')
  ) {
    const debugReset = () => {
      window.ny_debug = {
        count: 0,
        startTime: null,
        endTime: null,
      };
    };
    debugReset();

    const addConsole = () => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.defer = true;
      s.onload = () => {
        // 本地开发默认显示
        if (isDev && window.eruda) window.eruda.init();
      };
      s.src = 'https://cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.min.js';
      document.body.appendChild(s);
    };
    // 添加eruda
    addConsole();

    // 限制：时间间隔小于3秒，点击区域y轴<=300，点击次数等于10
    document.body.addEventListener('click', (e) => {
      // 不满足条件时清空flag
      if (
        e.y >= 300 ||
        (window.ny_debug.startTime &&
          window.ny_debug.endTime &&
          window.ny_debug.endTime - window.ny_debug.startTime >= 3000)
      ) {
        debugReset();
      }
      window.ny_debug.count += 1;
      if (!window.ny_debug.startTime) {
        window.ny_debug.startTime = Date.now();
      } else {
        window.ny_debug.endTime = Date.now();
      }
      // 点击次数大于10
      if (window.ny_debug.count >= 10) {
        debugReset();
        // 存在eruda则销毁
        if (window.eruda._isInit) {
          window.eruda.destroy();
        } else {
          window.eruda.init();
        }
      }
    });
  }
}

```



## 错误处理

通过 context.error 触发错误跳转到 error 页面

```js
async asyncData(context) {
    const id = context.params.id
    try {
      // Using the nuxtjs/http module here exposed via context.app
      const post = await context.app.$http.$get(
        `https://api.nuxtjs.dev/posts/${id}`
      )
      return { post }
    } catch (e) {
      context.error(e) // Show the nuxt error page with the thrown error
    }
  }

```

## 最佳实践

1. 如果服务器已经开启了 gzip 压缩，那么禁用 nuxt 的压缩：`compressor:false`

2. plugin最好都放到函数中去执行，保证插件执行顺序。

3. 优化打包速度可以尝试安装这个包：https://github.com/harlan-zw/nuxt-build-optimisations，不一定有效

4. 加速开发模式冷启动速度，安装`nuxt-esbuild-module`这个包，使用esbuild加速编译。使用vant时会导致组件错乱问题。

   

## 问题
### ssr和sag和spa如何选择？

#### ssr

优点：如果有动态路由那么选择ssr，如果需要实时更新的数据选择ssr，

缺点：ssr无法获取客户端信息。

#### ssg

优点：成本低，不需要服务和运维

缺点：static模式无法跨页面传递数据。

### spa

优点：spa跳转体验好

缺点：无seo,首屏慢

### vuex修改无效？

测试放在`beforeMount`中无效，但是放在`mounted`中执行可以生效，暂时不知道原因。

### middleware和plugin的区别？

1. `middleware`肯定是基于请求的，而`plugin`不一定是。
1. `plugin`可以全局注入
1. `plugin`不能写在页面或者组件中
1. `plugin`执行时机在服务端早于`middleware`，客户端晚于`middleware`
### 如何区分page还是component？

官方推荐方式是为每个page页面继承于一个特定组件：

```js
import PageComponent from '~/components/Page.vue'

export default PageComponent.extend({
  // asyncData
  // ...
})

```

[github链接](https://github.com/nuxt/nuxt.js/issues/5055#issuecomment-465147120)

还有一种方法可以判断：通过为每一个页面设置isPage属性，然后在mixin中进行判断和操作

```js
// 页面
export default{
  meta: {
      showNavBar: false,
      showTabBar: true,
      isPage:true
    },
} 
```



```js
// mixins plugin
import Vue from 'vue'
import locale from '@/assets/locale'
export default function ({ store, route, app }) {
  if (!Vue.__my_mixin__) {
    Vue.__my_mixin__ = true
    const pageTitle = {
      beforeCreate() {
        // 只处理page，过滤component
        if (this.$options?.meta?.isPage) {
          const pageTitle =
            app.i18n.t(this.$options.pageTitle) ||
            locale[store.state.locale][this.$options.name]?.pageTitle ||
            ''
          store.commit('setState', { pageTitle })
        }
      },
    }
    Vue.mixin(pageTitle)
  }
}

```





### nuxt generate 如何修改为相对路径
如果部署到服务的`/static/html`目录，那么修改`router.base`:

```js
router: {
  base: "/static/html/";
}
```
这样打包出来的代码就会映射到`/static/html/`下
### nuxt 如何同时使用ssr和ssg？

1. 添加layout，对不使用ssr的页面添加`client-only`
2. 使用路由中间价，修改是否spa，https://blog.lichter.io/posts/nuxt-dynamic-ssr-spa-handling/

### 如何修改路由切换动画？

添加一个全局样式,实现这几个类:
- page-enter-active
- page-leave-active
- page-enter
- page-leave

```css
.page-enter-active, .page-leave-active{
    transition: opacity 1.5s;
}
.page-enter, .page-leave-active{
    opacity: 0;
}
```
### 路由守卫？
使用middleware，局部后置守卫使用`beforeRouteLeave`

### 无法在mounted中访问refs?

nuxt/components v2中组件默认为懒加载，导致无法访问，需要设置loader:true ,[问题链接](https://github.com/nuxt/nuxt.js/issues/8879#issuecomment-784317611)

```js
components: {
    loader:true,
    dirs: [
      { path: '~/components/display/', prefix: 'ny' },
      { path: '~/components/form/', prefix: 'ny' },
      { path: '~/components/basic/', prefix: 'ny' },
      { path: '~/components/icon/', prefix: 'icon' },
      { path: '~/components/navigation/', prefix: 'ny' },
    ],
  },
```

### 页面跳转后不会滚动到顶部？

https://g.yuque.com/yunwuxin/useful-note/8d719afc-b5a4-4a06-a6c7-c7842f3faba2?language=zh-cn

### Can't resolve 'fs'?

修改`nuxt.config.js`:

```js
build:{
  extend(config, { isDev, isClient }) {
      config.node = {
        fs: 'empty'
      }
    }
}
```

