var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Cursor.js'));


function CompSakura () {

    var word = Complement.GetCurrentWord();
    var cur = new Cursor();

    if (word === '_X_' && /\{\d+\|.+(.+\,)+.+\|\}/.test(cur.selectedStr)) {

        var selStr = cur.selectedStr
        var start = selStr.indexOf('|') + 1;
        var end = selStr.length - 2;
        var menu = selStr.substring(start, end).split(',');
        for (key in menu) { Complement.AddList(menu[key]); }

    } else {

        var ext = Editor.ExpandParameter('$b');

        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var folder = fso.GetFolder(Plugin.GetPluginDir() + '/snippets');
        var files = new Enumerator(folder.Files);

        for (; !files.atEnd(); files.moveNext()) {

            var file = files.item();
            var regexFile = new RegExp(
                '(^' + ext + '_*[a-zA-Z0-9_]*\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets))|' +
                '(^global_*[a-zA-Z0-9_]*\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets))'
            );

            if (regexFile.test(file.Name)) {
                var snippets = eval('(' + loadModule('/plugins/SnipSakura/snippets/' + file.Name) + ')');
                var prefix = null;
                var regexSnip = new RegExp('^' + word + ".*");
                for (key in snippets){
                    prefix = snippets[key].prefix.replace(/[^a-zA-Z0-9_]/g, "");
                    if (regexSnip.test(prefix)) { Complement.AddList(prefix + ':snip$'); }
                }
            }

        }

        fso = null;

    }

}

CompSakura();

//    _X_${125|true,false|}
