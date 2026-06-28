var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/CommandListener/src/Tokenizer.js'));
eval(loadModule('/plugins/CommandListener/src/LoadConfig.js'));
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function CommandListener(inCmd) {
    var comConf = LoadConfig('/plugins/CommandListener/CommandListenerConfigs/CommandListenerConfig.json');
    for (var i = 0; i < comConf.modules.length; i++) {
        eval(loadModule(comConf.modules[i]));
    }
    for (var i = 0; i < comConf.preloads.length; i++) {
        eval(comConf.preloads[i]);
    }

}

CommandListener();
