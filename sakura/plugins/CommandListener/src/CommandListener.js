var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function CommandListener(inCmd) {
    var comConf = Utility.evalAsObject(loadModule('/plugins/CommandListener/CommandListenerConfig.json'));
    if (Utility.isArray(comConf.externals)) {
        for (var i = 0; i < comConf.externals.length; i++) {
            var tmpConf = Utility.evalAsObject(loadModule(comConf.externals[i]));
            comConf.modules = comConf.modules.concat(tmpConf.modules);
            comConf.preloads = comConf.preloads.concat(tmpConf.preloads);
            comConf.commands = Utility.mergeObjects([comConf.commands, tmpConf.commands]);
        }
    }
    for (var i = 0; i < comConf.modules.length; i++) {
        eval(loadModule(comConf.modules[i]));
    }
    for (var i = 0; i < comConf.preloads.length; i++) {
        eval(comConf.preloads[i]);
    }

    var result = null;
    for (var cmd in comConf.commands) {
        var handler = comConf.commands[cmd].handler;
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
    return result;
}
