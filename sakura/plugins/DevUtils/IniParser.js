var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Utility.js'));

function IniParser(str) {

    this.ini = str;

    this.get = function (section, key) {
        section = Utility.escapeRegExp(section);
        key = Utility.escapeRegExp(key);
        var secMatches = this.ini.match(new RegExp("\\[" + section + "\\]([\\s\\S]*?)(?=\\r?\\n\\s*\\[|$)", "i"));
        if (secMatches) {
            var sectionContent = secMatches[1];
            var keyMatch = sectionContent.match(new RegExp(key + "\\s*=\\s*(.*?)(?=\\r?\\n|;|$)", "i"));
            if (keyMatch) {
                return keyMatch[1];
            }
        }
        return undefined;
    };

    this.existsSection = function(section) {
        section = Utility.escapeRegExp(section);
        return this.ini.match(new RegExp("\\[" + section + "\\]", "i")) !== null;
    };

}
