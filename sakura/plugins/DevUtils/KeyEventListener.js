if (typeof(root) === 'undefined') {
    var root = Editor.ExpandParameter('$I').replace(/\\[^\\]*$/, '').replace(/\\/g, '/');
}
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;


eval(loadModuleRaw);
eval('var root = "' + root + '";' +
    loadModule(root + '/plugins/DevUtils/Decorator.js') + 
    loadModule(root + '/plugins/DevUtils/Cursor.js') + 
    loadModule(root + '/plugins/DevUtils/Config.js') + 
    loadModule(root + '/plugins/DevUtils/Utility.js')
);

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
