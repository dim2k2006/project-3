var gulp = require('gulp'),
	wiredep = require('wiredep').stream,
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	clean = require('gulp-clean'),
	connect = require('gulp-connect'),
	opn = require('opn'),
	importCss = require('gulp-import-css');



// Web server + livereload
gulp.task('connect', function() {
	connect.server({
		root: 'app',
		livereload: true,
		port: 8888
	});
	opn('http://localhost:8888');
});



// Work with html
gulp.task('html', function () {
	gulp.src('./app/*.html')
	.pipe(connect.reload());
});



// Work with css
gulp.task('css', function () {
	gulp.src('./app/css/*.css')
	.pipe(connect.reload());
});



// Work with js
gulp.task('js', function () {
	gulp.src('./app/js/*.js')
	.pipe(connect.reload());
});



// CSS import
// gulp.task('import', function () {
//   gulp.src('assets/*.css')
//     .pipe(importCss())
//     .pipe(gulp.dest('dist/'));
// });



// Build
gulp.task('build', ['move'], function () {
    var assets = useref.assets();
    
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({rebase: false})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});



// Clean
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});



// Move images and fonts to dist
gulp.task('move', ['clean'], function() {
	gulp.src('./app/images/*')
	.pipe(gulp.dest('dist/images'));

	gulp.src('./app/fonts/*')
	.pipe(gulp.dest('dist/fonts'));
});



// Bower wiredep
gulp.task('bower', function () {
	gulp.src('./app/*.html')
	.pipe(wiredep({
		directory : "app/bower_components"
	}))
	.pipe(gulp.dest('./app'));
});



// Watch
gulp.task('watch', function () {
	gulp.watch(['./app/*.html'], ['html']);
	gulp.watch(['./app/css/*.css'], ['css']);
	gulp.watch(['./app/js/*.js'], ['js']);
	gulp.watch('bower.json', ['bower']);
});



// Default task
gulp.task('default', ['connect', 'watch']);