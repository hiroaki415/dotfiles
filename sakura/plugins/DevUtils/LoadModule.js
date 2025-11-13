function loadModule(path) {

    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 2;
    stream.charset = '_autodetect_all';
    stream.Open();
    stream.LoadFromFile(path);
    var source = stream.ReadText(-1);
    stream.Close();
    stream = null;

    return source;

}
