var Utility = {};

Utility.getHomeDir = function() {
    var shell = new ActiveXObject('WScript.Shell');
    var home = shell.ExpandEnvironmentStrings('%USERPROFILE%');
    shell = null;
    return home;
};

Utility.getRootDir = function() {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var pluginDir = Plugin.GetPluginDir();
    var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
    fso = null;
    return root;
};

Utility.getRepeatedStr = function(str, rep) {
    var ret = '';
    for (var i = 0; i < rep; i++) { ret += str; }
    return ret;
};

Utility.padLeft = function(num, digits) {
    var str = "" + num;
    while (str.length < digits) {
        str = "0" + str;
    }
    return str;
}


Utility.getMaxInArray = function(array) {
    if (array.length === 0) return null;
    var max = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    return max;
};

Utility.getMinInArray = function(array) {
    if (array.length === 0) return null;
    var min = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] < min) {
            min = array[i];
        }
    }
    return min;
};

Utility.existsInArray = function(target, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
};

Utility.deleteNullOrEmpty = function(array) {
    var newArr = [];
    for (var key in array) {
        if (array[key] !== null && array[key] !== '') {
            newArr.push(array[key]);
        }
    }
    return newArr;
};

Utility.stringifyDict = function(dict) {
    var str = "";
    for (var key in dict) {
        str += key + " : " + dict[key] + "\r\n";
    }
    return str;
};


Utility.generateUUIDv4 = function() {
    function randomHexDigit() {
        return Math.floor(Math.random() * 16).toString(16);
    }

    var uuid = "";
    for (var i = 0; i < 36; i++) {
        switch (i) {
            case 8:
            case 13:
            case 18:
            case 23:
                uuid += "-";
                break;
            case 14:
                uuid += "4";
                break;
            case 19:
                uuid += (8 + Math.floor(Math.random() * 4)).toString(16);
                break;
            default:
                uuid += randomHexDigit();
        }
    }
    return uuid;
}

Utility.TraceOutArray = function(array) {
    for (var key in array) {
        Editor.TraceOut('' + key + ' : ' + array[key]);
    }
}
