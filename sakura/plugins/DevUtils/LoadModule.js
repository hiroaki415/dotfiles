function loadModule(path) {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var pluginDir = Plugin.GetPluginDir();
    var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
    var file = fso.OpenTextFile(root + path, 1);
    var code = file.ReadAll();
    file.Close();
    file = null;
    fso = null;
    return code;
}
