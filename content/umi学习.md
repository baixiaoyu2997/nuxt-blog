---
title: umi学习
category: 工具
tags:
- umi
date: 2020-04-09
vssue-title: umi学习
---
## Umi基础
### 路由
- component
    - 组件的路径如果是相对路径，会从src/pages开始找起，可以使用`@`指向`src`
- wrappers
    - 配置路由的高阶组件封装,相当于`react-router`中的`render`,重新渲染组件
```
export default {
  routes: [
    { path: '/user', component: 'user',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    { path: '/login', component: 'login' },
  ]
}
// /wrappers/auth
export default (props) => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return <div>{ props.children }</div>;
  } else {
    redirectTo('/login');
  }
}
```
### 约定式路由
如果没有`routes`配置，Umi会进入约定路由模式，然后分析`src/pages`目录拿到路由配置
```
  └── pages
    ├── index.tsx
    └── users.tsx
```
会得到：
```
[
  { exact: true, path: '/', component: '@/pages/index' },
  { exact: true, path: '/users', component: '@/pages/users' },
]
```
需要注意的是，满足以下任意规则的文件不会被注册为路由
- 以 . 或 _ 开头的文件或目录
- 以 d.ts 结尾的类型定义文件
- 以 test.ts、spec.ts、e2e.ts 结尾的测试文件（适用于 .js、.jsx 和 .tsx 文件）
- components 和 component 目录
- utils 和 util 目录
- 不是 .js、.jsx、.ts 或 .tsx 文件
- 文件内容不包含 JSX 元素
## 静态资源无法访问
在开发模式下如果对`public`中的静态资源更改无效，那么尝试重新启动开发服务。