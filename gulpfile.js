/**
 * Module dependencies
 */

var uglify = require('gulp-uglify');
var log = require('gulp-util').log;
var gulp = require('gulp');

/**
 * Configurations
 */

var config = {
  watch: './index.js',
  js: {
    src: './index.js',
    destination: './dest/'
  }
};

/**
 * Javascript task
 */

gulp.task('scripts', function() {
  gulp.src(config.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(config.js.destination));
});

/**
 * Watch task
 */

gulp.task('watch', function() {
  log('Watching files');
  gulp.watch(config.watch, ['build']);
});

/**
 * Command line task commands
 */

gulp.task('build', ['scripts']);
gulp.task('default', ['build', 'watch']);
