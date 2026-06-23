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
    loadModule(root + '/plugins/DevUtils/Config.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);

var SnipEscape = {

    markers: {
        backSlash:
            {origin: '\\\\\\\\' , escape: '__ESC_BACKSLASH__', doubleBS: '\\\\\\\\\\\\\\\\'},
        dollar:
            {origin: '\\\\\\$'  , escape: '__ESC_DOLLAR__'   , doubleBS: '\\\\\\\\\\$'     },
        lBrace:
            {origin: '\\\\\\{'  , escape: '__ESC_LBRACE__'   , doubleBS: '\\\\\\\\\\{'     },
        rBrace:
            {origin: '\\\\\\}'  , escape: '__ESC_RBRACE__'   , doubleBS: '\\\\\\\\\\}'     },
        indent:
            {origin: '\\\\t'    , escape: '__ESC_INDENT__'   , doubleBS: '\\\\\\\\t'       },
        eReturn:
            {origin: '\\\\n'    , escape: '__ESC_RETURN__'   , doubleBS: '\\\\\\\\n'       }
    },
    
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

    // deduplicateBackSlash: function (str) {
    //     var convStr = str;
    //     for (key in SnipEscape.markers) {
    //         convStr = convStr.replace( RegExp( SnipEscape.markers[key].doubleBS ,'g'),
    //                                     eval('"' + SnipEscape.markers[key].origin + '"'));
    //     }
    //     return convStr;
    // },

    evalIndent: function (str, ind) {
        if (typeof(ind) === 'undefined') {
            var conf = new Config();
            ind = conf.getIndent();
        }
        return str.replace( RegExp( SnipEscape.markers.indent.origin ,'g'), ind);
    },

    evalReturn: function (str, code) {
        if (typeof(code) === 'undefined') { code = Utility.getLineCode(); }
        return str.replace( RegExp( SnipEscape.markers.eReturn.origin ,'g'), code);
    }

};
