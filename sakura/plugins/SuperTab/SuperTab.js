var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SuperTab() {

    Editor.AddRefUndoBuffer();

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var tabw = Editor.ChangeTabWidth(0);

    if (cur.getStateSelection() === cur.stateEnum.notSelected) {
        if (cur.isBeginOfLine() === false && /[\w_]/.test(cur.getPrevChar())) {
            Editor.Complete();
        } else {
            Editor.SetDrawSwitch(0);
            var nestDep = cur.getNestDepth(originCur.line - 1);
            var moveNum = (nestDep - originCur.col >= 0) ? nestDep - originCur.col + 1: tabw
            cur.insertText(Utility.getRepeatedStr(' ', moveNum));
            cur.loadProperty(originCur, moveNum);
            Editor.SetDrawSwitch(1);
            Editor.ReDraw(0);
        }
    } else {
        Editor.SetDrawSwitch(0);
        cur.indent();
        cur.loadProperty(originCur, tabw);
        Editor.SetDrawSwitch(1);
        Editor.ReDraw(0);
    }

    Editor.SetUndoBuffer();

}

function ShiftTab() {

    Editor.AddRefUndoBuffer();
    Editor.SetDrawSwitch(0);

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var tabw = Editor.ChangeTabWidth(0);

    if (cur.getStateSelection() === cur.stateEnum.notSelected) {
        cur.move(cur.getLine(), cur.getCol() - 1, 1);
        cur.unindent();
    } else {
        cur.unindent();
    }
    cur.loadProperty(originCur, -tabw);

    Editor.SetDrawSwitch(1);
    Editor.ReDraw(0);
    Editor.SetUndoBuffer();

}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
    case 1:
        SuperTab();
        break;
    case 2:
        ShiftTab();
        break;
    }
})();
