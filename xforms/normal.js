var cheerio = require("cheerio");

// Baseline for reading websites, what we assume pages we don't sniff out will
// go through.
module.exports = function(html) {
    var $ = cheerio.load(html)("body");

    // Remove everything we don't want.
    $("script,noscript,link,style").each(function(i, el) {
        $(el).remove();
    });

    return $.html();
};
