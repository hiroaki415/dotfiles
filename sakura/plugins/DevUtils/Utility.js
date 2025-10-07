var Utility = {};

Utility.getHomeDir = function() {
    var shell = new ActiveXObject('WScript.Shell');
    var home = shell.ExpandEnvironmentStrings('%USERPROFILE%');
    shell = null;
    return home;
};

Utility.getRootDir = function() {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var pluginDir = Plugin.GetPluginDir();
    var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
    fso = null;
    return root;
};

Utility.getRepeatedStr = function(str, rep) {
    var ret = '';
    for (var i = 0; i < rep; i++) { ret += str; }
    return ret;
};
