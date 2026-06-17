var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));

switch (Indent.GetChar()) {
    case '\r':
        CommandDecorator(function() {
            var cur = new Cursor();
            var prevLine = cur.getLine() - 1;
            var prevLineText = cur.getLineText(prevLine);
            var prevChar = prevLineText.slice(-1);
            if (prevChar === '[' || prevChar === '(' || prevChar === '{' || prevChar === ':') {
                var nextChar = cur.getNextChar();
                cur.enter();
                switch (prevChar) {
                    case '{':
                        if (nextChar !== '}') { cur.insertText('}'); }
                        break;
                    case '(':
                        if (nextChar !== ')') { cur.insertText(')'); }
                        break;
                    case '[':
                        if (nextChar !== ']') { cur.insertText(']'); }
                        break;
                }
                cur.moveUp();
                cur.indent();
            }
        })();
        break;
}
