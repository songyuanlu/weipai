var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'multi-sprite']
});
var browserSync = require('browser-sync').create();

var root = {
	resource: './resource/',
	html: './html/',
	dist: '../UI-dist/'
};

var errHandler = function (title) {
	return function (err) {
		$.util.log($.util.colors.red('[' + title + ']'), err.toString());
		this.emit('end');
	};
};

/*less start*/
var path = require('path');

gulp.task('less', function () {
  return gulp.src(root.resource + 'less/build/**/*.less')
    .pipe($.less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(root.resource + 'css'));
});
/*less end*/

//开启服务
gulp.task('serve', ['less'], function(){
  browserSync.init({
    server: "./"
  });

  gulp.watch(root.resource + 'less/**/*.less',['less']);
  gulp.watch(["html/**/*.html", root.resource + "css/**/*.css"]).on('change', browserSync.reload);
});

/*默认任务 start*/
gulp.task('default', ['serve']);
/*默认任务 start*/


/* 输出重构文件 start */
//复制不需要处理的文件到dist目录，包括html、font、pic等
gulp.task('copyFiles', function(){
    gulp.src([root.html + '**', root.resource + 'font/**', root.resource + 'temp_img/**', root.resource + 'img/!(sprites)'])
        .pipe($.copy(root.dist));
});

/* 雪碧图 (css sprite)
特点：
1、配置少，但会重写原文件，生成后就可以直接使用 
2、会根据切片所在的文件夹分别进行合并，并以文件夹的名字作为雪碧图的命名
*/
gulp.task('multiSprite',function(){
    $.multiSprite({
        srcImg: root.resource + 'img/sprites',
        srcCss: root.resource + 'css',
        destImg: root.dist + 'resource/img/sprites',
        destCss: root.dist + 'resource/css',
        padding: 2
    });
});

//输出重构文件：自动拼雪碧图，并将所需的所有文件都输出到src中
gulp.task('outputFiles', ['copyFiles', 'multiSprite']);
/* 输出重构文件 end */


/* pc端任务 start */
var pcResourceRoot = './pc/resource/';
var pcHtmlRoot = './pc/html/';

gulp.task('pcLess', function () {
  return gulp.src(pcResourceRoot + 'less/build/*.less')
    .pipe($.less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(pcResourceRoot + 'css'));
});

gulp.task('pcServe', ['pcLess'], function(){
  browserSync.init({
    server: "./"
  });

  gulp.watch(pcResourceRoot + 'less/*/*.less',['pcLess']);
  gulp.watch([pcHtmlRoot + "*.html", pcHtmlRoot + "*/*.html", pcResourceRoot + "css/*.css"]).on('change', browserSync.reload);
});

gulp.task('pc', ['pcServe']);
/* pc端任务 end */

