var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	path = require('path'),
	filesExist = require('files-exist'),
	requireNew = require('require-new'),
	$ = gulpLoadPlugins();

/**
 * -------------
 * CONFIGURATION
 * -------------
 */

<%# /* Set up configurations from the yeoman options */ %>
var assets = '<%= assets %>',
	publicFolder = '<%= publicFolder %>',
	browserSyncProxy = '<%= proxy %>',
    craftReadonly = './craft/templates/_readonly';

var stylesSrc    = './src/scss/**/*.scss',
	stylesDest   = publicFolder + '/' + assets + '/css',

    // save css to craft's read only templates folder.
    stylesCraftDest = craftReadonly + '/css',

	scriptsSrc   = './src/js/**/*.js',
	scriptsDest  = publicFolder + '/' + assets + '/js',

    svgSrc   = './src/svg/**/*.svg',
    svgDest  = craftReadonly + '/svg',
    svgAssetDest = publicFolder + '/' + assets + '/svg',

	imagesSrc    = './src/img/**/*.{jpg,gif,png,svg,ico}',
	imagesDest   = publicFolder + '/' + assets + '/img',

	vendorSrc    = './vendor/**/*.{css,js,gif,eot,jpg,png,svg,otf,ttf,woff,woff2}',
	vendorDest   = publicFolder + '/' + assets + '/vendor',

    readOnlyDest = craftReadonly + '/**/*.{css,js,html,map}';





/**
 * -------------
 * SCRIPTS
 *
 * Build css files, and put them in the public folder.
 * -------------
 */

// concat scripts, minify and add sourcemaps
var joinscripts = function (src, dest, target) {


    gulp.src( filesExist(src, { exceptionMessage: ' Files from scriptFiles are missing' }) )
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.concat( target ))
            .pipe($.rename( function(path) {
                path.extname = ".min.js";
            }))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('maps'))
            .pipe(gulp.dest( dest ));


    return gulp.src( filesExist(src, { exceptionMessage: ' Files from scriptFiles are missing' }) )
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.concat( target ))
            .pipe($.sourcemaps.write('maps'))
            .pipe(gulp.dest(dest));
};

// copy an array of scripts over to dest,
// do not do sourcemaps, but provide
// both a min and unminified version.
var movescripts = function (src, dest) {

	src.forEach(function( file ) {
		gulp.src(file)
			.pipe(gulp.dest(dest))
			.pipe($.uglify())
			.pipe($.rename( function(path) {
				path.extname = ".min.js";
			}))
			.pipe(gulp.dest(dest));
	});

};

// This bundles our scripts as per the scriptFiles array above.
// But it runs copyscripts which does a straight copy,
// so you have the option of either
gulp.task('scripts', function() {

	var getScriptFiles = requireNew("./scriptFiles");

	getScriptFiles( scriptsDest ).forEach(function( scripts ) {

		if (!scripts.target) {
			// do not concatenate
			movescripts( scripts.files, scripts.dest );
		} else {
			// concat
			joinscripts( scripts.files, scripts.dest, scripts.target );
		}
	});

});


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

        // write sourcemaps to a subfolder
        .pipe($.sourcemaps.write('maps'))

		// save to public
		.pipe(gulp.dest(stylesDest))

		// minify
		.pipe($.cleanCss({
				keepSpecialComments: 0
			}))

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
			// imagemin.mozjpeg({
			// 	progressive: true
			// }),
			// imagemin.svgo({
			// 	plugins: [{
			// 		removeViewBox: false
			// 	}]
			// })
		]))

		// save output to public
		.pipe(gulp.dest(imagesDest));
});



/**
 * -----------
 * SVG
 * -----------
 */

/**
 * SVG
 */
gulp.task('svg', function () {
  return gulp.src(svgSrc)
    .pipe($.svgSymbols({
        title: '%f icon'
    }))
    .pipe(gulp.dest(svgDest))
    // copy to assets to use as a sprite
    .pipe(gulp.dest(svgAssetDest));
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

	$.watch([scriptsSrc, './scriptFiles.js'], function() {
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
            svgDest,
            scriptsDest,
            imagesDest,
            vendorDest,
            readOnlyDest
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
gulp.task('default', ['styles', 'svg', 'vendor', 'scripts', 'images'], function() {
	console.log( "Built Everything");
});




