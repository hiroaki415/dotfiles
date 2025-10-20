var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function BlurryCherry () {

    var alpha = Plugin.GetOption("Option", "alpha");

    alpha = Math.max(alpha, 25)
    alpha = Math.min(alpha, 255)

    var title = Editor.ExpandParameter('$A');
    var pluginDir = Plugin.GetPluginDir();
    var shell = new ActiveXObject("WScript.Shell");
    // shell.Run(pluginDir + '/SetTransparency.exe "' + title + '" acrylic', 0, true);
    shell.Run(pluginDir + '/SetTransparency.exe "' + title + '" ' + alpha, 0, true);

}


BlurryCherry();
