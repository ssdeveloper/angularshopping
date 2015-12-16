var gulp = require('gulp'), sass = require('gulp-sass');

gulp.task('buildcss', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'));
});