module.exports = {
	base64 : { 
		src: 'src/css/*.css', 
		dest:'dist/css', 
		options: { 
			baseDir: 'dist/css',
			extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
			maxImageSize: 10 * 1024,
			debug: true 
		}
	},
	//检测js代码定义的方法
	jshintFn : function (file,cb) {
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
	}
}
