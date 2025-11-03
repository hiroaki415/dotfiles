var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipElement.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipFuncs.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipEscape.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipRegex.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipVariable.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SnipParser() {

    this.prefix = null;
    this.nestDepth = 0;
    this.basePosition = null;

    this.currentTarget = -1;
    this.targets = [];

    this.init = function(prefix, nestDepth, basePosition) {

        this.prefix = prefix;
        this.nestDepth = nestDepth;
        this.basePosition = basePosition;

        this.currentTarget = -1;
        this.targets = [];

        var elements = this.getEscapedElements();

        for (key in elements) {
            var id = elements[key].getID();
            var etype = elements[key].getType();
            if (id > 0 && typeof(this.targets[id]) === 'undefined') {
                this.targets[id] = {
                    type: etype,
                    value: null
                };
                this.targets[id].value = elements[key].getEvaluatedText(this.targets);
            } else if (etype === elements[key].typeEnum.variable) {
                // 
            }
        }

    };


    this.getEscapedElements = function() {
        var jsnip = this.getJoinedSnippet();
        jsnip = SnipEscape.escape(jsnip);
        return SnipFuncs.devideIntoElements(jsnip);
    };

    this.getEvaluatedText = function() {

        var elements = this.getEscapedElements();

        var evalText = '';
        for (key in elements) {
            evalText += elements[key].getEvaluatedText(this.targets);
        }

        evalText = SnipEscape.restore(evalText);
        evalText = SnipEscape.evalIndent(evalText);
        evalText = SnipEscape.evalReturn(evalText);

        return evalText;

    };

    this.getPosition = function(elementID) {

        var evalText = '';
        var elements = this.getEscapedElements();

        for (var i = 0; i < elementID; i++) { evalText += elements[i].getEvaluatedText(); }

        evalText = SnipEscape.restore(evalText);
        evalText = SnipEscape.evalIndent(evalText);

        var lines = evalText.split(RegExp(SnipEscape.markers.eReturn.escape));
        var elmText = elements[i].getEvaluatedText(this.targets);

        var pos = {
            line: lines.length - 1,
            col: lines[lines.length - 1].length + 1,
            stateSelection: 0,
            viewTop: this.basePosition.viewTop
        };

        if (elmText.length === 0) {
            return pos;
        } else {
            pos.stateSelection = 1;
            pos.lineFrom = pos.line;
            pos.colFrom = pos.col;
            pos.lineTo = pos.line;
            pos.colTo = pos.col + elmText.length
            return pos;
        }

    };

    this.getJoinedSnippet = function() {
        var snippet = SnipLoader.getSnippet(this.prefix)
        var body = snippet.body;
        if (Utility.isArray(body)) {
            var jsnip = '';
            for (key in body) {
                if (Utility.isFirstKey(key, body) === false) {
                    jsnip += Utility.getRepeatedStr(' ', this.nestDepth);
                }
                jsnip += body[key] + '\\n';
            }
        } else {
            var jsnip = body + '\\n';
        }
        return jsnip;
    };

    this.getNextTarget = function() {
        // 
    };

    this.getPrevTarget = function() {
        // 
    };

    this.saveCookie = function() {
        // 
    };

    this.loadCookie = function() {
        // 
    };

    this.deleteCookie = function() {
        // 
    };

}
