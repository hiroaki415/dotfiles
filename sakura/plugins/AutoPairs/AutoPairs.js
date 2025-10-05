var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('../DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();

eval(loadModuleRaw);
eval(loadModule('../DevUtils/Cursor.js'));


function AutoPairs (openStr, closeStr) {

    Editor.AddRefUndoBuffer();
    var cur = new Cursor();

    if (cur.isSelected) {

        var originCur = cur.getProperty();

        cur.move(originCur.toLine, originCur.toCol, 0);
        cur.insertText(closeStr);
        cur.move(originCur.fromLine, originCur.fromCol, 0);
        cur.insertText(openStr);
        cur.loadProperty(originCur, openStr.length);

    } else {
        cur.insertText(openStr + closeStr);
        cur.moveLeft();
    }

    Editor.SetUndoBuffer();

}


(function() {

    var cmd = Plugin.GetCommandNo();

    switch (cmd) {
        case 1:  //Pairs
            AutoPairs('(', ')');
            break;
        case 2:  //SquareBrackets
            AutoPairs('[', ']');
            break;
        case 3:  //CurlyBrackets
            AutoPairs('{', '}');
            break;
        case 4:  //AngleBrackets
            AutoPairs('<', '>');
            break;
        case 5:  //SingleQuotes
            AutoPairs("'", "'");
            break;
        case 6:  //DoubleQuotes
            AutoPairs('"', '"');
            break;
    }

})();
