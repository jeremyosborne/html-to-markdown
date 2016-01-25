#!/usr/bin/env node

if (require.main !== module) {
    throw new Error("This is file is a shell script. Please don't require this module.");
}

try {
    var htmlToMarkdown = require("./index");
    var meta = require("./package.json");
    var argv = require("minimist")(process.argv.slice(2));
} catch (e) {
    console.error("Problems during import of script dependencies. Here's the error:\n", e, "\n\n");
    process.exit(1);
}



var url = argv._[0];
if (!url) {
    var usage = `
${meta.name} ${meta.version}

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



var verboseFlag = argv.v;
var verbose = function() {
    if (verboseFlag) {
        console.error.apply(console, arguments);
    }
};



// xform is the function, style is the argument string.
var xform = argv.xform;
if (xform) {
    if (htmlToMarkdown.xformExists(xform)) {
        verbose("using xform:", xform);
    } else {
        console.error("Could not find xform:", xform, "\nExiting.");
        process.exit(1);
    }
} else {
    xform = "none";
    verbose("using default xform named", xform);
}


// If we haven't exited, give it a try:
htmlToMarkdown.fetch(url, xform, function(err, md) {
    if (err) {
        console.error("Sorry, could not retrieve the page:", url);
        console.error("Error returned:", err);
        process.exit(1);
    }

    // Output.
    console.log(md);
});
