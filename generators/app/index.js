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

var generator;

module.exports = yeoman.Base.extend({

    /**
     * List functions as methods here to be run by the generator.  They are run in sequence but there are names that will
     * ensure priority running.  See http://yeoman.io/authoring/running-context.html
     *
     * But for reference here is the order the functions will run below

     * initializing - Your initialization methods (checking current project state, getting configs, etc)
     *     1. prompting - Where you prompt users for options (where you'd call generator.prompt())
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

        // this just makes it less ambiguous.
        generator = this;

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
        generator.argument('appname', { type: String, required: false });




        // if there's an argument passed, install into that directory, which would be a sub directory?
        // otherwise it'll just install here
        if ( generator.appname ) {
            generator.destinationRoot(generator.appname);
        }

        // but let people know the full path - they can then abort if it's not right:
        console.log( chalk.blue( "------------") );
        console.log("Installing into " + chalk.blue( generator.destinationRoot() ));
        console.log( chalk.blue( "------------") );

        // save a yeoman config file - this allows users to run yo in sub directories
        generator.config.save();

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


        // generator.registerTransformStream(


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
        var done = generator.async();

        // Have Yeoman greet the user.
        generator.log(yosay(
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
                message: 'Which Craft Plugins would you like to add?',
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
                message: 'Force overwrite custom craft files? (speeds things up but may delete something you wanted to keep)',
                default: true

            },

            {
                type: 'input',
                name: 'productionServer',
                message: 'What will be the production server name? No www and no http',
                default: 'mysite.com'
            },


            {
                type: 'input',
                name: 'stagingServer',
                message: '...and your staging server?',
                default: function( response ) {
                    return 'staging.' + response.productionServer;
                }
            },

            {
                type: 'input',
                name: 'devServer',
                message: 'Development Server?',
                default: function( response ) {
                    // here you could strip out .com / .co.uk / .org etc etc
                    // var url = response.productionServer.replace( /\.(com|org|co\..)/, '' );
                    return response.productionServer + '.craft.dev';
                }
            },


            {
                type: 'input',
                name: 'localdatabase',
                message: 'What is your local database name?',
                default: function( response ) {
                    return response.productionServer;
                }
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



            // // Destination for Assets
            // {
            //     type: 'input',
            //     name: 'assets',
            //     message: 'Where will your assets live? Default assets - inside the public folder chosen above',
            //     default: 'assets'
            // }

        ];

        // set the defaults to whatever is saved
        var configDefaults = generator.config.getAll();

        // based on saved data, we could even skip some prompts...
        prompts.forEach( prompt => {
            if (configDefaults.hasOwnProperty( prompt.name )) {
                prompt.default = configDefaults[ prompt.name ];
            }
        });


        generator.prompt(prompts, function (props) {

            generator.props = props;

            // set a default here
            generator.props.assets = 'assets';

            // To access props later use generator.props.someOption;

            if ( !generator.props.craftLicense ) {
                console.log( chalk.red( "NOT INSTALLING CRAFT - You have to agree to the license to download Craft!") );
            }

            // set some craft vars for use in templates
            generator.craftvars = {
                localdatabase: generator.props.localdatabase,
                public_folder: generator.props.public_folder,
                stagingServer: generator.props.stagingServer,
                production_server: generator.props.productionServer,
                devServer: generator.props.devServer
            };



            // save each property into the config
            for (var prop in generator.props) {
                var obj = {};
                obj[prop] = generator.props[prop];
                generator.config.set(obj);
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

        // Note `generator.fs` is
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
            assets: oneutils.stripTrailingSlash( generator.props.assets ),
            bower: generator.props.bower,
            proxy: generator.props.devServer,
            public_folder: generator.props.public_folder
        };

        // gulpfile
        generator.fs.copyTpl( generator.templatePath('_gulpfile.js'), generator.destinationPath('gulpfile.js'), gulpOptions );

        // Package JSON
        generator.fs.copyTpl( generator.templatePath('_package.json'), generator.destinationPath('package.json'), gulpOptions );

        // gitignore
        generator.fs.copyTpl( generator.templatePath('_gitignore'), generator.destinationPath('.gitignore'), gulpOptions );

        // Bower
        generator.fs.copyTpl( generator.templatePath('_bower.json'), generator.destinationPath('bower.json'), gulpOptions );


        /**
         * ---------------
         * Copying Folders
         * ---------------
         */

        // would be probably better to just have one array, and loop through checking if it's empty or not






        var folders = [
            'src/templates',
            'src/scss',
            'src/js'
        ];


        // Note that craft was installed in an earlier step.  This is going to
        folders.forEach( folder =>  {


            generator.fs.copyTpl(
                generator.templatePath( folder + '/**/*'),
                generator.destinationPath( folder + '/'),
                generator.craftvars

            );

        } );


        /**
         * Empty folders
         */

        // this uses `mkdir -p` where it'll make parent directories.
        // We can make empty directories with code here, without them having to exist in the generator itself.
        var emptyFolders = [
            'src/img',
            'src/partials',
            generator.props.public_folder + '/uploads'
        ];

        console.log('Making empty folders...');
        emptyFolders.forEach( folder => {
            console.log(chalk.green('     ' + folder ) );
            mkdirp( generator.destinationPath( folder ), function(err) {
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
            generator.installDependencies({
                callback: () => {
                    generator.spawnCommand('gulp');
                }
            });
        }

        ,installCraft: function() {

            if (!generator.props.craftLicense) {
                return;
            }

            console.log( "installing craft");

            generator.extract(
                'http://buildwithcraft.com/latest.zip?accept_license=yes',
                generator.destinationPath('./'),
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
                    generator.conflicter.force = generator.props.craftForce;



                    /**
                     * ---------------
                     * Craft Directory
                     * ---------------
                     */

                    // At this point we copy everything from the templates/craft directory into the new
                    // craft directory, thus overwriting anything that the default craft installed.
                    // for example, a new db.php file.  we're running it through the templater, so we can
                    // add custom config
                    generator.fs.copyTpl(
                        generator.templatePath( 'craft' + '/**/*'),
                        generator.destinationPath( 'craft' + '/'),
                        generator.craftvars
                    );

                    // make a storage folder
                    mkdirp( generator.destinationPath('craft/storage'), permission);

                    // Empty Craft's default template directory - we're going to put in our own and run gulp later
                    // little bit extreme perhaps, but we don't want any default routes and templates confusing things.
                    generator.fs.delete(
                        generator.destinationPath('craft/templates' + '/**/*')
                    );


                    /**
                     * ---------------
                     * Public Directory
                     * ---------------
                     */

                    // At this point we should have 'public' sat in the destination folder which was extracted
                    // from the craft zip.  We need to fiddle with it first...
                    //
                    // This should all work considering apparently mem-fs is synchronous.

                    // for apache hosts, as craft has htaccess by default.  Change if the user asked for it.


                    // Now move public to whatever the user decided - hopefully this overwrites public_html and confirms the conflicts.
                    if ( generator.props.public_folder != 'public' ) {
                        generator.fs.move(
                            generator.destinationPath('public'),
                            generator.destinationPath( generator.props.public_folder ) );
                    }


                    // copy in our custom generator code into public
                    generator.fs.copyTpl(
                        generator.templatePath( 'public' + '/**/*'),
                        generator.destinationPath( generator.props.public_folder + '/'),
                        generator.craftvars
                    );

                    // rename htaccess if this was required
                    if ( generator.props.htaccess === '.htaccess') {
                        generator.fs.move( generator.destinationPath( generator.props.public_folder + "/htaccess"), generator.destinationPath( generator.props.public_folder + "/.htaccess" ) );
                    }

                }

            });
        }


        ,installPlugins: function() {

            if (!generator.props.craftLicense) {
                return;
            }

            console.log( "installing craft plugins");

            // moved this to a module as it was getting a bit too cumbersome down here.
            var pluginsDir = generator.destinationPath('craft/plugins/');
            var saveplugins = require('./saveplugins.js');
            saveplugins( pluginsDir, permission, generator.props.craftplugins );



        }
    }

    /**
     * 8. end
     */

    // ,end: function() { }

});
