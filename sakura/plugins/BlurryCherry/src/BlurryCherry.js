var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Utility.js'));

function BlurryCherry (alpha) {
    if (alpha < 30 || 255 < alpha) {
        return '[BlurryChery]Warning: alpha is must be between 30 and 255';
    }

    var pspath = Utility.getAppDir() + '/sakura/plugins/BlurryCherry/src/SetLayeredWindowAttributes.ps1';
    var process = 'sakura';

    var shell = new ActiveXObject("WScript.Shell");
    shell.Run('powershell.exe -ExecutionPolicy Bypass -Command ' + '"' +
        'import-Module ' + pspath + ';' +
        'Set-LayeredWindowAttributes -Process ' + process +' -Alpha ' + alpha + ';' +
    '"', 0, true);
    shell = null;

    return '[BlurryChery]Info: applied transparency to window.'

}
