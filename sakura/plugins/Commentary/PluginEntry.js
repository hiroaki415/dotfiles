var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/Commentary/src/Commentary.js'));
eval(loadModule('/plugins/DevLib/src/Decorator.js'));


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
        case 1:
            CommandDecorator(CommentOut)();
            break;
        case 2:
            CommandDecorator(Uncomment)();
            break;
    }
})();
