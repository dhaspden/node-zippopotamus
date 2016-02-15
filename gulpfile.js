'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => {
  gulp.src(['lib/wrapper/data/countries.json'])
    .pipe(gulp.dest('dist/lib/wrapper/data'));

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
      plugins: ['transform-runtime'],
      presets: ['stage-0', 'es2015']
    }))
    .pipe(gulp.dest('dist'));
});