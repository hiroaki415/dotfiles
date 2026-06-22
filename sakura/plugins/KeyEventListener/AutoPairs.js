var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Utility.js'));


function AutoPairs (closing) {
    var cur = new Cursor();
    cur.insertText(closing);
    cur.moveLeft();
}

function AutoPairsClosing (closing) {
    var cur = new Cursor();
    if (cur.getNextChar() === closing) {
        cur.deleteWithoutBack();
    }
}
