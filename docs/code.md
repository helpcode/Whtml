## 源码分析 - package.json

---

上面说过了，我们可以通过`npm run all`命令来运行框架。那么我们这边先从`package.json`开始分析，看看这行命令背后到底发生了哪些事情。

打开`package.json`你将看到下面这些代码：

```bash
"scripts": {
   "all": "concurrently \" node-dev app.js \" \"gulp \" ",
   "doc": "docsify serve ./docs"
}
```

1：all ：通过nodejs的 `concurrently` 模块来并发执行两条命令，其中`node-dev app.js`是用来启动`express`框架运行我们编译后产生的静态文件`dist/`。而`gulp`命令执行的是`gulpfile.js`中的默认任务`default`

2：doc ：通过 `docsify` 来运行我们网站的帮助文档，这里没有什么好说的。

---

我们框架的关键逻辑在`all`命令背后，通过上面知道`all`命令运行后会并发执行`node-dev app.js`，我们打开项目根目录下的`app.js`探究一下：

```js
// express 框架部分
const express = require('express')
const app = express()
// 站点配置
const config = require('./config')
// 工具函数，OpenBrowser 自动打开浏览器
const { OpenBrowser } = require('./utils')
// 核心，需要被 express 托管的静态资源文件路径，提供给前端访问静态页面
app.use(express.static('./dist'))

// 监听 1314 端口，运行网站
app.listen(config.nodeService.port, () =>  OpenBrowser() );
```

这部分源码注释很详细也很简单，没什么可说的吧，一看就懂。


我们的核心应该在`gulp`命令背后，打开`gulpfile.js`文件，你将看到以下源码：

```js
const gulp = require('gulp')
const jade = require('gulp-jade')
const less = require("gulp-less")
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const cssmin = require('gulp-minify-css')
const watchPath = require('gulp-watch-path')
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const zip = require('gulp-zip')
const uglify = require('gulp-uglify')

// 引入gulp的配置文件
const config = require('./config')
const { RemoveFile } = require('./utils')

// 编译jade为html
gulp.task('jade', function() {
    return gulp.src(config.jade.jadeTohtml)
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest(config.jade.jadeTodist))
});

// 编译 less -> css，同时进行css3属性前缀自动补全，代码合并为一个文件，代码压缩
gulp.task('less', function() {
    return gulp.src(config.less.lessTocss)
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 2 versions','last 2 Explorer versions','Android >= 4.0'],
            cascade: true
    }))
    .pipe(concat(config.less.lessToFileName))
    //.pipe(cssmin())
    .pipe(gulp.dest(config.less.lessTodist));
});


// 监听用户在 src/的文件操作
gulp.task('file', function() {
    gulp.watch(config.watch.watchFile, function(event) {
        let paths = watchPath(event,'src/', 'Template/src/')
        switch (event.type){
            case 'deleted':
                console.log('删除操作...')
                RemoveFile(paths.srcFilename)
            break;
            default:
                console.log('其他操作...')
                gulp.run('less','jade','copyimg','copyjs','img','Online')
            break;    
        }
    });
  });


// 拷贝img 到dist文件夹
gulp.task('copyimg',function(){
    return gulp.src('src/assets/img/*')
        .pipe(gulp.dest('dist/img'))
})

// 拷贝js 到 dist/ 文件夹
gulp.task('copyjs',function(){
    return gulp.src('src/assets/js/*')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

// 压缩 img
gulp.task('img', function() {
    return gulp.src('dist/img/*') 
    .pipe(cache(imagemin({ 
      optimizationLevel: 7, 
      progressive: true, 
      interlaced: true,
      multipass: true,
      svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest('dist/img'))
})

// 部署阶段：zip打包 dist 文件夹，用于发布服务器
gulp.task('Online',function(){
    return gulp.src(['./dist/**'])
    .pipe(zip('Online.zip'))
    .pipe(gulp.dest('./'))
})

// 网站运行后，默认先进行一次编译
gulp.run(['less','jade','copyimg','copyjs','img','Online'])


// 执行默认任务，然后执行任务watcher
gulp.task('default',['file']);
```

`gulp.task('default',['file']);`是我们gulp的核心，运行了主任务`file`，源码如下：

```js
// 监听用户在 src/的文件操作
gulp.task('file', function() {
    gulp.watch(config.watch.watchFile, function(event) {
        let paths = watchPath(event,'src/', 'Template/src/')
        switch (event.type){
            case 'deleted':
                console.log('删除操作...')
                RemoveFile(paths.srcFilename)
            break;
            default:
                console.log('其他操作...')
                gulp.run('less','jade','copyimg','copyjs','img','Online')
            break;    
        }
    });
});
```

这边通过`gulp.watch`实现对`src/`文件夹进行监听，当用户修改被监听的`src/`文件夹里的文件后使用`'gulp-watch-path`模块获得被修改文件的路径，然后判断`event.type`的操作类型，根据操作类型来进行对应的操作。

1：如果是在`src/`文件夹中的删除操作，那么调用`utils/index.js`里的方法`RemoveFile()`同步去删除对应被编译后的文件。

2：如果是其他操作例如修改，添加等，直接将进行重新编译输出到`dist/`中，保持在`src`中的修改被同步到`dist/`中。这一步就是我们最核心的页面逻辑了。其实也没什么，你会发现还是很简单的。

## 源码分析 - src/

---

`src`文件夹中是前端工程师真正需要关心的源码部分，`assets`是静态资源的存放。`view`是页面的存放。`main/`文件夹中存放主要的页面，`public/`存放公共的页面组件。而`layout.jade`是页面的核心入口

