var gulp = require('gulp'),
//合并插件
	concat = require('gulp-concat'), 	
//压缩js插件
	uglify = require('gulp-uglify'), 	
//压缩图片插件
	imagemin = require('gulp-imagemin'), 	
//清除文件夹插件
	clean = require('gulp-clean'),	
//压缩css插件
	csso = require('gulp-csso'),
//js代码检查插件
	jshint = require('gulp-jshint'),
//添加版本号插件
	rev = require('gulp-rev'),
//重命名插件
	rename = require('gulp-rename'),  
//命令行插件
	shell = require('gulp-shell'),	
//浏览器自动刷新插件
	browserSync = require('browser-sync'),
//
	sourcemaps = require('gulp-sourcemaps'),
//压缩html插件
	htmlmin = require('gulp-htmlmin'),
//html文件引用路径替换插件
	htmlreplace = require('gulp-html-replace'),
//自动添加浏览器兼容前缀插件
	prefixer = require('gulp-autoprefixer'),
//背景url图片转换成base64
	base64 = require('gulp-base64'),
//检索代码具体错误信息插件
	map = require("map-stream"), 
//引入config.js
	config = require('./config.js'),
	reload = browserSync.reload;

//配置路径
var path = {
	script : 'src/js/*.js',
	images : 'src/images/**/*',
	cssPath : 'src/css/*.css',
	libPath : 'src/lib/*.js',
	htmlPath : 'src/*.html'
}
// 压缩 JS
gulp.task('js-optimize', function() {
    return gulp.src(path.script)
        .pipe(concat('index.js'))
        .pipe(rename('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());

    console.log('js 文件优化处理完毕！');
});

//图片压缩
gulp.task('img-optimize', function() {

    return gulp.src(['src/images/**/*.{png,jpg,gif}'])
        .pipe(imagemin({      // 只压缩修改的图片，没有修改的图片直接从缓存文件读取
            progressive: true,
        }))
        .pipe(gulp.dest('dist/images'));

    console.log('图片压缩完毕！');
});
//css压缩
gulp.task('css-optimize', function () {
    return gulp.src(path.cssPath)
    	.pipe(prefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
    	.pipe(base64(config.base64))
        .pipe(concat('index.css'))
        .pipe(rename('index.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});
//依赖插件压缩合并
gulp.task('js-common', function () {
    return gulp.src(path.libPath)
        .pipe(concat('common.js'))
        .pipe(rename('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib'))
        .pipe(browserSync.stream());
});
//html文件压缩并替换引入文件路径
gulp.task('html-optimize', function() {
  return gulp.src(path.htmlPath)
  	.pipe(htmlreplace({
  		'css'     : 'css/index.min.css',
  		'common'  : 'lib/common.min.js',
  		'js'      : 'js/index.min.js',
  		'intro-js': 'lib/common.min.js'
  	}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});
//检测js代码方法
var customerReporter = map(function(file,cb){  
	config.jshintFn(file,cb);
});  
//检测js代码任务
gulp.task('js-hint', function() {
  return gulp.src(path.script)
    .pipe(jshint())
    .pipe(customerReporter);
});

 gulp.task('server',function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch(path.cssPath, ['css-optimize']);
    gulp.watch(path.htmlPath).on('change', browserSync.reload);
    gulp.watch(path.script, ['js-optimize']);
});
//默认执行的任务
gulp.task('default', 
	[
		'js-hint',
		'css-optimize',
		'img-optimize',
		'js-optimize',
		'html-optimize',
		'js-common',
		'server'
	],
	function() {
		console.log('完成压缩打包任务！');
		var info = prefixer().info();
		console.log(info);
	}
);
//清除所有打包文件
gulp.task('clean', function() {
	return gulp.src('dist/*')
		.pipe(clean())
});
