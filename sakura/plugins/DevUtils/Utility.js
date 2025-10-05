var Utility = {};

Utility.getHomeDir = function() {
    var shell = new ActiveXObject('WScript.Shell');
    return shell.ExpandEnvironmentStrings('%USERPROFILE%');
};

Utility.getRepeatedStr = function(str, rep) {
    var ret = '';
    for (var i = 0; i < rep; i++) { ret += str; }
    return ret;
};
