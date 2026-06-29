var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/KeyEventListener/src/GetXmlTagClosing.js'));
eval(loadModule('/plugins/DevLib/src/Cursor.js'));
eval(loadModule('/plugins/DevLib/src/Config.js'));
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function FormatEnter() {
    var cur = new Cursor();
    cur.undo();
    var conf = new Config();
    var comDelim = conf.getLineCommentDelimiter();
    var nlcode = conf.getNewLineCode();
    var depth = Utility.repeatString(' ', cur.getNestDepth())

    if (cur.isCommentLine()) {
        cur.insertText(nlcode);
        cur.insertText(depth + comDelim + ' ');
        return;
    }
    
    var prevChar = cur.getPrevChar();
    var lineTextBefore = cur.getLineTextBeforeCursor();
    var tagClosing = GetXmlTagClosing(lineTextBefore);
    var flag = 
        prevChar === '(' ||
        prevChar === '[' ||
        prevChar === '{' ||
        // prevChar === '<' ||
        prevChar === ':' ||
        tagClosing !== null
    if (flag) {
        var nextChar = cur.getNextChar();
        var lineTextAfter = cur.getLineTextAfterCursor();
        var indent = conf.getIndentBlock();
        var closing = '';
        if (prevChar === '(' && nextChar !== ')') { closing = ')' }
        if (prevChar === '[' && nextChar !== ']') { closing = ']' }
        if (prevChar === '{' && nextChar !== '}') { closing = '}' }
        // if (prevChar === '<' && nextChar !== '>') { closing = '>' }
        if (tagClosing && lineTextAfter.substring(0, tagClosing.length) !== tagClosing) { closing = tagClosing }
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
