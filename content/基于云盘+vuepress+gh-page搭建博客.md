---
title: 基于云盘+vuepress+github pages搭建博客
category: 分享
tags:
- vuepress
date: 2019-02-24
vssue-title: 基于云盘+vuepress+github pages搭建博客
---

## 创建项目
参看这篇文章：[主题使用指南](https://vuepress-theme-meteorlxy.meteorlxy.cn/posts/2019/02/26/theme-guide-zh.html)
## 推送博客到gh-pages
待完善
### 编写deploy.sh脚本
```sh
git fetch --all
git reset --hard origin/master
git clean -df
yarn
echo "初始化"
cd ./dist
git init
git config core.autocrlf false
git remote add origin git@github.com:baixiaoyu2997/baixiaoyu2997.github.io.git
git fetch --all
git reset --hard origin/master
cd ../
echo "子项目初始化"
rm -rf src/_posts/*
cp -rf "E:/Nutstore/private/博客/." "src/_posts/"
echo "拷贝博客"
git add -A
git commit -m copy
git push -u origin master
echo "上传blog源文件到github"
yarn build
echo "编译生成静态文件"
cp -rf "build/." "dist/"
rm -rf build
echo "静态文件拷贝到子项目"
cd ./dist
git add -A
git commit -m deploy
git push -u origin master -f
cd ..
echo "上传博客"
read -p "推送成功，按回车键退出" var

```
### 执行脚本
双击sh文件或者在npm script中加入指令，例：
```json
"scripts": {
    "deploy": "deploy.sh"
},
```
执行`npm run deploy`
## SEO
1. 具体SEO怎么做可以参考以下这篇文章：[Hexo博客提交百度和Google收录](https://www.jianshu.com/p/f8ec422ebd52)
2. vuepress中可以使用`vuepress-plugin-sitemap`来自动生成sitemap文件，以下是具体步骤
> 因为百度不支持从github爬取数据，所以百度不能从sitemap中获取网址
```js
yarn add vuepress-plugin-sitemap -D

// docs\.vuepress\config.js中添加如下代码
plugins: {
      'sitemap': {
        hostname: 'https://xxxx.github.io/' //你的gh-pages地址
      },
}

```
3. 再次`build`之后就会自动在dist文件夹下生成`sitemap.xml`文件了