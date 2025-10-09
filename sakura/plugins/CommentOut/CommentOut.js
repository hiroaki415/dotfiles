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


function getLineCommentToken() {

    var ext = Editor.ExpandParameter('$b');

    var typeSlash = Plugin.GetOption('Option','CommentSlash').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '//';}
    }

    var typeSharp = Plugin.GetOption('Option','CommentSharp').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '#';}
    }

    var typeQuote = Plugin.GetOption('Option','CommentQuote').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '\'';}
    }

    var typeREM = Plugin.GetOption('Option','CommentREM').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return 'REM ';}
    }

    var typeHyphen = Plugin.GetOption('Option','CommentHyphen').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '--';}
    }

    var typeSemiColon = Plugin.GetOption('Option','CommentSemiColon').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return ';';}
    }

    var typePercent = Plugin.GetOption('Option','CommentPercent').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '%';}
    }

    var typeAsterisk = Plugin.GetOption('Option','CommentAsterisk').split(",");
    for (var key in typeSlash) {
        if (typeSlash[key] === ext) { return '*';}
    }

}

function CommentOut() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    var token = getLineCommentToken();

    if (cur.isSelected === 0) {
        if (cur.beginWith(0, token) === false) {
            cur.move(originCur.line, 1, 0);
            cur.insertText(token);
            cur.loadProperty(originCur, token.length);
        } else {
            UnComment();
        }
    } else {
        if (cur.beginWith(originCur.line, token) === false) {
            for (var i = originCur.fromLine;  i <= originCur.toLine;  i++) {
                cur.move(i, 1, 0);
                cur.insertText(token);
            }
            cur.loadProperty(originCur, token.length);
        } else {
            UnComment();
        }
    }
}

function UnComment() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    var token = getLineCommentToken();

    if (cur.isSelected === 0) {
        if (cur.beginWith(0, token) === true) {
            cur.move(originCur.line, 1, 0);
            for (var i = 0; i < token.length; i++) { cur.deleteWithoutBack(); }
            cur.loadProperty(originCur, -token.length);
        }
    } else {
        for (var i = originCur.fromLine;  i <= originCur.toLine;  i++) {
            cur.move(i, 1, 0);
            if (cur.beginWith(i, token) === true) {
                for (var j = 0; j < token.length; j++) { cur.deleteWithoutBack(); }
            }
        }
        cur.loadProperty(originCur, -token.length);
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
