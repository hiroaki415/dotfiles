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
            comConf.preload = comConf.preload.concat(tmpConf.preload);
            comConf.handlers = comConf.handlers.concat(tmpConf.handlers);
        }
    }
    for (var i = 0; i < comConf.modules.length; i++) {
        eval(loadModule(comConf.modules[i]));
    }
    for (var i = 0; i < comConf.preload.length; i++) {
        eval(comConf.preload[i]);
    }
    var cmd = Editor.InputBox('Input Command', '', 255);
    for (var key in comConf.commands) {
        var matches = cmd.match(new RegExp('^' + key + '$'));
        if (matches) {
            if (typeof(comConf.commands[key]) === 'string') {
                eval(comConf.commands[key]);
            } else if (Utility.isArray(comConf.commands[key])) {
                for (var i = 0; i < comConf.commands[key].length; i++) {
                    eval(comConf.commands[key][i]);
                }
            }
            eval(comConf.commands[key]);
        }
    }
}


CommandDecorator(CommandListener)();
