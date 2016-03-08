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

This will install into the present working directory.  If you want to install into a subfolder, then run 

```
$ yo one-craft myproject
```


## Folder Structure

These folders are generated from the `app/templates` directory but there may be some moving around on the Yeoman scaffolding process.  So below is what you'll end up with:

```
├── craft                       # Craft CMS app - including templates.
├── public                      # Document root directory, used by craft.  Compiled assets end up here
├── src                         # Front end source files mostly
|   ├── scss                    
|   ├── js
|   ├── partials                # for the templates folder using @@includes - see below.
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


## Craft CMS setup

### Local Config

After the latest version of Craft is downloaded and installed, we then overwrite a few configuration files for our way of development.  They'll still need some tweaking most probably:

`craft/config/db.php` is copied over from the `generators/app/templates/craft/generator` directory, with the `localdatabase` variable that Yeoman will have asked you for.  This is so you can set it up in your server configuration, we're using the MAMP Pro defaults for mysql being `localhost` with `root` as the username and password - but the database name is updated.  

It also adds some custom code to look for `craft/config/local/db.php` and use that in place of the existing file.  That way you can make custom modifications for you local environment - there is also a .gitignore in the local directory so that it stays local. 

### Plugins

We have added a list of our preferred plugins in `generators/app/craftplugins.js` which is called on in the generator and processed.  As plugin developers have their own ways of storing the plugin itself, we have to do a little bit of configuration to get the downloader to extract the right thing (and not a load of junk) to the right place.

As such you have to build an array of objects with the following options - but since this is in the generator, you're not really editing this unless you want to 
tweak the generator to your liking.  We can always modify this generator to accept some sort of config json?

**While the options have defaults, leave them unset at your peril!  The combination of things can create a bit of a mess potentially, so it's important to know what's being copied where, as we cannot always predict how someone sets their plugin repo**

#### plugin.name 
`_required_`
Type: `string`

The name of the plugin. Acts as the prompt choice, so make this readable, but also gets stored in the `.yo-rc.json` storage file (to remember a users' choices).  

#### plugin.url 
`_required_`
Type: `string`

Remote URL to a zipfile (this is important!) to be downloaded and extracted.  Usually a github master file, for example `https://github.com/johndwells/craft.minimee/archive/master.zip`

#### plugin.checked
Default: `false`
Type: `bool` 

Whether the option is checked by default for the user when running the generator.


#### plugin.essential
Default: `false`
Type: `bool` 

If true then we won't ask people, it just gets installed regardless - useful if your default templates have dependencies, such as with `minimee`

#### plugin.srcfolder:
Default: `false`
Type: `string, false`

If a string, then it will only copy that from that folder in the zip.  So for example if the repo has two directories:

```
pluginname
docs
src
```

Then maybe you only want to copy `pluginname` as the others will just muddy up the plugins folder, and also potentially create conflicts.  Specifying `pluginname` in this instance will only add that folder.

If `false` then it will just copy everything in the repo - use in conjuction with `plugin.destfolder` and `plugin.strip` for best results. 

#### destfolder
Default: `false`
Type: `string, false`

If a string, then it will put everything into this folder, in the plugins directory.  Eg.

`seomatic` will copy everything into `craft/plugins/seomatic`.  This is useful when the plugin has everything at its repository root and `plugin.strip` is 0

Otherwise you may end up with some weird results.  But some fiddling may be good if a zip had, say, more than 1 plugin in.

#### plugin.strip
Default: `1`
Type: `int`

How many paths to strip from the path of the files in the directory.  For example a repo might generate `myrepo-master/pluginname`

At `strip: 0` it would extract to `craft/plugins/myrepo-master/pluginname` which is obviously incorrect.  1 would then strip out `myrepo-master` and so on.  

Use in combination with `srcfolder` and `destfolder` to track down the right directory and put it in the right place.


----------------


# To Do

## MAMP PRO automation / PHP

It'd be nice to be able to set up the server based on our prompting options.  Since we generate a db.php file that has a database name, and we generate a gulpfile that has the hostname, it'd be great to send that to MySQL and to MAMP Pro to add all the bits and then we could literally start developing our site - especially if we were to perform a SQL import.  All depends on MAMP, and it's still a fairly basic GUI process.  

----------------

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

