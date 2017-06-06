/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
  public: './public/',
  sass: './src/styles/',
  css: './public/styles/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
  return gulp.src(['./src/*.pug'])
    .pipe(pug({pretty: true}))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});

/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 * expanded = 一般，每行CSS皆會斷行
 * nested = 有縮進，較好閱讀
 * compact = 簡潔格式，匯出來的ＣＳＳ檔案大小比上面兩個還小。
 * compressed = 壓縮過的CSS，所有設定都以一行來進行排列。
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.sass')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'nested'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/** 
* copy js to public 
*/

gulp.task('copy-js', function(){
     gulp.src(['src/js/*'])
    .pipe(gulp.dest('public/js'));
});

gulp.task('copy-img', function(){
     gulp.src(['src/images/*'])
    .pipe(gulp.dest('public/images'));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.sass', ['sass']);
  gulp.watch('./src/js/*', ['copy-js']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug', 'copy-js','copy-img']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch','copy-js','copy-img']);
