var wsh = new ActiveXObject("WScript.Shell");
var root = wsh.ExpandEnvironmentStrings("%APPDATA%") + '\\sakura';
var fso = new ActiveXObject('Scripting.FileSystemObject');
var loadModuleRaw = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js').ReadAll();
fso = null;
wsh = null;


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
        if (opt === undefined) { opt = 0; }
        this.move(this.getLine(), this.getCol() - 1, opt);
    };
    this.moveRight = function(opt) {
        if (opt === undefined) { opt = 0; }
        this.move(this.getLine(), this.getCol() + 1, opt);
    };
    this.moveUp = function() {this.move(this.getLine() - 1, this.getCol(), 0); };
    this.moveDown = function() { this.move(this.getLine() + 1, this.getCol(), 0); };
    this.selectCurrentWord = function() { Editor.SelectWord(); }
    this.moveWordLeft = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.WordLeft(0);
                break;
            case 1:
                Editor.WordLeft_Sel(0);
                break;
            case 2:
                Editor.WordLeft_BoxSel(1);
                break;
        }
    };
    this.moveWordRight = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.WordRight(0);
                break;
            case 1:
                Editor.WordRight_Sel(0);
                break;
            case 2:
                Editor.WordRight_BoxSel(1);
                break;
        }
    };
    this.goLineTop = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.GoLineTop(0);
                break;
            case 1:
                Editor.GoLineTop_Sel(0);
                break;
            case 2:
                Editor.GoLineTop_BoxSel(0, 1);
                break;
        }
    };
    this.goLineEnd = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.GoLineEnd(0);
                break;
            case 1:
                Editor.GoLineEnd_Sel(0);
                break;
            case 2:
                Editor.GoLineEnd_BoxSel(0, 1);
                break;
        }
    };
    this.goFileTop = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.GoFileTop(0);
                break;
            case 1:
                Editor.GoFileTop_Sel(0);
                break;
            case 2:
                Editor.GoFileTop_BoxSel(1);
                break;
        }
    };
    this.goFileEnd = function(opt) {
        if (opt === undefined) { opt = 0; }
        switch (opt) {
            case 0:
                Editor.GoFileEnd(0);
                break;
            case 1:
                Editor.GoFileEnd_Sel(0);
                break;
            case 2:
                Editor.GoFileEnd_BoxSel(1);
                break;
        }
    };

    this.insertText = function(str) { Editor.InsText(str); };
    this.deleteWithoutBack = function() { Editor.Delete(0); };
    this.deleteBack = function() { Editor.DeleteBack(0); };
    this.deleteCurrentWord = function() { Editor.WordDelete(0); };
    this.deleteCurrentWordToStart = function() { Editor.WordDeleteToStart(0); };
    this.deleteCurrentWordToEnd = function() { Editor.WordDeleteToEnd(0); };
    this.deleteCurrentLine = function() { Editor.DeleteLine(); };
    this.deleteCurrentLineToStart = function() { Editor.LineDeleteToStart(); };
    this.deleteCurrentLineToEnd = function() { Editor.LineDeleteToEnd(); };
    this.duplicateCurrentLine = function() { Editor.DuplicateLine(); };

    this.indent = function() { Editor.IndentTab(0); };
    this.unindent = function() { Editor.UnindentTab(0); };
    this.enter = function() { Editor.Char(13); };
    this.escape = function() { Editor.CancelMode(0); };
    this.undo = function() { Editor.Undo(0); };
    this.redo = function() { Editor.Redo(0); };

    this.getProperty = function() {
        var prop = {};
        prop.line = this.getLine();
        prop.col = this.getCol();
        prop.stateSelection = this.getStateSelection();
        if (this.isSelected() || this.isSelectedAsBox()) {
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
        if (this.isSelected() || this.isSelectedAsBox()) {
            ret = ret && this.getLineFrom() === prop.lineFrom;
            ret = ret && this.getColFrom() === prop.colFrom;
            ret = ret && this.getLineTo() === prop.lineTo;
            ret = ret && this.getColTo() === prop.colTo;
        }
        return ret;
    };
    this.loadProperty = function(prop, offsetCol) {
        if (offsetCol === undefined) { offsetCol = 0; }
        if (prop.stateSelection === this.stateEnum.notSelected) {
            this.move(prop.line, prop.col + offsetCol, 0);
        } else {
            if (prop.line === prop.lineFrom && prop.col === prop.colFrom) {
                this.move(prop.lineTo, prop.colTo + offsetCol, 0);
                this.move(prop.lineFrom, prop.colFrom + offsetCol, 1);
            } else {
                this.move(prop.lineFrom, prop.colFrom + offsetCol, 0);
                this.move(prop.lineTo, prop.colTo + offsetCol, 1);
            }
    }
        Editor.SetViewTop(prop.viewTop);
    };

    this.isNotSelected = function() { return this.getStateSelection() === this.stateEnum.notSelected; };
    this.isSelected = function() { return this.getStateSelection() === this.stateEnum.selected; };
    this.isSelectedAsBox = function() { return this.getStateSelection() === this.stateEnum.selectedAsBox; };
    this.isFirstLine = function() { return this.getLine() === 1; };
    this.isLastLine = function(line) {
        if (line === undefined) { line = this.getLine(); }
        return line === Editor.GetLineCount(0);
    };
    this.isBeginOfLine = function() { return this.getCol() === 1; };
    this.isEndOfLine = function() {
        var lineStr = this.getLineText();
        return this.getCol() === (lineStr.length + 1);
    };
    this.beginWith = function(str, line) {
        if (line === undefined) { line = this.getLine(); }
        var lineStr = this.getLineTextWithoutIndent(line);
        return lineStr.substring(0, str.length) === str;
    };
    this.isCommentLine = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var conf = new Config();
        var comDelim = conf.getLineCommentDelimiter();
        return this.beginWith(comDelim, line);
    };
    this.isBlankLine = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var lineStr = this.getLineText(line);
        return /^\s*$/.test(lineStr);
    };

    this.getCurrentWord = function() {
        var originCur = this.getProperty();
        this.selectCurrentWord();
        var word = this.getSelectedText();
        this.loadProperty(originCur);
        return word;
    }
    this.getLineText = function(line) {
        if (line === undefined) { line = this.getLine(); }
        return Editor.GetLineStr(line).replace(/[\r\n]/g, '');
    }
    this.getLineTextWithoutIndent = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var lineStr = this.getLineText(line);
        var match = lineStr.match(/^\s*(.*)/);
        return match ? match[1] : lineStr;
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
        if (line === undefined) { line = this.getLine(); }
        var originCur = this.getProperty();
        var lineStr = this.getLineText(line);
        var match = lineStr.match(/^(\s*)/);
        return match ? match[1].length : 0;
    };
    this.getPrevChar = function() {
        var chr = null;
        if (!this.isBeginOfLine()) {
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
        if (!this.isEndOfLine()) {
            var originCur = this.getProperty();
            this.moveRight();
            this.moveLeft(1);
            chr = this.getSelectedText();
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.searchNext = function(str, option) {
        if (option === undefined) { option = 0; }
        Editor.SearchNext(str, option);
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };
    this.searchPrev = function(str, option) {
        if (option === undefined) { option = 0; }
        Editor.SearchPrev(str, option);
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };
    this.getWordList = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var words = Utility.deleteNullOrEmpty(this.getLineText(line).split(' '));
        return words;
    };

    this.deleteLine = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var originCur = this.getProperty();
        this.move(line, 1);
        this.deleteCurrentLine();
        if (originCur.line > line) {
            originCur.line = originCur.line -1;
            if (this.isSelected() || this.isSelectedAsBox()) {
                originCur.lineFrom = originCur.lineFrom -1;
                originCur.lineTo = originCur.lineTo -1;
            }
        }
        this.loadProperty(originCur);
    };
    this.clearLine = function(line) {
        if (line === undefined) { line = this.getLine(); }
        var originCur = this.getProperty();
        this.move(line, 1);
        this.deleteCurrentLineToEnd();
        this.loadProperty(originCur);
    };
    this.addCommentDelimiter = function(line, position) {
        if (line === undefined) { line = this.getLine(); }
        if (this.isCommentLine(line) === true) {
            var conf = new Config();
            var comDelim = conf.getLineCommentDelimiter();
            var originCur = this.getProperty();
            if (position === undefined) { position = this.getNestDepth(line) + 1; }
            var offset = (originCur.line === line) && (originCur.col > position) ? comDelim.length : 0;
            this.move(line, position, 0);
            for (var i = 0; i < (comDelim.length); i++) { this.deleteWithoutBack(); }
            this.insertText(' ');
            offset += 1;
            this.loadProperty(originCur, offset);
        }
    };
    this.deleteCommentDelimiter = function(line) {
        if (line === undefined) { line = this.getLine(); }
        if (this.isCommentLine(line) === true) {
            var conf = new Config();
            var comDelim = conf.getLineCommentDelimiter();
            var originCur = this.getProperty();
            var position = this.getNestDepth(line) + 1;
            var offset = (originCur.line === line) && (originCur.col > position) ? -comDelim.length : 0;
            this.move(line, position, 0);
            for (var i = 0; i < (comDelim.length); i++) { this.deleteWithoutBack(); }
            if (this.getNextChar() === ' ') {
                this.deleteWithoutBack();
                offset -= 1;
            }
            this.loadProperty(originCur, offset);
        }
    };

}
