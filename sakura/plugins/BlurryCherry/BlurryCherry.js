var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Utility.js'));


function BlurryCherry () {

    var pspath = Plugin.GetPluginDir() + '\\SetLayeredWindowAttributes.ps1';
    var process = 'sakura';
    var alpha = Plugin.GetOption('Option', 'alpha');

    var shell = new ActiveXObject("WScript.Shell");
    shell.Run('powershell.exe -ExecutionPolicy Bypass -Command ' + '"' +
        'import-Module ' + pspath + ';' +
        'Set-LayeredWindowAttributes -Process ' + process +' -Alpha ' + alpha + ';' +
    '"', 0, true);
    shell = null;

}


BlurryCherry();
