var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Utility.js'));

var SnipEscape = {

    markers: [
        {origin: '\\\\\\\\' , escape: '__ESC_BACKSLASH__', doubleBS: '\\\\\\\\\\\\\\\\'},
        {origin: '\\\\\\$'  , escape: '__ESC_DOLLAR__'   , doubleBS: '\\\\\\\\\\$'     },
        {origin: '\\\\\\{'  , escape: '__ESC_LBRACE__'   , doubleBS: '\\\\\\\\\\{'     },
        {origin: '\\\\\\}'  , escape: '__ESC_RBRACE__'   , doubleBS: '\\\\\\\\\\}'     },
        {origin: '\\\\t'    , escape: '__ESC_INDENT__'   , doubleBS: '\\\\\\\\t'       },
        {origin: '\\\\n'    , escape: '__ESC_RETURN__'   , doubleBS: '\\\\\\\\n'       }
    ],
    
    escape: function (str) {
        var convStr = str;
        for (key in SnipEscape.markers) {
            convStr = convStr.replace( RegExp( SnipEscape.markers[key].origin ,'g'),
                                        eval('"' + SnipEscape.markers[key].escape + '"'));
        }
        return convStr;
    },

    restore: function (str) {
        var convStr = str;
        for (key in SnipEscape.markers) {
            convStr = convStr.replace( RegExp( SnipEscape.markers[key].escape ,'g'),
                                        eval('"' + SnipEscape.markers[key].origin + '"'));
        }
        return convStr;
    },

    duplicateBackSlash: function (str) {
        var convStr = str;
        for (key in SnipEscape.markers) {
            convStr = convStr.replace( RegExp( SnipEscape.markers[key].origin ,'g'),
                                        eval('"' + SnipEscape.markers[key].doubleBS + '"'));
        }
        return convStr;
    },

    deduplicateBackSlash: function (str) {
        var convStr = str;
        for (key in SnipEscape.markers) {
            convStr = convStr.replace( RegExp( SnipEscape.markers[key].doubleBS ,'g'),
                                        eval('"' + SnipEscape.markers[key].origin + '"'));
        }
        return convStr;
    },

    evalIndent: function (str, tabw) {
        if (typeof(tabw) === 'undefined') { tabw = Editor.ChangeTabWidth(0); }
        var convStr = str;
        for (key in SnipEscape.markers) {
            if (SnipEscape.markers[key].escape === '__ESC_INDENT__') {
                convStr = convStr.replace( RegExp( SnipEscape.markers[key].origin ,'g'),
                                            Utility.getRepeatedStr(' ', tabw));
            }
        }
        return convStr;
    },

    evalReturn: function (str, code) {
        if (typeof(code) === 'undefined') { code = Utility.getLineCode(); }
        var convStr = str;
        for (key in SnipEscape.markers) {
            if (SnipEscape.markers[key].escape === '__ESC_RETURN__') {
                convStr = convStr.replace( RegExp( SnipEscape.markers[key].origin ,'g'),
                                            code);
            }
        }
        return convStr;
    }

};
