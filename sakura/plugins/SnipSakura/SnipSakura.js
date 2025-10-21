var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipRegex.js'));
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function ExpandSnippet() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    cur.move(originCur.line, originCur.col - 6, 1);
    if (cur.selectedStr === ':snip$' ) {
        MessageBox('hello');
    } else {
        cur.loadProperty(originCur);
    }

}

function JumpNext() {
    var cur = new Cursor();
    cur.jumpMatch(/(\$\d+)|(\$\{\d+\:.+\})|(\$\{\d+\|.+(.+\,)+.+\|\})/);
}

function JumpPrev() {
    var cur = new Cursor();
    // cur.jumpMatch(/(\$\d+)|(\$\{\d+\:.+\})|(\$\{\d+\|.+(.+\,)+.+\|\})/, false);

    var str = '${TM_CURRENT_LINE/fg/dfg/g}'
    var regex = new RegExp('^' + SnipRegex.variable + '$');
    if ((match = regex.exec(str)) !== null) {
        MessageBox('match!');
    } else {
        MessageBox('failed...');
    }
    // TraceOut(SnipRegex.variable);

}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
        case 1:
            CommandDecorator(ExpandSnippet)();
            break;
        case 2:
            CommandDecorator(JumpNext)();
            break;
        case 3:
            CommandDecorator(JumpPrev)();
            break;
    }
})();
