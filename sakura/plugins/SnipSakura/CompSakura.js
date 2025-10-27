var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipLoader.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));


function CompSakura () {

    var word = Complement.GetCurrentWord();
    var cur = new Cursor();

    if (word === '_CHOICE_' && /\{\d+\|.+(.+\,)+.+\|\}/.test(cur.selectedStr)) {

        var selStr = cur.selectedStr
        var start = selStr.indexOf('|') + 1;
        var end = selStr.length - 2;
        var menu = selStr.substring(start, end).split(',');
        for (key in menu) { Complement.AddList(menu[key]); }

    } else {

        var prefixes = SnipLoader.getPrefixesBeginWith(word);
        for (key in prefixes) { Complement.AddList('<' + prefixes[key] + '>:snip$'); }

    }

}

CompSakura();

//    _X_${125|true,false|}
