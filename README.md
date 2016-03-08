# Craft CMS Generator  

Scaffold a new Craft CMS project, the One Darnley Road way.

## Installing the Generator

While this is in development and not published on NPM, we need to take a few steps to get this repo working as a yeoman generator.  When this is done, you are able to continue to make changes to the generator itself and have those instantly updated the next time you run the generator.

**Please note that the folder that the repo lives in needs to be prefixed with `generator`.**  Eg: `generator-one-craft` - where `one-craft` is the name of the generator,  and thus you would run `yo one-craft` to run the app.  See http://yeoman.io/authoring/ for more details.

```
$ git clone https://github.com/onedarnleyroad/generator-one-craft.git
$ npm install
```
We need to link this as a global npm module so that yeoman can find it, and make sure yeoman is globally installed:

```
$ npm link
$ npm install -g yeoman # if not previously done
```
Now, it's installed on your system, and accessible from Yeoman.  Effectively modifying this repo, doing a git pull updates the generator, so be wary if someone has updated the repo, they've updated the generator.  After `npm link` has done its thing you can run the generator:

```
$ yo one-craft
```

## Folder Structure

These folders are generated from the `app/templates` directory but there may be some moving around on the Yeoman scaffolding process.  So below is what you'll end up with:

```
├── craft                       # Craft CMS app - including templates.
├── public                      # Document root directory, used by craft.  Compiled assets end up here
├── src                         # Front end source files mostly
|   ├── scss                    
|   ├── js
|   ├── img                     # see gulpfile - we put in images here and they get compressed into public
|   └── templates               # this is for any twig template snippets you wish to transform before sending to craft
|   
├── README.md
├── .gitignore       
├── package.json
├── bower.json                  
├── gulpfile.js
└── ???
```     

## Gulpfile and Gulp Plugins

The generator copies over a gulpfile with a few tasks ready made.  It can be configured how you like after the scaffold but out of the box you get...

*** work in progress ***

### CSS

```
$ gulp styles
$ gulp styles-production
```
Pretty straightforward, this is your SASS compiler.  The latter simply omits sourcemaps, and minifies.  Tweak the `serve` bit below if you prefer this - but something like `minimee` may do the compression for us.  Sourcemaps are useful for development, and probably a negligible bloat to the filesize of the compiled CSS.

### Images
```
$ gulp images
```
This is something for discussion - but simply images go in at `src/img` and come out at `public/assets/img` - on the way they are run through `gulp-imagemin` (yet to be fully configured in the gulpfile).  This losslessly compresses them - it's good for stripping metadata.  As these assets generally come out of a PSD and PS isn't great and removing superfluous data, this should do enough work for us to get the files nice and small.  There's also `gulp-changed` to avoid doing this again and again - as it's probably quite a hefty gulp task.  Needs testing

### HTML / Twig
```
$ gulp templates
```

This is the task for handling template files.  Until this changes in a later commit, the idea is that you build ALL your Craft templates in `src/templates` and these get compiled into `craft/templates`.

As such, during development, do not edit anything in `craft/templates` as you may later overwrite files you added in the source folder.  

While developing in the source folder your templates will be run through three preprocessors:

#### Wiredep

Visit https://www.npmjs.com/package/wiredep for docs_

Quite simply, this is for handling your Bower installs.  This reads through your `bower.json` file to work out your chosen script dependencies, and then searches through your `src/templates` folder for HTML that has the appropriate snippet to inject script tags.  We use this in conjunction with `gulp-useref` (see below) to then compile these scripts into our assets folder.

It looks for something along these lines:

```
<html>
<head>
  <!-- bower:css -->
  <!-- endbower -->
</head>
<body>
  <!-- bower:js -->
  <!-- endbower -->
</body>
</html>
```

But feel free to look at `src/templates/_snippets/vendor.html` for our setup.

#### Useref

_Visit https://www.npmjs.com/package/gulp-useref for docs_

This is the next stage of the bower step above, but it can be used for other files and other scripts.  We're mostly just using it for Bower, as `Minimee` handles our scripts usually.

Consider the following example:

From `src/templates/_snippets/vendor.html`
```
<html>
<head>
    <!-- build:css assets/css/vendor.css -->
    <link href="css/one.css" rel="stylesheet">
    <link href="css/two.css" rel="stylesheet">
    <!-- endbuild -->
</head>
<body>
    <!-- build:js assets/js/vendor.js -->
    <!-- bower:js -->
    <script type="text/javascript" src="bower_components/vendor1/one.js"></script> 
    <script type="text/javascript" src="bower_components/vendor2/two.js"></script>
    <!-- endbower -->
    <script type="text/javascript" src="src/js/one.js"></script> 
    <script type="text/javascript" src="src/js/two.js"></script> 
    <!-- endbuild -->
</body>
</html>
```

Would be compiled (in our case) to `craft/templates/_snippets/vendor.html` like so:

```
<html>
<head>
    <link rel="stylesheet" href="assets/css/combined.css"/>
</head>
<body>
    <script src="assets/js/combined.js"></script> 
</body>
</html>
```

Your Craft templates can include the above in the normal way.  We aren't running a minification process here, because again `minimee` handles that - but we may want to use a linter with something like `gulp-if`.

#### Gulp File Include

_Visit https://www.npmjs.com/package/gulp-file-include for docs_

Lastly, for extra functionality we have access to `gulp-file-include` but this is entirely optional.  So as to avoid conflicts when compiling all included files from this step are in `src/partials` rather than within the `src/templates` folder.  

It's something that is entirely optional, and doesn't really add much to the compiling time, but can be used whenever you're having trouble using Twig to keep things DRY. 

When an HTML file in `src/templates` contains something like the following:
```
<h1>Cat Voices</h1>
@@include("file.html", {"catsays" : "meow"} )
```

It would look for `src/partials/file.html` which might look like this:

```
<strong>Our cat says @@catsays</strong>
```

It compiles into `craft/templates` to:

```
<h1>Cat Voices</h1>
<strong>Our cat says meow</strong>
```

For the most part Twig includes can handle this kind of behaviour and more dynamically, so we may find this feature is never used.  The data object is optional, eg `@@include("file.html")` but remember if the include file references variables it can't find, gulp will throw an error.  Includes can include files themselves too.


### While developing
```
$ gulp serve
```

The usual - watches for css files and runs browser sync.  When running the generator, it will ask you for the proxy server.  This is what browser sync looks for, but you can always edit the `gulpfile.js` if you put in something wrong.  

Bear in mind we may need to rethink how this works for local development and our `gulp templates` task above, as this method is going to compile vendor scripts without sourcemaps.  It might mean then, that it can be harder to debug but I've found that usually the errors are logged in my own code and not vendor code.  




## Optional Addons

1. Bower

Even if you include Bower in your project, you don't really have to even use it, as it'll just sort of sit there and isn't too intrusive.  Saying no to this option when generating will give you a slightly leaner Gulpfile.    


# To Do

## Database Automation

Could we run a bash script to set up the local database? Perhaps the generator could take a project name, thus naming the repo, and create a `.sh` file that sets up a MySQL database assuming normal commands.  It would also update the `local/config/db.php` (check filename) and rewrite it with supplied variables.   It would also be good to have a default SQL file to import, bootstrapping the usual credentials.  At the time of generation, we could supply an admin account, and possibly a client account login


## Notes on installation

### Craft Setup

// ETC

------------

# Notes

## Naming Convention

Our personal generators are of the format 

```
one-name
```

Where `name` is the name of the particular generator, which means that:

The repo folder names should always be called `generator-one-name` so that Yeoman can find it, and named appropriately so in the `package.json` file for the generator repo.  It also then means that you run

```
$ yo one-name
````

To scaffold whatever it is we're scaffolding.  It's a way of remembering which generators are One Darnley Road.

## Packages for the Generator itself

Just some notes for our node modules and tools to run the generator.  This is not necesarily anything to do with the project scaffolding itself.

### Chalk

https://www.npmjs.com/package/chalk
**Simply colours the console output - makes for easier reading of the terminal's output.**

https://www.npmjs.com/package/mkdirp
**So we can just build empty directories, as Yeoman isn't so great at 'copying' empty directories.**

--

