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
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function ExpandSnippet() {

    var cur = new Cursor();
    var originCur = cur.getProperty();

    cur.move(originCur.line, originCur.col - 6, 1);
    if (cur.selectedStr === ':snip$' ) {
        MessageBox('hello');
    } else {
        cur.loadProperty(originCur);
    }

}

function JumpNext() {
    var cur = new Cursor();
    cur.jumpMatch(/(\$\d+)|(\$\{\d+\:.+\})|(\$\{\d+\|.+(.+\,)+.+\|\})/);
}

function JumpPrev() {
    var cur = new Cursor();
    // cur.jumpMatch(/(\$\d+)|(\$\{\d+\:.+\})|(\$\{\d+\|.+(.+\,)+.+\|\})/, false);

    Utility.TraceOutArray(cur.getWordList());

}


function SnipElement(rawText) {

    this.rawText = rawText;
    this.id = -1;
    this.type = null;
    this.children = [];

    this.choices = [];

    this.typeEnum = {
        text: 'text',
        tabstop: 'tabstop',
        named: 'named',
        choice: 'choice'
    }


    this._parseElement = function(rawText){

        if (/^\$\d+$/.test(rawText)) {

            this.type = this.typeEnum.tabstop;
            this.id = Number(rawText.substring(1));
            this.rawText = '';

        } else if (/^\$[A-Z_]+$/.test(rawText)) {

            this.type = this.typeEnum.text;
            var token = rawText.substring(1);
            var varVal = SnipFuncs.getValFromVariable(token);
            if (varVal === '') { varVal = token; }
            this.rawText = varVal;

        } else {

            if (/^\$\{\d+\:\w+\}$/.test(rawText)) {

                this.type = this.typeEnum.named;
                var index = rawText.indexOf(':');
                this.id = Number(rawText.substring(2, index));
                this.rawText = rawText.substring(index + 1, rawText.length - 1);

                var regex = /(\$\d+|\$\{[\d\u]+.*\})/g;
                if (regex.exec(this.rawText)) !== null) {
                    this.children = SnipFuncs.parseRawText(this.rawText);
                }

            } else if (/^\$\{\d+\|.+(.+\,)+.+\|\}$/.test(rawText)) {

                this.type = this.typeEnum.choice;
                var index = rawText.indexOf('|');
                this.id = Number(rawText.substring(2, index));
                this.choices = rawText.substring(index + 1, rawText.length - 2).split(',');
                this.rawText = '_CHOICE_';

            } else if (/^\$\{[a-zA-Z0-9_]+\:.+\}$/.test(rawText)) {

                this.type = this.typeEnum.text;
                var index = rawText.indexOf(':');
                var defaultText = rawText.substring(index + 1, rawText.length - 1);
                var token = rawText.substring(2, index - 1);
                var varVal = SnipFuncs.getValFromVariable(token);
                if (varVal === '') { varVal = defaultText; }
                this.rawText = varVal;

            } else {

                this.type = this.typeEnum.text;
                this.rawText = rawText;

            }

        }

    };

    this.getEvaluatedText = function(){
        // 
    };

}


var SnipFuncs = {};

SnipFuncs.parseRawText = function() {

    var regex = /(\$\d+|\$\{[\d\u]+.*\})/g;
    var elements = [];
    var lastIndex = 0;
    var match;

    while ((match = regex.exec(rawText)) !== null) {

        if (match.index > lastIndex) {
            var slicedText = rawText.substring(lastIndex, match.index);
            elements.push(new SnipElement(slicedText));
        }

        var token = match[0];
        elements.push(new SnipElement(token));

        lastIndex = regex.lastIndex;

    }

    if (lastIndex < rawText.length) {
        var slicedText = rawText.substring(lastIndex);
        elements.push(new SnipElement(slicedText));
    }

    return elements;

};

SnipFuncs.getValFromVariable = function(varToken) {

    var val = '';

    var cur = new Cursor();
    var originCur = cur.getProperty();
    var conf = new Config();

    var today = new Date();
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    switch (varToken) {
        case 'TM_SELECTED_TEXT':
            val = cur.seletedStr;
            break;
        case 'TM_CURRENT_LINE':
            val = cur.getLine();
            break;
        case 'TM_CURRENT_WORD':
            val = cur.getCurrentWord();
            break;
        case 'TM_LINE_INDEX':
            val = String(cur.line - 1);
            break;
        case 'TM_LINE_NUMBER':
            val = String(cur.line);
            break;
        case 'TM_FILENAME':
            val = Editor.ExpandParameter('$f');
            break;
        case 'TM_FILENAME_BASE':
            val = Editor.ExpandParameter('$g');
            break;
        case 'TM_DIRECTORY':
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var file = fso.GetFile(Editor.ExpandParameter('$/'));
            val = fso.GetParentFolderName(file) + '\\';
            fso = null;
            break;
        case 'TM_FILEPATH':
            val = Editor.ExpandParameter('$/');
            break;
        case 'RELATIVE_FILEPATH':
            val = '';  // not supported
            break;
        case 'CLIPBOARD':
            val = Editor.GetClipboard(0);
            break;
        case 'WORKSPACE_NAME':
            val = '';  // not supported
            break;
        case 'WORKSPACE_FOLDER':
            val = '';  // not supported
            break;
        case 'CURSOR_INDEX':
            val = String(cur.col - 1);
            break;
        case 'CURSOR_NUMBER':
            val = String(cur.col);
            break;
        case 'CURRENT_YEAR':
            val = String(today.getFullYear());
            break;
        case 'CURRENT_YEAR_SHORT':
            val = String(today.getFullYear() - 2000);
            break;
        case 'CURRENT_MONTH':
            val = String(today.getMonth() + 1);
            break;
        case 'CURRENT_MONTH_NAME':
            val = monthNames[today.getMonth()];
            break;
        case 'CURRENT_MONTH_NAME_SHORT':
            val = monthNames[today.getMonth()].substring(0,3);
            break;
        case 'CURRENT_DATE':
            var date = today.getDate();
            val = (day < 10 ? '0' : '') + day;
            break;
        case 'CURRENT_DAY_NAME':
            val = dayNames[today.getDay()];
            break;
        case 'CURRENT_DAY_NAME_SHORT':
            val = dayNames[today.getDay()].substring(0,3);
            break;
        case 'CURRENT_HOUR':
            val = String(today.getHours());
            break;
        case 'CURRENT_MINUTE':
            val = String(today.getMinutes());
            break;
        case 'CURRENT_SECOND':
            val = String(today.getSeconds());
            break;
        case 'CURRENT_SECOND_UNIX':
            val = String(Math.floor(Date.now()/1000));
            break;
        case 'CURRENT_TIMEZONE_OFFSET':
            var offset = -today.getTimezoneOffset();
            var hh = (Math.abs(offset)/60 < 10 ? '0' : '') + Math.floor(Math.abs(offset)/60);
            var mm = (Math.abs(offset)%60 < 10 ? '0' : '') + Math.abs(offset)%60;
            val = (offset >=0 ? '+' : '-') + hh + ':' + mm;
            break;
        case 'RANDOM':
            val = Utility.padLeft(Math.floor(Math.random()*Math.pow(10,6)), 6);
            break;
        case 'RANDOM_HEX':
            val = Utility.padLeft(Math.floor(Math.random()*Math.pow(16,6)).toString(16), 6);
            break;
        case 'UUID':
            val = Utility.generateUUIDv4();
            break;
        case 'BLOCK_COMMENT_START':
            val = conf.getBlockCommentFrom();
            break;
        case 'BLOCK_COMMENT_END':
            val = conf.getBlockCommentTo();
            break;
        case 'LINE_COMMENT':
            val = cur.comDelim;
            break;
    }

    cur.loadProperty(originCur);

    return val;

};


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
