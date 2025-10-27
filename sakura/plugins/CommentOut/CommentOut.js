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
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function CommentOut() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    var offset = 0;

    if (cur.stateSelection === cur.stateEnum.notSelected) {
        if (cur.isCommentLine() === false) {
            var nestDep = cur.getNestDepth();
            var offset = originCur.col > (nestDep + 1) ? cur.comDelim.length + 1 : 0
            cur.move(originCur.line, nestDep + 1, 0);
            cur.insertText(cur.comDelim + ' ');
            cur.loadProperty(originCur, offset);
        } else {
            UnComment();
        }
    } else {

        var comFlag = true;
        var nestDeps = [];
        for (var i = originCur.lineFrom;  i <= originCur.lineTo;  i++) {
            comFlag = comFlag || cur.isCommentLine(i);
            if (cur.isBlankLine(i) === false) { nestDeps.push(cur.getNestDepth(i)); }
        }

        if (cur.isCommentLine(originCur.line) === false) {
            var minDep = Utility.getMinInArray(nestDeps);
            for (var i = originCur.lineFrom;  i <= originCur.lineTo;  i++) {
                if (cur.isBlankLine(i) === false) { 
                    cur.move(i, minDep + 1, 0);
                    cur.insertText(cur.comDelim + ' ');
                }
            }
            cur.loadProperty(originCur);
        } else {
            UnComment();
        }
    }
}

function UnComment() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    if (cur.stateSelection === cur.stateEnum.notSelected) {
        cur.deleteCommentDelimiter(originCur.line);
    } else {
        for (var i = originCur.lineFrom;  i <= originCur.lineTo;  i++) {
            cur.deleteCommentDelimiter(i);
        }
        cur.loadProperty(originCur);
    }

}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
        case 1:
            CommandDecorator(CommentOut)();
            break;
        case 2:
            CommandDecorator(UnComment)();
            break;
    }
})();
