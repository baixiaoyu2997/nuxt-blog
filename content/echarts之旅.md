---
title: echarts之旅
category: 工具
tags:
- echarts
date: 2019-10-21
vssue-title: echarts之旅
---
### 地图
echarts不再提供地图下载，官方各个省份的地图json下载地址为`https://gallery.echartsjs.com/`+`provinces`，以下是各个`provinces`的值
```js
var provinces = {
    '上海': '/asset/get/s/data-1482909900836-H1BC_1WHg.json',
    '河北': '/asset/get/s/data-1482909799572-Hkgu_yWSg.json',
    '山西': '/asset/get/s/data-1482909909703-SyCA_JbSg.json',
    '内蒙古': '/asset/get/s/data-1482909841923-rkqqdyZSe.json',
    '辽宁': '/asset/get/s/data-1482909836074-rJV9O1-Hg.json',
    '吉林': '/asset/get/s/data-1482909832739-rJ-cdy-Hx.json',
    '黑龙江': '/asset/get/s/data-1482909803892-Hy4__J-Sx.json',
    '江苏': '/asset/get/s/data-1482909823260-HkDtOJZBx.json',
    '浙江': '/asset/get/s/data-1482909960637-rkZMYkZBx.json',
    '安徽': '/asset/get/s/data-1482909768458-HJlU_yWBe.json',
    '福建': '/asset/get/s/data-1478782908884-B1H6yezWe.json',
    '江西': '/asset/get/s/data-1482909827542-r12YOJWHe.json',
    '山东': '/asset/get/s/data-1482909892121-BJ3auk-Se.json',
    '河南': '/asset/get/s/data-1482909807135-SJPudkWre.json',
    '湖北': '/asset/get/s/data-1482909813213-Hy6u_kbrl.json',
    '湖南': '/asset/get/s/data-1482909818685-H17FOkZSl.json',
    '广东': '/asset/get/s/data-1482909784051-BJgwuy-Sl.json',
    '广西': '/asset/get/s/data-1482909787648-SyEPuJbSg.json',
    '海南': '/asset/get/s/data-1482909796480-H12P_J-Bg.json',
    '四川': '/asset/get/s/data-1482909931094-H17eKk-rg.json',
    '贵州': '/asset/get/s/data-1482909791334-Bkwvd1bBe.json',
    '云南': '/asset/get/s/data-1482909957601-HkA-FyWSx.json',
    '西藏': '/asset/get/s/data-1482927407942-SkOV6Qbrl.json',
    '陕西': '/asset/get/s/data-1482909909703-SyCA_JbSg.json',
    '甘肃': '/asset/get/s/data-1482909780863-r1aIdyWHl.json',
    '青海': '/asset/get/s/data-1482909853618-B1IiOyZSl.json',
    '宁夏': '/asset/get/s/data-1482909848690-HJWiuy-Bg.json',
    '新疆': '/asset/get/s/data-1482909952731-B1YZKkbBx.json',
    '北京': '/asset/get/s/data-1482818963027-Hko9SKJrg.json',
    '天津': '/asset/get/s/data-1482909944620-r1-WKyWHg.json',
    '重庆': '/asset/get/s/data-1482909775470-HJDIdk-Se.json',
    '香港': '/asset/get/s/data-1461584707906-r1hSmtsx.json',
    '澳门': '/asset/get/s/data-1482909771696-ByVIdJWBx.json'
};
```
其他地图下载地址：  
1. [推荐]如果是在模块中引入，可以直接`import 'echarts/map/js/china.js'`   
2. [China.js](https://github.com/liangrumeng2015/China.js)  
3. [地图选择器](http://datav.aliyun.com/tools/atlas/)

省份官方例子：  
https://gallery.echartsjs.com/editor.html?c=map-HK