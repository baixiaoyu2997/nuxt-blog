---
title: vue3使用指南
category: 分享
tags:
- vue
date: 2021-02-23
vssue-title: vue3使用指南
---

## 介绍

为什么引入组合式API？

### 对象式API存在的问题

1. 不利于复用
2. 潜在命名冲突
3. 上下文丢失
4. 有限的类型支持
5. 按APi类型组织

### 组合式API提供的能力

1. 极易复用
2. 可灵活组合（生命周期钩子可多次使用）
3. 提供更好的上下文支持
4. 更好的TS支持
5. 按功能/逻辑组织
5. 可独立于Vue组件使用

## 目录结构

参考：https://v3.cn.vuejs.org/api/options-data.html#props

## 库

### compiler-dom

实现`template`语法到`render`函数的转换

### compiler-sfc

专门处理sfc文件的解析

## 全局API

### createApp

当创建实例的时候如果没有`template`，并且挂载元素不为空时，会使用挂载元素中的节点作为`tempalte`.

### h

hyperscript返回一个”虚拟节点“，通常缩写为 **VNode**：一个普通对象，其中包含向 Vue 描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。它的目的是用于手动编写的[渲染函数](https://v3.cn.vuejs.org/guide/render-function.html)：

### defineCustomElement

定义web component组件，定义后的组件通过原生`customElements.difine('my-vue-element',MyVueElement)`注册,注册后的组件应该由浏览器接管，而不是vue，需要配置vite：

```js
export default defineConfig({
  plugins:[
    vue({
      template:{
        compilerOptions:{
          // vue将跳过my-vue-element解析
          isCustomElement:(tag)=>tag === "my-vue-element"
        }
      }
    })
  ]
})
```



## 选项

### Data

#### props

props 无需通过 setup 函数 return，也可以在 template 进行绑定对应的值。推荐使用这种语法绑定`props`:

```
const props=defineProps()
const title=computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
```



#### emits

组件事件现在可以在emits中声明（非强制），支持数组或者对象语法，对象语法中，值可以验证函数。

### DOM

#### render

大多数情况下应该使用`template`，遇到使用tempalte编写比js编写更复杂的时候应该使用render函数来渲染。  

## 实例property

### $attrs

vue3中$attrs将包含`class`、`style`、`$listeners`

## 指令

### v-model

可以使用在`input、select、textarea和components`上。  

当被使用在组件上时，等价于：

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>

```

自定义组件绑定属性:

```vue
<custom-input
  v-model:title="searchText"
></custom-input>
```

vue3中不再支持`v-bind.sync`,使用v-model来替换

### v-bind

vue2中当有v-bind和其他单独的属性绑定，则不论单独的属性在哪里，v-bind中的属性永远是被替换的，而在vue3中替换条件则根据定义的位置决定

vue3中以`on`开头的属性绑定被当做事件处理，这会有个隐性问题，使用组件时`@click`和`on-click`是等价的，在组件内部props接收时都为`onClick`,使用attrs可以区分。使用`emit`触发事件可以解决这个问题。

## 特殊指令

### is

`vue3.1`之后可以用在html原生组件上，is在html中表示该元素使用自定组件渲染，想要使用vue的组件，需要添加前缀`vue:：`

```html
<tr is="vue:my-row-component"></tr>
```



## 响应性API

### 响应性基础API

### reactive

返回对象的响应式副本，响应式转换是深度的，影响所有嵌套属性.

当ref被包裹在响应式`Object`中时，会自动展开，不需要写`.value`

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1

```

### readonly

接收一个对象或响应式对象，并返回一个原始对象的只读代理（不可增删改）。修改原始对象会导致readonly对象值变更。

#### toRaw

返回 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 或 [`readonly`](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly) proxy 的原始对象。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

### markRaw

标记一个对象永远不会被reactive，即使是被嵌套在其他reactive对象中

#### isProxy

用于判断一个对象是否由[`reactive()`](https://vuejs.org/api/reactivity-core.html#reactive), [`readonly()`](https://vuejs.org/api/reactivity-core.html#readonly), [`shallowReactive()`](https://vuejs.org/api/reactivity-advanced.html#shallowreactive) or [`shallowReadonly()`](https://vuejs.org/api/reactivity-advanced.html#shallowreadonly)创建

#### isReative

用于判断数据是否有`reactive`创建的

#### isReadonly

用于判断数据是否由`readonly`创建

### Refs

#### ref

ref 和 reactive 的存在都是了追踪值变化（响应式），ref 有个「包装」的概念，它用来包装原始值类型，如 string 和 number ，我们都知道不是引用类型是无法追踪后续的变化的。ref 返回的是一个包含 `.value` 属性的对象。ref本质也是`reactive`。

如果将一个`ref`传递给`ref()`，它将原样将其返回。

```js
const foo=ref(1)
const bar=ref(foo)
console.log(foo===bar) // true

const bar=isRef(foo)?foo:ref(foo)
// 所以上面的判断也可以简写下边这样
const bar=ref(foo)
```



ref值的修改：ref值的修改应该是在`xxx.value`上进行，如果对返回的ref对象进行修改，则会因为被覆盖导致响应性丢失。

`watch`函数监听`ref`时，返回值会自动解包：

```js
const counter=ref(0)

watch(counter,count=>{
  console.log(count) // 已经解包的值
})
```



ref还可以创建对元素的引用,与`react`类似：

```html
<template>
  <div>
    <div ref="el">div元素</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    // 创建一个DOM引用，名称必须与元素的ref属性名相同
    const el = ref(null)

    // 在挂载后才能通过 el 获取到目标元素
    onMounted(() => {
      el.value.innerHTML = '内容被修改'
    })

    // 把创建的引用 return 出去
    return {el}
  }
}
</script>
```

有些情况可以使用ref也可以使用toRef，具体的区别是：

1. `ref`是对传入数据的拷贝；`toRef`是对传入数据的引用
2. `ref`的值改变会更新视图；`toRef`的值改变不会更新视图

#### isRef

用于判断数据是否是`ref`对象

#### unref

如果参数为ref，返回`.value`，否则返回参数本身。相当于`val = isRef(val) ? val.value : val`.

使用场景：unref可以用作在不确定参数类型的工具函数中使用。

注意：unref不支持deep处理，使用`JSON.parse(JSON.stringify(data))`可以快速实现`unwrap`,但是不能对computedRef使用，相关讨论：https://github.com/vuejs/rfcs/discussions/366`

#### toRefs

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的`ref`。保持响应式对象中属性的引用，可以理解这一切都是因为我们要用解构，`toRefs` 所采取的解决方案。

toRefs的参数只应该为`reactive`对象。

以下情况不需要使用`toRefs`，因为解构后reactive和ref还是保持原对象的引用：

```

export const useTest = () => {
  const a = reactive({
    c: 1,
    b: 2,
  })
  const d= ref(0)
  const change=()=>{
    a.c=3
  }
  return {
    a,
    d,
    change
  }
}

```



#### shallowRef

因为ref是`深proxy`，`shallowRef`只做`浅proxy` ，可以用来做优化

#### triggerRef

`shallowRef`中没有被监听的数据改变时，不会触发视图更新，这个时候可以使用`triggerRef`来立刻更新视图

### Computed与Watch

#### computed

接收getter函数或者`get、set`对象为参数，返回`ref`对象。当使用getter函数为参数时，返回的是一个`readonly ref`

当computed监听一个中间值computed时，如果中间值computed的值没变，但是它依赖的值变了，那么监听中间值的computed还是会再次执行。例如：

```vue
<script setup>
const a=ref(1)
const b=ref(2)
const c=computed(()=>{
	return a.value+b.value
})
const d=(()=>{
	return c+1
})
setTimeout(()=>{
	a.value=2
	b.value=1
},500)
</script>
```

#### watchEffect

与watch的区别，watch是惰性出发的，而watchEffect会在声明时就触发。因为需要预先收集依赖关系，所以不能为惰性触发。

当watchEffect函数中包含响应性数据的get方法，就会进行收集依赖。

如果想要获取`oldValue`,那么应该使用`watch`

`onTrack和onTrigger`会在每次值变更时触发，初始化时只会触发`onTrack`。

watchEffect有着与上边computed一样的中间值问题。

#### watch

`watch` api监听的数据源可以是返回值的 getter 函数，也可以是`ref`数组,也可以直接是 `ref`，这点与`watchEffect`不同，`watchEffect`不能直接监听ref，`watch`如果监听的是`ref`,那么回调函数返回的值则是解包后的值。

`watch`现在有一个问题就是如果在组件实例化之前 监听的内容有多次变更只会触发一次，issue:https://github.com/vuejs/docs/issues/1154?utm_source=wechat_session&utm_medium=social&utm_oi=43554147663872

### Effect Scope

在Vue的setup中，响应会在开始初始化的时候被收集，在实例被卸载的时候，响应就会自动的被取消追踪了，这时一个很方便的特性。
但是，当我们在组件外使用或者编写一个独立的包时，这会变得非常麻烦。当在单独的文件中，我们该如何停止computed & watch的响应式依赖呢？使用effetScope可以手动清除依赖绑定:

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// to dispose all effects in the scope
scope.stop()
```

### $()和$$()

1. $ref 尽量用`let`声明，如果不用let则不能修改

## 组合式API

### setup

setup函数的执行顺序要早于`beforeCreate`,并且vue3为了区分options api，特意让setup中不能调用`this`，`this`的值为`undefined`。每个单文件中只能有一个`setup script`

setup可以返回两种类型：

1. object类型，用来配合模版使用，
2. function类型，为渲染函数

#### 特性

1. 顶层await：setup支持顶层使用await,但是会导致await之后的代码无法获取实例上下文。使用await时使用`withAsyncContext`对其进行包裹来重新获取上下文。本质原因是setup本身是个同步执行的函数，内部在执行完毕后会清空实例数据。
2. 内部函数：`v3.2`之后默认不需要导入支持的函数有`defineProps、defineEmits、defineExpose`,define开头的都不需要导入了。
3. 外部无法获取内部导出：外部组件想要调用特定组件的内部变量或者方法时，需要在被调用组件内部导入defineExpose`，并设置要导出的变量
4. 外部导入：组件内部可以通过再添加一个`script`标签，来`export`，位置必须在setup上边。相当于setup负责渲染部分，其他的script可以用来导出。也可以`export default`,这里导出的就相当于是在原先导出的组件上添加的属性。
5. `useAttrs`:用于输出当前组件非`defineProps`定义的属性,非响应式
6. `useSlots`：用于输出当前组件的插槽

### defineExpose

导出会自动`unwrapped`,这个函数时通过`setup`上下文提供的，不是通过全局api，所以他不能在外部组合函数中导入

### effectScope

一个新的API用于自动收集副作用，计划在`3.2`中引入

### Provide/Inject

当provide传递一个对象时，如果对象值没变，即使重复赋值，inject获取的值也不会变化

### getCurrentInstance

getCurrentInstance返回的值大部分都不是响应性的。可以通过@vue/runtime-core/dist/runtime-core.d.ts文件查看哪些在属性在运行时被排除

```js
export declare interface ComponentInternalInstance {
    uid: number;
    type: ConcreteComponent;
    parent: ComponentInternalInstance | null;
    root: ComponentInternalInstance;
    appContext: AppContext;
    /**
     * Vnode representing this component in its parent's vdom tree
     */
    vnode: VNode;
    /* Excluded from this release type: next */
    /**
     * Root vnode of this component's own vdom tree
     */
    subTree: VNode;
    /**
     * Render effect instance
     */
    effect: ReactiveEffect;
    /**
     * Bound effect runner to be passed to schedulers
     */
    update: SchedulerJob;
    /* Excluded from this release type: render */
    /* Excluded from this release type: ssrRender */
    /* Excluded from this release type: provides */
    /* Excluded from this release type: scope */
    /* Excluded from this release type: accessCache */
    /* Excluded from this release type: renderCache */
    /* Excluded from this release type: components */
    /* Excluded from this release type: directives */
    /* Excluded from this release type: filters */
    /* Excluded from this release type: propsOptions */
    /* Excluded from this release type: emitsOptions */
    /* Excluded from this release type: inheritAttrs */
    /**
     * is custom element?
     */
    isCE?: boolean;
    /**
     * custom element specific HMR method
     */
    ceReload?: (newStyles?: string[]) => void;
    proxy: ComponentPublicInstance | null;
    exposed: Record<string, any> | null;
    exposeProxy: Record<string, any> | null;
    /* Excluded from this release type: withProxy */
    /* Excluded from this release type: ctx */
    data: Data;
    props: Data;
    attrs: Data;
    slots: InternalSlots;
    refs: Data;
    emit: EmitFn;
    /* Excluded from this release type: emitted */
    /* Excluded from this release type: propsDefaults */
    /* Excluded from this release type: setupState */
    /* Excluded from this release type: devtoolsRawSetupState */
    /* Excluded from this release type: setupContext */
    /* Excluded from this release type: suspense */
    /* Excluded from this release type: suspenseId */
    /* Excluded from this release type: asyncDep */
    /* Excluded from this release type: asyncResolved */
    isMounted: boolean;
    isUnmounted: boolean;
    isDeactivated: boolean;
    /* Excluded from this release type: bc */
    /* Excluded from this release type: c */
    /* Excluded from this release type: bm */
    /* Excluded from this release type: m */
    /* Excluded from this release type: bu */
    /* Excluded from this release type: u */
    /* Excluded from this release type: bum */
    /* Excluded from this release type: um */
    /* Excluded from this release type: rtc */
    /* Excluded from this release type: rtg */
    /* Excluded from this release type: a */
    /* Excluded from this release type: da */
    /* Excluded from this release type: ec */
    /* Excluded from this release type: sp */
}
```

### 生命周期

执行顺序：

1. onMounted
2. `onBeforeUnmount`
3. onScopeDispose,或者使用`scope?.cleanups?.push(_off)`
4. onUnmounted

#### onScopeDispose

实现源码：

```
// 注册stop scope时的回调
export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn)
  } else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    )
  }
}
```



##  选项式API

### inheritAttrs

设置false防止组件直接绑定到顶级元素

## 单文件组件

###  `<script setup>`

#### 全局变量

1. $ref：v3.2目前仅支持不在函数或者其他块级作用域中的`ref`语法糖
2. $computed
3. $fromRefs
4. $raw

### CSS 特性

#### v-bind in css

可以支持将响应性变量绑定到css中，使用content时需要加双引号

## 渲染函数

## TypeScript

### volar

设置接管模式可以防止性能损耗，因为volar自己维护一个ts服务，而编辑器对于ts文件使用自己的ts服务。

禁用当前项目的ts语法服务有助于加速编辑器速度：

1. 在插件中搜索`@builtin typescript`，禁用`Typescript and JavaScript Language Features`
2. 重新加载窗口

### ref

ref子组件的类型提示：

```ts
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)
```

### 定义props类型

1. defineProps和defineEmits可以使用运行时声明或者类型声明，但是不能两者同时使用
2. 使用类型声明的时候有个限制，不能使用通过import导入的类型变量
3. 默认props值，可以使用`withDefaults`

```ts
const props = defineProps({
  selected: {
    type: String,
    default: '',
  },
  supports: {
    type: Array as () => ('Create' | 'Redeem')[],
    default: () => ['Create'],
  },
})
```

注意: 无法toRefs()中嵌套withDefaults使用

### 封装第三方UI库

为了保留第三方UI原本的props和event,通过import继承并扩展：

```jsx
<template>
  <el-input ref="elRef"></el-input>
</template>
<script setup lang="ts">
import { inputProps } from "element-plus";
  
const props = defineProps({
  ...inputProps,
  testLabel: String, // 自定义扩展
});
const emits = defineEmits({
  ...inputEmits,
  "prefix-click": (v: number) => true, 
  // 事件返回应该为真值,否则devtool会提示Invalid event arguments: event validation failed for event "prefix-click".
});  
</script>
```



## 最佳实践

### 快速查看template被转换之后的代码？

可以通过[vue3-template-explorer](https://vue-next-template-explorer.netlify.app/)进行快速查看

### 代码重构

尽量把业务逻辑相关代码写在一起，而不是方法都写在一起，变量都写在一起。这样后期的代码重构更便利，

### 防止重新渲染

vue3 的tempalte自动为内联函数缓存了，不需要手动优化

### ref和reactive的使用选择

更推荐使用ref：

1. 因为单独的数据更容易进行逻辑的拆分
2. 显示调用，类型检查
3. 不存在reactive的种种限制：使用es6解会导致响应式丢失，需要使用箭头函数包装才能使用`watch`
3. 即使使用对象也可以通过一个普通对象包裹属性值为ref，这样解构不会引用丢失，而且当想要使用自动解包时，也可以直接通过`reactive`包裹,产生保持引用的对象

### 组合式api

当使用合成 API 显式创建响应式对象时，最佳做法是不要保留对原始对象的引用，而只使用响应式版本

### 如何修改响应性provide的值？

建议尽可能，在提供者内保持响应式 property 的任何更改。提供者提供一个修改方法传递到子孙组件。

### 当前作用域或者组件保存为唯一key?

通常做法是使用`map`或者`weakmap`， key值可以为`getCurrentInstance`,但是我发现`getCurrentScope`所占内存更小，但不确定是唯一值

### 封装第三方UI组件

代理UI组件的属性、事件、slot

```vue
<template>
  <el-input
    ref="elRef"
    v-bind="{ ...$attrs, ...props }"
    v-on="$listeners"
    class="b-input"
  >
    <template v-for="name in Object.keys($slots)" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-input>
</template>
<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'mini',
  },
})
// 父组件通过ref.value.elRef.xxx调用element-ui组件方法
const elRef=ref(null)
</script>
<script>
export default {
  inheritAttrs: false,
}
</script>
<style lang="less" scoped>
.b-input {
}
</style>

```

## 性能优化

1. [Vue3 Compiler 优化细节，如何手写高性能渲染函数](https://zhuanlan.zhihu.com/p/150732926)

## UI

1. pc端：element-plus
2. 移动端：vant、ionic vue、varlet

## 迁移指南

1. vue3兼容vue2运行时，需要使用`@vue/compat`包，  该包会从`Vue v3.1`版本开始推出，同步维护到`v3.2`。如果是`nuxt`项目最好还是等`nuxt3`。
   1. 可以全局设置`configureCompat`兼容性配置，也可以为组件单独添加`compatConfig`

2. vue2项目想体验vue3语法可以使用`@vue/composition-api`,不过有一些[限制](https://github.com/vuejs/composition-api/blob/master/README.zh-CN.md#%E9%99%90%E5%88%B6),`<scriptsetup>`需要安装`unplugin-vue2-script-setup`这个[插件](https://github.com/antfu/unplugin-vue2-script-setup)

   1. readonly没有实际效果，只是提供类型，可以被`isReadonly`检测。

3. vue2转换成vue3代码，使用`gogocode-plugin-vue`：https://juejin.cn/post/6977259197566517284?share_token=cafe7b9c-6292-4b25-91c4-6bf6f7903fff

4. 想要更稳定的迁移，可以等待`vue v2.7`,该版本会包含`@vue/composition-api`和`<script setup> `等一些其他的vue3的api和特性。（计划在2021的Q3末发布）

5. nuxt项目需要使用[@nuxtjs/composition-api 插件](https://composition-api.nuxtjs.org/)

6. 使用vueuse包来减少重复的轮子，兼容vue2和vue3

7. 库作者可以通过`vue-demi`使用同样的语法在`vue2和vue3`进行开发。 

8. eslint添加vue3支持,eslint规则应该在prettier上边：

   ```
   extends: [
       'plugin:vue/vue3-recommended',
    ],
   ```

9. 插件使用`volar,`如果需要支持vue2，那么需要安装`@vue/runtime-dom`

10. Vue.prototype替换为app.config.globalProperties

11. `::v-deep`修改为`:deep(.class)`

12. class和style现在属于`$attrs`,如果使用时有定义，则会和组件中的class和style合并

13. 更多内容参考官网：https://v3.cn.vuejs.org/guide/migration/migration-build.html


## 问题

### 如何处理ssr组件？

1. 使用`生命周期函数`可以跳过ssr阶段，目前nuxt3是这样的，不确定其他框架是否如此，查看[element-plus](https://github.com/element-plus/element-plus/pull/6656)在`onMounted`中同样加入了isClient判断
2. 使用`isClient`判断拦截，实现`const isClient=typeof window === 'undefined'`, (element-plus和vant都使用该方法)
3. 检查组件元素`Element`是否存在

### hook可以被treeshaking吗？

首先treeshaking是针对import/export来实现的，而且export default 导出的模块，被导入时，即使没有使用，其上边的变量和方法不会被删除掉。

再者，hook其实是减少了代码量，只是会被多次使用，不合理的使用会导致运行时的消耗变多

### getCurrentInstance注意事项？

返回值中只有`proxy`会在打包时生成，可以使用`proxy.$parent`这种内部属性

### 如何区分什么应该放进hook，什么应该放进`utils`？

个人认为`hook`中存放的应当是业务耦合的，或者带有副作用的。而`utils`应该框架无关的，是无业务逻辑的

### vue3为什么放弃class api而转向composition api？

1. 对typescript更加友好，typescript对函数的参数和返回值都非常好，写Function-based API既是javascript又是typescript，不需要任何的类型声明，typescript可以自己做类型推导。
2. 静态的import和export是treeshaking的前提，Function-based API中的方法都是从全局的vue中import进来的。
3. 函数内部的变量名和函数名都可以被压缩为单个字母，但是对象和类的属性和方法名默认不被压缩（为了防止引用出错）。
4. 更灵活的逻辑复用。

### render函数的使用场景？  

通常为可重用的组件

### watch和watchEffect的区别？

watchEffect会自动收集依赖。

watch：不会一开始就调用监听函数，可以查看旧值。可以监控回调函数中用不到的值。

### 如何使用动态组件？

`<component :is="bar"></component>	`

### 全局变量如何处理?

参考[vue3中使用element-plus调用message](https://blog.csdn.net/qq_40185480/article/details/110926273)

有4种方法：

1. app.config.globalProperties 添加全局方法 $message后，就可以在option api中使用this调用

2. composition api中需要获取组件实例后调用

3. provide/inject

4. 不使用全局变量而是按需导入

   ```js
   import {ElMessage} from 'element-ui'
   ElMessage.success()
   ```


### 关于defineExpose和`ref.value.$.proxy`的区别？

`definedExpose`只能用于获取组件公开开放的变量，使用方法：`ref.value.xxx`,并且提供`TS`的类型提示。

`ref.value.$.proxy`可以获取组价内所有变量，但是没有ts类型提示

通过这两种方式获取的数据都会自动`unwrapped`

### 如何获取当前组件的`ref`?

`getCurrentInstance().proxy.$.vnode.ref.r`

### 组件的实例和其在父组件的ref是什么结构关系？

父组件获取的`ref`值的`.value.$`等于子组件中的`getCurrentInstance()`

## 参考

1. [Vue3丨从 5 个维度来讲 Vue3 变化](https://juejin.cn/post/6910009240053055496)
2. [Vue 3 Deep Dive with Evan You ](https://www.bilibili.com/video/BV1rC4y187Vw?p=1)

