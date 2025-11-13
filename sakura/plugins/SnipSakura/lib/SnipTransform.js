if (typeof(root) === 'undefined') {
    var root = Editor.ExpandParameter('$I').replace(/\\[^\\]*$/, '').replace(/\\/g, '/');
}
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval('var root = "' + root + '";' +
    loadModule(root + '/plugins/SnipSakura/lib/SnipRegex.js') +
    loadModule(root + '/plugins/DevUtils/FormatCase.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


var SnipTransform = {

    transform: function (val, re, format, opt) {
        var regex = new RegExp(re, opt);
        var match = regex.exec(val);
        // to be continue
    },

    devideTextIntoElements: function (rawText) {

        var regex = new RegExp(SnipRegex.format, 'g');
        var elements = [];
        var lastIndex = 0;
        var match;

        while ((match = regex.exec(rawText)) !== null) {

            if (match.index > lastIndex) {
                var slicedText = rawText.substring(lastIndex, match.index);
                elements.push(new SnipFormatElement(slicedText));
            }

            var token = match[0];
            elements.push(new SnipFormatElement(token));

            lastIndex = regex.lastIndex;

        }

        if (lastIndex < rawText.length) {
            var slicedText = rawText.substring(lastIndex);
            elements.push(new SnipFormatElement(slicedText));
        }

        return elements;
    }

};

function SnipFormatElement(rawText) {

    this.rawText = rawText;

    this.getID = function() {
        var match = /(\d+?)/g.exec(this.rawText);
        return Number(match[0]);
    };

    this.getEvaluatedText = function(reMatch) {

        if (reMatch === null) { return ''; } // ????

        var rawVal = reMatch[this.getID()];

        if (RegExp("^(" + '\\$'+SnipRegex.reInt + "|" + '\\$\\{'+SnipRegex.reInt+'\\}' + ")$").test(this.rawText)) {
            return rawVal;
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/upcase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toUpCase(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/downcase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toDownCase(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/capitalize'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toCapitalized(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/camelcase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toCamelCase(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/pascalcase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toPascalCase(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/snakecase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toSnakeCase(rawVal);
        } else if (RegExp("^" + '\\$'+SnipRegex.reInt+':'+'\\/kebabcase'+'\\}' + "$").test(this.rawText)) {
            return FormatCase.toKebabCase(rawVal);
        } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':\\+'+SnipRegex.reIf+'\\}' + "$").test(this.rawText)) {
            if (typeof(rawVal) !== 'undefined') {
                // 
            } else {
                return '';
            }
        } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':\\?'+SnipRegex.reIf+':'+SnipRegex.reElse+'\\}' + "$").test(this.rawText)) {
            if (typeof(rawVal) !== 'undefined') {
                // 
            } else {
                // 
            }
        } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+"(\\-)?"+SnipRegex.reElse+'\\}' + "$").test(this.rawText)) {
            if (typeof(rawVal) !== 'undefined') {
                return '';
            } else {
                // 
            }
        }

        return '';

    };

};
