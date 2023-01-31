---
title: Tailwind.css学习
category: css
tags:
  - Tailwind
date: 2021-01-23
vssue-title: Tailwind.css学习
---
## 优点
### 不用浪费时间去想类名
### 你的css不会增多
### 更安全的对样式进行修改
CSS是全局性的，当你做出改变时，你永远不知道你会破坏什么。HTML中的类是本地的，所以你可以改变它们，而不用担心其他东西会被破坏。

## 缺点

1. 代码量的增加，侧面增加了第一时间发现拼写错误的难度，尤其是class中。
2. 模版中大量的class代码导致业务逻辑难以分清和快速查找
3. 编译速度变慢
4. 团队的学习成本。虽然官方提供了默认的类名，并且有插件智能提示。但是遇到自定义样式项目还是要重新学习

## 最佳实践

1. 可以适当使用`div`为代码结构分层，这样可以在大量大码中使用折叠，来快速找到目标元素
2. 更适合用在小项目上，不适合用在长时间维护的大型项目

## 问题
### tailwind和nuxt同时使用时加载速度太慢？

解决方案参考这篇[文章](https://nystudio107.com/blog/speeding-up-tailwind-css-builds),同时可以关注tailwind的性能优化[PR](https://github.com/tailwindlabs/tailwindcss/pull/3718)

### tailwind和px-to-viewport同时使用时没有被转换的问题？

需要在postcss的插件中优先指定加载tailwind，nuxt[官网](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#postcss-plugins--nuxtjstailwindcss)有详细说明：

```js
import { join } from 'path'

export default {
  // ...
  build: {
    postcss: {
      plugins: {
        tailwindcss: join(__dirname, 'tailwind.config.js'),
        'postcss-pxtorem': {
          propList: ['*', '!border*']
        }
      }
    }
  }
}
```

### 为什么不直接使用内联样式？

1. 约束：内联样式的值是可以随便填写的，使用功能类，你需要预先定义好样式。
1. 响应式设计
1. 悬停、焦点、和其他状态，内联无法实现。
### 如何解决同样权重，样式被覆盖问题？

可以设置`important`为`true`或者`css选择器`来为`tailwind`加权

```js
module.exports = {
  purge: [],
  important:'html',
  theme: {
    fontSize: {
      's29': '29px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

```

另外tailwind会因为导入`base`包而提供一些默认样式，需要小心。

### 如何修改其他 UI 库变量为 tailwind 类？

`@apply`

### 如何通过tailwind修改其他 UI 库深层组件类的样式？

初步方法，使用`@apply`进行覆盖

```css
.customCell{
    .van-cell__title{
        @apply py-2 px-4 bg-indigo-500 text-white
    }
}
```



### 如何禁用默认的配置？

将`tailwind.config.js`中的`presets`设置成空数组

```js
module.exports = {
  presets: [],
  theme: {
    // ...
  },
  plugins: [
    // ...
  ],
}
```



