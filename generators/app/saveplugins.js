var craftPlugins = require('./craftplugins.js'),
	download = require("download"),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	chalk = require('chalk');

/** our save function to export
 * @param pluginsDir The directory where all plugins should be saved to
 * @param permission The chmod to set file & folder permissions to
 * @param approved An object of plugins to download
 * @return Void
 */
var save = function( pluginsDir, permission, approved ) {

	// loop through every plugin set in craftPlugins
	craftPlugins.forEach( plugin => {

		// bool whether to download plugin
		var downloadYN = false;

		// debug mode, allow us to force this in.
		if (typeof approved === 'undefined') {
			downloadYN = true;
		} else {
		   downloadYN = (plugin.essential || approved.indexOf( plugin.name ) != -1);
		}

		if (downloadYN) {

			console.log( "Downloading " + chalk.green( plugin.name ) );
			console.log( "-----------------------------------------------" );

			// open up a new download stream...
			// strip of 1 is to always step into our extracted folder,
			// which at least in the case of github is 100% the case.
			// i.e. when you download a ZIP from github, the entire plugin
			// is contained within a folder named "pluginname-master".
			// We further make 2 other general assumptions about the folder structure:
			// 	1. Either the plugin contents exist at the root of the repo
			// 	2. Or the plugin contents exist one level into the repo, and
			// 	   that level directory is the correct name of the plugin folder for installation.
			new download({ mode: permission, extract: true, strip: 1 })
				.get( plugin.url )
				.run( function( err, files ) {

					console.log( "Extracting " + chalk.green( plugin.name ) + " & saving files to disk." );
					// console.log( plugin );
					console.log( "-----------------------------------------------" );

					if (err) {
						console.log(err);
						throw err;
					}

					files.forEach( file => {
							// @TODO: someone's going to complain if they run this on windows...

							// by default, include every file that we extract
							var saveFile = true;

							// if the srcFolder has been set, we should make sure the file is inside
							if ( plugin.srcFolder && typeof plugin.srcFolder === 'string') {

								// we have specified a specific folder, so check against this:
								var chunks = file.path.split( "/" );

								// check if the first directory matches our src target
								saveFile = (chunks[0] === plugin.srcFolder);
							}

							// if we have determined that the file is inside the folder we want, then copy it over
							if (saveFile) {

								// are we moving all of the files inside a named folder?
								if ( plugin.destFolder) {
									// specified a subfolder to put things in
									file.path = pluginsDir + plugin.destFolder + "/" + file.path;
								} else {
									file.path = pluginsDir + file.path;
								}

								// create our directory synchronously so that it
								// finishes before attempting to write file
								mkdirp.sync( file.dirname, { mode: permission } );

								if ( file.isBuffer() ) {
									// write file synchronously... jusr to be safe
									fs.writeFileSync( file.path, file.contents, { mode: permission }, function(err) {
										if (err) {
											console.log( err );
										}
									});
								}
							} else {
								console.log('Skipping file ' + file.path);
							}
					});

					console.log( "Extracted " + chalk.green( plugin.name ) );
					console.log( "-----------------------------------------------" );
				});
		} else {
			console.log( "Skipping " + chalk.green( plugin.name ) );
			console.log( "-----------------------------------------------" );
		}
	});
}

// run a debug by uncommenting the below and running this script directly
 // save( './plugin_test/', 0755, ['Preparse Field']);

module.exports = save;


