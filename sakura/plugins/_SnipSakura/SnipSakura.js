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
    loadModule(root + '/plugins/SnipSakura/lib/SnipParser.js') +
    loadModule(root + '/plugins/SnipSakura/lib/SnipRegex.js') +
    loadModule(root + '/plugins/SnipSakura/lib/SnipLoader.js') +
    loadModule(root + '/plugins/DevUtils/Decorator.js') +
    loadModule(root + '/plugins/DevUtils/Cursor.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


function ExpandSnippet() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    cur.searchPrev('<[^<>:\$]+>:snip\\$', 0x1804);

    if (cur.lineTo === originCur.line && cur.colTo === originCur.col ) {

        var str = cur.selectedText;
        var prefix = str.substring(1, str.length - 7);

        if (SnipLoader.getSnippet(prefix) !== null) {

            cur.deleteBack();

            var parser = new SnipParser();
            parser.deleteCookie();
            parser.init(prefix, cur.getNestDepth(), cur.getProperty());
            cur.insertText(parser.getEvaluatedText());

            parser.nextTarget();
            var pos = parser.getPosition();
            cur.loadProperty(pos);
            parser.saveCookie();

            var msg = '[Info]Snip$akura: expand snippet prefix<' + prefix + '>'
            return msg;

        } else {
            cur.loadProperty(originCur);
            var msg = '[Info]Snip$akura: not found prefix<' + prefix + '>'
            return msg;
        }

    } else {
        cur.loadProperty(originCur);
    }

}

function JumpNext() {
    var cur = new Cursor();
    var parser = new SnipParser();
    parser.loadCookie();
    parser.nextTarget();
    var pos = parser.getPosition();
    cur.loadProperty(pos);
    parser.saveCookie();
}

function JumpPrev() {
    var cur = new Cursor();
    var parser = new SnipParser();
    parser.loadCookie();
    parser.prevTarget();
    var pos = parser.getPosition();
    MessageBox(Utility.stringifyObject(pos)); // ?
    cur.loadProperty(pos);
    parser.saveCookie();
}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
        case 1:
            CommandDecorator(ExpandSnippet)();
            break;
        case 2:
            CommandDecorator(JumpNext)();
            break;
        case 3:
            CommandDecorator(JumpPrev)();
            break;
    }
})();
