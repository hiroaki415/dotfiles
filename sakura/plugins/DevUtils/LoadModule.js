function loadModule(path) {

    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var pluginDir = Plugin.GetPluginDir();
    var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
    fso = null;

    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 2;
    stream.charset = '_autodetect_all';
    stream.Open();
    stream.LoadFromFile(root + '/' + path);
    var source = stream.ReadText(-1);
    stream.Close();
    stream = null;

    return source;

}
