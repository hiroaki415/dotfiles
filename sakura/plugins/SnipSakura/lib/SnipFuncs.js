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
eval(loadModule('/plugins/DevUtils/Utility.js'));


var SnipFuncs = {

    devideTextIntoElements : function(rawText) {

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

    }

};
