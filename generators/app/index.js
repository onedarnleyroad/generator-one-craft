var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

// include our own utilities
var oneutils = require('./utils.js');

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
        console.log("installing into " + chalk.blue( this.destinationRoot() ));
        console.log( chalk.blue( "------------") );

        // save a yeoman config file - this allows users to run yo in sub directories
        this.config.save();

        // register transform streams.  ALL files are passed through this, but we can filter with gulp-if
        // run things through streams, Gulpstylee
        //
        // remember to match the if pattern up here, with whatever you're doing with the writing of files below.
        var beautify = require('gulp-beautify');
        var gulpIf = require('gulp-if');


        // optionally pass a function to gulpIf instead of a glob matching pattern
        var fileCheck = function(file){
            // do something with file
            return true;
        };


        this.registerTransformStream(


            gulpIf(
                "beautified.js", // if matches this pattern then...
                beautify({indentSize: 2 }) // do this
            )
        );

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
            'Welcome to the cat\'s pajamas ' + chalk.red('') + ' generator!'
        ));

        // Create an array of options - this is where the installer configures the output
        // eg project name, database options, and so on
        // http://yeoman.io/authoring/user-interactions.html
        // Prompts come from Inquirer:
        // https://github.com/SBoudrias/Inquirer.js
        var prompts = [

            // Yes / no example
            {
                type: 'confirm', // input, confirm, list, rawlist, password
                name: 'bower',
                message: 'Using Bower?',
                default: true
            },

            // Craft Username
            {
                type: 'input',
                name: 'adminUsername',
                message: 'What should be the admin username for Craft?',
                default: 'webmaster'
            },

            // Proxy
            {
                type: 'input',
                name: 'proxy',
                message: 'What will you call your dev server? eg 1dr.dev',
                default: 'local.dev'
            },

            // Destination for Assets
            {
                type: 'input',
                name: 'assets',
                message: 'Where will your assets live? Default ./public/assets',
                default: './public/assets'
            }

        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;

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
     * 4.1 Write Optional (runs under default priority)
     *
     * Write all the files that were optionally added.  This could just be a function called within the
     * `writing` function but it probably doesn't matter a whole lot at this point.  We may want to
     * rethink this if we ever use this in conjunction with other generators.
     */
     ,writeOptional: function() {
        console.log( chalk.grey( "Installing optional stuff" ) );
        if (this.props.bower) {
            // copy the package.json so NPM can do something with it later
            this.fs.copy(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );
        }
    }

    /**
     * 5. WRITING
     */
    ,writing: function () {

        console.log( chalk.grey( "Installing dependencies" ) );

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

        // GULPFILE
        // send this to the gulpfile
        var gulpOptions = {
            assets: oneutils.stripTrailingSlash( this.props.assets ),
            bower: this.props.bower,
            proxy: this.props.proxy
        };

        this.fs.copyTpl( this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'), gulpOptions );


        // copying folders entirely
        // craft

        var folders = ['craft', 'public', 'src'];

        var self = this;
        folders.forEach( (folder) =>  {
            console.log( folder, this.templatePath( folder + '/**/*') );

            this.fs.copyTpl(
                this.templatePath( folder + '/**/*'),
                this.destinationPath( folder + '/')
            );

        } );









    }




    /**
     * 7. Install
     */
    // finally run npm install and bower install, if the user said they want the bower packages
    // in the case of this stuff bower and npm are probably not optional, as the package will define
    // how we build and develop a new project so unless we're also going to ask about what dependencies they want...
    ,install: function () {

        if (!this.props.runinstall) {
            return;
        }

        if (this.props.bower) {
            this.installDependencies();
        } else {
            this.npmInstall();
        }
    }

    /**
     * 8. end
     */

    // ,end: function() { }

});
