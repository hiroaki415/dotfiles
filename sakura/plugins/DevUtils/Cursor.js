function Cursor() {

    this.line = 0;
    this.col = 0;

    this.isSelected = 0;

    this.fromLine = 0;
    this.fromCol = 0;
    this.toLine = 0;
    this.toCol = 0;

    this.selectedStr = null;


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

        this.isSelected = Editor.IsTextSelected();

        if (this.isSelected > 0) {

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

    this.moveRight = function() {
        this.move(this.line + 1, this.col, 0);
    };

    this.loadProperty = function(prop, offsetCol) {

        if (typeof(offsetCol) === "undefined") { offsetCol = 0; }

        if (prop.isSelected === 0) {
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

        this.read();

    };

    this.insertText = function(str) {
        Editor.InsText(str);
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

    this.isBeginOfLine = function() {
        return this.col === 1;
    };

    this.isEndOfLine = function() {
        var str = Editor.GetLineStr(0).replace(/[\r\n]/g, "");
        return this.col === (str.length + 1);
    };

    this.getPrevChar = function() {
        var chr = null;
        if (this.isBeginOfLine !== true) {
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
        if (this.isEndOfLine !== true) {
            var originCur = this.getProperty();
            this.moveRight();
            this.move(this.line, this.col + 1, 1);
            chr = this.selectedStr;
            this.loadProperty(originCur);
        }
        return chr;
    };


    this.read();

}
