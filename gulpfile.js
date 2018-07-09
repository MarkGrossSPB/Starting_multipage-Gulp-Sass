'use strict'

var gulp = require('gulp'),
  rigger = require('gulp-rigger'), // include html файлов
  sass = require('gulp-sass'), //компиляция sass
  livereload = require('gulp-livereload'), //перезагрузка
  concat = require('gulp-concat'), //конкатинация файлов
  uglify = require('gulp-uglifyjs'), //минимизация js
  autoprefixer = require('gulp-autoprefixer'), //автопрефиксы 
  rename = require('gulp-rename'), //переименование файла
  sourcemaps = require('gulp-sourcemaps'), //карты стилей
  del = require('del'), //удаление
  imagemin = require('gulp-imagemin'), //сжатие изображений
  pngquant = require('imagemin-pngquant'), //сжатие png
  cache = require('gulp-cache'); //кэширование изображений

//html
gulp.task('indexHtml', function () {
  return gulp.src('source/pages/index.html')
    .pipe(rigger())
    .pipe(gulp.dest('source'))
    .pipe(livereload({ start: true }));
});

gulp.task('innerHtml', function () {
  return gulp.src(['source/pages/*.html', '!source/pages/index.html'])
    .pipe(rigger())
    .pipe(gulp.dest('source/html'))
    .pipe(livereload({ start: true }));
});

gulp.task('html', gulp.series('indexHtml', 'innerHtml'));

//sass
gulp.task('sass', function() {
  return gulp.src('source/scss/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 4 versions'], cascade: false}))
  .pipe(sourcemaps.write())
  .pipe(rename("main.min.css")) 
  .pipe(gulp.dest('source/css'))
  .pipe(livereload({ start: true }));
});

//scripts
gulp.task('js', function() {
  return gulp.src([
    'source/libs/jquery/dist/jquery.min.js',
    'source/js/common.js'])
  .pipe(concat('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('source/js'));
});

//watch
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('source/pages/**/*.html', gulp.series('html'));
  gulp.watch('source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('source/js/common.js', gulp.series('js'));
});

//default
gulp.task('default', gulp.series('sass', 'js', 'html', 'watch'));

//clear cache
gulp.task('clear', function() {
  return cach.clearAll();
});

//minify img
gulp.task('img', function() {
  return gulp.src('source/image/**/*.*')
  .pipe(cache(imagemin({ 
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('web/img'));
});

//clean foulder web
gulp.task('clean', function() {
  return del([ 'web/*' ]);
});

//build
gulp.task('buildIndexHtml', function() {
  return gulp.src('source/*.html').pipe(gulp.dest('web'));
});

gulp.task('buildInnerHtml', function() {
  return gulp.src('source/html/**/*.html').pipe(gulp.dest('web/html'));
});

gulp.task('buildSass', function() {
  return gulp.src('source/css/main.min.css').pipe(gulp.dest('web/css'));
});

gulp.task('buildJs', function() {
  return gulp.src('source/js/scripts.min.js').pipe(gulp.dest('web/js'));
});

gulp.task('buildImage', function() {
  return gulp.src('source/image/*').pipe(gulp.dest('web/image'));
});

gulp.task('buildFonts', function() {
  return gulp.src('source/fonts/**/*.*').pipe(gulp.dest('web/fonts'));
});

gulp.task('buildOther', function() {
  return gulp.src(['source/ht.access']).pipe(gulp.dest('web'));
});

gulp.task('build', gulp.series('clean', 'img', gulp.parallel([
  'buildIndexHtml',
  'buildInnerHtml',
  'buildSass',
  'buildJs',
  'buildImage',
  'buildFonts',
  'buildOther'
  ])));
