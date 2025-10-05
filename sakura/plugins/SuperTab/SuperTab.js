var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('../DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();


eval(loadModuleRaw);
eval(loadModule('../DevUtils/Cursor.js'));
eval(loadModule('../DevUtils/DevUtils.js'));


function SuperTab() {

    Editor.AddRefUndoBuffer();

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var tabw = ChangeTabWidth(0);

    if (cur.isSelected === 0) {
        if (cur.isBeginOfLine() === false && /[\w_]/.test(cur.getPrevChar())) {
            Editor.Complete();
        } else {
            var nestDep = getNestDepth(originCur.line - 1);
            var moveNum = (nestDep - originCur.col >= 0) ? nestDep - originCur.col + 1: tabw
            cur.insertText(getRepeatedStr(' ', moveNum));
            cur.loadProperty(originCur, moveNum);
        }
    } else {
        cur.indent();
        cur.loadProperty(originCur, tabw);
    }

    Editor.SetUndoBuffer();

}

function ShiftTab() {

    Editor.AddRefUndoBuffer();

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
