---
title: gulp
category: 工具
tags:
  - gulp
date: 2019-02-22
vssue-title: gulp
---
## 小程序
```js

//通用
var gulp = require("gulp");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var cleanCss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var livereload = require('gulp-livereload');

gulp.task("default", ["watch"]);

gulp.task('html', function () {
    return gulp.src('./index.html')
        .pipe(livereload());
});
gulp.task('babel', () => {
    return gulp.src('./src/js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
//监听
gulp.task('watch', function () {
    livereload.listen(); //这句不能省，它是用来开启 livereload 服务器
    gulp.watch('index.html', ['html']);
    gulp.watch("./src/css/*.scss", ["sass"]);
});

//sass转换成css
gulp.task("sass", function () {
    return gulp.src("./src/css/*.scss").pipe(sass({
            outputStyle: "expanded"
        }).on('error', sass.logError)).pipe(cleanCss())
        .pipe(gulp.dest("./dist/css/"));
});

// 小程序CLI
gulp.task("wxCLI", function () {
    // 获取当前文件路径
    var PWD = process.cwd(); // 兼容windows
    var option = minimist(process.argv.slice(2), {
        string: "name"
    });
    try {
        fse.accessSync(PWD + "/" + option.name, fse.F_OK);
        console.log(option.name + "目录已存在，如果想覆盖请先删除原文件夹");
        return false;
    } catch (e) {
        // success
    }

    var suffixName = ["js", "json", "wxml", "wxss", "logic"];
    var fileName = option.name.slice(option.name.lastIndexOf("\/") + 1);
    var logicFirstLetter = fileName.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    var template = {
        js: `Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})`,
        wxml: `<view>
    
</view>`,
        wxss: "",
        json: `{
    "navigationBarTitleText": ""
}`,
        logic: `var ` + logicFirstLetter + `Logic = function () {
  var ApiInvoker = require("../../utils/ApiInvoker");

  if (` + logicFirstLetter + `Logic._instance) {
    return ` + logicFirstLetter + `Logic._instance;
  }
  ` + logicFirstLetter + `Logic._instance = this;


  this.getXXX = function (pageNum, pageSize, successCallback) {
    var url = "";
    var data = {
      page: pageNum,
      pageSize: pageSize
    }
    ApiInvoker.post(url, data, function (e) {
      successCallback(e);
    });
  };
};

// factory
` + logicFirstLetter + `Logic.getInstance = function () {
  return ` + logicFirstLetter + `Logic._instance || new ` + logicFirstLetter + `Logic();
};
module.exports = ` + logicFirstLetter + `Logic.getInstance();`
    }
    suffixName.map(function (x, y) {
        if (y == 0) {
            fse.ensureDirSync(PWD + "/" + option.name, function () {});
        }
        if (x != "logic") {
            fse.writeFileSync(PWD + "/" + option.name + "/" + fileName + "." + x, template[x]);
        } else {
            fse.writeFileSync(PWD + "/" + option.name + "/" + logicFirstLetter + "Logic.js", template[x]);
        }
    })

})
```

## 通用配置

```js
const gulp = require("gulp");
const terser = require("gulp-terser");
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');

gulp.task("js", function () {
  return gulp
    .src("./static/js/**/*.js", { overwrite: true })
    .pipe(terser())
    .pipe(
      gulp.dest(function (data) {
        return data.base;
      })
    );
});

gulp.task("img", function () {
  return gulp
    .src("./static/img/**/*.png")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 5}),
  ]))
    .pipe(
      gulp.dest(function (data) {
        return data.base;
      })
    );
});

gulp.task('css', () => {
  return gulp.src('./static/css/**/*.css')
    .pipe(cleanCSS())
    .pipe(
      gulp.dest(function (data) {
        return data.base;
      })
    );
});

gulp.task("default", gulp.series("js", "css","img"));

```

