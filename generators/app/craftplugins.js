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
 * As it is there seems to be no simple way to fetch the latest *release* i.e.
 *
 * https://github.com/johndwells/craft.minimee/releases/tag/v0.9.6
 *
 * But maybe we want to control release versions anyway
 */

/**
 * TO ADD
 *
 */


// options
/*

	{
		name : string // what will be given to the user as an option.  Also saved as a key in the yo json.
		url: string // location of the zipfile of the code
		checked: bool // if this is checked for the user
		essential: bool // if true then we won't ask people, it just gets installed regardless - useful if your templates have dependencies
		srcFolder: string | false // if a string, then it will only copy that from that folder in the zip file.  Otherwise it'll just copy anything
		destFolder: string | false // if string, then it will put everything into this folder, in the plugins directory.  Useful when the repo has the plugin at root
	}

 */


module.exports = [

	{
		name: "CacheFlag",
		url: "https://github.com/mmikkel/CacheFlag-Craft/archive/master.zip",
		checked: false,
		srcFolder: "cacheflag"
	},

	{
		name: "ColdCache",
		url: "https://github.com/pixelandtonic/ColdCache/archive/master.zip",
		checked: false,
		srcFolder: "coldcache"
	},

	{
		name: "CropField (not yet on Github, one of ours, still needs polish)",
		url: "",
		checked: false,
		srcFolder: "cropfield"
	},

	{
		name: "FruitLinkIt",
		url: "https://github.com/fruitstudios/LinkIt/archive/master.zip",
		checked: true,
		srcFolder: "fruitlinkit"
	},

	{
		name: "Imager Craft",
		url: "https://github.com/aelvan/Imager-Craft/archive/master.zip",
		checked: true,
		srcFolder: "imager"
	},

	{
		name: "ImageResizer",
		url: "https://github.com/engram-design/ImageResizer/archive/master.zip",
		checked: true,
		srcFolder: "imageresizer"
	},

	{
		name: "Minimee",
		url: "https://github.com/johndwells/craft.minimee/archive/master.zip",
		essential: true,
		srcFolder: 'minimee'
	},

	{
		name: "MN Twig Perversion",
		url: "https://github.com/marionnewlevant/craft-twig_perversion/archive/master.zip",
		checked: true,
		srcFolder: "mntwigperversion"
	},

	{
		name: "Preparse Field",
		url: "https://github.com/aelvan/Preparse-Field-Craft/archive/master.zip",
		checked: false,
		srcFolder: "preparsefield"
	},

	{
		name: "RedactorI",
		url: "https://github.com/pixelandtonic/RedactorI/archive/master.zip",
		checked: true,
		srcFolder: "redactori"
	},

	{
		name: "Redirect Manager",
		url: "https://github.com/rkingon/Craft-Plugin--Redirect-Manager/archive/master.zip",
		checked: true,
		srcFolder: "redirectmanager"
	},

	{
		name: "SEOmatic",
		url: "https://github.com/nystudio107/seomatic/archive/master.zip",
		checked: true,
		destFolder: 'seomatic' // if this is set then it will create this folder at the top level.

	},

    {
        name: "Cookies",
        url: "https://github.com/nystudio107/cookies/archive/master.zip",
        checked: true,
        destFolder: 'cookies'
    },

    {
        name: "Plus",
        url: "https://github.com/fvaldes33/plus/archive/master.zip",
        checked: true,
        destFolder: 'plus'
    },

	{
		name: "Translate",
		url: "https://github.com/boboldehampsink/translate/archive/master.zip",
		checked: false,
		destFolder: 'translate'
	}

];
