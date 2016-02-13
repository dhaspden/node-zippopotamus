'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => {
  return gulp.src([
      'index.js',
      '**/*.js',
      '!**/*.spec.js',
      '!coverage/**/*',
      '!node_modules/**/*',
      '!dist/**/*',
      '!gulpfile.js'
    ])
    .pipe(babel({
      presets: ['stage-0', 'es2015']
    }))
    .pipe(gulp.dest('dist'));
});