var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function FormatEnter() {
    var cur = new Cursor();
    cur.undo();
    var conf = new Config();
    var comDelim = conf.getLineCommentDelimiter();
    var nlcode = conf.getNewLineCode();
    var depth = Utility.getRepeatedStr(' ', cur.getNestDepth())

    if (cur.isCommentLine()) {
        cur.insertText(nlcode);
        cur.insertText(depth + comDelim + ' ');
        return;
    }
    
    var prevChar = cur.getPrevChar();
    var lineText = cur.getLineTextBeforeCursor();
    var matches = lineText.match(/<([a-zA-Z_][\w:.-]*)(?:\s+[^>]*[^>/])*>$/);
    var flag = 
        prevChar === '(' ||
        prevChar === '[' ||
        prevChar === '{' ||
        // prevChar === '<' ||
        prevChar === ':' ||
        matches !== null
    if (flag) {
        var nextChar = cur.getNextChar();
        var closing = '';
        if (prevChar === '(' && nextChar !== ')') { closing = ')' }
        if (prevChar === '[' && nextChar !== ']') { closing = ']' }
        if (prevChar === '{' && nextChar !== '}') { closing = '}' }
        // if (prevChar === '<' && nextChar !== '>') { closing = '>' }
        if (matches) { closing = '</' + matches[1] + '>' }
        var indent = conf.getIndent();
        cur.insertText(nlcode);
        cur.insertText(depth + indent + nlcode);
        cur.insertText(depth + closing);
        cur.moveUp();
        cur.goLineEnd();
        return;
    }

    // else
    cur.insertText(nlcode);
    cur.insertText(depth);
    
}
