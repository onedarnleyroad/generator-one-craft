// this is a node module to help our yeoman - just a place to stick a bunch of functions without bloating the index.js file
//
//



function stripTrailingSlash(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}




module.exports = {
    stripTrailingSlash: stripTrailingSlash
};
