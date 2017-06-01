document.addEventListener('lazybeforeunveil', function(e) {

	var bg = e.target.getAttribute('data-bg');
	var vid = e.target.getAttribute('data-video');
	if(bg){
		e.target.style.backgroundImage = 'url(' + bg + ')';
	}

	if (vid) {

		var attributes = e.target.getAttribute('data-attributes');
		var poster = e.target.getAttribute('data-poster');

		APP.promises.ready(function( ) {
			var $v = $('<video ' + attributes + '></video>');

			$v.attr('preload','metadata')
			if (poster) {
				$v.attr('poster', poster);
			}

			var $s = $('<source />').attr('src', vid ).appendTo( $v );
			$(e.target).append( $v );
		});
	}
});
