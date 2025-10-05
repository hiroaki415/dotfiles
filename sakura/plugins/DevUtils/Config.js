function Config() {

    this.config = null;

    this.read = function() {
        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var home = getHomeDir();
        var file = fso.OpenTextFile(home + '\\AppData\\Roaming\\sakura\\sakura.ini', 1);
        this.config = file.ReadAll();
        file.Close();
    };

    this.getLineComment function(ctype) {

    };

}
