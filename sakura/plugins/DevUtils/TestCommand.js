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
eval(loadModule('/plugins/DevUtils/Config.js'));


function testCommand() {
//    Write Test Script Here
//
//    Editor.MessageBox('Hello World!');
//    Editor.StatusMsg('Hello World!');
//    Editor.TraceOut('Hello World!');
    var conf = new Config();
    conf.load();
}


CommandDecorator(testCommand)();
