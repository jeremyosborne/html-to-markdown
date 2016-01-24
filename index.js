var request = require("request");
var toMarkdown = require("to-markdown").toMarkdown;


// Determine if an particular transform exists.
// Synchronous code, raises exception if it does not exist.
exports.xformExists = function(xform) {
    try {
        xform = require("./xforms/" + xform);
        return true;
    } catch(e) {
        return false;
    }
};


exports.fetch = function(url, xform, callback) {
    var xformFn = require("./xforms/" + xform);
    request(url, function(err, res, body) {
        callback(err, toMarkdown(xformFn(body)));
    });
};
