var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevLib/src/LoadModule.js').ReadAll();
fso = null;
wsh = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevLib/src/Utility.js'));


function Tokenizer(operators, motions) {
    this.operators = operators;
    this.motions = motions;

    this.parseAsNormalCommand = function(cmd) {
        var tmpCmd = cmd;
        var matches = null;

        var opRegex = new RegExp('^(\\d+)?(' + this.operators.join('|') + ')');
        matches = tmpCmd.match(opRegex);
        if (!matches) { return null; }
        tmpCmd = tmpCmd.substring(matches[0].length);
        var opCount = matches[1] ? Number(matches[1]) : 1;
        var operator = matches[2];

        var motRegex = new RegExp('^(\\d+)?(' + this.motions.join('|') + ')$');
        matches = tmpCmd.match(motRegex);
        if (!matches) { return null; }
        var motCount = matches[1] ? Number(matches[1]) : 1;
        var motion = matches[2];
        for (var i = 0; i < motions.length; i++) {
            var extraMatches = motion.match(new RegExp('^' + motions[i] + '$'));
            if (extraMatches) { break; }
        }

        return {
            operator: operator,
            opCount: opCount,
            motion: motion,
            motCount: motCount,
            extraMatches: extraMatches
        };
    };

    this.parseAsDoubleOperator = function(cmd) {
        var tmpCmd = cmd;
        var doubleOperators = {};
        for (var i = 0; i < this.operators.length; i++) {
            doubleOperators[this.operators[i] + this.operators[i]] = this.operators[i];
            if (this.operators[i].charAt(0) === 'g') {
                var op = this.operators[i].substring(1);
                doubleOperators['g' + op + op] = this.operators[i];
            }
        }
        var matches = null;
        var opRegex = new RegExp('^(\\d+)?(' + Utility.getKeys(doubleOperators).join('|') + ')$');
        matches = tmpCmd.match(opRegex);
        if (!matches) { return null; }
        tmpCmd = tmpCmd.substring(matches[0].length);
        var opCount = matches[1] ? Number(matches[1]) : 1;
        var operator = doubleOperators[matches[2]];
        return {
            operator: operator,
            opCount: opCount
        };
    };

    this.parseAsMotionOnly = function(cmd) {
        var tmpCmd = cmd;
        var matches = null;
        var motRegex = new RegExp('^(\\d+)?(' + this.motions.join('|') + ')$');
        matches = tmpCmd.match(motRegex);
        if (!matches) { return null; }
        var motCount = matches[1] ? Number(matches[1]) : 1;
        var motion = matches[2];
        for (var i = 0; i < motions.length; i++) {
            var extraMatches = motion.match(new RegExp('^' + motions[i] + '$'));
            if (extraMatches) { break; }
        }
        return {
            motion: motion,
            motCount: motCount,
            extraMatches: extraMatches
        };
    };

    this.parseAsLineCommand = function(cmd) {
        var matches = cmd.match(new RegExp('^:(\\d+)(?:\\-(\\d+))?(' + this.operators.join('|') + ')$'));
        if (!matches) { return null; }
        var lineFrom = Number(matches[1]);
        var lineTo = matches[2] ? Number(matches[2]) : lineFrom;
        var operator = matches[3];
        return {
            operator: operator,
            lineFrom: lineFrom,
            lineTo: lineTo
        };
    };

    this.parseAsStandalone = function(cmd) {
        var matches = cmd.match(new RegExp('^(\\d+)?(' + this.operators.join('|') + ')$'));
        if (!matches) { return null; }
        var lineFrom = Number(matches[1]);
        var lineTo = matches[2] ? Number(matches[2]) : lineFrom;
        var operator = matches[3];
        return {
            operator: operator,
            lineFrom: lineFrom,
            lineTo: lineTo
        };
    };
}


// var operators = ['y', 'd', 'v', 'gU'];
// var motions = ['h', '0', '\\^', '\\$', 'f(.)'];
// var tknzr = new Tokenizer(operators, motions);
// WScript.Echo(tknzr.parseAsDoubleOperator('12gUU').operator);
