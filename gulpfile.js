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


  
gulp.run(['less','jade','copyimg','copyjs','img','Online'])


// 执行默认任务，然后执行任务watcher
gulp.task('default',['file']);