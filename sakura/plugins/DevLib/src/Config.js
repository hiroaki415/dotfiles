var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/IniParser.js'));
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function Config() {

    this.ini = new IniParser(loadModule('/sakura.ini'));

    this.getExtention = function() { return Editor.ExpandParameter('$b'); };

    this.getTypeNumber = function() {
        var ext = this.getExtention();
        for (var i = 1; i <= 64; i++) {
            if (!this.ini.existsSection('Types(' + i + ')')) { return -1; }
            var exts = this.ini.get('Types(' + i + ')', 'szTypeExts').split(',');
            if (Utility.existsInArray(ext, exts)) { return i; }
        }
        return -1;
    };

    this.getLineCommentDelimiter = function() {
        var typeNum = this.getTypeNumber();
        if (typeNum < 0) { return null; }
        return this.ini.get('Types(' + typeNum + ')', 'szLineComment');
    };
    this.getBlockCommentFrom = function() {
        var typeNum = this.getTypeNumber();
        if (typeNum < 0) { return null; }
        return this.ini.get('Types(' + typeNum + ')', 'szBlockCommentFrom');
    };
    this.getBlockCommentTo = function() {
        var typeNum = this.getTypeNumber();
        if (typeNum < 0) { return null; }
        return this.ini.get('Types(' + typeNum + ')', 'szBlockCommentTo');
    };

    this.getTabWidth = function() { return Editor.ChangeTabWidth(0); };
    this.getIndent = function() {
        var typeNum = this.getTypeNumber();
        if (typeNum < 0) { return null; }
        var flag = this.ini.get('Types(' + typeNum + ')', 'bInsSpace');
        if (flag === '0') {
            return '\t';
        } else {
            return ' ';
        }
        return ' ';
    };
    this.getIndentBlock = function() {
        var typeNum = this.getTypeNumber();
        if (typeNum < 0) { return null; }
        var flag = this.ini.get('Types(' + typeNum + ')', 'bInsSpace');
        if (flag === '0') {
            return '\t';
        } else {
            return Utility.repeatString(' ', this.getTabWidth());
        }
        return Utility.repeatString(' ', this.getTabWidth());
    };
    this.getNewLineCode = function() {
        switch (Editor.GetLineCode()) {
            case 0:
                return '\r\n';
            case 1:
                return '\r';
            case 2:
                return '\n';
            default:
                return '\r\n';
        }
    };

    this.getRootDir = function() {
        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var pluginDir = Plugin.GetPluginDir();
        var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
        fso = null;
        return root;
    };

}
