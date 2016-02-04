/* --------- plugins --------- */
var
	gulp        = require('gulp'),
	jade        = require('gulp-jade'),//компилятор jade
	browserSync = require('browser-sync').create(),//livereload + local server
	browserify  = require('gulp-browserify'),//сборщик js файлов
	uglify      = require('gulp-uglify'),//минификация js файлов
	rename      = require("gulp-rename"),//переименовывание файлов
	plumber     = require('gulp-plumber'),//Не дает галпу остановиться с ошибкой
	concat      = require('gulp-concat'),//склеивание js файлов
	sass        = require('gulp-sass'),//Компилятор sass файлов
	spritesmith = require('gulp.spritesmith');//создание спрайтов


/* --------- paths --------- */

var
	paths = {
		build:{//файлы для выгрузки
			html:  'dist/',
			js:	   'dist/js',
			css:   'dist/styles',
			img:   'dist/img/main',
			sprite:'dist/img/sprite',
			fonts: 'dist/fonts'
		},
		dev:{//исходники
			jade:      '-dev/markups/pages/*.jade',
			js:        '-dev/js/**/*.js',
			style:     '-dev/styles/main.scss',
			sprite:    '-dev/img/sprite/**/*.*',
			img:       '-dev/img/main/**/*.*',
			spritescss:'-dev/styles/sprite',
			fonts:     '-dev/fonts/**/*.*'
		},
		watch:{
			jade: '-dev/markups/**/*.jade',
			scss: '-dev/styles/**/*.scss',
			js:   '-dev/js/**/*.js',
			img:  '-dev/img/**/*.*',
			fonts:'-dev/fonts/**/*.*'
		},
		browserSync: {
			baseDir:'build',
			watchPaths: ['build/**/*.*']
		},
		clean: 'build',
};


/* --------- jade --------- */
gulp.task('jade', function() {
	gulp.src(paths.dev.jade)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.build.html));
});
/* --------- fonts --------- */
gulp.task('other', function() {
	gulp.src(paths.dev.fonts)
		.pipe(gulp.dest(paths.build.fonts));
	gulp.src(paths.dev.img)
		.pipe(gulp.dest(paths.build.img));
});
/* --------- sass --------- */
gulp.task('sass', function() {
	gulp.src(paths.dev.style)
		.pipe(sass().on('error',sass.logError))
		.pipe(gulp.dest(paths.build.css));
});
/* --------- browser sync --------- */
gulp.task('sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});
/* --------- plugins --------- */
gulp.task('scripts', function() {
	return gulp.src(paths.dev.js)
		.pipe(plumber())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.build.js));
});
/* --------- sprites --------- */
gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.dev.sprite)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.scss',
			padding: 70
		}));
	spriteData.img.pipe(gulp.dest(paths.dev.sprite));
	spriteData.css.pipe(gulp.dest(paths.dev.spritescss));
});
/* --------- watch --------- */
gulp.task('watch', function(){
	gulp.watch(paths.watch.jade, ['jade']);
	gulp.watch(paths.watch.scss, ['sass']);
	gulp.watch(paths.watch.js, ['scripts']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});
/* --------- clean --------- */
gulp.task('clean', function() {

});
/* --------- default --------- */

gulp.task('default', ['jade','other','sass','sync','scripts','sprite', 'watch']);