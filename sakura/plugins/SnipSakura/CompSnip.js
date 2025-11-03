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


function CompSnip () {

    var word = Complement.GetCurrentWord();
    var prefixes = SnipLoader.getPrefixesBeginWith(word);
    for (key in prefixes) { Complement.AddList('<' + prefixes[key] + '>:snip$'); }

}

CompSnip();
