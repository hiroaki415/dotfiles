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
    loadModule(root + '/plugins/SnipSakura/lib/SnipRegex.js') +
    loadModule(root + '/plugins/SnipSakura/lib/SnipVariable.js') +
    loadModule(root + '/plugins/DevUtils/Utility.js')
);


function SnipElement(rawText) {

    this.rawText = rawText;


    this.typeEnum = {
        tabstop: 'tabstop',
        placeholder: 'placeholder',
        choice: 'choice',
        variable: 'variable',
        text: 'text'
    };


    this.getID = function() {
        if (RegExp('^'+SnipRegex.haveID+'$').test(this.rawText)) {
            var match = /(\d+?)/g.exec(this.rawText);
            return Number(match[0]);
        } else {
            return -1;
        }
    };

    this.getType = function() {
        if (RegExp('^'+SnipRegex.tabstop+'$').test(this.rawText)) {
            return this.typeEnum.tabstop;
        } else if (RegExp('^'+SnipRegex.placeholder+'$').test(this.rawText)) {
            return this.typeEnum.placeholder;
        } else if (RegExp('^'+SnipRegex.choice+'$').test(this.rawText)) {
            return this.typeEnum.choice;
        } else if (RegExp('^'+SnipRegex.variable+'$').test(this.rawText)) {
            return this.typeEnum.variable;
        } else {
            return this.typeEnum.text;
        }
    };


    this.getTransformFunc = function() {
        if (RegExp('^'+SnipRegex.haveTransform+'$').test(this.rawText)) {

            var tfRegex = '';
            var tfFormat = '';
            var tfOptions = '';

            var match = null;
            var regex = new RegExp('\\/', 'g');
            var lastIndex = 0;

            match = regex.exec(this.rawText);
            lastIndex = regex.lastIndex;

            match = regex.exec(this.rawText);
            tfRegex = this.rawText.substring(lastIndex, match.index);
            lastIndex = regex.lastIndex;

            match = regex.exec(this.rawText);
            tfFormat = this.rawText.substring(lastIndex, match.index);
            lastIndex = regex.lastIndex;

            tfOptions = this.rawText.substring(lastIndex, this.rawText.length - 1);
            
            // switch (tfFormat) {
            //     case '/upcase':
            //         return function(str) {};
            //         break;
            //     case '/downcase':
            //         return function(str) {};
            //         break;
            //     case '/capitalize':
            //         return function(str) {};
            //         break;
            //     case '/camelcase':
            //         return function(str) {};
            //         break;
            //     case '/pascalcase':
            //         return function(str) {};
            //         break;
            //     default:
            //         return function(str) {
            //             var regex = new RegExp(tfRegex, tfOptions);
            //             return str.replace(regex, tfFormat);
            //         };
            //         break;
            // }

            return function(str) {
                return str;  // do nothing
            };

        } else {
            return function(str) {
                return str;  // do nothing
            };
        }
    };


    this.getDefaultField = function() {
        if (RegExp('^'+SnipRegex.haveDefaultField+'$').test(this.rawText)) {

            var regex = new RegExp(':', 'g');
            var match = regex.exec(this.rawText);
            var lastIndex = regex.lastIndex;

            return this.rawText.substring(lastIndex, this.rawText.length - 1);

        } else {
            return null;
        }
    };


    this.getChoiceList = function() {

        if (this.getType() === this.typeEnum.choice) {

            var match = null;
            var regex = new RegExp('\\|', 'g');
            var lastIndex = 0;

            match = regex.exec(this.rawText);
            lastIndex = regex.lastIndex;

            match = regex.exec(this.rawText);

            return this.rawText.substring(lastIndex, match.index).split(',');

        } else {
            return [];
        }

    };


    this.getEvaluatedVariable = function() {

        if (this.getType() === this.typeEnum.variable) {

            if (RegExp('^'+'\\$'+SnipRegex.reVar+'$').test(this.rawText)) {
                var token = this.rawText.substring(1);
            } else {
                // under construction
                match = RegExp('\\}', 'g').exec(this.rawText);
                var token = this.rawText.substring(1, match.index);
            }

            return SnipVariable.evaluate(token);

        } else {
            return null;
        }
    };


    this.getChildren = function() {

        var children = [];

        if ( true ) {
            //
        }

        return children;

    };


    this.getInitialText = function() {
        var type = this.getType();
        switch (type) {
            case this.typeEnum.tabstop:
                return '';
                break;
            case this.typeEnum.placeholder:
                return this.getDefaultField();
                break;
            case this.typeEnum.choice:
                return '_CHOICE_';
                break;
            case this.typeEnum.variable:
                return this.getEvaluatedVariable();
                break;
            case this.typeEnum.text:
                return this.rawText;
                break;
        }
    };


    this.getEvaluatedText = function(targets) {
        if (typeof(targets) === 'undefeined') {
            return this.getInitialText();
        }

        var id = this.getID();
        var type = this.getType();

        if (type === this.typeEnum.text) {
            return this.rawText;
        } else if (id > 0) {
            // case variable????
            return targets[id].value;
        }

        return this.getInitialText();

    };

}
