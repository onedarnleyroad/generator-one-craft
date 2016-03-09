var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Download = require("download");


// permissions for craft files
var permission = "0774";


// include our own utilities
var oneutils = require('./utils.js');

// load plugin data
var craftplugins = require('./craftplugins.js');

// oneutils.stripTrailingSlash(str) // returns a string without a trailing slash

module.exports = yeoman.Base.extend({

    /**
     * List functions as methods here to be run by the generator.  They are run in sequence but there are names that will
     * ensure priority running.  See http://yeoman.io/authoring/running-context.html
     *
     * But for reference here is the order the functions will run below

     * initializing - Your initialization methods (checking current project state, getting configs, etc)
     *     1. prompting - Where you prompt users for options (where you'd call this.prompt())
     *     2. configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     *     3. default - If the method name doesn't match a priority, it will be pushed to this group.
     *     4. writing - Where you write the generator specific files (routes, controllers, etc)
     *     5. conflicts - Where conflicts are handled (used internally)
     *     6. install - Where installation are run (npm, bower)
     *     7. end - Called last, cleanup, say good bye, etc
     *
     */

    // 0. Constructor function.
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.Base.apply(this, arguments);

        // Next, add your custom code



    }


    /**
     * 1. Initialization
     */

    ,initializing: function() {

        /**
         * ARGUMENTS ON THE COMMAND LINE
         *
         * when running `yo name arg1 arg2` these can be accessed and set here
         */

        // This makes `appname` an argument.
        // But how to do multiple args?
        this.argument('appname', { type: String, required: false });




        // if there's an argument passed, install into that directory, which would be a sub directory?
        // otherwise it'll just install here
        if ( this.appname ) {
            this.destinationRoot(this.appname);
        }

        // but let people know the full path - they can then abort if it's not right:
        console.log( chalk.blue( "------------") );
        console.log("Installing into " + chalk.blue( this.destinationRoot() ));
        console.log( chalk.blue( "------------") );

        // save a yeoman config file - this allows users to run yo in sub directories
        this.config.save();

        // register transform streams.  ALL files are passed through this, but we can filter with gulp-if
        // run things through streams, Gulpstylee
        //
        // remember to match the if pattern up here, with whatever you're doing with the writing of files below.


        // var beautify = require('gulp-beautify');
        // var gulpIf = require('gulp-if');


        // // optionally pass a function to gulpIf instead of a glob matching pattern
        // var fileCheck = function(file){
        //     // do something with file
        //     return true;
        // };


        // this.registerTransformStream(


        //     gulpIf(
        //         "beautified.js", // if matches this pattern then...
        //         beautify({indentSize: 2 }) // do this
        //     )
        // );

        // basically we can use any gulp plugin if we want...
    }

    /**
     * 2. PROMPTING - or LETTING THE USER CUSTOMISE THE INSTALLATION
     *
     * Before anything is run, the generator will ask the user questions
     *
     * We can then set variables for later use, such as changing files when copying them over,
     * or choosing which packages to install or whatever we like.
     *
     */
    ,prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the One Darnley Road\'s Craft CMS generator!'
        ));

        // Create an array of options - this is where the installer configures the output
        // eg project name, database options, and so on
        // http://yeoman.io/authoring/user-interactions.html
        // Prompts come from Inquirer:
        // https://github.com/SBoudrias/Inquirer.js

        // setup a list for our craft plugins
        var plugin_options = [];
        craftplugins.forEach( plugin => {

            // plugin.checked = plugin.checked || false; // not undefined?
            if (!plugin.essential) {
                plugin_options.push( {
                    name: plugin.name,
                    checked: plugin.checked
                    } );
            }

        });

        // handle defaults





        var prompts = [

            {
              type: 'confirm',
              name: 'craftLicense',
              message: 'I agree to the terms and conditions. http://buildwithcraft.com/license',
              default: true // change to false!
            },

            {
                // only ask when license was yes
                when: function(response) {
                    return response.craftLicense;
                },
                type: 'checkbox',
                name: 'craftplugins',
                message: 'Which Craft Plugins would you like to install',
                choices: plugin_options

            },

            // installing custom craft
             {
                // only ask when license was yes
                when: function(response) {
                    return response.craftLicense;
                },
                type: 'confirm',
                name: 'craftForce',
                message: 'Force overwrite custom craft files? config/db.php etc',
                default: true

            },


            {
                type: 'input',
                name: 'localdatabase',
                message: 'What is your local database name?  You will still have a chance to change this as it will just set up local/config/db.php',
                default: ''
            },



            // Server Config
            // Public Folder
            {
                type: 'input',
                name: 'public_folder',
                message: 'What is your servers public folder eg public or public_html or htdocs or www',
                default: 'public'
            },

            // .htaccess or htaccess
            {
                type: 'list', // input, confirm, list, rawlist, password
                name: 'htaccess',
                message: 'htaccess file: .htaccess or htaccess?',
                choices: ['.htaccess','htaccess'],
                default: 0
            },

            // Proxy
            {
                type: 'input',
                name: 'proxy',
                message: 'What will you call your dev server? eg 1dr.dev',
                default: 'local.dev'
            }

            // // Destination for Assets
            // {
            //     type: 'input',
            //     name: 'assets',
            //     message: 'Where will your assets live? Default assets - inside the public folder chosen above',
            //     default: 'assets'
            // }

        ];

        // set the defaults to whatever is saved
        var configDefaults = this.config.getAll();

        // based on saved data, we could even skip some prompts...
        prompts.forEach( prompt => {
            if (configDefaults.hasOwnProperty( prompt.name )) {
                prompt.default = configDefaults[ prompt.name ];
            }
        });


        this.prompt(prompts, function (props) {

            this.props = props;

            // set a default here
            this.props.assets = 'assets';

            // To access props later use this.props.someOption;

            if ( !this.props.craftLicense ) {
                console.log( chalk.red( "NOT INSTALLING CRAFT - You have to agree to the license to download Craft!") );
            }

            // set some craft vars for use in templates
            this.craftvars = {
                localdatabase: this.props.localdatabase
            };

            // save each property into the config
            for (var prop in this.props) {
                var obj = {};
                obj[prop] = this.props[prop];
                this.config.set(obj);
            }

            done();






        }.bind(this));
    }

    /**
     * 3. Configuring
     */

    // ,configuring: function() {}



    /**
     * 4. ADD YOUR DEFAULT / CUSTOM METHODS HERE
     */





    /**
     * 5. WRITING
     */
    ,writing: function () {

        console.log( chalk.grey( "Installing files" ) );

        // Note `this.fs` is
        // https://github.com/sboudrias/mem-fs-editor
        // and not the native node fs = require('fs') module.
        //
        // Files run through templates:
        // see http://ejs.co/
        // but basically <%= username %> corresponds to the property below.
        // we can also have nested properties eg user.name and so on.
        //
        // The nice advantage with <%= %> as a syntax is it doesn't clash with twig or any other templating we're using
        // in our actual projects so far.

        // set some options for the templates to use.
        var gulpOptions = {
            assets: this.props.public_folder + "/" + oneutils.stripTrailingSlash( this.props.assets ),
            bower: this.props.bower,
            proxy: this.props.proxy,
            publicFolder: this.props.public_folder
        };

        // gulpfile
        this.fs.copyTpl( this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'), gulpOptions );

        // Package JSON
        this.fs.copyTpl( this.templatePath('_package.json'), this.destinationPath('package.json'), gulpOptions );

        // gitignore
        this.fs.copyTpl( this.templatePath('_gitignore'), this.destinationPath('.gitignore'), gulpOptions );

        // Bower
        this.fs.copyTpl( this.templatePath('_bower.json'), this.destinationPath('bower.json'), gulpOptions );


        /**
         * ---------------
         * Copying Folders
         * ---------------
         */


        /**
         * Folders with things in....do not touch /craft though! That's handled on craft installation.
         */
        // public - copy to whatever they named their public directory as
        this.fs.copyTpl(
                this.templatePath( 'public' + '/**/*'),
                this.destinationPath( this.props.public_folder + '/')
            );



        var folders = ['src/templates', 'src/scss'];


        // Note that craft was installed in an earlier step.  This is going to
        folders.forEach( folder =>  {


            this.fs.copyTpl(
                this.templatePath( folder + '/**/*'),
                this.destinationPath( folder + '/'),
                this.craftvars

            );

        } );


        /**
         * Empty folders
         */

        // this uses `mkdir -p` where it'll make parent directories.
        // We can make empty directories with code here, without them having to exist in the generator itself.
        var emptyFolders = [
            'src/img',
            'src/js',
            'src/partials',
            public_folder + '/uploads'
        ];

        console.log('Making empty folders...');
        emptyFolders.forEach( folder => {
            console.log(chalk.green('     ' + folder ) );
            mkdirp( this.destinationPath( folder ), function(err) {
                if (err) { console.log( chalk.red(err) ); }
            });
        });

    }


    /**
     * 7. Install
     */
    // finally run npm install and bower install, if the user said they want the bower packages
    // in the case of this stuff bower and npm are probably not optional, as the package will define
    // how we build and develop a new project so unless we're also going to ask about what dependencies they want...
    //
    // We're also throwing Craft in here, because we need the above stuff to happen first (because of our slightly unorthodox
    // approach of using force to overwrite default craft files).  It's not perfect, as the download of Craft then happens a lot
    // later and not parallel to other actions, but it's 'safer' this way.
    ,install: {
        npm: function () {

            // install dependencies and then run gulp - this will do a first build so that Craft has assets and templates where they should be.
            this.installDependencies({
                callback: () => {
                    this.spawnCommand('gulp');
                }
            });
        }

        ,installCraft: function() {

            if (!this.props.craftLicense) {
                return;
            }

            console.log( "installing craft");

            this.extract(
                'http://buildwithcraft.com/latest.zip?accept_license=yes',
                this.destinationPath('./'),
                {mode:permission}, // this is important - without it we seem to end up with files that are 0000
                err => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('-----------------------------');
                    console.log(chalk.green("Craft download completed!"));
                    console.log('-----------------------------');

                    // now run specific overrides

                    // add force when editing files below?  This would have been set in the prompter
                    // and really it just saves people having to keep typing Y for every file.
                    //
                    // However if they type no it at least allows them to run the scaffolder again without overwriting new things.
                    this.conflicter.force = this.props.craftForce;

                    // At this point we copy everything from the templates/craft directory into the new
                    // craft directory, thus overwriting anything that the default craft installed.
                    // for example, a new db.php file.  we're running it through the templater, so we can
                    // add custom config
                    this.fs.copyTpl(
                        this.templatePath( 'craft' + '/**/*'),
                        this.destinationPath( 'craft' + '/'),
                        this.craftvars
                    );

                    // Empty Craft's default template directory - we're going to put in our own and run gulp later
                    // little bit extreme perhaps, but we don't want any default routes and templates confusing things.
                    this.fs.delete(
                        this.destinationPath('craft/templates' + '/**/*')
                    );

                    // for apache hosts, as craft has htaccess by default.
                    if ( this.props.htaccess === '.htaccess') {
                        this.fs.move( this.destinationPath( this.props.public_folder + "/htaccess"), this.destinationPath( this.props.public_folder + "/.htaccess") );
                    }

                    // make a storage folder
                    mkdirp( this.destinationPath('craft/storage'), permission);

                }

            });
        }


        ,installPlugins: function() {

            if (!this.props.craftLicense) {
                return;
            }

            console.log( "installing craft plugins");





            var pluginsDir = this.destinationPath('craft/plugins/');

            craftplugins.forEach( plugin => {

                if (plugin.essential || this.props.craftplugins.indexOf( plugin.name ) != -1) {

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



                                            if (typeof folderTest === "string") {



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

                                    console.log( "Saved " + chalk.green( plugin.name ) );
                                });


                }


});



        }
    }

    /**
     * 8. end
     */

    // ,end: function() { }

});
