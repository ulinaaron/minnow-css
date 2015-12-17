/**
 *
 * Minnow CSS
 * 
 * Author: Aaron <ulinaaron@gmail.com>
 *
 * MIT License
 *
 */

/**
 * Initialize
 * ========================
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')({
    camelize: true
});
var config = require('./config.json');
var merge = require('merge-stream');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var build = '';
    
/**
 * Setup
 * ========================
 */

var docsSrcPath = config.docs.src.root;
var docsBuildPath = config.docs.build.root;

/**
 * Task: Source Styles
 * ========================
 * Compiles Sass (scss) for source
 */

gulp.task('src-styles', function () {
    return gulp.src([config.src.scss + '*.scss', '!' + config.src.scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions','> 1%','ie 8'))
    .pipe(gulp.dest(config.src.css))
    .pipe(reload({stream:true}))
    .pipe(plugins.csso())
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(config.src.css))
    .pipe(reload({stream:true}));
});

/**
 * Task: Doc Styles
 * ========================
 */

gulp.task('doc-styles', function () {
    return gulp.src([docsSrcPath + config.docs.src.scss + '*.scss', '!' + docsSrcPath + config.docs.src.scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer(config.autoprefixer.browsers))
    .pipe(gulp.dest(dir_docs_build_css))
    .pipe(reload({stream:true}))
    .pipe(plugins.csso({
        keepSpecialComments: 1
    }))
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dir_docs_build_css))
    .pipe(reload({stream:true}));
});

/**
 * Task: StyleStats
 * REQUIREMENT: StyleStats must be installed globally to use
 * "npm install -g stylestats"
 *
 * Usage: This will gulp-shell to run a command trigging stylestats.
 * ========================
 */

gulp.task('stylestats', function () {
  return gulp.src('')
    .pipe(plugins.shell(
      'stylestats "' + config.src.css + 'minnow.css" -t html > stylestats.html'
    ));
})

/**
 * Task: Doc Images
 * ========================
 */

gulp.task('doc-img', function () {
    return gulp.src(docsSrcPath + config.docs.src.img + '**/*')
    .pipe(plugins.cache(plugins.imagemin({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(docsBuildPath + config.docs.build.img))
    .pipe(reload({stream:true, once:true}));
});

/**
 * Task: Clean
 * ========================
 */

gulp.task('clean', function () {
    return gulp.src(build + '**/.DS_Store', {
        read: false
    })
    .pipe(plugins.rimraf());
});

/**
 * Task: Reload
 * ========================
 */

gulp.task('reload', function () {
    browserSync.reload();
});


/**
 * Task: Bower Packages
 * ================
 * This is a manual process for components that should be included.
 * However the advantage is Gulp will fetch the latest version on bower update.
 * This function is not included in the default Gulp process.
 * Run 'gulp bower' to use.
 */

gulp.task('bower-packages', function () {

    return merge(

        // Normalize
        gulp.src([config.bower + 'normalize.css/normalize.css'])
        .pipe(plugins.rename('_base_normalize.scss'))
        .pipe(gulp.dest(config.src.scssVendor)) // Copies to src/scss

    );

});

/**
 * Task: NPM Components
 * ================
 * This is a manual process for components that should be included.
 * This function is not included in the default Gulp process.
 * Run 'gulp npm-packages' to use.
 */

gulp.task('npm-packages', function () {

    return merge();
});

/**
 * Task: Compiles HTML
 * ========================
 * Compiles HTML files with includes
 */

gulp.task('html', function() {
    gulp.src([docsSrcPath + '**/*.html', '!' + docsSrcPath + '**/_*.html'])
    .pipe(plugins.fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(docsBuildPath))
    .pipe(reload({stream:true}));
});

/**
 * Task: Watch
 * ========================
 * Initiates BrowserSync and watches files for any tasks.
 */

gulp.task('watch', function() {

    browserSync.init({
        server: {
            baseDir: docsBuildPath
        },
        open: false,
        port: config.devPort
    });

    gulp.watch(config.scss + '**/*.scss', ['src-styles', 'doc-styles']);
    gulp.watch(docsSrcPath + config.docs.src.scss + '**/*.scss', ['doc-styles']);
    gulp.watch([docsSrcPath + config.docs.src.img + '**/*', docsSrcPath + config.docs.build.img + '**/*'], ['doc-img']);
    gulp.watch(docsSrcPath +  '**/*.html', ['html']);
});

/**
 * Task: Deploy
 * ========================
 * Deployes to Github Pages
 */

gulp.task('deploy', function() {
    gulp.src(docsBuildPath + '**/*')
    .pipe(plugins.ghPages());
});

/**
 * Task: Default
 * ========================
 */

gulp.task('default', ['html', 'src-styles', 'doc-styles', 'doc-img', 'clean', 'watch']);
