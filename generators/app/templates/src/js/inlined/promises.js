// promise-polyfill doesn't have deferred, which works nicer with what we want.
window.Deferred = function() {
	var _this = this;
	this.resolve = null;
	this.reject = null;

	this.promise = new Promise(function(r, rj) {
		this.resolve = r;
		this.reject = rj;
	}.bind(this));
};


(function() {

	// Set a deferred promise...
	var p = new Deferred();
	p.promise.then(function() {
		APP.promises.run();
	});

	// allow other scripts to store functions that will execute
	// when bundles is ready:
	APP.promises = {

		_fns: [],
		_dr: [],

		resolved: false,

		// run when bundle is ready
		q: function( fn ) {
			if ( this.resolved ) {
				fn();
			} else {
				this._fns.push( fn );
			}
		},

		// run when bundle is ready, inside doc ready.
		ready: function( fn ) {

			if ( this.resolved ) {
				$(function() {
					fn();
				});
			} else {
				this._dr.push( fn );
			}
		},

		// Can have a think about what we'd
		// like to pass to the function
		run: function( status ) {

			// If a function got queued after
			// the first run, then we can test
			// against that and run
			this.resolved = true;

			// Run asap
			APP.promises._fns.forEach(function( fn ) {
				fn( status );
			});

			// run doc ready
			$(function() {
				APP.promises._dr.forEach(function( fn ) {
					fn( status );
				});
			});
		},

		init: function() {
			// APP.promises.init will resolve the promise, and kick everything off.
			// this isn't actually needed but it's a placeholder if we need
			// several async scripts to resolve together, i.e. if we go a multiple
			// parallel route.
			p.resolve();
		}
	};


})();

