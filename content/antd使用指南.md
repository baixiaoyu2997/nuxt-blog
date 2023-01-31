---
title: antd使用指南
category: UI
tags:
  - antd
date: 2020-04-01
vssue-title: antd使用指南
---

## 国际化

通过在组件外添加`ConfigProvider`组件，并设置`locale={zhCN}`

```
import React from "react";

import { render } from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import App from "./App";

render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);

```

## 定制主题

### 自定义主题颜色

在`create-react-app`中，要想使用自定义颜色功能需要手动更改配置，首先下载

```
yarn add react-app-rewired customize-cra  -D
```

然后新增或者修改`config-overrides.js`文件

```
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);
```

这里利用了 less-loader 的 modifyVars 来进行主题配置，变量和其他配置方式可以参考[定制主题](https://ant.design/docs/react/customize-theme-cn) 文档。

### 设置统一样式前缀

通过在组件外添加`ConfigProvider`组件，并设置`prefixCls`

```
import React from "react";

import { render } from "react-dom";
import { ConfigProvider } from "antd";
import App from "./App";

render(
  <ConfigProvider prefixCls="fantuan">
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);

```
