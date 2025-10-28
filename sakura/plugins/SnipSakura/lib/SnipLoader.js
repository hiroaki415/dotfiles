var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipEscape.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


var SnipLoader = {};

SnipLoader.DIRECTORY = '/plugins/SnipSakura/snippets';

SnipLoader.getRegexFileName = function (ext) {
    return RegExp('(^' + ext + '(_[a-zA-Z0-9_]*)?\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets)$)|' +
                    '(^global(_[a-zA-Z0-9_]*)?\.(json)|(JSON)|(txt)|(TXT)|(code\-snippets)$)');
};


SnipLoader.getSnippet = function (str, ext) {
    if (typeof(ext) === 'undefined') { ext = Editor.ExpandParameter('$b'); }
    return SnipLoader._runSearch(str, ext, SnipLoader.mode.equal);
};

SnipLoader.getPrefixesBeginWith = function (str, ext) {
    if (typeof(ext) === 'undefined') { ext = Editor.ExpandParameter('$b'); }
    return SnipLoader._runSearch(str, ext, SnipLoader.mode.beginWith);
};


SnipLoader.mode = {
    equal: 'equal',
    beginWith: 'beginWith'
};

SnipLoader._runSearch = function (str, ext, mode) {

    var prefixes = [];

    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var folder = fso.GetFolder(Utility.getRootDir() + SnipLoader.DIRECTORY);
    var files = new Enumerator(folder.Files);

    for (; !files.atEnd(); files.moveNext()) {

        var file = files.item();
        var regexFile = new SnipLoader.getRegexFileName(ext);

        if (regexFile.test(file.Name)) {
            var snipRaw = loadModule(SnipLoader.DIRECTORY + '/' + file.Name);
            snipRaw = SnipEscape.duplicateBackSlash(snipRaw);
            var snippets = eval('(' + snipRaw + ')');
            for (key in snippets){

                var prefix = snippets[key].prefix;

                if (mode === SnipLoader.mode.equal && str === prefix) {
                    fso = null;
                    return snippets[key];
                }

                if (mode === SnipLoader.mode.beginWith) {
                    var normPrefix = prefix.replace(/^[^\w_]+/, "");
                    if (RegExp('^' + str + ".*").test(normPrefix)) {
                        prefixes.push(prefix);
                    }
                }

            }
        }

    }

    fso = null;

    if (mode === SnipLoader.mode.equal) {
        return null;
    } else if (mode === SnipLoader.mode.beginWith) {
        return prefixes;
    }

};
