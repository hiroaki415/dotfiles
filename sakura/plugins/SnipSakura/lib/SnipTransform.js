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
        var elements = SnipTransform.devideTextIntoElements(format);
        var lastIndex = 0;
        var match;

        var transText = '';

        while ((match = regex.exec(val)) !== null) {

            if (match.index > lastIndex) {
                transText += val.substring(lastIndex, match.index);
            }

            for (var key in elements) {
                transText += elements[key].getEvaluatedText(match);
            }

            lastIndex = regex.lastIndex;

            if (regex.global === false) { break; }

        }

        if (lastIndex < val.length) {
            transText += val.substring(lastIndex);
        }

        return transText;

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
        if (match !== null) {
            return Number(match[0]);
        } else {
            return -1;
        }
    };

    this.getEvaluatedText = function(reMatch) {

        if (reMatch === null) { return ''; } // ????

        var id = this.getID();

        if (id >= 0) {

            var rawVal = reMatch[id];

            if (RegExp("^(" + '\\$'+SnipRegex.reInt + "|" + '\\$\\{'+SnipRegex.reInt+'\\}' + ")$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return rawVal;
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/upcase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toUpCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/downcase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toDownCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/capitalize'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toCapitalized(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/camelcase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toCamelCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/pascalcase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toPascalCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/snakecase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toSnakeCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+'\\/kebabcase'+'\\}' + "$").test(this.rawText)) {
                if (typeof(rawVal) !== 'undefined') {
                    return FormatCase.toKebabCase(rawVal);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':\\+'+SnipRegex.reIf+'\\}' + "$").test(this.rawText)) {
                if (rawVal !== '') {
                    var regex = new RegExp('\\+');
                    regex.exec(this.rawText);
                    return this.rawText.substring(regex.lastIndex, this.rawText.length - 1);
                } else {
                    return '';
                }
            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':\\?'+SnipRegex.reIf+':'+SnipRegex.reElse+'\\}' + "$").test(this.rawText)) {

                var regex = new RegExp(':', 'g');
                regex.exec(this.rawText);
                var qIndex = regex.lastIndex + 1;
                regex.exec(this.rawText);
                var colIndex = regex.lastIndex;

                var ifStr = this.rawText.substring(qIndex, colIndex - 1);
                var elseStr = this.rawText.substring(colIndex, this.rawText.length - 1);

                if (rawVal !== '') {
                    return ifStr;
                } else {
                    return elseStr;
                }

            } else if (RegExp("^" + '\\$\\{'+SnipRegex.reInt+':'+"(\\-)?"+SnipRegex.reElse+'\\}' + "$").test(this.rawText)) {
                if (rawVal !== '') {
                    return '';
                } else {
                    var regex = new RegExp(':(\\-)?');
                    regex.exec(this.rawText);
                    return this.rawText.substring(regex.lastIndex, this.rawText.length - 1);
                }
            }

            return this.rawText;

        } else {
            return this.rawText;
        }

    };

};
