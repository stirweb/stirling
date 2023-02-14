/**
 * TODO remove any unused gulp packages from package.json
 * 
 * moment - still in use?
 * waypoints - still in use?
 * 
 */

var gulp            = require('gulp');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var sass            = require('gulp-sass');
var concatCss       = require('gulp-concat-css');
var cleanCSS        = require('gulp-clean-css');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync').create();
var expect          = require('gulp-expect-file');
var minimist        = require('minimist');



gulp.task('sass-revamp', function () {
    return gulp.src('pages/_search-revamp-2021/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('pages/_search-revamp-2021'));
});

/**
 * Tasks to run after every event
 */
gulp.task('default', function() {
    gulp.watch(['pages/**/*.scss'], ['sass-revamp']);
});
