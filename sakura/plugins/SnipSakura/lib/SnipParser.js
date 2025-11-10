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

    this.COOKIE_NAME = 'SnipSakura';

    this.prefix = null;
    this.nestDepth = 0;
    this.basePosition = null;

    this.currentTarget = 0;
    this.targets = {};

    this.snippet = null;

    this.init = function(prefix, nestDepth, basePosition) {

        this.prefix = prefix;
        this.nestDepth = nestDepth;
        this.basePosition = basePosition;

        this.currentTarget = 0;
        this.targets = {};

        this.snippet = SnipLoader.getSnippet(this.prefix);

        var elements = this.getEscapedElements();

        var node_i = 1;

        for (key in elements) {

            var id = elements[key].getID();
            var etype = elements[key].getType();

            if (id >= 0 && typeof(this.targets[id]) === 'undefined') {
                this.targets[id] = {
                    node: node_i,
                    type: etype,
                    value: elements[key].getInitialText()
                };
            } else if (etype === elements[key].typeEnum.variable) {
                // under construction
            }

            if (
                etype === elements[key].typeEnum.tabstop ||
                etype === elements[key].typeEnum.placeholder ||
                etype === elements[key].typeEnum.choice
            ) {
                node_i++;
            }

        }

        this.loadPositions();

    };

    this.loadPositions = function() {

        var elmText = '';
        var evalText = '';
        var tmpText = '';
        var elements = this.getEscapedElements();

        for (key in elements) {

            elmText = elements[key].getEvaluatedText(this.targets);
            evalText += elmText;
            var id = elements[key].getID();

            if (typeof(this.targets[id]) !== 'undefined') {
                if (typeof(this.targets[id]['position']) === 'undefined') {

                    tmpText = evalText;
                    tmpText = SnipEscape.restore(tmpText);
                    tmpText = SnipEscape.evalIndent(tmpText);

                    var lines = tmpText.split(RegExp(SnipEscape.markers.eReturn.origin));

                    var pos = {
                        line: lines.length - 1,
                        col: lines[lines.length - 1].length - elmText.length + 1,
                        stateSelection: 0,
                        viewTop: this.basePosition.viewTop
                    };

                    if (elmText.length === 0) {
                        this.targets[id]['position'] = pos;
                    } else {
                        pos.stateSelection = 1;
                        pos.lineFrom = pos.line;
                        pos.colFrom = pos.col;
                        pos.lineTo = pos.line;
                        pos.colTo = pos.col + elmText.length
                        this.targets[id]['position'] = pos;
                    }

                }
            }

        }

    };


    this.getJoinedSnippet = function() {
        var body = this.snippet.body;
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

    this.getEscapedElements = function() {
        var jsnip = this.getJoinedSnippet();
        jsnip = SnipEscape.escape(jsnip);
        return SnipFuncs.devideTextIntoElements(jsnip);
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

        // var pobj = Utility.transformObjectIntoPlain(this);
        // TraceOut(Utility.stringifyObject(pobj));

        return evalText;

    };

    this.getCaptureRegex = function() {

        var elements = this.getEscapedElements();

        var evalText = '';
        for (key in elements) {
            var etype = elements[key].getType();
            if (
                etype === elements[key].typeEnum.tabstop ||
                etype === elements[key].typeEnum.placeholder ||
                etype === elements[key].typeEnum.choice
            ) {
                evalText += '(.*?)';
            } else {
                evalText += elements[key].getEvaluatedText(this.targets);
            }
        }

        evalText = SnipEscape.restore(evalText);
        evalText = SnipEscape.evalIndent(evalText);
        evalText = SnipEscape.evalReturn(evalText);

        return evalText;

    };

    this.captureValues = function(eText) {

        var regex = new RegExp('^' + this.getCaptureRegex() + '$');
        var match = regex.exec(eText);

        for (var key in match) {
            if (/\d+/.test(key)) {
                var node = number(key);
                var id = this.getTargetIDFromNode(node);
                if (id >= 0) {
                    this.targets[id].value = match[key];
                }
            }
        }

    };

    this.getTargetIDFromNode = function(node) {
        for (var key in this.targets) {
            if (this.targets[key].node === node) {
                return key;
            }
        }
        return -1;
    };


    this.getPosition = function(id) {
        if (typeof(id) === 'undefined') { id = this.currentTarget; }

        var pos = this.targets[id].position;

        if (pos.line === 0) {
            pos.col += this.basePosition.col - 1;
            if (pos.stateSelection === 1) {
                pos.colFrom += this.basePosition.col - 1;
                pos.colTo += this.basePosition.col - 1;
            }
        }

        pos.line += this.basePosition.line;
        if (pos.stateSelection === 1) {
            pos.lineFrom += this.basePosition.line;
            pos.lineTo += this.basePosition.line;
        }

        return pos;

    };

    this.nextTarget = function() {
        for (var i = this.currentTarget + 1; i < Math.pow(2, 8); i++) {
            if (typeof(this.targets[i]) !== 'undefined') {
                this.currentTarget = i;
                return null;
            }
        }
        if (typeof(this.targets[0]) !== 'undefined') {
            this.currentTarget = 0;
            return null;
        }
    };

    this.prevTarget = function() {
        for (var i = this.currentTarget - 1; i > 0; i--) {
            if (typeof(this.targets[i]) !== 'undefined') {
                this.currentTarget = i;
                return null;
            }
        }
    };


    this.saveCookie = function() {

        var prop = {
            prefix: this.prefix,
            nestDepth: this.nestDepth,
            basePosition: this.basePosition,
            currentTarget: this.currentTarget,
            targets: this.targets
        };

        var cookie = Utility.stringifyObject(prop);
        Editor.SetCookie('document', this.COOKIE_NAME, cookie);

    };

    this.loadCookie = function() {

        var cookie = Editor.GetCookie('document', this.COOKIE_NAME);
        var prop = Utility.evalAsObject(cookie);

        this.prefix = prop.prefix;
        this.nestDepth = prop.nestDepth;
        this.basePosition = prop.basePosition;
        this.currentTarget = prop.currentTarget;
        this.targets = prop.targets;

        this.snippet = SnipLoader.getSnippet(this.prefix);

    };

    this.deleteCookie = function() {
        Editor.DeleteCookie('document', this.COOKIE_NAME);
    };

}
