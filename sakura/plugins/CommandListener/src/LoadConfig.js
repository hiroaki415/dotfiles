var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function LoadConfig(path) {
    var comConf = Utility.evalAsObject(loadModule(path));
    if (Utility.isArray(comConf.externals)) {
        var externals = comConf.externals;
        for (var i = 0; i < externals.length; i++) {
            var tmpConf = Utility.evalAsObject(loadModule(externals[i]));
            comConf = Utility.mergeObjects([comConf, tmpConf]);
        }
    }
    return comConf;
}
