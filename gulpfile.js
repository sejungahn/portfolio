var gulp = require('gulp'); 

// gulp 플러그인 호출
var 
    concat      = require('gulp-concat'), 
    uglify      = require('gulp-uglify'), 
    rename      = require('gulp-rename'), 
    sourcemaps  = require('gulp-sourcemaps'), 
    scss        = require('gulp-sass')(require('sass')), 
    livereload = require('gulp-livereload'),
    minifyCss = require("gulp-clean-css");



// 객체 생성
var src  = 'project/';
var dist = 'project/dist/';
var paths = {
    js : 'js/*.js',
    scss : 'scss/*.scss',
    min : dist + 'scss/*.scss'
};


 // @task : HTML livereload 반영
gulp.task('html', function () {
    return gulp
        /**
         * html 파일을 읽어오기 위해 경로 지정
         */
        .src('*.html')

        /**
         * html 파일을 읽어온 후 livereload 호출하여 브라우저에 반영
         */
        .pipe(livereload());
});

// @task : Script 병합,압축,min 파일 생성
gulp.task('js:combine', function () {
    return gulp.src(['project/js/main.js', 'project/js/common.js', 'project/js/sub.js'])
        .pipe(uglify())
        .pipe(concat('style.min.js'))
        .pipe(gulp.dest(dist + '/js'))
        .pipe(livereload());
});

// @SCSS : SCSS Config(환경설정)
var scssOptions = {
    outputStyle : "expanded",
    indentType : "tab",
    indentWidth : 1, 
    precision: 6,
    sourceComments: true
};

// @task : SCSS Compile & sourcemaps
gulp.task('scss:compile', function () {
    return gulp
        .src(src + paths.scss)
        .pipe(sourcemaps.init())
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dist + 'css'))
        .pipe(livereload());
});

// @task : CSS min 파일 생성
gulp.task('minifyCss', function(){
     return gulp.src(dist + '/css/*.css')
     .pipe(minifyCss({keepSpecialComments:1}))
     .pipe(rename({ 
            suffix: ".min" 
        })) 
     .pipe(gulp.dest(dist + 'css/min'));
});

// @task : livereload 실행
gulp.task('live', gulp.series('html','scss:compile','js:combine','minifyCss'), function () {
     livereload.listen(
         { basePath: dist }
     )
});

// @task : watch 파일 변경을 감지
gulp.task('watch', function() {
    gulp.watch('./**/*.html', gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js:combine'));
    gulp.watch(paths.scss, gulp.series('scss:compile'));
    gulp.watch(paths.min, gulp.series('minifyCss'));
});



gulp.task('default', gulp.series('live', 'watch'));