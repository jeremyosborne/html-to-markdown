var cheerio = require("cheerio");

// Baseline for reading websites, what we assume pages we don't sniff out will
// go through.
module.exports = function(html) {
    var body = cheerio.load(html)("body");

    // Remove everything we don't want.
    body.remove("script,noscript,link,style");

    return body.html();
};
