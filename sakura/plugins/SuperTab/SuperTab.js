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
eval(loadModule('/plugins/DevUtils/TextAnalyzer.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SuperTab() {

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var tabw = Editor.ChangeTabWidth(0);

    if (cur.isSelected === 0) {
        if (cur.isBeginOfLine() === false && /[\w_]/.test(cur.getPrevChar())) {
            Editor.Complete();
            cur.read();
        } else {
            var nestDep = TextAnalyzer.getNestDepth(originCur.line - 1);
            var moveNum = (nestDep - originCur.col >= 0) ? nestDep - originCur.col + 1: tabw
            cur.insertText(Utility.getRepeatedStr(' ', moveNum));
            cur.loadProperty(originCur, moveNum);
        }
    } else {
        cur.indent();
        cur.loadProperty(originCur, tabw);
    }

}

function ShiftTab() {

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var tabw = Editor.ChangeTabWidth(0);

    if (cur.isSelected === 0) {
        cur.move(cur.line, cur.col - 1, 1);
        cur.unindent();
    } else {
        cur.unindent();
    }
    cur.loadProperty(originCur, -tabw);

}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
    case 1:
        CommandDecorator(SuperTab)();
        break;
    case 2:
        CommandDecorator(ShiftTab)();
        break;
    }
})();
