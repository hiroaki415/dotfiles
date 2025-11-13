if (typeof(root) === 'undefined') {
    var root = Editor.ExpandParameter('$I').replace(/\\[^\\]*$/, '').replace(/\\/g, '/');
}
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval('var root = "' + root + '";' +
    loadModule(root + '/plugins/DevUtils/Config.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


function Cursor() {

    this.line = 0;
    this.col = 0;

    this.stateSelection = Editor.IsTextSelected();
    this.stateEnum = {
        notSelected: 0,
        selected: 1,
        selectedAsBox: 2
    };

    this.lineFrom = 0;
    this.colFrom = 0;
    this.lineTo = 0;
    this.colTo = 0;

    this.selectedText = null;

    this.viewTop = 0;

    var conf = new Config();
    this.comDelim = conf.getLineCommentDelimiter();


    this.getProperty = function() {
        // var copy = {};
        // for (var key in this) {
        //     if (this.hasOwnProperty(key)) {
        //         copy[key] = this[key];
        //     }
        // }
        // return copy;
        return Utility.transformObjectIntoPlain(this);
    };

    this.read = function() {

        this.line = Number(Editor.ExpandParameter('$y'));
        this.col = Number(Editor.ExpandParameter('$x'));

        this.stateSelection = Editor.IsTextSelected();

        if (this.stateSelection !== this.stateEnum.notSelected) {

            var lineF = Editor.GetSelectLineFrom();
            var colF = Editor.GetSelectColmFrom();
            var lineT = Editor.GetSelectLineTo();
            var colT = Editor.GetSelectColmTo();

            this.lineFrom = Editor.LayoutToLogicLineNum(lineF);
            this.colFrom = Editor.LineColumnToIndex(lineF, colF);
            this.lineTo = Editor.LayoutToLogicLineNum(lineT);
            this.colTo = Editor.LineColumnToIndex(lineT, colT);

            this.selectedText = Editor.GetSelectedString(0);

        } else {
            this.lineFrom = 0;
            this.colFrom = 0;
            this.lineTo = 0;
            this.colTo = 0;
            this.selectedText = null;
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

    this.deleteLine = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }

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
        if (typeof(line) === 'undefined') { line = this.line; }

        var originCur = this.getProperty();

        this.move(line, this.getLineText(line).length + 1);
        Editor.LineDeleteToStart();

        this.loadProperty(originCur);

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


    this.isEqualTo = function(prop) {
        var ret = true;
        ret = ret && this.line === prop.line;
        ret = ret && this.col === prop.col;
        if (this.stateSelection !== this.stateEnum.notSelected) {
            ret = ret && this.lineFrom === prop.lineFrom;
            ret = ret && this.colFrom === prop.colFrom;
            ret = ret && this.lineTo === prop.lineTo;
            ret = ret && this.colTo === prop.colTo;
        }
        return ret;
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


    this.searchNext = function(str, option) {
        if (typeof(option) === 'undefined') { option = 0; }
        Editor.SearchNext(str, option);
        this.read();
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };

    this.searchPrev = function(str, option) {
        if (typeof(option) === 'undefined') { option = 0; }
        Editor.SearchPrev(str, option);
        this.read();
        var tmpCur = this.getProperty();
        Editor.CancelMode(0);
        Editor.SearchClearMark();
        this.loadProperty(tmpCur);
    };


    this.getCurrentWord = function() {
        var originCur = this.getProperty();
        this.selectCurrentWord();
        var word = this.selectedText;
        this.loadProperty(originCur);
        return word;
    }

    this.getLineText = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        return Editor.GetLineStr(line).replace(/[\r\n]/g, '');
    }

    this.getLineTextAfterCursor = function() {
        var lineStr = Editor.GetLineStr(this.line).replace(/[\r\n]/g, '');
        return lineStr.substring(this.col - 1);
    }

    this.getLineTextBeforeCursor = function() {
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
            chr = this.selectedText;
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
            chr = this.selectedText;
            this.loadProperty(originCur);
        }
        return chr;
    };

    this.getWordList = function(line) {
        if (typeof(line) === 'undefined') { line = this.line; }
        var words = Utility.deleteNullOrEmpty(this.getLineText().split(' '));
        return words;
    };


    this.read();

}
