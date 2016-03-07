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
├── craft                       # Craft CMS app
├── public                      # Document root directory, used by craft.  Compiled assets end up here
├── src                         # Front end source files mostly
|   ├── scss                    
|   ├── js
|   ├── img                     # do we want to do this? this can get compiled into the public folder, and transformed - eg losslessly compressed?
|   └── templates               # this is for any twig template snippets you wish to transform before sending to craft
|   
├── README.md
├── .gitignore       
├── package.json
├── bower.json                  
├── gulpfile.js
└── ???
```     




## Optional

***Proposed***

1. Bower

## Non-optionals
For want of a better term, these things are going to install no matter what

### Gulp and Gulp Plugins


## Optionals
Things that you don't have to use, but may want
1. Bower
Add this 

    


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

Simply colours the console output - makes for easier reading of the terminal's output.

--

