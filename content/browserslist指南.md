---
title: browserslist指南
category: 分享
tags:
  - browserslist
date: 2020-11-03
vssue-title: browserslist指南
---

## 版本介绍

### 可选版本

browserslist 内部依赖 caniuse，所以能指定的版本号也是依据 caniuse 的数据，可以在[这里](https://caniuse.com/ciu/comparison)查看所有支持版本



## 最佳实践

推荐的配置为

```
defaults          // > 0.5%, last 2 versions, Firefox ESR, not dead
not IE 11
not op_mini all   // Opera mini故意削减了某些特性来减少网络和电池的消耗，所以Polyfill也不适用与它
maintained node versions
```

