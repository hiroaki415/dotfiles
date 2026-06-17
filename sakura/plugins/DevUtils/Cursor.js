var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;


eval(loadModuleRaw);
eval(loadModule('/plugins/DevUtils/Config.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function Cursor() {

    this.stateEnum = {
        notSelected: 0,
        selected: 1,
        selectedAsBox: 2
    };

    this.getLine = function() { return Number(Editor.ExpandParameter('$y')); };
    this.getCol = function() { return Number(Editor.ExpandParameter('$x')); };

    this.getStateSelection = function() { return Editor.IsTextSelected(); };
    this.getLineFrom = function() {
        var lineF = Editor.GetSelectLineFrom();
        return Editor.LayoutToLogicLineNum(lineF);
    };
    this.getColFrom = function() {
        var colF = Editor.GetSelectColmFrom();
        return Editor.LineColumnToIndex(this.getLineFrom(), colF);
    };
    this.getLineTo = function() {
        var lineT = Editor.GetSelectLineTo();
        return Editor.LayoutToLogicLineNum(lineT);
    };
    this.getColTo = function() {
        var colT = Editor.GetSelectColmTo();
        return Editor.LineColumnToIndex(this.getLineTo(), colT);
    };

    this.getSelectedText = function() { return Editor.GetSelectedString(0); };
    this.getViewTop = function() { return Editor.GetViewTop(); };

    this.move = function(line, col, opt) { Editor.MoveCursor(line, col, opt); };
    this.moveLeft = function(opt) {
        if (typeof(opt) === 'undefined') { opt = 0; }
        this.move(this.getLine(), this.getCol() - 1, opt);
    };
    this.moveRight = function(opt) {
        if (typeof(opt) === 'undefined') { opt = 0; }
        this.move(this.getLine(), this.getCol() + 1, opt);
    };
    this.moveUp = function() {this.move(this.getLine() - 1, this.getCol(), 0); };
    this.moveDown = function() { this.move(this.getLine() + 1, this.getCol(), 0); };
    this.selectCurrentWord = function() { Editor.SelectWord(); }

    this.insertText = function(str) { Editor.InsText(str); };
    this.deleteWithoutBack = function() { Editor.Delete(0); };
    this.deleteBack = function() { Editor.DeleteBack(0); };

    this.indent = function() { Editor.IndentTab(0); };
    this.unindent = function() { Editor.UnindentTab(0); };
    this.enter = function() { Editor.Char(13); };


    this.getProperty = function() {
        var prop = {};
        prop.line = this.getLine();
        prop.col = this.getCol();
        prop.stateSelection = this.getStateSelection();
        if (this.getStateSelection() !== this.stateEnum.notSelected) {
            prop.lineFrom = this.getLineFrom();
            prop.colFrom = this.getColFrom();
            prop.lineTo = this.getLineTo();
            prop.colTo = this.getColTo();
            prop.selectedText = this.getSelectedText();
        }
        prop.viewTop = this.getViewTop();
        return prop;
    };

    this.isEqualTo = function(prop) {
        var ret = true;
        ret = ret && this.getLine() === prop.line;
        ret = ret && this.getCol() === prop.col;
        if (this.getStateSelection() !== this.stateEnum.notSelected) {
            ret = ret && this.getLineFrom() === prop.lineFrom;
            ret = ret && this.getColFrom() === prop.colFrom;
            ret = ret && this.getLineTo() === prop.lineTo;
            ret = ret && this.getColTo() === prop.colTo;
        }
        return ret;
    };

    this.loadProperty = function(prop, offsetCol) {
        if (typeof(offsetCol) === "undefined") { offsetCol = 0; }

        if (prop.stateSelection === this.stateEnum.notSelected) {
            this.move(prop.line, prop.col + offsetCol, 0);
        } else {
            if (prop.lineFrom !== prop.lineTo) {
                if (prop.line === prop.lineFrom) {
                    this.move(prop.lineTo, prop.colTo + offsetCol, 0);
                    this.move(prop.lineFrom, prop.colFrom + offsetCol, 1);
                } else {
                    this.move(prop.lineFrom, prop.colFrom + offsetCol, 0);
                    this.move(prop.lineTo, prop.colTo + offsetCol, 1);
                }
            } else {
                if (prop.col === prop.colFrom) {
                    this.move(prop.lineTo, prop.colTo + offsetCol, 0);
                    this.move(prop.lineFrom, prop.colFrom + offsetCol, 1);
                } else {
                    this.move(prop.lineFrom, prop.colFrom + offsetCol, 0);
                    this.move(prop.lineTo, prop.colTo + offsetCol, 1);
                }
            }
        }

        Editor.SetViewTop(prop.viewTop);

    };


    this.deleteLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }

        var originCur = this.getProperty();

        this.move(line, 1);
        Editor.DeleteLine();

        if (originCur.line > line) {
            originCur.line = originCur.line -1;
            if (originCur.stateSelection !== originCur.stateEnum.notSelected) {
                originCur.lineFrom = originCur.lineFrom -1;
                originCur.lineTo = originCur.lineTo -1;
            }
        }

        this.loadProperty(originCur);

    };

    this.clearLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }

        var originCur = this.getProperty();

        this.move(line, this.getLineText(line).length + 1);
        Editor.LineDeleteToStart();

        this.loadProperty(originCur);

    };


    this.deleteCommentDelimiter = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        if (this.isCommentLine(line) === true) {
            var conf = new Config();
            var comDelim = conf.getLineCommentDelimiter();
            var originCur = this.getProperty();
            var nestDep = this.getNestDepth(line);
            var offset = (originCur.line === line) && (originCur.col > (nestDep + 1)) ? -comDelim.length : 0;
            this.move(line, (nestDep + 1), 0);
            for (var i = 0; i < (comDelim.length); i++) { this.deleteWithoutBack(); }
            if (this.getNextChar() === ' ') {
                this.deleteWithoutBack();
                offset = offset - 1;
            }
            this.loadProperty(originCur, offset);
        }
    };


    this.isFirstLine = function() {
        return this.getLine() === 1;
    };

    this.isLastLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        return line === Editor.GetLineCount(0);
    };

    this.isBeginOfLine = function() {
        return this.getCol() === 1;
    };

    this.isEndOfLine = function() {
        var lineStr = this.getLineText();
        return this.getCol() === (lineStr.length + 1);
    };

    this.beginWith = function(str, line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        var lineStr = this.getLineText(line);
        return lineStr.substring(0, str.length) === str;
    };

    this.isCommentLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        var conf = new Config();
        var comDelim = conf.getLineCommentDelimiter();
        var lineStr = this.getLineText(line).replace(/[\s]/g, '');
        return lineStr.substring(0, comDelim.length) === comDelim;
    };

    this.isBlankLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        var lineStr = this.getLineText(line);
        return lineStr === '';
    };


    this.searchNext = function(str, option) {
        if (typeof(option) === 'undefined') { option = 0; }
        Editor.SearchNext(str, option);
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };

    this.searchPrev = function(str, option) {
        if (typeof(option) === 'undefined') { option = 0; }
        Editor.SearchPrev(str, option);
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };


    this.getCurrentWord = function() {
        var originCur = this.getProperty();
        this.selectCurrentWord();
        var word = this.getSelectedText();
        this.loadProperty(originCur);
        return word;
    }

    this.getLineText = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        return Editor.GetLineStr(line).replace(/[\r\n]/g, '');
    }

    this.getLineTextAfterCursor = function() {
        var lineStr = this.getLineText();
        return lineStr.substring(this.getCol() - 1);
    }

    this.getLineTextBeforeCursor = function() {
        var lineStr = this.getLineText();
        return lineStr.substring(0, this.getCol() - 1);
    }

    this.getNestDepth = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        var lineStr = this.getLineText(line);
        var match = lineStr.match(/^(\s*)/);
        var ret = match ? match[1].length : 0;
        return ret;
    };

    this.getPrevChar = function() {
        var chr = null;
        if (this.isBeginOfLine() === false) {
            var originCur = this.getProperty();
            this.moveLeft();
            this.moveRight(1);
            chr = this.getSelectedText();
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.getNextChar = function() {
        var chr = null;
        if (this.isEndOfLine() === false) {
            var originCur = this.getProperty();
            this.moveRight();
            this.moveLeft(1);
            chr = this.getSelectedText();
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.getWordList = function(line) {
        if (typeof(line) === 'undefined') { line = this.getLine(); }
        var words = Utility.deleteNullOrEmpty(this.getLineText(line).split(' '));
        return words;
    };

}
