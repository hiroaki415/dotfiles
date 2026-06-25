var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/BlurryCherry/src/BlurryCherry.js'));
eval(loadModule('/plugins/DevLib/src/Decorator.js'));


var alpha = Plugin.GetOption('Option', 'alpha');
CommandDecorator(BlurryCherry)(alpha);
