function loadModule(path, encoding) {
    if (encoding === undefined) { encoding = 'UTF-8'; }
    var wsh = new ActiveXObject("WScript.Shell");
    var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 2;
    stream.charset = encoding;
    stream.Open();
    stream.LoadFromFile(root + path);
    var source = stream.ReadText(-1);
    stream.Close();
    stream = null;
    wsh = null;

    return source;

}
