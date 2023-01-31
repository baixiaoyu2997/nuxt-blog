---
title: androidstudio加速指南（转）
category: 工具
tags:
  - android studio
date: 2019-04-28
vssue-title: androidstudio加速指南（转）
---

> [原文链接](https://blog.csdn.net/walkeryudev/article/details/80360422)

# 设置

更改 studio 的 VM 大小  
Android Studio 限制了 Java 虚拟机启动的内存大小，限制了最大堆内存，当 Android Studio 运行越久，内存越不足的时候，就会频繁的触发 GC，Android Studio 就自然会卡起来了，严重的直接黑屏，所以，我们把对应的所需内存都配置大一些，32 位的系统打开 studio.exe.vmoptions 文件，如果是 64 位的话打开 studio64.exe.vmoptions，改动以下配置，根据各自配置适当调节。

> -Xms1024m  
> -Xmx4096m  
> -XX:MaxPermSize=2048m  
> -XX:ReservedCodeCacheSize=1024m

# 优化配置:

1、gradle 运行相关的配置 (gradle.properties 文件中)

> # The Gradle daemon aims to improve the startup and execution time of Gradle.
>
> \# When set to true the Gradle daemon is to run the build.  
> \# TODO: disable daemon on CI, since builds should be clean and reliable on servers  
> org.gradle.daemon=true  
> \# Specifies the JVM arguments used for the daemon process.  
> \# The setting is particularly useful for tweaking memory settings.  
> \# Default value: -Xmx10248m -XX:MaxPermSize=256m  
> org.gradle.jvmargs=-Xms1024m -Xmx2048m -XX:MaxPermSize=768m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8  
> \# When configured, Gradle will run in incubating parallel mode.  
> \# This option should only be used with decoupled projects. More details, visit  
> \# [http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects](http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects)  
> org.gradle.parallel=true  
> \# Enables new incubating mode that makes Gradle selective when configuring projects.  
> \# Only relevant projects are configured which results in faster builds for large multi-projects.  
> \# [http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:configuration_on_demand](http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:configuration_on_demand)  
> org.gradle.configureondemand=true

2、启用新一代 Dex 编译器 D8 (gradle.properties 文件中)

> android.enableD8=true

3、启用新一代资源编译器 aapt2 (增量资源处理) (gradle.properties 文件中)

> android.enableAapt2=true

4、启用构建缓存 (gradle.properties 文件中)【如果工程是从 2.2 之前的版本升级上来的】

> Build Cache: 2.2 版本的时候，加入了编译缓存的功能。但是 2.3 正式版之前都是默认关闭的。你可以通过 android.enableBuildCache = true 来开启这个功能。  
> 2.3 正式版开始将此功能转成默认开启的状态。

为了不受版本更替的影响, 直接在项目根目录下的 gradle.properties 文件中添加下列配置:

    #启用并设置 构建缓存 的目录 (使用 `./gradlew cleanBuildCache` 指令清除cache内容)
    android.enableBuildCache=true
    android.buildCacheDir=buildCacheDir/

Build Cache 默认的存储目录~/.android/build-cache. 为了方便管理(如, 缓存过多时手动清除), 上述配置的第二行就自己指定了缓存的存储目录  
关于更多 Build Cache 的内容请参考官方说明: [https://developer.android.com/studio/build/build-cache.html](https://developer.android.com/studio/build/build-cache.html)  
如果无法访问请看这里: [https://developer.android.google.cn/studio/build/build-cache.html](https://developer.android.google.cn/studio/build/build-cache.html)

5、启用 gradle 缓存 (gradle.properties 文件中)

     org.gradle.caching=true

6、禁用 PNG 图片优化处理 (禁止 Png Cruncher 优化)  
a. 在 Root Project 的 build.gradle 文件中添加下面一个函数, 来判断是否是打 debug 包, 如下:

    //是否是执行Debug相关task (通用函数, 可供子module调用)
    def isDebug() {
         def taskNames = gradle.startParameter.taskNames
         for (tn in taskNames) {
             if( (tn.contains("install") || tn.contains("assemble")) && tn.contains("Debug")) {
                 return true
             }
         }
         return false
     }

b. 在主 module 的 build.gradle 文件中的 android {}块中添加下面配置:

    android {

            // 其他配置省略 ...

            //如果是构建debug包, 则禁用 "png cruncher" (默认cruncherEnabled=true, 禁用以加速构建)
            def enableCruncher = { ->
                return !isDebug()
            }

            aaptOptions { //禁用cruncher, 以加速编译
                cruncherEnabled = enableCruncher()
                cruncherProcesses = 0
            }

        }

7、Dex 配置项优化  
在主 module 的 build.gradle 的 android {}语句块中添加下面配置项目:

    android {

         // 其他配置省略 ...

          dexOptions { //优化dex配置
             dexInProcess true
             preDexLibraries true
             javaMaxHeapSize "2g"
         }
     }

8、其他配置项  
在主 module 中的 buildg.gradle 文件中添加如下配置:

    android {
         compileOptions {
             incremental = true  //开启增量编译
             //其他代码省略 ...
         }

         buildTypes {
             debug {
                 crunchPngs false //关闭crunchPng优化, 以加快构建
                 //其他代码省略 ...
             }
         }

         //其他代码省略 ...
     }

9、跳过 Tests 和 Lint 相关的 Task  
在主 module 的 build.gradle 文件中的 android {}代码块中添加下面代码:

    android {
         //其他代码省略 ...


         //跳过Lint和Test相关的task, 以加速编译
         if (isDebug()) {
             gradle.taskGraph.whenReady {
                 tasks.each { task ->
                     if (task.name.contains("Test") || task.name.contains("Lint")) {
                         task.enabled = false
                     }
                 }
             }
         }
     }

10、Dex 的 merge 过程优化 (API Level 21, 即安卓 5.0 的优化配置)  
随着代码的日益积累, 我们安卓项目中的方法数目很容易就超过 64K 了, 这时候就需要分包, 即 MultDex 操作 (为什么方法数不能超过 64K 呢? 什么又是 MultDex? 这些就说来话长了, 如果你还不了解这些, 请移步此处: [https://developer.android.com/studio/build/multidex.html#about](https://developer.android.com/studio/build/multidex.html#about))

MultiDex 主要是为了解决 64K 限制. Google 给出的 MultiDex 解决方案分为两个阶段:  
a. Android 5.0 之前使用 Dalvik 可执行文件分包支持库 来支持分包  
b. Android 5.0 即 Android 5.0 之后的版本内置支持 MultiDex 操作 (因此就不需要额外的支持库啦, 只需要在 gradle 中简单的配置一下)

两种方法都会把 dex 分成多个, 但是前一分的 dex 更少, 内置的分包分的 dex 非常多. 下面是两种分包方式打的包的 dex 切分情况:

minSdkVersion 小于 21 时构建出来的 apk 包的 dex 切分情况如下:  
![这里写图片描述](https://img-blog.csdn.net/2018051810050984?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbGtlcnl1ZGV2/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

minSdkVersion 大于等于 21 时构建出来的 apk 包的 dex 切分情况如下:  
![这里写图片描述](https://img-blog.csdn.net/2018051810055344?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbGtlcnl1ZGV2/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)  
具体优化逻辑就是:  
如果不需要进行优, 则把 minSdkVersion 配成正常的支持版本(如 14, 15 等); 而如果需要优化, 则把 minSdkVersion 配置成 21(或大于 21)

具体配置如下:

    /**
     * 默认构建会进行优化, 如果不需要优化, 则运行下列命令:
     * ./gradlew assembleDebug -Pso=1
     * 或者 (构建并安装)
     * ./gradlew installDebug -Pso=1
     */
    def getMinSdkVersion() {
        int is_skip_optimize = hasProperty("so") ? Integer.parseInt(so) : 0

        //如果跳过优化 或 Release版本, 则minSdkVersion使用15; 否则使用21以便加快构建速度
        if(is_skip_optimize == 1 || !isDebug()) {
            return 15
        } else {
            return 21
        }
    }

    android {
        defaultConfig {
            applicationId "com.stone.xxx"
            minSdkVersion getMinSdkVersion() //此处的设置导致: 根据打包时传入的参数决定是否进行优化
            //其他配置省略 ...
        }
    }

两种分包方式的具体配置请参考: [https://developer.android.com/studio/build/multidex.html](https://developer.android.com/studio/build/multidex.html)

11、Fabric 相关优化  
在 Main Module 的 build.gradle 中添加下面 Fabric 相关的代码来优化 Fabric 配置:

    def getMinSdkVersion() {
    int is_skip_optimize = hasProperty("so") ? Integer.parseInt(so) : 0
    //如果跳过优化 或 Release版本, 则minSdkVersion使用15; 否则使用21以便加快构建速度
    if(is_skip_optimize == 1 || !isDebug()) {
        return 15
    } else {
        return 21
    }
    }




    android {
        buildTypes {
        debug {
            crunchPngs false //关闭crunchPng优化, 以加快构建
            ext.alwaysUpdateBuildId = false

            // enableCrashlytics = true 会影响编译速度 (enableCrashlytics默认值为true)
            // https://developer.android.com/studio/build/optimize-your-build.html#profile
            if (getMinSdkVersion() == 21) {
                ext.enableCrashlytics = false
                buildConfigField "boolean", "USER_FABRIC", "false" //此变量用于是否初始化或调用Fabric
            } else {
                buildConfigField "boolean", "USER_FABRIC", "true" //此变量用于是否初始化或调用Fabric
            }
        }
    }

    //其他配置省略 ...

}  
android 官网给出的优化 Fabric 的配置如下:  
![这里写图片描述](https://img-blog.csdn.net/20180518100350128?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbGtlcnl1ZGV2/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

官网优化相关配置:  
[https://developer.android.com/studio/build/optimize-your-build.html#profile](https://developer.android.com/studio/build/optimize-your-build.html#profile)  
References  
[https://docs.fabric.io/android/crashlytics/build-tools.html](https://docs.fabric.io/android/crashlytics/build-tools.html)  
[https://developer.android.com/studio/build/optimize-your-build.html#profile](https://developer.android.com/studio/build/optimize-your-build.html#profile)  
[https://developer.android.com/studio/build/multidex.html](https://developer.android.com/studio/build/multidex.html)  
[https://developer.android.google.cn/studio/build/build-cache.html](https://developer.android.google.cn/studio/build/build-cache.html)  
[https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties](https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties)  
[https://developer.android.google.cn/studio/releases/index.html#preview-the-new-d8-dex-compiler](https://developer.android.google.cn/studio/releases/index.html#preview-the-new-d8-dex-compiler)  
[https://developer.android.com/studio/releases/gradle-plugin.html#optimizations](https://developer.android.com/studio/releases/gradle-plugin.html#optimizations)  
[http://blog.csdn.net/ahence/article/details/73603326](http://blog.csdn.net/ahence/article/details/73603326)

配置到这里，我的 Android Studio 编译速度从原来的 4 分钟缩短到了 10 秒。希望你也可以通过设置提高工作效率.

最后,加速 Android Studio 另一个最简单的方法就是:

**升级你的电脑配置！！**
