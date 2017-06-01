(function() {

	var timeoutSeconds = 30,
		timeout = timeoutSeconds * 1000,
	];

	var loader_1 = new FontFaceObserver( "myFont", { weight: '400', style: 'normal' });

    // Etc:
    // var loader_2 = new FontFaceObserver( "myFont", { weight: '400', style: 'normal' });
    // var loader_3 = new FontFaceObserver( "myFont", { weight: '400', style: 'normal' });


	Promise.all( [

			loader_1
            // ,loader_2
            // ,loader_3 etc

		] ).then(function() {
			document.documentElement.className += " fontface";
			sessionStorage.setItem('fontfaceLoaded', APP.siteVersion);
		}, function() {
			document.documentElement.className += " fontface--timeout";
		});

})();
