var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipElement.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipRegex.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipVariable.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SnipParser(normSnip, nestDepth) {

    this.normSnip = normSnip;
    this.nestDepth = nestDepth;

    this.parseRawText = function(rawText) {

        var regex = new RegExp('(' + SnipRegex.tabstop + '|' + SnipRegex.placeholder + '|' +
                                    SnipRegex.choice + '|' + SnipRegex.variable + ')', 'g');
        var elements = [];
        var lastIndex = 0;
        var match;

        while ((match = regex.exec(rawText)) !== null) {

            if (match.index > lastIndex) {
                var slicedText = rawText.substring(lastIndex, match.index);
                elements.push(new SnipElement(slicedText));
            }

            var token = match[0];
            elements.push(new SnipElement(token));

            lastIndex = regex.lastIndex;

        }

        if (lastIndex < rawText.length) {
            var slicedText = rawText.substring(lastIndex);
            elements.push(new SnipElement(slicedText));
        }

        return elements;

    };

    this.escapeMarkers = function(text) {
        return text
            .replace(/\\\\/g, '__ESC_BACKSLASH__')
            .replace(/\\\$/g, '__ESC_DOLLAR__')
            .replace(/\\\{/g, '__ESC_LBRACE__')
            .replace(/\\\}/g, '__ESC_RBRACE__')
            .replace(/\\\t/g, '__ESC_INDENT__')
            .replace(/\\\n/g, '__ESC_RETURN__');
    };

    this.restoreMarkers = function(text) {
        return text
            .replace(/__ESC_BACKSLASH__/g, '\\')
            .replace(/__ESC_DOLLAR__/g, '$')
            .replace(/__ESC_LBRACE__/g, '{')
            .replace(/__ESC_RBRACE__/g, '}')
            .replace(/__ESC_INDENT__/g, Utility.getRepeatedStr(' ', Editor.ChangeTabWidth(0)))
            .replace(/__ESC_RETURN__/g, Utility.getLineCode() + Utility.getRepeatedStr(' ', this.nestDepth));
    };

    this.getEvaluatedText = function() {
        var escText = this.escapeMarkers(this.normSnip);
        var elements = this.parseRawText(escText);
        var evalText = '';
        for (key in elements) { evalText = evalText + elements[key].getEvaluatedText(); }
        var restText = this.restoreMarkers(evalText);
        return restText;
    };

    this.initCookie = function() {
        // 
    };

    this.saveCookie = function() {
        // 
    };

    this.loadCookie = function() {
        // 
    };

    this.deleteCookie = function() {
        // 
    };

}
