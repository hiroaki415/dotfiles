var Utility = {

    getHomeDir : function() {
        var shell = new ActiveXObject('WScript.Shell');
        var home = shell.ExpandEnvironmentStrings('%USERPROFILE%');
        shell = null;
        return home;
    },

    getRootDir : function() {
        var fso = new ActiveXObject('Scripting.FileSystemObject');
        var pluginDir = Plugin.GetPluginDir();
        var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
        fso = null;
        return root;
    },

    getLineCode : function() {
        switch (Editor.GetLineCode()) {
            case 0:
                return '\r\n';
            case 1:
                return '\r';
            case 2:
                return '\n';
        }
    },


    getRepeatedStr : function(str, rep) {
        var ret = '';
        for (var i = 0; i < rep; i++) { ret += str; }
        return ret;
    },

    padLeft : function(num, digits) {
        var str = "" + num;
        while (str.length < digits) {
            str = "0" + str;
        }
        return str;
    },


    isArray : function(obj) {
        return obj && obj.constructor === Array;
    },

    isPlainObject : function(obj) {
        return obj && obj.constructor === Object;
    },

    getMaxInArray : function(array) {
        if (array.length === 0) return null;
        var max = array[0];
        for (var i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    },

    getMinInArray : function(array) {
        if (array.length === 0) return null;
        var min = array[0];
        for (var i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
            }
        }
        return min;
    },

    existsInArray : function(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === target) {
                return true;
            }
        }
        return false;
    },

    getIndexOfKey : function(key, obj) {
        var i = 0;
        for (var k in obj) {
            if (key === k) {
                return i;
            };
            i++;
        }
        return null;
    },

    isFirstKey : function(key, obj) {
        var keys = [];
        for (var k in obj) {
            keys.push(k);
        }
        return key === keys[0];
    },

    isLastKey : function(key, obj) {
        var keys = [];
        for (var k in obj) {
            keys.push(k);
        }
        return key === keys[keys.length - 1];
    },

    deleteNullOrEmpty : function(array) {
        var newArr = [];
        for (var key in array) {
            if (array[key] !== null && array[key] !== '') {
                newArr.push(array[key]);
            }
        }
        return newArr;
    },

    generateUUIDv4 : function() {
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
    },


    evalAsObject : function(str) {
        return eval('(' + str + ')');
    },

    stringifyObject : function(obj, nest, str) {
        if (typeof(nest) === 'undefined') { nest = 0; }
        if (typeof(str) === 'undefined') { str = ''; }

        str += Utility.getRepeatedStr(' ', nest);
        if (Utility.isArray(obj)) {
            str += '[';
        } else if (Utility.isPlainObject(obj)) {
            str += '{';
        }
        str += '\r\n';

        for (var key in obj) {

            if (typeof(obj[key]) !== 'string' && typeof(obj[key]) !== 'number' &&
                !Utility.isArray(obj[key]) && !Utility.isPlainObject(obj[key])) {
                break;
            }

            str += Utility.getRepeatedStr(' ', nest + 4);
            if (Utility.isPlainObject(obj)) {
                str += '"' + key + '"' + " : ";
            }

            if (typeof(obj[key]) === 'object') {
                if (Utility.isArray(obj)) {
                    str = str.substring(0, str.length - nest - 4);
                    str = Utility.stringifyObj(obj[key], nest + 4, str);
                } else if (Utility.isPlainObject(obj)) {
                    str += '\r\n';
                    str = Utility.stringifyObj(obj[key], nest + 8, str);
                }
            } else if (typeof(obj[key]) === 'string') {
                str += '"' + obj[key] + '"';
            } else if (typeof(obj[key]) === 'number') {
                str += obj[key];
            }

            if (Utility.isLastKey(key, obj) !== true) {
                str += ',';
            }

            str += '\r\n';
        }

        str += Utility.getRepeatedStr(' ', nest);
        if (Utility.isArray(obj)) {
            str += ']';
        } else if (Utility.isPlainObject(obj)) {
            str += '}';
        }

        return str;

    }

};
