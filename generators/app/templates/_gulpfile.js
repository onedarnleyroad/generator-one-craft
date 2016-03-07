
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    wiredep = require('wiredep').stream;

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
 * Unlike the other tasks, this sends things to the craft templates folder.  We can use file include to
 * perform functions that twig can't, to keep things a little drier.  The only issue is, we have to
 * think about snippets living here and not touching them on templates.  So perhaps this isn't needed?
 *
 * Other than the optional bower step, which is helpful for copying assets over.
 * -------------
 */

gulp.task('templates', function () {

    // take anything from templates
    return gulp
        .src('./src/templates/*.html')
        .pipe( $.fileInclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))

    <%# /* ADD bower process only if we have asked for this in the generator */ %>
     // Automatically pop bower components into the HTML.
     // it might be better to just put a very specific file rather than to look through everything
     //
     // we need a process to copy the files to the assets folder, and perhaps bundle them.  useref can handle this quite quickly though.
    <% if (bower) { %>
        .pipe(wiredep())
    <% } %>

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


    <% if (bower) { %>
    // watch our bower.json - if someone installs and saves a package, we can load in that script into any snippets that might be calling them.
    gulp.watch('./bower.json', ['templates']);
    <% } %>

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
}
