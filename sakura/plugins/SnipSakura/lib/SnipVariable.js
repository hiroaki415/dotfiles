var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Cursor.js'));
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


var SnipVariable = {

    varList: [
                {
                    token: 'TM_SELECTED_TEXT',
                    getVal: function(){
                        var cur = new Cursor();
                        return cur.seletedStr;
                    }
                },
                {
                    token: 'TM_CURRENT_LINE',
                    getVal: function(){
                        var cur = new Cursor();
                        return cur.getLine();
                    }
                },
                {
                    token: 'TM_CURRENT_WORD',
                    getVal: function(){
                        var cur = new Cursor();
                        return cur.getCurrentWord();
                    }
                },
                {
                    token: 'TM_LINE_INDEX',
                    getVal: function(){
                        var cur = new Cursor();
                        return String(cur.line - 1);
                    }
                },
                {
                    token: 'TM_LINE_NUMBER',
                    getVal: function(){
                        var cur = new Cursor();
                        return String(cur.line);
                    }
                },
                {
                    token: 'TM_FILENAME',
                    getVal: function(){
                        return Editor.ExpandParameter('$f');;
                    }
                },
                {
                    token: 'TM_FILENAME_BASE',
                    getVal: function(){
                        return Editor.ExpandParameter('$g');
                    }
                },
                {
                    token: 'TM_DIRECTORY',
                    getVal: function(){
                        var fso = new ActiveXObject("Scripting.FileSystemObject");
                        var file = fso.GetFile(Editor.ExpandParameter('$/'));
                        var val = fso.GetParentFolderName(file) + '\\';
                        fso = null;
                        return val;
                    }
                },
                {
                    token: 'TM_FILEPATH',
                    getVal: function(){
                        return Editor.ExpandParameter('$/');
                    }
                },
                {
                    token: 'RELATIVE_FILEPATH',
                    getVal: function(){
                        return '';  // not supported
                    }
                },
                {
                    token: 'CLIPBOARD',
                    getVal: function(){
                        return Editor.GetClipboard(0);
                    }
                },
                {
                    token: 'WORKSPACE_NAME',
                    getVal: function(){
                        return '';  // not supported
                    }
                },
                {
                    token: 'WORKSPACE_FOLDER',
                    getVal: function(){
                        return '';  // not supported
                    }
                },
                {
                    token: 'CURSOR_INDEX',
                    getVal: function(){
                        var cur = new Cursor();
                        return String(cur.col - 1);
                    }
                },
                {
                    token: 'CURSOR_NUMBER',
                    getVal: function(){
                        var cur = new Cursor();
                        return String(cur.col);
                    }
                },
                {
                    token: 'CURRENT_YEAR',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getFullYear());
                    }
                },
                {
                    token: 'CURRENT_YEAR_SHORT',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getFullYear() - 2000);
                    }
                },
                {
                    token: 'CURRENT_MONTH',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getMonth() + 1);
                    }
                },
                {
                    token: 'CURRENT_MONTH_NAME',
                    getVal: function(){
                        var today = new Date();
                        return SnipVariable.monthNames[today.getMonth()];
                    }
                },
                {
                    token: 'CURRENT_MONTH_NAME_SHORT',
                    getVal: function(){
                        var today = new Date();
                        return SnipVariable.monthNames[today.getMonth()].substring(0,3);
                    }
                },
                {
                    token: 'CURRENT_DATE',
                    getVal: function(){
                        var today = new Date();
                        var date = today.getDate();
                        return (day < 10 ? '0' : '') + day;
                    }
                },
                {
                    token: 'CURRENT_DAY_NAME',
                    getVal: function(){
                        var today = new Date();
                        return SnipVariable.dayNames[today.getDay()];
                    }
                },
                {
                    token: 'CURRENT_DAY_NAME_SHORT',
                    getVal: function(){
                        var today = new Date();
                        return SnipVariable.dayNames[today.getDay()].substring(0,3);
                    }
                },
                {
                    token: 'CURRENT_HOUR',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getHours());
                    }
                },
                {
                    token: 'CURRENT_MINUTE',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getMinutes());
                    }
                },
                {
                    token: 'CURRENT_SECOND',
                    getVal: function(){
                        var today = new Date();
                        return String(today.getSeconds());
                    }
                },
                {
                    token: 'CURRENT_SECOND_UNIX',
                    getVal: function(){
                        var today = new Date();
                        return String(Math.floor(Date.now()/1000));
                    }
                },
                {
                    token: 'CURRENT_TIMEZONE_OFFSET',
                    getVal: function(){
                        var today = new Date();
                        var offset = -today.getTimezoneOffset();
                        var hh = (Math.abs(offset)/60 < 10 ? '0' : '') + Math.floor(Math.abs(offset)/60);
                        var mm = (Math.abs(offset)%60 < 10 ? '0' : '') + Math.abs(offset)%60;
                        return (offset >=0 ? '+' : '-') + hh + ':' + mm;
                    }
                },
                {
                    token: 'RANDOM',
                    getVal: function(){
                        return Utility.padLeft(Math.floor(Math.random()*Math.pow(10,6)), 6);;
                    }
                },
                {
                    token: 'RANDOM_HEX',
                    getVal: function(){
                        return Utility.padLeft(Math.floor(Math.random()*Math.pow(16,6)).toString(16), 6);
                    }
                },
                {
                    token: 'UUID',
                    getVal: function(){
                        return Utility.generateUUIDv4();
                    }
                },
                {
                    token: 'BLOCK_COMMENT_START',
                    getVal: function(){
                        var conf = new Config();
                        return conf.getBlockCommentFrom();
                    }
                },
                {
                    token: 'BLOCK_COMMENT_END',
                    getVal: function(){
                        var conf = new Config();
                        return conf.getBlockCommentTo();
                    }
                },
                {
                    token: 'LINE_COMMENT',
                    getVal: function(){
                        var conf = new Config();
                        return cur.comDelim;
                    }
                },
    ],

    monthNames : [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],

    dayNames : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],


    evaluate : function(token){
        for (var key in SnipVariable.varList){
            if (v === token) {
                return SnipVariable.varList[key].getVal();
                break;
            }
        }
    },

    getListRegex : function() {
        var regex = '(';
        for (var key in SnipVariable.varList){
            regex = regex + SnipVariable.varList[key].token + '|';
        }
        regex = regex.substring(0, regex.length - 1) + ')';
        return regex;
    }

};
