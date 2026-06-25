var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Cursor.js'));
eval(loadModule('/plugins/DevLib/src/Config.js'));
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function SuperTab() {

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var conf = new Config();
    var indent = conf.getIndent();
    var offset = conf.getIndentBlock().length;
    var prevChar = cur.getPrevChar();

    if (cur.isSelected()) {
        CommandDecorator(function() {
            cur.indent();
            cur.loadProperty(originCur, offset);
        })();
        return;
    }

    if ((prevChar === ' ' || prevChar === null) && cur.isBlankLine()) {
        CommandDecorator(function() {
            cur.goLineEnd();
            var dep = cur.getNestDepth();
            var prevDep = cur.getPrevNestDepth();
            if (dep < prevDep) {
                cur.insertText(Utility.repeatString(indent, prevDep - dep));
            } else {
                cur.indent();
                cur.loadProperty(originCur, offset);
            }
        })();
        return;
    }

    if (prevChar !== null && /[a-zA-Z_]/.test(prevChar)) {
        Editor.Complete();
        return;
    }

    // else
    CommandDecorator(function() {
        cur.indent();
        cur.loadProperty(originCur, offset);
    })();
    return;

}

function ShiftTab() {
    var cur = new Cursor();
    var originCur = cur.getProperty();
    var conf = new Config();
    var offset = conf.getIndentBlock().length;
    if (cur.isNotSelected()) {
        cur.move(cur.getLine(), cur.getCol() - 1, 1);
        cur.unindent();
        cur.loadProperty(originCur, -offset);
        return;
    }
    if (cur.isSelected()) {
        cur.unindent();
        cur.loadProperty(originCur, -offset);
        return;
    }
}
