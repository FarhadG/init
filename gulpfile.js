/**
 * Module dependencies
 */

var gulp = require('gulp');
var log = require('gulp-util').log;
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('concat-stream');

/**
 * Configurations
 */

var config = {
  watch: './src/*',
  js: {
    src: './src/index.js',
    out: './build'
  },
  template: {
    pattern: '{{bookmarkletCode}}',
    src: './src/index.tpl',
    out: './landing'
  },
  babel: {
    presets: ['babili'],
    plugins: ['transform-function-to-arrow'],
    comments: false
  }
};

/**
 * Javascript task
 */

gulp.task('compile', function() {
  var compiled = gulp.src(config.js.src)
    .pipe(babel(config.babel));
  compiled
    .pipe(rename('bookmarklet.js'))
    .pipe(gulp.dest(config.js.out));
  compiled
    .pipe(concat(function(codeBuffer) {
      var code = codeBuffer[0].contents.toString();
      gulp.src(config.template.src)
        .pipe(replace(config.template.pattern, code))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(config.template.out));
    }));
});

/**
 * Watch task
 */

gulp.task('watch', function() {
  log('Watching files');
  gulp.watch(config.watch, ['compile']);
});

/**
 * Command line task commands
 */

gulp.task('build', ['compile']);
gulp.task('default', ['build', 'watch']);
