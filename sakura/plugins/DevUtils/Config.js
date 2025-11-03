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

    this._dict = {};

    this.load = function() {
        var iniPath = Editor.ExpandParameter('$I');
        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var file = fso.OpenTextFile(iniPath, 1);
        var raw = file.ReadAll();
        file.Close();
        file = null;
        fso = null;

        this._parseRaw(raw);

    };

    this._parseRaw = function(raw) {

        var lines = raw.split(/\r\n/);
        var currentBlock = null;
        var blockDict = {};

        for (var i in lines) {

            if (/^\[.*\]$/.test(lines[i])) {
                if (currentBlock !== null) { this._dict[currentBlock] = blockDict; }
                currentBlock = lines[i];
                blockDict = {};
                continue;
            }

            var index = lines[i].indexOf("=");
            var key = lines[i].substring(0, index);
            var valueArr = lines[i].substring(index + 1).split(',');

            blockDict[key] = valueArr;

            if (Number(i) === (lines.length - 1) ) { this._dict[currentBlock] = blockDict; }

        }
    };

    this.getLineCommentDelimiter = function() {

        var ext = Editor.ExpandParameter('$b');

        for (var i = 0;  i < Math.pow(2, 8);  i++) {
            var exts = this._dict['[Types(' + i + ')]']['szTypeExts'];
            if (Utility.existsInArray(ext, exts)) {
                return this._dict['[Types(' + i + ')]']['szLineComment'][0];
            }
            if (typeof(this._dict['[Types(' + (i + 1) + ')]']) === "undefined") { break; }
        }

        return '';

    };

    this.getBlockCommentFrom = function() {

        var ext = Editor.ExpandParameter('$b');

        for (var i = 0;  i < Math.pow(2, 8);  i++) {
            var exts = this._dict['[Types(' + i + ')]']['szTypeExts'];
            if (Utility.existsInArray(ext, exts)) {
                return this._dict['[Types(' + i + ')]']['szBlockCommentFrom'][0];
            }
            if (typeof(this._dict['[Types(' + (i + 1) + ')]']) === "undefined") { break; }
        }

        return '';

    };

    this.getBlockCommentTo = function() {

        var ext = Editor.ExpandParameter('$b');

        for (var i = 0;  i < Math.pow(2, 8);  i++) {
            var exts = this._dict['[Types(' + i + ')]']['szTypeExts'];
            if (Utility.existsInArray(ext, exts)) {
                return this._dict['[Types(' + i + ')]']['szBlockCommentTo'][0];
            }
            if (typeof(this._dict['[Types(' + (i + 1) + ')]']) === "undefined") { break; }
        }

        return '';

    };

    this.getTab = function() {

        var ext = Editor.ExpandParameter('$b');

        for (var i = 0;  i < Math.pow(2, 8);  i++) {
            var exts = this._dict['[Types(' + i + ')]']['szTypeExts'];
            if (Utility.existsInArray(ext, exts)) {
                if (this._dict['[Types(' + i + ')]']['bInsSpace'][0] === '0') {
                    return '\t';
                } else if (this._dict['[Types(' + i + ')]']['bInsSpace'][0] === '1') {
                    return Utility.getRepeatedStr(' ', Editor.ChangeTabWidth(0));
                }
            }
            if (typeof(this._dict['[Types(' + (i + 1) + ')]']) === "undefined") { break; }
        }

        return '';

    };


    this.load();

}
