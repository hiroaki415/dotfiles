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
    this.types = {};

    this.load = function() {
        var root = Utility.getRootDir();
        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var file = fso.OpenTextFile(root + '/sakura.ini', 1);
        this.raw = file.ReadAll();
        file.Close();
        file = null;

        this.parseRaw();

        TraceOut(this.types['C/C++']['szTypeExts']);

    };

    this.parseRaw = function(ctype) {

        var lines = this.raw.split(/\r\n/);
        var type = {szTypeName:'dummy'};

        for (var i in lines) {

            if (/\[Types\(\d+\)\]/.test(lines[i])) {
                this.types[type.szTypeName] = type;
                type = {szTypeName:'dummy'};
            }

            var index = lines[i].indexOf("=");
            var key = lines[i].substring(0, index);
            var value = lines[i].substring(index + 1);

            if (false) {
                //
            } else {
                type[key] = value;
            }

            if (Number(i) === (lines.length - 1) ) { this.types[type.szTypeName] = type; }

        }
    };

    this.getLineComment = function(ctype) {

    };

}
