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
    if (Utility.isArray(comConf.externals)) {
        for (var i = 0; i < comConf.externals.length; i++) {
            var tmpConf = Utility.evalAsObject(loadModule(comConf.externals[i]));
            comConf.modules = comConf.modules.concat(tmpConf.modules);
            comConf.preloads = comConf.preloads.concat(tmpConf.preloads);
            comConf.commands = comConf.commands.concat(tmpConf.commands);
        }
    }
    for (var i = 0; i < comConf.modules.length; i++) {
        eval(loadModule(comConf.modules[i]));
    }
    for (var i = 0; i < comConf.preloads.length; i++) {
        eval(comConf.preloads[i]);
    }
    var inCmd = Editor.InputBox('Input Command', '', 255);
    for (var i = 0; i < comConf.commands.length; i++) {
        var cmd = comConf.commands[i].command;
        var handler = comConf.commands[i].handler;
        var matches = inCmd.match(new RegExp('^' + cmd + '$'));
        if (matches) {
            if (typeof(handler) === 'string') {
                eval(handler);
            } else if (Utility.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    eval(handler[i]);
                }
            }
            break;
        }
    }
}


CommandDecorator(CommandListener)();
