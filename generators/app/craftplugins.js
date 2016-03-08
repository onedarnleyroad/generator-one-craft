/**
 * CRAFT PLUGINS
 * ------------------
 *
 * Plugins for craft.  This is where you list all the plugins to be used in the yeoman app.
 * The user will be prompted, unless you configure it to be essential, whatever they leave
 * checked will be installed into the plugins directory as you'd expect.
 *
 * I'd like to find a way to simply add the repo and just do 'latest'.
 * Perhaps we just fetch the master branch?
 *
 * EG you could supply
 *
 * type: githubrepo
 * repo: johndwells/craft.minimee
 *
 * And then the app could build the zip url:
 *
 * https://github.com/johndwells/craft.minimee/archive/master.zip
 *
 *
 * As it is there seems to be no simple way to fetch the latest *release* i.e.
 *
 * https://github.com/johndwells/craft.minimee/releases/tag/v0.9.6
 *
 * But maybe we want to control release versions anyway
 */


// options
/*

    {
        name : string // what will be given to the user as an option.  Also saved as a key in the yo json.
        url: string // location of the zipfile of the code
        checked: bool // if this is checked for the user
        essential: bool // if true then we won't ask people, it just gets installed regardless - useful if your templates have dependencies
        srcfolder: string | false // if a string, then it will only copy that from that folder in the zip file.  If false, it'll just copy anything
        destfolder: string | false // if string, then it will put everything into this folder, in the plugins directory.  Useful when the repo has the plugin at root
        strip: int // default 1 - will strip this directory from the path.

        RE: Strip

        if your repo is github.com/name/repo/pluginame/files

        then the resulting zip will have a folder structure, something like repo/pluginame/files and so strip: 1 would remove 'repo'

        however strip 0 uses the root.  See the difference between Minimee and SEOmatic...

    }


 */


module.exports = [
    {
        name: "Minimee", // label so people know what they're installing
        url: "https://github.com/johndwells/craft.minimee/archive/master.zip", // link to a zip file so yeoman can extract
        checked: true, // on or off in the list by default?
        essential: true, // set to true to not give people the option to turn it off
        srcfolder: 'minimee'
    },

    {
        name: "Supercool Button-box",
        url: "https://github.com/supercool/Button-Box/archive/master.zip",
        checked: false,
        essential: false,
        srcfolder: 'buttonbox'
    },

    {
        name: "SEOmatic",
        url: "https://github.com/nystudio107/seomatic/archive/master.zip",
        checked: false,
        essential: false,
        srcfolder: false, // false means it'll ignore the directories and just install what it can
        destfolder: 'seomatic', // if this is set then it will create this folder at the top level.

        // default is 1 for stripe, which means it'll go to the next level and strip out the top level folder.  But since this repo
        strip: 0
    }

];
