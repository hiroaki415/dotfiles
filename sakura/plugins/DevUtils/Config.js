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


function Config() {

    this.raw = null;

    this.load = function() {
        var root = Utility.getRootDir();
        var file = fso.OpenTextFile(root + '/sakura.ini', 1);
        this.raw = file.ReadAll();
        file.Close();
        file = null;
    };

    this.getLineComment = function(ctype) {

    };

}
