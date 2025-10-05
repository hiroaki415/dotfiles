function getHomeDir() {
    var shell = new ActiveXObject('WScript.Shell');
    return shell.ExpandEnvironmentStrings('%USERPROFILE%');
}

function getRepeatedStr(str, rep) {
    var ret = '';
    for (var i = 0; i < rep; i++) { ret += str; }
    return ret;
}

function getNestDepth(line) {
    var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, "");
    var match = lineStr.match(/^(\s*)/);
    var ret = match ? match[1].length : 0;
    return ret;
}

function isBlankLine(line) {
    var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, "");
    return lineStr === '';
}

function getCTypeConfigs(ctype) {

    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var home = getHomeDir();
    var file = fso.OpenTextFile(home + '\\AppData\\Roaming\\sakura\\sakura.ini', 1);
    var body = file.ReadAll();
    file.Close();

}

function getLineComment(ctype) {

}

function testDev() {
//    Editor.TraceOut('Hello!');
//    Editor.TraceOut('This is Test!');
}

testDev();
