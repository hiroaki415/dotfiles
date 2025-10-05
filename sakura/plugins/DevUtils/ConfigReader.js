function ConfigReader() {

    this.getCTypeConfigs = function(ctype) {

        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var home = getHomeDir();
        var file = fso.OpenTextFile(home + '\\AppData\\Roaming\\sakura\\sakura.ini', 1);
        var body = file.ReadAll();
        file.Close();

    };

    this.getLineComment function(ctype) {

    };

}
