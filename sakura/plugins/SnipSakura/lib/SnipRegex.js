var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipVariable.js'));


var SnipRegex = {};
var _sr = {}; // alias

SnipRegex.reRegex = ".+";
SnipRegex.reOptions = "[dgimsuvy]*";
SnipRegex.reVar = SnipVariable.getListRegex();
SnipRegex.reInt = "[0-9]+";
SnipRegex.reText = ".*";
SnipRegex.reIf = SnipRegex.reText;
SnipRegex.reElse = SnipRegex.reText;

_sr = SnipRegex;


SnipRegex.format = "(" +
                      '\\$'+_sr.reInt + "|" + '\\$\\{'+_sr.reInt+'\\}' + "|" +
                      '\\$\\{'+_sr.reInt+':'+"("+'\\/upcase'+"|"+'\\/downcase'+"|"+'\\/capitalize'+"|" +
                                            +'\\/camelcase'+"|"+'\\/pascalcase'+")"+'\\}' + "|" +
                      '\\$\\{'+_sr.reInt+':\\+'+_sr.reIf+'\\}' + "|" +
                      '\\$\\{'+_sr.reInt+':\\?'+_sr.reIf+':'+_sr.reElse+'\\}' + "|" +
                      '\\$\\{'+_sr.reInt+':\\-'+_sr.reElse+'\\}' + "|" + '\\$\\{'+_sr.reInt+':'+_sr.reElse+'\\}' +
                      ")";
SnipRegex.transform = '\\/'+_sr.reRegex+'\\/'+"("+_sr.format+"|"+_sr.reText+")+"+'\\/'+_sr.reOptions;

_sr = SnipRegex;


SnipRegex.reAny = '.+';
SnipRegex.tabstop = "(" +
                      '\\$'+_sr.reInt + "|" +
                      '\\$\\{'+_sr.reInt+'\\}' + "|" +
                      '\\$\\{'+_sr.reInt+_sr.transform+'\\}' +
                      ")";
SnipRegex.placeholder = '\\$\\{'+_sr.reInt+':'+_sr.reAny+'\\}';
SnipRegex.choice = '\\$\\{'+_sr.reInt+'\\|'+_sr.reText+"("+','+_sr.reText+")*"+'\\|\\}';
SnipRegex.variable = "(" +
                      '\\$'+_sr.reVar + "|" + '\\$\\{'+_sr.reVar+'\\}' + "|" +
                      '\\$\\{'+_sr.reVar+':'+_sr.reAny+'\\}' + "|" +
                      '\\$\\{'+_sr.reVar+_sr.transform+'\\}' +
                      ")";

_sr = null;
