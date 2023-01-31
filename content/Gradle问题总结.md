---
title: Gradle问题总结
category: 工具
tags:
- Gradle
date: 2020-02-28
vssue-title: Gradle问题总结
---
## Gradle SDK下载慢
一般情况下，新打开项目都会下载项目依赖Gradle对应版本，但是因为被墙的原因导致速度很慢，解决办法：  
1. 不要下载all的版本，它会附带源码和文档，下载带bin的版本。
1. 2019年3月，Gradle开启了在中国地区的CDN，下载Gradle的distribution已经不需要翻墙，修改gradle文件夹下面的gradle-wrapper.properties中的http://services.gradle.org为http://downloads.gradle-dn.com即可
1. 或者手动下载需要的Gradle版本 [https://gradle.org/releases/](https://gradle.org/releases/)
1. 打开`Android Studio`设置，找到`Gradle`，指定本地Gradle位置,例如：
![Gradle问题总结_2020-2-28-14-0-33.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Gradle问题总结_2020-2-28-14-0-33.png)
1. 把下载好的`gradley.zip`移到第一步中指定的`/Applications/Android Studio.app/Contents/gradle/`下，不需要解压。
1. 打开`Android Studio`，会进行解压操作，这样我们就不用等待漫长的下载了。
第二种方法：

## Gradle Maven下载慢
只是修改上一步还是会遇到下载maven包很慢的问题，因而我们需要一个国内maven仓库，把maven库地址改成阿里云的地址，找到根目录下的`build.gradle`,进行如下修改：
```diff
buildscript {
    
    repositories {
+       maven{url 'http://maven.aliyun.com/nexus/content/groups/public/'}
+       maven{url "https://jitpack.io" }
        google()
-       // jcenter()
-       // mavenCentral()
    }
}

allprojects {
    repositories {
+       maven{url 'http://maven.aliyun.com/nexus/content/groups/public/'}
        google()
-       // jcenter()
    }
}
```

