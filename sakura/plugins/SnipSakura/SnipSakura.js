var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipParser.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipRegex.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipLoader.js'));
eval(loadModule('/plugins/DevUtils/Decorator.js'));
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function ExpandSnippet() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    cur.searchPrev('<.+>:snip\\$', 0x1804);

    if (cur.lineTo === originCur.line && cur.colTo === originCur.col ) {

        var str = cur.selectedText;
        var prefix = str.substring(1, str.length - 7);
        var snippet = SnipLoader.getSnippet(prefix);

        if (snippet !== null) {

            var body = snippet.body;
            if (snippet.body.constructor === Array) {
                body[0] = cur.getLineTextBeforeCursor() + body[0];
                var normSnip = '';
                for (key in body) { normSnip = normSnip + body[key] + '\\n'; }
                // normSnip = normSnip.substring(2);
            } else {
                var normSnip = cur.getLineTextBeforeCursor() + body + '\\n';
            }

            // var cookie = new SnipCookie(parser.getCookie());
            // cookie.clear(); // delete previous session
            // cookie.save();

            cur.clearLine();
            var parser = new SnipParser(normSnip, cur.getNestDepth());
            cur.insertText(parser.getEvaluatedText());

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
    cur.searchNext('<[a-zA-Z0-9_]+>:snip\\$', 0x1804);
}

function JumpPrev() {
    var cur = new Cursor();
    cur.searchPrev('<[a-zA-Z0-9_]+>:snip\\$', 0x1804);
    // cur.jumpMatch(/(\$\d+)|(\$\{\d+\:.+\})|(\$\{\d+\|.+(.+\,)+.+\|\})/, false);

    // var str = '${TM_CURRENT_LINE/fg/dfg/g}'
    // var regex = new RegExp('^' + SnipRegex.variable + '$');
    // if ((match = regex.exec(str)) !== null) {
    //     MessageBox('match!');
    // } else {
    //     MessageBox('failed...');
    // }

    // var se = new SnipElement('${76:gs sesysres rtts4}');
    // MessageBox(se.getDefaultField());

    // TraceOut(SnipRegex.variable);

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
