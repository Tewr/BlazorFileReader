// run on typescript-bundle output.
module.exports.bundleOutput = function (javascript_code) {
    // apply transformations here.
    javascript_code = javascript_code.replace("//# sourceMappingURL=FileReaderComponent.js.map", "");
    // Lets the script me interpreted as a classic script rather than module definition
    return `(function() { var module = ${javascript_code}\nwindow.FileReaderComponent = module.FileReaderComponentInstance })();`;
}