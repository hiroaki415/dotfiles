var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function testCommand() {
    // Write Test Script Here
    // Editor.MessageBox('Hello World!');
    // Editor.StatusMsg('Hello World!');
    // Editor.TraceOut('Hello World!');

    var conf = new Config();

    MessageBox(conf.getLineCommentDelimiter());

}


CommandDecorator(testCommand)();
