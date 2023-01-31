---
title: egg学习随笔
category: 分享
tags:
- egg
date: 2020-08-21
vssue-title: egg学习随笔
---

## 中间件
我们约定一个中间件是一个放置在 `app/middleware` 目录下的单独文件，它需要 `exports` 一个普通的 `function`，接受两个参数：

`options`: 中间件的配置项，框架会将 `app.config[${middlewareName}]` 传递进来。
`app`: 当前应用 Application 的实例。

### 中间件函数
```js
// `app/middleware/gzip.js`
module.exports = options => {
  return async function gzip(ctx, next) {
    await next();

    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;
    if (!body) return;

    // 支持 options.threshold
    if (options.threshold && ctx.length < options.threshold) return;

    if (isJSON(body)) body = JSON.stringify(body);

    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};
```
返回的函数参数有两个`ctx和next`：
- ctx为egg实例上下文
- next是回调函数，如果不调用则不会执行下一个中间件，可以利用这个实现中间件的报错跳出，`await next()`调用之后会等待下一个中间件执行完毕再执行下面的代码

### 使用中间件
```js
module.exports = {
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: [ 'gzip' ],

  // 配置 gzip 中间件的配置
  gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
};
```
## 执行顺序
middleware>controller