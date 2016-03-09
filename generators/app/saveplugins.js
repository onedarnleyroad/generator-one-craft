// don't commit, just for etesting

var craftplugins = require('./craftplugins.js');
var Download = require("download");
var gulp = require('gulp');
var vfs = require('vinyl-fs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var chalk = require('chalk');



var save = function( pluginsDir, permission, approved ) {


    craftplugins.forEach( plugin => {

        var true_false;

        // debug mode, allow us to force this in.
        if (typeof approved === 'undefined') {
            true_false = true;
        } else {
           true_false = (plugin.essential || approved.indexOf( plugin.name ) != -1);
        }



        if (true_false) {

            plugin.strip = plugin.strip || 1;
            var p = new Download({ mode: permission, extract: true, strip: plugin.strip })
                        .get( plugin.url )
                        .run( function( err, files ) {



                            if (err) throw err;

                            files.forEach( file => {
                                    // someone's going to complain if they run this on windows...



                                    if ( plugin.srcfolder && typeof plugin.srcfolder === 'string') {
                                        // we have specified a specific folder, so check against this:
                                        var chunks = file.path.split( "/" );

                                        // only pass if the first directory matches our src target
                                        var folderTest = (chunks[0] === plugin.srcfolder);
                                        // set the path


                                    } else if (!plugin.srcfolder) {
                                        var folderTest = true;
                                    }


                                    if ( plugin.destfolder) {
                                        // specified a subfolder to put things in
                                        file.path = pluginsDir + plugin.destfolder + "/" + file.path;
                                    } else {
                                        file.path = pluginsDir + file.path;
                                    }



                                    if (folderTest) {


                                        mkdirp( file.dirname, { mode: permission } );

                                        if ( file.isBuffer() ) {
                                            fs.writeFile( file.path, file.contents, { mode: permission }, function(err) {
                                                if (err) {
                                                    //console.log( file.path + " buffer errr" );
                                                } else {

                                                }
                                            });
                                        }

                                    }
                            });

                            console.log( "Downloaded " + chalk.green( plugin.name ) );
                            console.log( "-----------------------------------------------" );
                        });


        }
    });
}

// run a debug by uncommenting the below and running this script directly
 // save( './plugin_test/', 0755, ['Preparse Field']);

module.exports = save;


