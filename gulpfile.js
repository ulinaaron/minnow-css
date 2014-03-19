var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

// Compiles Sass
gulp.task('styles', function() {
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./css'));
});

// Minify CSS
gulp.task('css', function() {
    gulp.src('./css/*.css')
        .pipe(minifyCSS(opts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'));
});

// Default Tasks

gulp.task('default', ['styles', 'css'], function() {
    // Default task code
});