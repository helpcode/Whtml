## 源码分析 - package.json

---

上面说过了，我们可以通过`npm run all`命令来运行框架。那么我们这边先从`package.json`开始分析，看看这行命令背后到底发生了哪些事情。

打开`package.json`你将看到下面这些代码：

```bash
"scripts": {
    "all": "node_modules/.bin/concurrently \" node_modules/.bin/node-dev app.js \" \"node_modules/.bin/gulp \" ",
    "doc": "node_modules/.bin/docsify serve ./docs"
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
// 编译jade文件为hrml
const jade = require('gulp-jade')
// 编译stylus文件为css
const stylus = require('gulp-stylus')
// 自动为css3属性加前缀
const autoprefixer = require('gulp-autoprefixer')
// 合并js，css文件
const concat = require('gulp-concat')
// 压缩css
const cssmin = require('gulp-clean-css')
// gulp 文件监听
const watchPath = require('gulp-watch-path')
// zip压缩
const zip = require('gulp-zip')
// 压缩js文件
const uglify = require('gulp-uglify')
// 处理gulp错误，防止程序报错终止
const plumber = require('gulp-plumber')
// 引入gulp的配置文件
const config = require('./config/index.js')
// 引入全局公共方法
const { RemoveFile } = require('./utils')

/**
 * 编译jade为html
 */
gulp.task('jade', function() {
    return gulp.src(config.jade.jadeTohtml)
    .pipe(plumber({ errHandler: e => {
        gutil.beep()
        gutil.log(e)
    }}))
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest(config.jade.jadeTodist))
})


...

/**
 * 监听用户在 src/ 的所有文件操作
 */
gulp.task('file', function() {
    gulp.watch(config.watch.watchFile, function(event) {
        let paths = watchPath(event,'src/', 'Template/src/')
        switch (event.type){
            case 'deleted':
                console.log('删除操作...')
                RemoveFile(paths.srcFilename)
            break
            default:
                console.log('其他操作...')
                gulp.run('publicstyl','copyfont','pagestyl','jade','copyjs','copyimg','Online')
            break    
        }
    })
  })


/**
 * 默认先运行一次 编译过程
 */
gulp.run('publicstyl','copyfont','pagestyl','jade','copyjs','copyimg','Online')


/**
 * 执行file任务，当文件被操作后进行相关的编译过程
 */
gulp.task('default',['file'])
```

这边通过`gulp.watch`实现对`src/`文件夹进行监听，当用户修改被监听的`src/`文件夹里的文件后使用`gulp-watch-path`模块获得被修改文件的路径，然后判断`event.type`的操作类型，根据操作类型来进行对应的操作。

1：如果是在`src/`文件夹中的删除操作，那么调用`utils/index.js`里的方法`RemoveFile()`同步去删除对应被编译后的文件。

2：如果是其他操作例如修改，添加等，直接将进行重新编译输出到`dist/`中，保持在`src`中的修改被同步到`dist/`中。这一步就是我们最核心的页面逻辑了。其实也没什么，你会发现还是很简单的。

## 源码分析 - src/

---

`src`文件夹中是前端工程师真正需要关心的源码部分。
- 1： `assets`是静态资源的存放。
- 2： `view`是页面的存放。
- 3： `main/`文件夹中存放主要的页面，
- 4： `public/`存放公共的页面组件，而`layout.jade`是页面的核心入口

## 源码分析 - 配置/

---

你可以在网站的`config/index.js`文件来修改基本配置，做到设置端口，打开url地址，是否自动打开浏览器等，具体配置信息如下：

```js
module.exports = {
    "jade":{
        // jade -> html 需要监听转换的jade文件路径
        "jadeTohtml": "./src/view/main/*.jade",
        // html 输出的路径
        "jadeTodist": "./dist/"
    },
    "styl":{
        // 将 public/ 公共的 styl 文件直接编译在 dist/ 中生成对应的
        "stylTocssPublic": "./src/assets/css/public/*.styl",
        // 将 page/ 中 styl 编译合并
        "stylTocssPage": "./src/assets/css/layout.styl",
        // styl 转换完成后，需要将多个文件合并成一个的文件名
        "stylToFileName":"main.css",
        // css 输出的路径
        "stylTodist":"./dist/css/"
    },
    "watch":{
        // gulp 需要监听的文件路径，当我们在src修改源码时，gulp会动态编译输出到dist
        "watchFile":"src/**/*"
    },
    "nodeService": {
        // 访问ip
        "host":"http://127.0.0.1:",
        // 访问端口
        "port": 1314,
        // 提示信息
        "log":"项目运行在:",
        // 是否开始自动打开浏览器功能，取值：true，false
        "isOpenBrowser": false
    }
}
```

