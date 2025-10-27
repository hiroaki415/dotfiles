var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Utility.js'));


var SnipLoader = {};

SnipLoader.snipDirectory = '/plugins/SnipSakura/snippets';

SnipLoader.getRegexFileName = function (ext) {
    return RegExp('(^' + ext + '(_[a-zA-Z0-9_]*\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets))*)|' +
                    '(^global_*[a-zA-Z0-9_]*\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets))');
};


SnipLoader.getSnippet = function (prefix, ext) {
    if (typeof(ext) === 'undefined') { ext = ext = Editor.ExpandParameter('$b'); }

    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var folder = fso.GetFolder(Utility.getRootDir() + SnipLoader.snipDirectory);
    var files = new Enumerator(folder.Files);

    for (; !files.atEnd(); files.moveNext()) {

        var file = files.item();
        var regexFile = SnipLoader.getRegexFileName(ext);

        if (regexFile.test(file.Name)) {
            var snipRaw = loadModule(SnipLoader.snipDirectory + '/' + file.Name);
            snipRaw = snipRaw; // .replace(/\\/g, "\\\\");
            var snippets = eval('(' + snipRaw + ')');
            for (key in snippets){
                if (prefix === snippets[key].prefix) {
                    fso = null;
                    return snippets[key];
                }
            }
        }

    }

    return null;

};

SnipLoader.getPrefixesBeginWith = function (str, ext) {
    if (typeof(ext) === 'undefined') { ext = ext = Editor.ExpandParameter('$b'); }

    var prefixes = [];

    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var folder = fso.GetFolder(Utility.getRootDir() + SnipLoader.snipDirectory);
    var files = new Enumerator(folder.Files);

    for (; !files.atEnd(); files.moveNext()) {

        var file = files.item();
        var regexFile = new SnipLoader.getRegexFileName(ext);

        if (regexFile.test(file.Name)) {
            var snipRaw = loadModule(SnipLoader.snipDirectory + '/' + file.Name);
            snipRaw = snipRaw;
            var snippets = eval('(' + snipRaw + ')');
            for (key in snippets){
                var prefix = snippets[key].prefix;
                var normPrefix = prefix.replace(/^[^\w_]+/, "");
                if (RegExp('^' + str + ".*").test(normPrefix)) {
                    prefixes.push(prefix);
                }
            }
        }

    }

    fso = null;
    return prefixes;

};
