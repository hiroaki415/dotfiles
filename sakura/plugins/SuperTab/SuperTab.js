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

    var cur = new Cursor();

    if (/[a-zA-Z_]/.test(cur.getPrevChar())) {
        Editor.Complete();
        return;
    }

    var originCur = cur.getProperty();
    var conf = new Config();
    var offset = conf.getIndent().length;

    if (cur.isNotSelected()) {
        Editor.AddRefUndoBuffer();
        Editor.SetDrawSwitch(0);
        cur.indent();
        cur.loadProperty(originCur, offset);
        Editor.SetDrawSwitch(1);
        Editor.ReDraw(0);
        Editor.SetUndoBuffer();
        return;
    }

    if (cur.isSelected()) {
        Editor.AddRefUndoBuffer();
        Editor.SetDrawSwitch(0);
        cur.indent();
        cur.loadProperty(originCur, offset);
        Editor.SetDrawSwitch(1);
        Editor.ReDraw(0);
        Editor.SetUndoBuffer();
        return;
    }

}

function ShiftTab() {
    var cur = new Cursor();
    var originCur = cur.getProperty();
    var conf = new Config();
    var offset = conf.getIndent().length;
    if (cur.isNotSelected()) {
        cur.move(cur.getLine(), cur.getCol() - 1, 1);
        cur.unindent();
        cur.loadProperty(originCur, -offset);
        return;
    }
    if (cur.isSelected()) {
        cur.unindent();
        return;
    }
}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
    case 1:
        SuperTab();
        break;
    case 2:
        CommandDecorator(ShiftTab)();
        break;
    }
})();
