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
    loadModule(root + '/plugins/SnipSakura/lib/SnipLoader.js') +
    loadModule(root + '/plugins/DevUtils/Cursor.js')
);


function CompSnip () {

    var word = Complement.GetCurrentWord();
    var prefixes = SnipLoader.getPrefixesBeginWith(word);
    for (key in prefixes) { Complement.AddList('<' + prefixes[key] + '>:snip$'); }

}

CompSnip();
