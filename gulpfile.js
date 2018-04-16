const gulp = require('gulp')
const jade = require('gulp-jade')
const less = require("gulp-less")
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const cssmin = require('gulp-clean-css')
const watchPath = require('gulp-watch-path')
const zip = require('gulp-zip')
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
// 引入gulp的配置文件
const config = require('./config/index.js')
const { RemoveFile } = require('./utils')

// 编译jade为html
gulp.task('jade', function() {
    return gulp.src(config.jade.jadeTohtml)
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest(config.jade.jadeTodist))
});

// 编译公共页 css
gulp.task('publicless', function() {
    return gulp.src(config.less.lessTocssPublic)
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 2 versions','last 2 Explorer versions','Android >= 4.0'],
            cascade: true
    }))
    // .pipe(concat(config.less.lessToFileName))
    // .pipe(cssmin({
    //     advanced: false,
    //     compatibility: 'ie7',
    //     keepBreaks: false,
    //     keepSpecialComments: '*'
    // }))
    .pipe(gulp.dest(`${config.less.lessTodist}public`));
});

// 编译主要页面的 css，合并为main.css
gulp.task('pageless', function() {
    return gulp.src(config.less.lessTocssPage)
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 2 versions','last 2 Explorer versions','Android >= 4.0'],
            cascade: true
    }))
    .pipe(concat(config.less.lessToFileName))
    // .pipe(cssmin({
    //     advanced: false,
    //     compatibility: 'ie7',
    //     keepBreaks: false,
    //     keepSpecialComments: '*'
    // }))
    .pipe(gulp.dest(`${config.less.lessTodist}page`));
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
                gulp.run('publicless','pageless','jade','copyimg','copyjs','img','Online')
            break;    
        }
    });
  });


// 拷贝img 到dist文件夹
gulp.task('copyimg',function(){
    return gulp.src('src/assets/img/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    .pipe(gulp.dest('dist/img'))
})

// 拷贝js 到 dist/ 文件夹
gulp.task('copyjs',function(){
    return gulp.src('src/assets/js/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    // .pipe(uglify({
    //     compress: false
    //   }))
    .pipe(gulp.dest('dist/js'))
})

// 压缩 img
gulp.task('img', function() {
    return gulp.src('dist/img/*')
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    // .pipe(imagemin({
    //   optimizationLevel: 7, 
    //   progressive: true, 
    //   interlaced: true,
    //   multipass: true,
    //   use: [pngquant()],
    //   svgoPlugins: [{removeViewBox: false}]
    // }))
    .pipe(gulp.dest('dist/img'))
})

// 部署阶段：zip打包 dist 文件夹，用于发布服务器
gulp.task('Online',function(){
    return gulp.src(['./dist/**'])
    .pipe(plumber({ errHandler: e => {
        gutil.beep(); 
        gutil.log(e);
    }}))
    .pipe(zip('Online.zip'))
    .pipe(gulp.dest('./'))
})


  
gulp.run('publicless','pageless','jade','copyimg','copyjs','img','Online')


// 执行默认任务，然后执行任务watcher
gulp.task('default',['file']);