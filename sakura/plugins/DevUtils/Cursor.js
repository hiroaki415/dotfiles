var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Config.js'));


function Cursor() {

    this.line = 0;
    this.col = 0;

    this.stateSelection = Editor.IsTextSelected();
    this.stateEnum = {
        notSelected: 0,
        selected: 1,
        selectedAsBox: 2
    };

    this.fromLine = 0;
    this.fromCol = 0;
    this.toLine = 0;
    this.toCol = 0;

    this.selectedStr = null;

    this.viewTop = 0;

    var conf = new Config();
    this.comDelim = conf.getLineCommentDelimiter();


    this.getProperty = function() {
        var copy = {};
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                copy[key] = this[key];
            }
        }
        return copy;
    };

    this.read = function() {

        this.line = Number(Editor.ExpandParameter('$y'));
        this.col = Number(Editor.ExpandParameter('$x'));

        this.stateSelection = Editor.IsTextSelected();

        if (this.stateSelection !== this.stateEnum.notSelected) {

            var fLine = Editor.GetSelectLineFrom();
            var fCol = Editor.GetSelectColmFrom();
            var tLine = Editor.GetSelectLineTo();
            var tCol = Editor.GetSelectColmTo();

            this.fromLine = Editor.LayoutToLogicLineNum(fLine);
            this.fromCol = Editor.LineColumnToIndex(fLine, fCol);
            this.toLine = Editor.LayoutToLogicLineNum(tLine);
            this.toCol = Editor.LineColumnToIndex(tLine, tCol);

            this.selectedStr = Editor.GetSelectedString(0);

        } else {
            this.fromLine = 0;
            this.fromCol = 0;
            this.toLine = 0;
            this.toCol = 0;
            this.selectedStr = null;
        }

        this.viewTop = Editor.GetViewTop();

    };

    this.move = function(line, col, opt) {
        Editor.MoveCursor(line, col, opt);
        this.read();
    };

    this.moveLeft = function() {
        this.move(this.line, this.col - 1, 0);
    };

    this.moveRight = function() {
        this.move(this.line, this.col + 1, 0);
    };

    this.moveUp = function() {
        this.move(this.line - 1, this.col, 0);
    };

    this.moveDown = function() {
        this.move(this.line + 1, this.col, 0);
    };

    this.selectCurrentWord = function() {
        Editor.SelectWord();
        this.read();
    }

    this.loadProperty = function(prop, offsetCol) {

        if (typeof(offsetCol) === "undefined") { offsetCol = 0; }

        if (prop.stateSelection === prop.stateEnum.notSelected) {
            this.move(prop.line, prop.col + offsetCol, 0);
        } else {
            if (prop.fromLine !== prop.toLine) {
                if (prop.line === prop.fromLine) {
                    this.move(prop.toLine, prop.toCol + offsetCol, 0);
                    this.move(prop.fromLine, prop.fromCol + offsetCol, 1);
                } else {
                    this.move(prop.fromLine, prop.fromCol + offsetCol, 0);
                    this.move(prop.toLine, prop.toCol + offsetCol, 1);
                }
            } else {
                if (prop.col === prop.fromCol) {
                    this.move(prop.toLine, prop.toCol + offsetCol, 0);
                    this.move(prop.fromLine, prop.fromCol + offsetCol, 1);
                } else {
                    this.move(prop.fromLine, prop.fromCol + offsetCol, 0);
                    this.move(prop.toLine, prop.toCol + offsetCol, 1);
                }
            }
        }

        Editor.SetViewTop(prop.viewTop);

        this.read();

    };


    this.insertText = function(str) {
        Editor.InsText(str);
        this.read();
    };

    this.deleteWithoutBack = function() {
        Editor.Delete(0);
        this.read();
    };

    this.deleteBack = function() {
        Editor.DeleteBack(0);
        this.read();
    };

    this.indent = function() {
        Editor.IndentTab(0);
        this.read();
    };

    this.unindent = function() {
        Editor.UnindentTab(0);
        this.read();
    };


    this.deleteCommentDelimiter = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        if (this.isCommentLine(line) === true) {
            var originCur = this.getProperty();
            var nestDep = this.getNestDepth(line);
            var offset = (originCur.line === line) && (originCur.col > (nestDep + 1)) ? -this.comDelim.length : 0;
            this.move(line, (nestDep + 1), 0);
            for (var i = 0; i < (this.comDelim.length); i++) { this.deleteWithoutBack(); }
            if (this.getNextChar() === ' ') {
                this.deleteWithoutBack();
                offset = offset - 1;
            }
            this.loadProperty(originCur, offset);
        }
    };


    this.isFirstLine = function() {
        return this.line === 1;
    };

    this.isLastLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        return line === Editor.GetLineCount(0);
    };

    this.isBeginOfLine = function() {
        return this.col === 1;
    };

    this.isEndOfLine = function() {
        var lineStr = Editor.GetLineStr(this.line).replace(/[\r\n]/g, '');
        return this.col === (lineStr.length + 1);
    };

    this.beginWith = function(str, line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, '');
        return lineStr.substring(0, str.length) === str;
    };

    this.isCommentLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var lineStr = Editor.GetLineStr(line).replace(/[\s\r\n]/g, '');
        return lineStr.substring(0, this.comDelim.length) === this.comDelim;
    };

    this.isBlankLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, '');
        return lineStr === '';
    };


    this.jumpMatch = function(regex, afterCursor) {
        if (typeof(afterCursor) === 'undefined') { afterCursor = true; }

        var originCur = this.getProperty();
        var targetCur = this.getProperty();
        var lineStr = null;
        var match = null;

        if (afterCursor) {
            var condition = function(i) { return i <= Editor.GetLineCount(0); }
            var nextVal = function(i) { return i + 1; }
        } else {
            var condition = function(i) { return i >= 1; }
            var nextVal = function(i) { return i - 1; }
        }

        for (var i = this.line; condition(i); i = nextVal(i)) {

            if (this.line === i) {
                lineStr = this.getLineAfterCursor().substring(1);
            } else {
                this.move(i, 1, 0)
                lineStr = this.getLine();
            }

            match = regex.exec(lineStr);

            if (match) {

                targetCur.line = this.line;
                targetCur.fromLine = this.line;
                targetCur.toLine = this.line;

                targetCur.col = match.index + 1;
                targetCur.fromCol = match.index + 1;
                targetCur.toCol = match.index + match[0].length + 1;

                targetCur.stateSelection = this.stateEnum.selected;

                targetCur.viewTop = this.viewTop;

                this.loadProperty(targetCur);
                break;

            }

        }

        if (match === null) { this.loadProperty(originCur); }

    };


    this.getCurrentWord = function() {
        var originCur = this.getProperty();
        this.selectCurrentWord();
        var word = this.selectedStr;
        this.loadProperty(originCur);
        return word;
    }

    this.getLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        return Editor.GetLineStr(line).replace(/[\r\n]/g, '');
    }

    this.getLineAfterCursor = function() {
        var lineStr = Editor.GetLineStr(this.line).replace(/[\r\n]/g, '');
        return lineStr.substring(this.col - 1);
    }

    this.getLineBeforeCursor = function() {
        var lineStr = Editor.GetLineStr(this.line).replace(/[\r\n]/g, '');
        return lineStr.substring(0, this.col - 1);
    }

    this.getNestDepth = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var lineStr = Editor.GetLineStr(line).replace(/[\r\n]/g, '');
        var match = lineStr.match(/^(\s*)/);
        var ret = match ? match[1].length : 0;
        return ret;
    };

    this.getPrevChar = function() {
        var chr = null;
        if (this.isBeginOfLine() === false) {
            var originCur = this.getProperty();
            this.moveLeft();
            this.move(this.line, this.col + 1, 1);
            chr = this.selectedStr;
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.getNextChar = function() {
        var chr = null;
        if (this.isEndOfLine() === false) {
            var originCur = this.getProperty();
            this.moveRight();
            this.move(this.line, this.col - 1, 1);
            chr = this.selectedStr;
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.getWordList = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var words = Utility.deleteNullOrEmpty(this.getLine().split(' '));
        return words;
    };


    this.read();

}
