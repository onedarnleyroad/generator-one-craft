var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var gulpLoadPlugins = require('gulp-load-plugins');
var path = require('path');
// var bowerFiles = require('main-bower-files');
var $ = gulpLoadPlugins();

/**
 * -------------
 * CONFIGURATION
 * -------------
 */

<%# /* Set up configurations from the yeoman options */ %>
var assets = '<%= assets %>';
var publicFolder = '<%= publicFolder %>';
var proxy = '<%= proxy %>';
var publicAssets = publicFolder + '/' + assets;


/**
 * -------------
 * STYLES
 * -------------
 */

var cssDest = publicAssets + '/css';

// Build css files with source maps and without minification
gulp.task('styles', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe($.changed( cssDest ))
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error',$.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.mergeMediaQueries({
		  log: true
		}))
		//.pipe($.uglifycss())
		.pipe(gulp.dest(publicAssets + '/css'))
});



/**
 * -------------
 * IMAGES
 *
 * Run images through optimisation, and put them in the public folder.
 * -------------
 */

var imgDest = publicAssets + '/img';

gulp.task('images', function () {

	return gulp.src('src/img/**/*')
		// Only send through changed files, as this is a somewhat 'heavy' operation
		.pipe($.changed( imgDest ))
		// need to configure this to our tastes.
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest( imgDest ));
});


/**
 * -------------
 * SCRIPTS
 * -------------
 */

var jsDest = publicAssets + '/js';

// Simple task to copy js into the assets folder...
// At this point you can add various tasks, linting, whatever
gulp.task('scripts', function() {
	return gulp
		.src(['./src/js/**/*'])
        .pipe($.changed( jsDest ))
		.pipe( gulp.dest(publicAssets + '/js') )
});



/**
 * -------------
 * DEVELOPMENT
 * -------------
 */

// Serve watches for changes, builds, and reloads browser sync all in one.
gulp.task('serve', ['styles'], function() {

	// Watch for changes to src folders
	gulp.watch('./src/scss/**/*.scss', ['styles']);
	gulp.watch('./src/js/**/*.js', ['scripts'])

	// Launch browser sync
	browserSync({

			proxy: proxy,
			files: "**/*.css",

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


gulp.task('clean', function() {
    console.log("Cleaning!")
    return gulp.src(publicAssets + '/**/*', { read: false }) // much faster
     .pipe($.plumber())
    //.pipe(ignore('protected/**'))
    .pipe($.rimraf());

});

gulp.task('build', ['clean', 'default'], function() {

});

gulp.task('default', ['styles', 'vendor', 'scripts'], function() {
    console.log( "Built Everything");
});




/*========================================
=            Depracated Tasks            =
========================================*/

/**
 * -------------
 * STYLES
 * -------------
 */

// Build css files without source maps and with minification
// gulp.task('styles-production', function() {
// 	return gulp.src('./src/scss/**/*.scss')
// 		.pipe($.plumber())
// 		.pipe($.sass().on('error',$.sass.logError))
// 		.pipe($.autoprefixer())
// 		.pipe($.mergeMediaQueries({
// 		  log: true
// 		}))
// 		.pipe($.uglifycss())
// 		.pipe(gulp.dest(publicAssets + '/css'))
// });



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
 *
 * Also note that this is minimee flavoured, so we don't output <script> tags,
 * but just strings with commas to go in an array.
 *
 * Add script tags below if you want normal versions - but simply removing the transform
 * function will take away the ability to change the scripts path to the assets folder.
 * -------------
 */


// gulp.task('bower', function() {
//     return gulp
//         .src(bowerFiles())
//         // send to
//         .pipe(gulp.dest(publicAssets + '/js/bower'));
// });

// gulp.task('templates', function () {

//     // take anything from templates
//     return gulp
//         .src('./src/templates/**/*.*')

//         .pipe($.changed( './craft/templates' ))

//         .pipe( $.fileInclude({
//             prefix: '@@',
//             basepath: './src/partials/'
//         }))

//         .pipe($.inject(gulp.src(bowerFiles(), {read: false}), {
//             name: 'bower',
//             removeTags: true, // extremely important otherwise you'll kill the minimee array
//             transform: function( filepath ) {
//                 // Comma creep is okay, as we will have app scripts below!
//                 // but watch out for this...
//                 return "'/" + assets + "/js/bower/" + path.basename( filepath ) + "',";
//             }
//         }))

//         // send to
//         .pipe(gulp.dest('./craft/templates/_compiled'));
// });

