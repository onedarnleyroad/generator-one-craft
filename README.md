# Yeoman Generator - Example 

Barebones generator, with a lot of comments.  This doesn't really do anything, but copy a few arbitrary files to understand how to build a yeoman generator.

## Installing the Generator

While this is in development and not published on NPM, we need to take a few steps to get this repo working as a yeoman generator.  When this is done, you are able to continue to make changes to the generator itself and have those instantly updated the next time you run the generator.

**Please note that the folder that the repo lives in needs to be prefixed with `generator`.**  Eg: `generator-name` - where `name` is the name of the generator,  and thus you would run `yo name` to run the app.  See http://yeoman.io/authoring/ for more details.

```
$ git clone https://github.com/nathanedwards/generator-example.git
$ npm install
```
We need to link this as a global npm module so that yeoman can find it, and make sure yeoman is globally installed:

```
$ npm link
$ npm install -g yeoman # if not previously done
```
Now, it's installed on your system, and accessible from Yeoman.  Effectively modifying this repo, doing a git pull updates the generator, so be wary if someone has updated the repo, they've updated the generator.  After `npm link` has done its thing you can run the generator:

```
$ yo example
```


## Options

***to do***


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

