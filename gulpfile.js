var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css')
    rename = require('gulp-rename');

// Minify CSS with .min.css
gulp.task('minify-css', function() {
    gulp.src('./assets/css/*.css')
        .pipe(minifyCSS(opts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/css/min/'))
});

// Default Runner
gulp.task('default', ['minify-css'], function() {
    // watch for CSS changes
    gulp.watch('./assets/css/*.css', function() {
        gulp.run('minify-css');
    });
});