var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	path = require('path'),
	$ = gulpLoadPlugins();

/**
 * -------------
 * CONFIGURATION
 * -------------
 */

<%# /* Set up configurations from the yeoman options */ %>
var assets = '<%= assets %>',
	publicFolder = '<%= publicFolder %>',
	browserSyncProxy = '<%= proxy %>';

var stylesSrc    = './src/scss/**/*.scss',
	stylesDest   = publicFolder + '/' + assets + '/css',

	scriptsSrc   = './src/js/**/*.js',
	scriptsDest  = publicFolder + '/' + assets + '/js',

	imagesSrc    = './src/img/**/*.{jpg,gif,png,svg,ico}',
	imagesDest   = publicFolder + '/' + assets + '/img',

	vendorSrc    = './vendor/**/*.{css,js,gif,jpg,png,svg,otf,ttf,woff,woff2}',
	vendorDest   = publicFolder + '/' + assets + '/vendor';


/**
 * -------------
 * STYLES
 *
 * Build css files, and put them in the public folder.
 * -------------
 */

gulp.task('styles', function() {

	return gulp.src(stylesSrc)
		// Only send through changed files (speed)
		.pipe($.changed( stylesDest ))

		// handle errors without having entire task fail
		.pipe($.plumber())

		// sourcemaps
		.pipe($.sourcemaps.init())

		// post process sass
		.pipe($.sass().on('error', $.sass.logError))

		// postprocess vendor prefixes
		.pipe($.autoprefixer({
			browsers: [
				'last 2 versions',
				'ie 9'
			]
		}))

		// merge media queries
		.pipe($.mergeMediaQueries({
			log: true
		}))

		// save to public
		.pipe(gulp.dest(stylesDest))

		// minify
		.pipe($.uglifycss())

		// rename with *.min extension
		.pipe($.rename({
			extname: '.min.css'
		}))

		// save to public
		.pipe(gulp.dest(stylesDest))
});



/**
 * -------------
 * IMAGES
 *
 * Run images through optimisation, and put them in the public folder.
 * -------------
 */
gulp.task('images', function () {

	return gulp.src(imagesSrc)
		// Only send through changed files, as this is a somewhat 'heavy' operation
		.pipe($.changed(imagesDest))

		// need to configure this to our tastes.
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}]
		}))

		// save output to public
		.pipe(gulp.dest(imagesDest));
});


/**
 * -------------
 * SCRIPTS
 *
 * Build css files, and put them in the public folder.
 * -------------
 */
gulp.task('scripts', function() {
	return gulp.src(scriptsSrc)
        .pipe($.changed(scriptsDest))
		.pipe(gulp.dest(scriptsDest))
});


/**
 * -------------
 * VENDOR (and fonts!)
 * -------------
 */
// Simple task to copy our vendor packages into the assets folder...
// At this point you can add various tasks, linting, whatever
gulp.task('vendor', function() {
	return gulp.src(vendorSrc)
		.pipe($.changed(vendorDest))
		.pipe(gulp.dest(vendorDest));
});


/**
 * -------------
 * DEVELOPMENT
 * -------------
 */

// Serve watches for changes, builds, and reloads browser sync all in one.
gulp.task('serve', ['clean'], function() {

	$.watch(stylesSrc, function() {
		gulp.start('styles');
	});

	$.watch(vendorSrc, function() {
		gulp.start('vendor');
	});

	$.watch(scriptsSrc, function() {
		gulp.start('scripts');
	});

	$.watch(imagesSrc, function() {
		gulp.start('images');
	});

	// Launch browser sync
	browserSync({

			proxy: browserSyncProxy,
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
	return gulp.src(
		[
			stylesDest,
			scriptsDest,
			imagesDest,
			vendorDest
		],
		{
			read: false // much faster
		})
		.pipe($.plumber())
		//.pipe(ignore('protected/**'))
		.pipe($.rimraf())

});

gulp.task('build', ['clean'], function() {
	gulp.start('default');
});

gulp.task('default', ['styles', 'vendor', 'scripts', 'images'], function() {
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

