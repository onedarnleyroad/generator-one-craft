console.log("Loading Scripts");

module.exports = function( scriptsDest ) {
    return [

        // Bundle will be loaded async.  Make sure it has
        // no dependencies to files not included below
        {
            dest: scriptsDest,
            target: 'bundle.js',
            files: [
                './node_modules/jquery/dist/jquery.min.js',
                // './node_modules/media-queries/mediaQueries.js',
                // './node_modules/scrollMonitor/scrollMonitor.js',
                // './node_modules/flickity/dist/flickity.pkgd.min.js',
                // './vendor/afarkas/lazysizes.js',
                './src/js/app.js'
            ]
        },

        // fonts contains a fontface observer & font promises
        {
            dest: scriptsDest,
            target: 'fonts.js',
            files: [
                './node_modules/fontfaceobserver/fontfaceobserver.js',
                './src/js/inlined/fonts.js'
            ]
        },

        // inlined will be included in the head, and will be obviously,
        // inlined.  So it cannot rely on other scripts - UNLESS
        // it is wrapped or deferred somehow to be executed in the
        // APP.init function (inside setup.js)
        {
            dest: './craft/templates/_readonly/js',
            target: 'inlined.js',
            files: [
                './node_modules/promise-polyfill/promise.min.js',
                './node_modules/1dr-classToggle/index.js',
                './node_modules/loadjs/dist/loadjs.min.js',
                './node_modules/lazysizes/lazysizes.min.js',
                './src/js/inlined/promises.js',
                './src/js/inlined/setup.js',
                './src/js/inlined/lazysizes.js',
            ]
        },
    ];
};
