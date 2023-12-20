var gulp = require('gulp'); // gulp load (gulp modules 호출)

// gulp 플러그인 호출
var 
    concat      = require('gulp-concat'), // Gulp 의 concat 패키지 로드
    uglify      = require('gulp-uglify'), // uglify 플러그인 로드(호출)
    rename      = require('gulp-rename'), // gulp-rename 모듈 호출
    sourcemaps  = require('gulp-sourcemaps'), // sourcemaps 호출
    scss        = require('gulp-sass')(require('sass')), // sass 호출
    livereload = require('gulp-livereload'),
    minifyCss = require("gulp-clean-css");



/**
 * ==============================+
 * 경로들을 담을 객체 생성
 * ==============================+
 */
var src  = 'project/';
var dist = 'project/dist/';
var paths = {
    js : 'js/*.js',
    scss : 'scss/*.scss',
    min : dist + 'scss/*.scss'
};

/**
 * =====================================+
 * @task : HTML livereload 반영
 * =====================================+
 */
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


/**
 * =====================================+
 * @task : Script 병합,압축,min 파일 생성
 * =====================================+
 */
gulp.task('js:combine', function () {
    return gulp.src(['project/js/main.js', 'project/js/common.js', 'project/js/sub.js'])
        .pipe(uglify())
        .pipe(concat('style.min.js'))
        .pipe(gulp.dest(dist + '/js'))

        /**
         * 스크립트 task를 모두 수행한 후 livereload 호출하여 브라우저에 반영
         */
        .pipe(livereload());

});


/**
 * ==============================+
 * @SCSS : SCSS Config(환경설정)
 * ==============================+
 */
var scssOptions = {
    /**
     * outputStyle (Type : String  , Default : nested)
     * CSS의 컴파일 결과 코드스타일 지정
     * Values : nested, expanded, compact, compressed
     */
    outputStyle : "expanded",

    /**
     * indentType (>= v3.0.0 , Type : String , Default : space)
     * 컴파일 된 CSS의 "들여쓰기" 의 타입
     * Values : space , tab
     */
    indentType : "tab",

    /**
     * indentWidth (>= v3.0.0, Type : Integer , Default : 2)
     * 컴파일 된 CSS의 "들여쓰기" 의 갯수
     */
    indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용

    /**
     * precision (Type :  Integer , Default : 5)
     * 컴파일 된 CSS 의 소수점 자리수.
     */
    precision: 6,

    /**
     * sourceComments (Type : Boolean , Default : false)
     * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
     */
    sourceComments: true
};




/**
 * ==================================+
 * @task : SCSS Compile & sourcemaps
 * ==================================+
 */

gulp.task('scss:compile', function () {
    return gulp
        // SCSS 파일을 읽어온다.
        .src(src + paths.scss)

        // 소스맵 초기화(소스맵을 생성)
        .pipe(sourcemaps.init())
        
        // SCSS 함수에 옵션갑을 설정, SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
        .pipe(scss(scssOptions).on('error', scss.logError))

        // 위에서 생성한 소스맵을 사용한다.
        .pipe(sourcemaps.write('/'))
        
        // 목적지(destination)을 설정
        .pipe(gulp.dest(dist + 'css'))
        /**
         * SCSS 컴파일을 수행한 후 livereload 호출하여 브라우저에 반영
         */
        .pipe(livereload());

        
});


gulp.task('minifyCss', function(){
     return gulp.src(dist + '/css/*.css')
     .pipe(minifyCss({keepSpecialComments:1}))
     .pipe(rename({ 
            suffix: ".min" 
        })) 


     .pipe(gulp.dest(dist + 'css/min'));
});


/**
 * ==============================+
 * @task : livereload 실행
 * ==============================+
 */
gulp.task('live', gulp.series('html','scss:compile','js:combine','minifyCss'), function () {

    /**
     * livereload.listen() 옵션값으로 기본 경로를 지정
     */
     livereload.listen(
         { basePath: dist }
     );

});

/**
 * ==================================+
 * @task : watch 파일 변경을 감지
 * ==================================+
 */

gulp.task('watch', function() {
    gulp.watch('./**/*.html', gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js:combine'));
    gulp.watch(paths.scss, gulp.series('scss:compile'));
    gulp.watch(paths.min, gulp.series('minifyCss'));
});


// gulp 를 실행하면 default 로 js:combine task, scss:compile task 그리고 watch task 를 실행하도록 한다.
// Watch 태스크 정의

// 기본 태스크 설정
gulp.task('default', gulp.series('live', 'watch'));