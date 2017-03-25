# 关于gulp构建工具的个人学习总结

## 一般项目中用到的gulp插件：

     1. gulp-uglify           //压缩js插件
     2. gulp-imagemin         //压缩图片插件
     3. gulp-clean            //清除文件夹插件
     4. gulp-csso             //压缩css插件
     5. gulp-jshint           //js代码检查插件
     6. gulp-rev              //添加版本号插件
     7. gulp-rename           //重命名插件
     8. browser-sync          //浏览器自动刷新插件
     9. gulp-htmlmin          //压缩html插件
     10. gulp-html-replace    //html文件引用路径替换插件
     11. gulp-autoprefixer    //自动添加浏览器兼容前缀插件
     12. gulp-base64          //背景url图片转换成base64
   ## 插件代码示例：

``` stylus
	//配置路径
var path = {
    basePath : 'dist/',
    videoPath : 'dist/video',
    audioPath : 'dist/audio',
    script : 'src/js/*.js',
    images : 'src/images/**/*',
    cssPath : 'src/css/*.css',
    libPath : 'src/lib/*.js',
    htmlPath : 'src/*.html',
    watchhtmlPath : 'dist/*.html'
}

// 压缩 JS
gulp.task('js-optimize', function() {
    return gulp.src(path.script)
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

//html文件压缩并替换引入文件路径
gulp.task('html-optimize', function() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(path.htmlPath)
        .pipe(htmlreplace({
            'css'     : 'css/index.min.css'
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
});

//检测js代码方法
var customerReporter = map(function(file,cb){
     if(!file.jshint.success){
            //打印出错误信息
            console.log("jshint fail in:" + file.path);
            file.jshint.results.forEach(function(err){
                if(err){
                    console.log(err);
                    console.log("在 "+file.path+" 文件的第"+err.error.line+" 行的第"+err.error.character+" 列发生错误");
                }
            });
        }
});
//检测js代码任务
gulp.task('js-hint', function() {
    return gulp.src(path.script)
        .pipe(jshint())
        .pipe(customerReporter);
});

//启动本地服务器监听文件变化自动刷新页面
gulp.task('server',function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch(path.cssPath, ['css-optimize']);
    //在下面watch这里添加on('change',browserSync.reload)会出现先刷新页面再压缩文件，实现不了同步更新；
    gulp.watch(path.htmlPath, ['html-optimize']);
    gulp.watch(path.script, ['js-optimize']);
});

//清除所有打包文件
gulp.task('clean', function() {
    return gulp.src('dist/*')
        .pipe(clean())
});
```


 
