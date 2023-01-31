---
title: vue踩坑指南
category: 分享
tags:
- vue
date: 2019-04-26
vssue-title: vue踩坑指南
---
## vue
1. 在使用setInterval时，如果当页面内有使用v-model.lazy的组件，那么那个组件的值会无法改变，一直会变回上一次的值。
1. 打包在生产环境运行时console中依旧提示当前在开发环境，原因是没有区分引用的vue版本，都是用的开发环境的vue
> 解决方案：在webpack配置文件中修改vue的引用
```vue
 resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      vue: process.env.NODE_ENV == 'production' ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
    }
  },
```
1. Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。两个元素属性名可以不一致，特殊的属性值会有影响，例如input的type属性会导致从头开始渲染。 ​​​​
1. vue的组件定义不能写在new vue()之后 ​​​​，实例化vue的时候会配置数据观测(data observer)、编译模版、挂载实例到 DOM ，然后在数据变化时更新 DOM
1. vue子组件给父组件传递事件，例如按键修饰符这样的特殊性写法，如下：
```
<input @keyup.enter="$emit(\'ku\')"></input> ​​​​
```
### 指令
#### v-on
修饰符可以不写表达式，例如：`@click.stop`

`native`修饰符无法绑定到普通html元素上：

```js
// For components only. Allows you to listen to
// native events, rather than events emitted from
// the component using `vm.$emit`.
nativeOn: {
  click: this.nativeClickHandler
},
```

### scoped
当style设置scoped时，使用less导入其他样式文件无效，有两种解决办法：
1. （推荐）可以在import外部包裹一层`/deep/ [选择器]`:
```
/deep/ .content {
    @import url('~/assets/styles/readonly');

    margin-top: 0.25rem;
  }
```
2. 或者修改源文件为`less`或者`scss`格式,在里边所有样式前都添加`/deep/`
### v-html
当使用v-html时，如果其中包含class指定的样式，并且设置了`style scoped`，那么样式不会生效，需要在class对应的样式前加`/deep/`
### vue数据和事件传递方式
1. props
1. `$parent`和`$children`
1. sync
1. v-model
1. eventBus
1. vuex
1. `$attrs`
1. `$listeners`
1. `$emit`和`$on`
1. provide / inject
### 问题
#### vue中的@click中为什么不能使用三元运算符？
当click事件写成这样时无效：`@click="dialogStatus=='create'?createData:updateData"
`  
解决方法：  
vue中有正则来判断你click后面写的是什么，如果是函数，不作处理，但如果不是函数，他会封装一下，比如`dialogStatus=='create'?createData:updateData`会封装为`function($event){dialogStatus=='create'?createData:updateData}`，这个函数运行后，里面的createData:updateData是不会运行的,所以应该写成`@click="dialogStatus=='create'?createData():updateData()"`

#### 如何在template中使用可选链？
只有在vue3中支持

### props对象和数组设置默认值无效？

不能使用箭头函数，必须是工厂函数

```js
listProps: {
      type: Object,
      default:function(){
        return {}
      },
    },
```

### 无法获取refs？

如果设置了`v-if`或者`v-show`会导致无法获取，还有如果组件为懒加载，那么也无法获取

## vue-router

### 动态添加路由router.addRoutes(routes: Array<RouteConfig>)
在addroutes后，router.options.routes不会更新，这不是一个bug，以后应该也不会修复，有个简单的解决办法是通过vue-devtool>Routing>Routes查看，这里边的路由是实时更新的。
### 路由参数
query 在刷新页面得时候参数不会消失，而 params 刷新页面得时候会参数消失，可以考虑本地存储解决。  
query 传得参数都是显示在url 地址栏当中，而 params 传参不会显示在地址栏  
query语法：    
this.$router.push({path:"地址",query:{id:"123"}}); 这是传递参数  
this.$route.query.id； 这是接受参数  
params语法：  
this.$router.push({name:"地址",params:{id:"123"}}); 这是传递参数  
this.$route.params.id; 这是接受参数  
### 问题
`hash`模式和`history`模式的区别?  
>[https://www.jb51.net/article/144341.htm](https://www.jb51.net/article/144341.htm)  

vue-devtools不能使用？  
1. 如果用了production/minified的vue，devtools的选项是默认关闭的所以没法用
1. 如果页面是要用file://打开，需要到chrome设置->扩展应用->把“允许访问文件网址”的选项打开，才能读取到内容使用 ​​​​

## vuex
### 插件

一、 vuex-router-sync  


把 vue-router 当前的 $route 同步为 vuex 状态的一部分。

工作原理
该库在 store 上增加了一个名为 route 的模块，用于表示当前路由的状态。
```js
store.state.route.path   // current path (字符串类型)
store.state.route.params // current params (对象类型)
store.state.route.query  // current query (对象类型)
```
当被导航到一个新路由时，store 的状态会被更新。

`store.state.route` 是不可变更的，因为该值取自 URL，是真实的来源。你不应该通过修改该值去触发浏览器的导航行为。取而代之的是调用 `$router.push()` 或者 `$router.go()`。另外，你可以通过 `$router.push({ query: {...}})` 来更新当前路径的查询字符串。
