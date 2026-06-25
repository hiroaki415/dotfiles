var Utility = {

    getHomeDir : function() {
        var shell = new ActiveXObject('WScript.Shell');
        var home = shell.ExpandEnvironmentStrings('%USERPROFILE%');
        shell = null;
        return home;
    },

    getAppDir : function() {
        var shell = new ActiveXObject('WScript.Shell');
        var home = shell.ExpandEnvironmentStrings('%APPDATA%');
        shell = null;
        return home;
    },

    getTempDir : function() {
        var shell = new ActiveXObject('WScript.Shell');
        var temp = shell.ExpandEnvironmentStrings('%TEMP%');
        shell = null;
        return temp;
    },

    repeatString : function(str, num) {
        return Array(num + 1).join(str);
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


    existsInArray : function(target, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === target) {
                return true;
            }
        }
        return false;
    },


    existsInObject : function(val, obj) {
        for (var k in obj) {
            if (obj[k] === val) {
                return true;
            }
        }
        return false;
    },

    existsAsKey : function(key, obj) {
        for (var k in obj) {
            if (k === key) {
                return true;
            }
        }
        return false;
    },

    getIndexOfKey : function(key, obj) {
        var i = 0;
        for (var k in obj) {
            if (k === key) {
                return i;
            };
            i++;
        }
        return null;
    },

    getKeyFromValue : function(val, obj) {
        for (var k in obj) {
            if (obj[k] === val) {
                return k;
            };
        }
        return null;
    },

    isFirstKey : function(key, obj) {
        var keys = [];
        for (var k in obj) {
            return k === key;
            break;
        }
        return false;
    },

    isLastKey : function(key, obj) {
        var keys = [];
        for (var k in obj) {
            keys.push(k);
        }
        return key === keys[keys.length - 1];
    },

    deleteNullOrEmpty : function(obj) {
        var newObj = [];
        for (var key in obj) {
            if (obj[key] !== null && obj[key] !== '') {
                newObj.push(obj[key]);
            }
        }
        return newObj;
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

    mergeObjects: function (objs, overWrite) {
        if (overWrite === undefined) { overWrite = false; }
        var result = {};
        for (var i = 0; i < objs.length; i++) {
            for (var key in objs[i]) {
                if (objs[i].hasOwnProperty(key)) {
                    if (!Utility.existsAsKey(key, result) || overWrite) {
                        result[key] = objs[i][key];
                    }
                }
            }
        }
        return result;
    },

    transformObjectIntoPlain : function(obj) {
        var pobj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && (
                    typeof(obj[key]) === 'string' || typeof(obj[key]) === 'number' ||
                    Utility.isArray(obj[key]) || Utility.isPlainObject(obj[key])
                )
            ) {
                pobj[key] = obj[key];
            }
        }
        return pobj;
    },

    stringifyObject : function(obj, depth) {
        if (obj === null) { return 'null'; }
        if (obj === undefined) { return 'undefined'; }
        if (depth === undefined) { depth = 0; };
        var type = typeof obj;
        if (type === 'number' || type === 'boolean') { return obj.toString(); }
        if (type === 'string') {
            return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
        }
        if (obj instanceof Array || Object.prototype.toString.call(obj) === '[object Array]') {
            var arr = [];
            for (var i = 0; i < obj.length; i++) {
                arr.push(
                    Utility.repeatString(' ', (depth + 1) * 4) + 
                    Utility.JsonStringify(obj[i], depth + 1)
                );
            }
            var ret = '[\n';
            ret += arr.join(',\n') + '\n' + Utility.repeatString(' ', depth * 4) + ']';
            return ret;
        }
        if (type === 'object') {
            var pairs = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    pairs.push(
                        Utility.repeatString(' ', (depth + 1) * 4) + 
                        '"' + key + '":' + Utility.JsonStringify(obj[key], depth + 1)
                    );
                }
            }
            var ret = '{\n';
            ret += pairs.join(',\n');
            ret += '\n' + Utility.repeatString(' ', depth * 4) + '}';
            return ret;
        }
        return 'null';
    },

    escapeRegExp : function(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    dummy : null

};
