
var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var gulpLoadPlugins = require('gulp-load-plugins');
var path = require('path');
var bowerFiles = require('main-bower-files'),
var $ = gulpLoadPlugins();

/**
 * -------------
 * CONFIGURATION
 * -------------
 */

<%# /* Set up configurations from the yeoman options */ %>
var assets = '<%= assets %>';
var proxy = '<%= proxy %>';




/**
 * -------------
 * STYLES
 * -------------
 */

// Build css files with source maps and without minification
gulp.task('styles', function() {
    return gulp.src('./src/scss/main.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error',$.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.mergeMediaQueries({
          log: true
        }))
        //.pipe($.uglifycss())
        .pipe(gulp.dest(assets + '/css'))
});


// Build css files without source maps and with minification
gulp.task('styles-production', function() {
    return gulp.src('./src/scss/main.scss')
        .pipe($.plumber())
        .pipe($.sass().on('error',$.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.mergeMediaQueries({
          log: true
        }))
        .pipe($.uglifycss())
        .pipe(gulp.dest(assets + '/css'))
});


/**
 * -------------
 * IMAGES
 *
 * Run images through optimisation, and put them in the public folder.
 * -------------
 */

gulp.task('images', function () {

    var imgDest = assets + '/img';
    return gulp.src('src/img/**/*')

        // Only send through changed files, as this is a somewhat 'heavy' operation
        .pipe($.changed( imgDest ))
        // need to configure this to our tastes.
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest( imgDest ));
});


/**
 * -------------
 * TEMPLATES
 *
 * Send all src/templates to the craft/templates folder and
 *
 * Run gulp-file-include including snippets as we like
 * Inject Bower scripts into the appropriate snippets,
 * basically, anywhere you've written this:

    <!-- bower:js -->
    <!-- endinject -->

 *
 * The 'bower' task, called before 'templates', will look through the bower
 * json and copy all the appropriate scripts into our assets folder, in a subfolder
 * called 'bower' for reference.
 *
 * The two tasks work together because the path name is transformed when injected
 * so if you change the path of one, make sure you change the other.
 * -------------
 */

gulp.task('bower', function() {
    return gulp
        .src(bowerFiles())
        // send to
        .pipe(gulp.dest(assets + '/js/bower'));
})

gulp.task('templates', ['bower'], function () {

    // take anything from templates
    return gulp
        .src('./src/templates/**/*.html')
        .pipe( $.fileInclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))

        .pipe($.inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            transform: function( filepath ) {

                return '<script src="/assets/js/bower/' + path.basename( filepath ) + '"></script>';
            }
        }))

        // send to
        .pipe(gulp.dest('./craft/templates'));
});




/**
 * -------------
 * DEVELOPMENT
 * -------------
 */

// Serve watches for changes, builds, and reloads browser sync all in one.
gulp.task('serve', ['styles'], function() {

    // Watch for changes to SCSS folder
    gulp.watch('./src/scss/**/*.scss', ['styles']);

    // Run templates task if any templates or partials are updated.
    gulp.watch('./src/partials/**/*.html', ['templates']);
    gulp.watch('./src/templates/**/*.html', ['templates']);



    // watch our bower.json - if someone installs and saves a package, we can load in that script into any snippets that might be calling them.
    gulp.watch('./bower.json', ['templates']);


    // Launch browser sync
    browserSync({
            server: {
                proxy: proxy,
                routes: {
                    "/bower_components": "./bower_components"
                }
            },
            files: "./cordova/www/**/*.css",

            ghostMode: {
                scroll: false,
                clicks: false
            },

            // don't notify - it lingers too long and gets in the way of the design!
            notify: false,

            // don't automatically open a browser - usually I might start or stop gulp, so I don't want to have to keep opening and closing tabs.
            open: false
    });
});


gulp.task('default', ['styles', 'templates'], function() {
    console.log( "copying styles and templates");
});
