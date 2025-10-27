var fso = new ActiveXObject('Scripting.FileSystemObject');
var pluginDir = Plugin.GetPluginDir();
var root = fso.GetParentFolderName(fso.GetParentFolderName(pluginDir));
var file = fso.OpenTextFile(root + '/plugins/DevUtils/LoadModule.js', 1);
var loadModuleRaw = file.ReadAll();
file.Close();
file = null;
fso = null;

eval(loadModuleRaw);
eval(loadModule('/plugins/SnipSakura/lib/SnipRegex.js'));
eval(loadModule('/plugins/SnipSakura/lib/SnipVariable.js'));
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SnipElement(rawText) {

    this.rawText = rawText;


    this.choices = [];
    this.evalutedVariable;

    this.typeEnum = {
        tabstop: 'tabstop',
        placeholder: 'placeholder',
        choice: 'choice',
        variable: 'variable',
        text: 'text'
    };


    this.getID = function() {
        if (RegExp('^'+SnipRegex.haveID+'$').test(this.rawText)) {
            var match = /\d+/g.exec(this.rawText);
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


    this.getChildren = function() {

        var children = [];

        if ( true ) {
            //
        }

        return children;

    };


    this.getEvaluatedText = function() {
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
                return this.evalutedVariable;
                break;
            case this.typeEnum.text:
                return this.rawText;
                break;
        }
    };


    // this._parseElement = function() {

    //     if (/^\$\d+$/.test(this.rawText)) {

    //         this.type = this.typeEnum.tabstop;
    //         this.id = Number(this.rawText.substring(1));

    //     } else if (/^\$[A-Z_]+$/.test(this.rawText)) {

    //         this.type = this.typeEnum.text;
    //         var token = this.rawText.substring(1);
    //         var varVal = SnipFuncs.evaluateVariable(token);
    //         if (varVal !== '') {
    //             this.rawText = varVal;
    //         }

    //     } else {

    //         if (/^\$\{\d+\}$/.test(this.rawText)) {

    //             this.type = this.typeEnum.tabstop;
    //             this.id = Number(this.rawText.substring(2, this.rawText.length - 1));

    //         } else if (/^\$\{\d+\:\w+\}$/.test(this.rawText)) {

    //             this.type = this.typeEnum.placeholder;
    //             var index = this.rawText.indexOf(':');
    //             this.id = Number(this.rawText.substring(2, index));
    //             var staticField = this.rawText.substring(index + 1, this.rawText.length - 1);

    //             var regex = /(\$\d+|\$\{[\d\u]+.*\})/g;
    //             if (regex.exec(staticField) !== null) {
    //                 this.children = SnipFuncs.parseRawText(staticField);
    //             }

    //         } else if (/^\$\{\d+\|.+(.+\,)+.+\|\}$/.test(this.rawText)) {

    //             this.type = this.typeEnum.choice;
    //             var index = this.rawText.indexOf('|');
    //             this.id = Number(this.rawText.substring(2, index));
    //             this.choices = this.rawText.substring(index + 1, this.rawText.length - 2).split(',');

    //         } else if (/^\$\{[A-Z_]+\:.+\}$/.test(this.rawText)) {

    //             this.type = this.typeEnum.text;
    //             var index = this.rawText.indexOf(':');
    //             var defaultText = this.rawText.substring(index + 1, this.rawText.length - 1);
    //             var token = this.rawText.substring(2, index - 1);
    //             var varVal = SnipFuncs.evaluateVariable(token);
    //             if (varVal !== '') {
    //                 this.rawText = varVal;
    //             }

    //         } else {

    //             this.type = this.typeEnum.text;

    //         }

    //     }

    // };

}
