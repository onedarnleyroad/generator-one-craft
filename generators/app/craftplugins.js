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


module.exports = [
    {
        name: "Minimee", // label so people know what they're installing
        url: "https://github.com/johndwells/craft.minimee/archive/v0.9.6.zip", // link to a zip file so yeoman can extract
        checked: true, // on or off in the list by default?
        essential: false, // set to true to not give people the option to turn it off
        zipfolder: 'minimee'
    },

    {
        name: "Supercool Button-box",
        url: "https://github.com/supercool/Button-Box/archive/1.3.2.zip",
        checked: false,
        essential: false,
        zipfolder: 'buttonbox'
    }

];
