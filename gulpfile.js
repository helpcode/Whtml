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

const DistPublic = `${config.styl.stylTodist}public`

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


/**
 *  编译公共页 css
 */
gulp.task('publicstyl', function() {
    return gulp.src(config.styl.stylTocssPublic)
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(stylus())
    .pipe(autoprefixer({
        browsers: ['last 2 versions','last 2 Explorer versions','Android >= 4.0'],
            cascade: true
    }))
    /**
     * 压缩兼容处理css文件，取消注释使用
     */
    // .pipe(cssmin({
    //     advanced: false,
    //     compatibility: 'ie7',
    //     keepBreaks: false,
    //     keepSpecialComments: '*'
    // }))
    .pipe(gulp.dest(DistPublic))
})


/**
 * 编译主要页面的 css，合并为main.css
 */
gulp.task('pagestyl', function() {
    return gulp.src(config.styl.stylTocssPage)
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(stylus())
    .pipe(autoprefixer({
        browsers: ['last 2 versions','last 2 Explorer versions','Android >= 4.0'],
            cascade: true
    }))
    .pipe(concat(config.styl.stylToFileName))
    /**
     * 同上
     */
    // .pipe(cssmin({
    //     advanced: false,
    //     compatibility: 'ie7',
    //     keepBreaks: false,
    //     keepSpecialComments: '*'
    // }))
    .pipe(gulp.dest(`${config.styl.stylTodist}page`))
})

/**
 * 拷贝 public中的第三方css到dist文件夹
 */
gulp.task('copycss',function(){
    return gulp.src('src/assets/css/public/*.css')
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(cssmin({
        advanced: false,
        compatibility: 'ie7',
        keepBreaks: false,
        keepSpecialComments: '*'
    }))
    .pipe(gulp.dest(DistPublic))
})

/**
 * 拷贝img 到dist文件夹
 */
gulp.task('copyimg',function(){
    return gulp.src('src/assets/img/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(gulp.dest('dist/img'))
})

/**
 * 拷贝字体文件
 */
gulp.task('copyfont',function(){
    return gulp.src('src/assets/font/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(gulp.dest('dist/font'))
})


/**
 * 拷贝js文件
 */
gulp.task('copyjs',function(){
    return gulp.src('src/assets/js/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    /**
     * 压缩js代码，取消注释启用
     */
    // .pipe(uglify({
    //     compress: false
    //   }))
    .pipe(gulp.dest('dist/js'))
})


/**
 * 自动zip打包 dist 文件夹，用于提交给后端
 */
gulp.task('Online',function(){
    return gulp.src(['./dist/**'])
    .pipe(plumber({ errHandler: e => {
        gutil.beep() 
        gutil.log(e)
    }}))
    .pipe(zip('Online.zip'))
    .pipe(gulp.dest('./'))
})


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
                gulp.run('publicstyl','copyfont','pagestyl','jade','copyjs','copyimg','copycss','Online')
            break    
        }
    })
  })


/**
 * 默认先运行一次 编译过程
 */
gulp.run('publicstyl','copyfont','pagestyl','jade','copyjs','copyimg','copycss','Online')


/**
 * 执行file任务，当文件被操作后进行相关的编译过程
 */
gulp.task('default',['file'])