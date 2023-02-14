var gulp = require('gulp');
var sass = require('gulp-sass');

// Task for compiling sass. Run with 'gulp sass'
gulp.task('sass', function () {

    gulp.src('scss/slidemenu.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('default', function() {
    gulp.watch(['scss/**/*.scss'], ['sass']);
});
