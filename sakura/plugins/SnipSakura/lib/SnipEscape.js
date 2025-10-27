var SnipEscape = {

    markers: [
        { origin: '\\\\\\\\' , escape: '__ESC_BACKSLASH__'},
        { origin: '\\\\\\$' , escape: '__ESC_DOLLAR__'},
        { origin: '\\\\\\{' , escape: '__ESC_LBRACE__'},
        { origin: '\\\\\\}' , escape: '__ESC_RBRACE__'},
        { origin: '\\\\t'  , escape: '__ESC_INDENT__'},
        { origin: '\\\\n'  , escape: '__ESC_RETURN__'}
    ],
    
    escape: function (str) {
        var escStr = str;
        for (key in SnipEscape.markers) {
            escStr = escStr.replace( RegExp( SnipEscape.markers[key].origin ,'g') ,
                                        eval('"' + SnipEscape.markers[key].escape + '"'));
        }
        return escStr;
    },

    restore: function (str) {
        var resStr = str;
        for (key in SnipEscape.markers) {
            resStr = resStr.replace( RegExp( SnipEscape.markers[key].escape ,'g') ,
                                        eval('"' + SnipEscape.markers[key].origin + '"'));
        }
        return resStr;
    }

};


// var stream = new ActiveXObject("ADODB.Stream");
// stream.Type = 2;
// stream.charset = '_autodetect_all';
// stream.Open();
// stream.LoadFromFile('C:\\Users\\hiroa\\dotfiles\\sakura\\plugins\\SnipSakura\\lib\\_test.txt');
// var txt = stream.ReadText(-1);
// stream.close();
// stream = null;

// WScript.Echo(txt);
// WScript.Echo(SnipEscape.escape(txt));
// WScript.Echo(SnipEscape.restore(SnipEscape.escape(txt)));
