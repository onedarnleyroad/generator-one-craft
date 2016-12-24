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
		.pipe($.imagemin([
			imagemin.mozjpeg({
				progressive: true
			}),
			imagemin.svgo({
				plugins: [{
					removeViewBox: false
				}]
			})
		]))

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
gulp.task('serve', function() {

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


// Clean wipes all assets areas which we build to
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

// Build does a clean + default task run
gulp.task('build', ['clean'], function() {
	gulp.start('default');
});

// Our default task calls each of our main tasks in parallel
gulp.task('default', ['styles', 'vendor', 'scripts', 'images'], function() {
	console.log( "Built Everything");
});
