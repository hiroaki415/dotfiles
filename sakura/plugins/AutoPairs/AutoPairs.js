var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function AutoPairs (openStr, closeStr) {

    var cur = new Cursor();

    if (cur.isSelected) {

        var originCur = cur.getProperty();

        cur.move(originCur.toLine, originCur.toCol, 0);
        cur.insertText(closeStr);
        cur.move(originCur.fromLine, originCur.fromCol, 0);
        cur.insertText(openStr);
        cur.loadProperty(originCur, openStr.length);

    } else {
        cur.insertText(openStr + closeStr);
        cur.moveLeft();
    }

}


(function() {

    var cmd = Plugin.GetCommandNo();

    switch (cmd) {
        case 1:  //Pairs
            CommandDecorator(AutoPairs)('(', ')');
            break;
        case 2:  //SquareBrackets
            CommandDecorator(AutoPairs)('[', ']');
            break;
        case 3:  //CurlyBrackets
            CommandDecorator(AutoPairs)('{', '}');
            break;
        case 4:  //AngleBrackets
            CommandDecorator(AutoPairs)('<', '>');
            break;
        case 5:  //SingleQuotes
            CommandDecorator(AutoPairs)("'", "'");
            break;
        case 6:  //DoubleQuotes
            CommandDecorator(AutoPairs)('"', '"');
            break;
    }

})();
