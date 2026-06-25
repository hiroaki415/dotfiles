var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/CommandListener/src/CommandListener.js'));
eval(loadModule('/plugins/DevLib/src/Decorator.js'));


var inCmd = Editor.InputBox('Input Command', '', 255);
CommandDecorator(CommandListener)(inCmd);
