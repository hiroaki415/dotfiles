function loadModule(path) {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var file = fso.OpenTextFile(path, 1);
    var code = file.ReadAll();
    file.Close();
    return code;
}
