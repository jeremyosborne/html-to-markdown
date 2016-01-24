#!/usr/bin/env node
/* jshint undef:true, unused:true, node:true */

try {
    var request = require("request");
    var toMarkdown = require("to-markdown").toMarkdown;
    var argv = require("minimist")(process.argv.slice(2));
    var meta = require("./package.json");
} catch (e) {
    console.error("Make sure to `npm install` before running this code.");
    console.error("Here's the error that happened during module import:", e, "\n\n");
    process.exit(1);
}


var verboseFlag = argv.v;
var verbose = function() {
    if (verboseFlag) {
        console.error.apply(console, arguments);
    }
};


var url = argv._[0];
if (!url) {
    var usage = `\n${meta.name} ${meta.version}

Usage:

    html-to-markdown -v [--xform=some-style] <url>

-v
    verbose mode. non-content comments to stderr (content only ever to stdout)

--xform
    none (default)
    wikipedia
`;
    console.error(usage);
    process.exit(1);
}

// xform is the function, style is the argument string.
var xform;
var style = argv.xform;
if (style) {
    try {
        xform = require("./xforms/" + style);
        verbose("using xform style:", style);
    } catch(e) {
        console.error("Could not find xform style:", style);
        console.error("Exiting.");
        process.exit(1);
    }
} else {
    style = "none";
    xform = require("./xforms/" + style);
    verbose("default xform style:", style);
}



request(url, function(err, res, body) {
    if (err) {
        console.error("Sorry, could not retrieve the page:", url);
        console.error("Error returned:", err);
        process.exit(1);
    }

    // Output.
    console.log(toMarkdown(xform(body)));
});
