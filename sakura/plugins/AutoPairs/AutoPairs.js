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
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


function AutoPairs (openStr, closeStr) {

    var cur = new Cursor();

    if (cur.stateSelection === cur.stateEnum.selected ) {

        var originCur = cur.getProperty();

        cur.move(originCur.lineTo, originCur.colTo, 0);
        cur.insertText(closeStr);
        cur.move(originCur.lineFrom, originCur.colFrom, 0);
        cur.insertText(openStr);
        cur.loadProperty(originCur, openStr.length);

    } else {
        cur.insertText(openStr + closeStr);
        cur.moveLeft();
    }

}


(function() {

    var cmd = Plugin.GetCommandNo();

    switch (cmd) {
        case 1:  //Pairs
            CommandDecorator(AutoPairs)('(', ')');
            break;
        case 2:  //SquareBrackets
            CommandDecorator(AutoPairs)('[', ']');
            break;
        case 3:  //CurlyBrackets
            CommandDecorator(AutoPairs)('{', '}');
            break;
        case 4:  //AngleBrackets
            CommandDecorator(AutoPairs)('<', '>');
            break;
        case 5:  //SingleQuotes
            CommandDecorator(AutoPairs)("'", "'");
            break;
        case 6:  //DoubleQuotes
            CommandDecorator(AutoPairs)('"', '"');
            break;
    }

})();
