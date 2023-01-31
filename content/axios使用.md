---
title: axios使用
category: 工具
tags:
  - axios
date: 2019-05-16
vssue-title: axios使用
---

## axios get 的 params 怎么传入数组

默认 params 传入数组的话，传值的时候会变成下面这样

```js
axios.get(url, {
  params: {
    tag: [1, 2, 3, 4],
  },
});
// ...tag[]=1&tag[]=2&tag[]=3&tag[]=4
```

如果真的是要 tag=1&tag=2，那就...

```js
axios.get(url, {
  params: {
    tag: [1, 2, 3, 4],
  },
  paramsSerializer: function (params) {
    const yourNewParams = params.tag.map((_) => `tag=${_}`).join("&");
    return yourNewParams;
  },
});
// ...tag=1&tag=2&tag=3&tag=4
```

## res.end 和 res.send 的区别

1、res.end() 终结响应处理流程。 2、res.send() 发送各种类型的响应。 3、res.end() 参数为: a Buffer object / a String(字符串或者 buffer 实例) 4、res.send() 参数为: a Buffer object / a String / an object / an Array（字符串、buffer 实例、对象、数组） 5、res.end() 只接受服务器响应数据,如果是中文则会乱码 6、res.send() 发送给服务端时,会自动发送更多的响应报文头,其中包括 Content-Tpye: text/html; charset=uft-8,所以中文不会乱码

## 参考

[axios get 的 params 怎么传入数组？](https://www.zhihu.com/question/272032105?sort=created)
