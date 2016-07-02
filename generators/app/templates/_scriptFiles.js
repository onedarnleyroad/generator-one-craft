console.log("Loading Scripts");

module.exports = function( scriptsDest ) {
	return [

		// Bundle will be loaded async.  Make sure it has
		// no dependencies to files not included below
		{
			dest: scriptsDest,
			target: 'bundle.js',
			files: [
				// './vendor/jquery/jquery/jquery-2.2.1.js',
				// './vendor/aFarkas/lazysizes.js',
				// './vendor/desandro/imagesloaded/imagesloaded.js'
				// './vendor/metafizzy/flickity/flickity.pkgd.js',
				'./src/js/app.js'
			]
		}
	];
};
