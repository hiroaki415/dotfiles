var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function KeyEventListener(chr) {
    var comConf = Utility.evalAsObject(loadModule('/plugins/KeyEventListener/KeyEventListenerConfig.json'));
    if (Utility.isArray(comConf.externals)) {
        for (var i = 0; i < comConf.externals.length; i++) {
            var tmpConf = Utility.evalAsObject(loadModule(comConf.externals[i]));
            comConf.modules = comConf.modules.concat(tmpConf.modules);
            comConf.preloads = comConf.preloads.concat(tmpConf.preloads);
            comConf.handlers = comConf.handlers.concat(tmpConf.handlers);
        }
    }
    if (Utility.existsAsKey(chr, comConf.handlers)) {
        var result = null;
        for (var i = 0; i < comConf.modules.length; i++) {
            eval(loadModule(comConf.modules[i]));
        }
        for (var i = 0; i < comConf.preloads.length; i++) {
            eval(comConf.preloads[i]);
        }
        if (typeof(comConf.handlers[chr]) === 'string') {
            eval(comConf.handlers[chr]);
        } else if (Utility.isArray(comConf.handlers[chr])) {
            for (var i = 0; i < comConf.handlers[chr].length; i++) {
                eval(comConf.handlers[chr][i]);
            }
        }
        return result;
    }
}
