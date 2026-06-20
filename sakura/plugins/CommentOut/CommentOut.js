var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function CommentOut() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    var conf = new Config();
    var comDelim = conf.getLineCommentDelimiter();

    var offset = 0;

    if (cur.getStateSelection() === cur.stateEnum.notSelected) {
        if (cur.isCommentLine() === false) {
            var nestDep = cur.getNestDepth();
            var offset = originCur.col > (nestDep + 1) ? comDelim.length + 1 : 0
            cur.move(originCur.line, nestDep + 1, 0);
            cur.insertText(comDelim + ' ');
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
                    cur.insertText(comDelim + ' ');
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

    if (cur.getStateSelection() === cur.stateEnum.notSelected) {
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
