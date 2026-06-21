var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function CommandListener() {
    var comConf = Utility.evalAsObject(loadModule('/plugins/CommandListener/CommandListenerConfig.json'));
    for (var i = 0; i < comConf.modules.length; i++) {
        eval(loadModule(comConf.modules[i]));
    }
    for (var i = 0; i < comConf.preload.length; i++) {
        eval(comConf.preload[i]);
    }
    var cmd = Editor.InputBox('Input Command', '', 255);
    eval(comConf.commands[cmd]);
}


CommandDecorator(CommandListener)();
