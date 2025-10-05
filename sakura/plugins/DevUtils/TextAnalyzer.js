var TextAnalyzer = {};

TextAnalyzer.getNestDepth = function(line) {
    var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, "");
    var match = lineStr.match(/^(\s*)/);
    var ret = match ? match[1].length : 0;
    return ret;
};

TextAnalyzer.isBlankLine = function(line) {
    var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, "");
    return lineStr === '';
};
