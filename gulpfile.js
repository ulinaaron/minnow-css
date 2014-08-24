/**
 * Setup
 * ========================
 */

    // Source
var dir_scss                    = 'src/scss/',
    dir_scss_vendor             = 'src/scss/vendor/',
    dir_css                     = 'src/css/',
    // Docs Setup
    dir_docs                    = 'docs/',
    dir_docs_src                = 'docs/src/',
    dir_docs_build              = 'docs/build/',
    // Docs Source
    dir_docs_src_assets         = 'docs/src/assets/',
    dir_docs_src_scss           = 'docs/src/assets/scss/',
    dir_docs_src_js             = 'docs/src/assets/js/',
    dir_docs_src_js_standalone  = 'docs/src/assets/js/standalone/',
    dir_docs_src_js_plug        = 'docs/src/assets/js/plugins/',
    dir_docs_src_img            = 'docs/src/assets/img/',
    // Docs Build
    dir_docs_build_css          = 'docs/build/assets/css/',
    dir_docs_build_js           = 'docs/build/assets/js/',
    dir_docs_build_img          = 'docs/build/assets/img/',
    // Misc
    dir_bower                   = 'src/bower_components/',
    dir_npm                     = 'node_modules/',
    js_final                    = 'main', // JS final name of all the combined JS files
    // Browser Sync Settings
    dev_port                    = '7280',
    dev_dir                     = dir_docs_build
;

/**
 * Initialize
 * ========================
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    deploy = require('gulp-gh-pages'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    build = '';

/**
 * Task: Source Styles
 * ========================
 * Compiles Sass (scss) for source
 */

gulp.task('src-styles', function () {
    return gulp.src([dir_scss + '**/*.scss', '!' + dir_scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
    .pipe(plugins.bless())
    .pipe(gulp.dest(dir_css))
    .pipe(reload({stream:true}))
    .pipe(plugins.minifyCss({
        keepSpecialComments: 1
    }))
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dir_css))
    .pipe(reload({stream:true}));
});

/**
 * Task: Doc Styles
 * ========================
 */

gulp.task('doc-styles', function () {
    return gulp.src([dir_docs_src_scss + '*.scss', '!' + dir_docs_src_scss + '_*.scss'])
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
    .pipe(plugins.bless())
    .pipe(gulp.dest(dir_docs_build_css))
    .pipe(reload({stream:true}))
    .pipe(plugins.minifyCss({
        keepSpecialComments: 1
    }))
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dir_docs_build_css))
    .pipe(reload({stream:true}));
});

/**
 * Task: Style Testing
 * ========================
 */

gulp.task('style-test', function() {
});

/**
 * Task: Doc Images
 * ========================
 */

gulp.task('doc-img', function () {
    return gulp.src(dir_docs_src_img + '**/*')
    .pipe(plugins.cache(plugins.imagemin({
        optimizationLevel: 7,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(dir_docs_build_img))
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
        gulp.src([dir_bower + 'normalize.css/normalize.css'])
        .pipe(plugins.rename('_base_normalize.scss'))
        .pipe(gulp.dest(dir_scss_vendor)) // Copies to src/scss

    );

});

/**
 * Task: NPM Components
 * ================{pretty: true}
 * This is a manual process for components that should be included.
 * This function is not included in the default Gulp process.
 * Run 'gulp npm-packages' to use.
 */

gulp.task('npm-packages', function () {

    return merge();
});

/**
 * Task: Jade
 * ========================
 * Compiles Jade to HTML
 */

gulp.task('jade', function() {
    gulp.src(dir_docs_src + '*.jade')
    .pipe(plugins.jade({
        pretty: true
    }))
    .on('error', console.log)
    .pipe(gulp.dest(dir_docs_build))
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
            baseDir: dev_dir
        },
        open: false,
        port: dev_port
    });

    gulp.watch(dir_scss + '**/*.scss', ['src-styles', 'doc-styles']);
    gulp.watch(dir_docs_src_scss + '**/*.scss', ['doc-styles']);
    gulp.watch([dir_docs_src_img + '**/*', dir_docs_build_img + '**/*'], ['doc-img']);
    gulp.watch(dir_docs_src + '**/*.jade', ['jade']);
});

/**
 * Task: Deploy
 * ========================
 * Deployes to Github Pages
 */

gulp.task('deploy', function() {
    gulp.src(dir_docs_build + '**/*')
    .pipe(deploy());
});

/**
 * Task: Default
 * ========================
 */

gulp.task('default', ['jade', 'src-styles', 'doc-styles', 'doc-img', 'clean', 'watch']);
