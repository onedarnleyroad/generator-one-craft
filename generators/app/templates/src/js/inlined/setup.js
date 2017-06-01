// Replace no-js with js in html
(function(H){
    H.className=H.className.replace(/\bno-js\b/,'js');

    if ('ontouchstart' in H) {
        H.className = H.className.replace(/\bno-touch\b/,'touch');
    }
})(document.documentElement);


