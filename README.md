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

`$ gulp styles`
`$ gulp styles-production`
Pretty straightforward, this is your SASS compiler.  The latter simply omits sourcemaps, and minifies.  Tweak the `serve` bit below if you prefer this - but something like `minimee` may do the compression for us.  Sourcemaps are useful for development, and probably a negligible bloat to the filesize of the compiled CSS.

### Images
`$ gulp images`
This is something for discussion - but simply images go in at `src/img` and come out at `public/assets/img` - on the way they are run through `gulp-imagemin` (yet to be fully configured in the gulpfile).  This losslessly compresses them - it's good for stripping metadata.  As these assets generally come out of a PSD and PS isn't great and removing superfluous data, this should do enough work for us to get the files nice and small.  There's also `gulp-changed` to avoid doing this again and again - as it's probably quite a hefty gulp task.  Needs testing

### HTML / Twig
`$ gulp templates`
This is something for discussion. 
The thinking here is we can do a couple of things here:
#### Wire up our Bower Components
Bower is great at copying vendor repos, but since they are as tidy and accessible as people make them, it's a little bit of a mess.  `wiredep` - an npm module - is great at parsing your `bower.json` and writing in `<script>` tags accordingly - with paths to the right scripts.  The problem though is it'll just point to where your bower scripts were installed.

Enter `gulp-useref`.  This can concatenate JS and copy them somewhere else, while then saving an HTML file with the new bundled javascript files in `script` tags.

At that point we need those to live in a Twig template, so html would be copied over into the templates directory.  

So here are the questions about how we set this up: 

1. Do we just have some sort of `scripts-snippet.html` in this `src/templates` folder and then copy that to some sort of `_compiled-includes` folder in our `craft/templates` folder?

In other words *everything* would get copied from `src/templates/` into `craft/templates/_compiled-includes/` - that way we know not to touch it when making twig templates.

**OR**


2. Or do we treat our `src/templates` directory as a not-yet-compiled templates directory which compiles into `craft/templates`

With 2. we get to use `gulp-file-include` which allows us to use cool parsing and functions that Twig was not made to do - it's a way to end up with perhaps less DRY and bloated Twig templates that are actually fast for our server to process, but our actual `src/tempates` can be really nicely DRY because we use processors to compile.




`$ gulp serve`




## Optional Addons

***Proposed***

1. Bower







    


# To Do

## Database Automation

Could we run a bash script to set up the local database? Perhaps the generator could take a project name, thus naming the repo, and create a `.sh` file that sets up a MySQL database assuming normal commands.  It would also update the `local/config/db.php` (check filename) and rewrite it with supplied variables.   It would also be good to have a default SQL file to import, bootstrapping the usual credentials.  At the time of generation, we could supply an admin account, and possibly a client account login


## Notes on installation

### Build Tools

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

