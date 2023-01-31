---
title: ChromeDevtools学习随笔
category: 工具
tags:
- chrome devtools
date: 2020-04-13
vssue-title: ChromeDevtools学习随笔
---

## Performance
Performance 面板包含以下四个窗格：
1. Controls。开始记录，停止记录和配置记录期间捕获的信息。
2. Overview。 页面性能的高级汇总
3. 火焰图。 CPU 堆叠追踪的可视化。
4. Details。选择事件后，此窗格会显示与该事件有关的更多信息。 未选择事件时，此窗格会显示选定时间范围的相关信息。
![ChromeDevtools学习随笔_2020-04-13-11-26-48](https://blog-pic.oss-cn-beijing.aliyuncs.com/ChromeDevtools学习随笔_2020-04-13-11-26-48.png)
### Overview 窗格
Overview 窗格包含以下三个图表：
1. FPS。每秒帧数。绿色竖线越高，FPS 越高。 FPS 图表上的红色块表示长时间帧，很可能会出现卡顿。
2. CPU。 CPU 资源。此面积图指示消耗 CPU 资源的事件类型。
3. NET。每条彩色横杠表示一种资源。横杠越长，检索资源所需的时间越长。 每个横杠的浅色部分表示等待时间（从请求资源到第一个字节下载完成的时间）。  
深色部分表示传输时间（下载第一个和最后一个字节之间的时间）。  
横杠按照以下方式进行彩色编码：  
- HTML 文件为`蓝色`。
- 脚本为`黄色`。
- 样式表为`紫色`。
- 媒体文件为`绿色`。
- 其他资源为`灰色`。
![ChromeDevtools学习随笔_2020-04-13-11-32-53](https://blog-pic.oss-cn-beijing.aliyuncs.com/ChromeDevtools学习随笔_2020-04-13-11-32-53.png)
## 问题
### 页面跳转后的newwork信息没有了？
可以勾选`Network>Preserve log`
## 参考
1. [如何使用 Timeline 工具](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)