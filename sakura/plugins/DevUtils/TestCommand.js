if (typeof(root) === 'undefined') {
    var root = Editor.ExpandParameter('$I').replace(/\\[^\\]*$/, '').replace(/\\/g, '/');
}
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval('var root = "' + root + '";' +
    loadModule(root + '/plugins/DevUtils/Decorator.js') +
    loadModule(root + '/plugins/DevUtils/Cursor.js') +
    loadModule(root + '/plugins/DevUtils/Config.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


function testCommand() {
    // Write Test Script Here
    // Editor.MessageBox('Hello World!');
    // Editor.StatusMsg('Hello World!');
    // Editor.TraceOut('Hello World!');

    var conf = new Config();

    MessageBox(conf.getLineCommentDelimiter());

}


CommandDecorator(testCommand)();
