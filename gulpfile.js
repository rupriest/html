var gulp = require('gulp'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cssnano = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	sourcemaps = require('gulp-sourcemaps'),
	reload = browserSync.reload;

var config = {
    server: {
        baseDir: "dist/"
    },
    host: 'localhost',
    port: 3000,
    tunnel: true,
    logPrefix: "Frontend_Priest"
};
gulp.task('copy', function(done){
	gulp.src('src/**/*.+(txt|pdf|doc|docx)')
	.pipe(gulp.dest('dist/'))
	done();
});
gulp.task('html:build', function(done){
	gulp.src('src/**/*.+(html|shtml)')
	.pipe(rigger())
	.pipe(gulp.dest('dist/'))
	done();
});
gulp.task('js:build', function(done){
	gulp.src('src/js/*.js')
	.pipe(rigger())
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/js/'))
	done();
});
gulp.task('style:build', function(done){
	gulp.src('src/css/*.+(sass|scss|css)')
	.pipe(rigger())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer(['last 5 version', '> 1%', 'ie 8'],{cascade: true}))
	.pipe(cssnano({compatibility: 'ie8', level: 2}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/css/'))
	done();
});
gulp.task('image:build', function (done){
	gulp.src('src/img/**/*.*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest('dist/img'))
	done();
});
gulp.task('fonts:build', function(done) {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'))
        done();
});
gulp.task('build', gulp.series(
	gulp.parallel('html:build', 'js:build', 'style:build', 'fonts:build', 'image:build')
));
gulp.task('reload', function(done){
	gulp.src('dist/')
		.pipe(reload({stream: true}))
		done();
});
gulp.task('watch', function(){
    gulp.watch('src/css/**/*.+(sass|scss|css)', gulp.series('style:build','reload'));
    gulp.watch('src/**/*.+(html|shtml|php)', gulp.series('html:build','reload'))
    gulp.watch('src/js/**/*.js', gulp.series('js:build','reload'));
});
gulp.task('webserver', function () {
    browserSync.init(config);
    browserSync.watch('src', browserSync.reload());
});
gulp.task('clean', function (done) {
    del("dist");
    done();
});
gulp.task('live', gulp.series(
	gulp.parallel('watch','webserver')
));
gulp.task('default', gulp.series('build', gulp.parallel('watch','webserver')));
// gulp.task('default', gulp.task('build'));
