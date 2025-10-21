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
eval(loadModule('/plugins/DevUtils/Utility.js'));


function SnipElement(rawText) {

    this.rawText = rawText;
    this.id = -1;
    this.type = null;
    this.children = [];

    this.transform = null;
    this.format = null;

    this.choices = [];

    this.typeEnum = {
        tabstop: 'tabstop',
        placeholder: 'placeholder',
        choice: 'choice',
        variable: 'variable',
        text: 'text'
    }


    this.getID = function(){
        if (/^\$\d+$/.test(this.rawText)) {
            return Number(this.rawText.substring(1));
        } else if (/^\$\{\d+\w*\}$/.test(this.rawText)) {
            var index = /[^\$\{\d]/.exex(rawText);
            return Number(this.rawText.substring(2, index - 1));
        } else {
            return -1;
        }
    };

    this.getType = function(){
        if (/^\$\d+$/.test(this.rawText)) {
            return this.typeEnum.tabstop;
        } else if (/^\$[_a-zA-Z][_a-zA-Z0-9]*$/.test(this.rawText)) {
            return this.typeEnum.variable;
        } else {
            if (/^\$\{\d+(\/.+\/.+\/[dgimsuvy]*)*)\}$/.test(this.rawText)) {
                return this.typeEnum.tabstop;
            } else if (/^\$\{\d+\:.+\}$/.test(this.rawText)) {
                return this.typeEnum.placeholder;
            } else if (/^\$\{\d+\|.+(\,.+)*\|\}$/.test(this.rawText)) {
                return this.typeEnum.choice;
            } else if (/^\$\{[_a-zA-Z][_a-zA-Z0-9]*([\:\/].+)*\}$/.test(this.rawText)) {
                return this.typeEnum.variable;
            } else {
                return this.typeEnum.text;
            }
        }
    };

    this.getTransformRegex = function(){
        switch (this.getType()) {
            case this.typeEnum.tabstop:
                // 
                break;
            case this.typeEnum.variable:
                // 
                break;
            default:
                return null;
                break;
        }
    }

    this._parseElement = function(){

        if (/^\$\d+$/.test(this.rawText)) {

            this.type = this.typeEnum.tabstop;
            this.id = Number(this.rawText.substring(1));

        } else if (/^\$[A-Z_]+$/.test(this.rawText)) {

            this.type = this.typeEnum.text;
            var token = this.rawText.substring(1);
            var varVal = SnipFuncs.evaluateVariable(token);
            if (varVal !== '') {
                this.rawText = varVal;
            }

        } else {

            if (/^\$\{\d+\}$/.test(this.rawText)) {

                this.type = this.typeEnum.tabstop;
                this.id = Number(this.rawText.substring(2, this.rawText.length - 1));

            } else if (/^\$\{\d+\:\w+\}$/.test(this.rawText)) {

                this.type = this.typeEnum.placeholder;
                var index = this.rawText.indexOf(':');
                this.id = Number(this.rawText.substring(2, index));
                var staticField = this.rawText.substring(index + 1, this.rawText.length - 1);

                var regex = /(\$\d+|\$\{[\d\u]+.*\})/g;
                if (regex.exec(staticField)) !== null) {
                    this.children = SnipFuncs.parseRawText(staticField);
                }

            } else if (/^\$\{\d+\|.+(.+\,)+.+\|\}$/.test(this.rawText)) {

                this.type = this.typeEnum.choice;
                var index = this.rawText.indexOf('|');
                this.id = Number(this.rawText.substring(2, index));
                this.choices = this.rawText.substring(index + 1, this.rawText.length - 2).split(',');

            } else if (/^\$\{[A-Z_]+\:.+\}$/.test(this.rawText)) {

                this.type = this.typeEnum.text;
                var index = this.rawText.indexOf(':');
                var defaultText = this.rawText.substring(index + 1, this.rawText.length - 1);
                var token = this.rawText.substring(2, index - 1);
                var varVal = SnipFuncs.evaluateVariable(token);
                if (varVal !== '') {
                    this.rawText = varVal;
                }

            } else {

                this.type = this.typeEnum.text;

            }

        }

    };

    this.getEvaluatedText = function(){
        var etext = null;
        switch (this.type) {
            case this.typeEnum.text:
                etext = this.rawText;
                break;
            case this.typeEnum.tabstop:
                etext = '';
                break;
            case this.typeEnum.placeholder:
                // 
                break;
            case this.typeEnum.choice:
                etext = '_CHOICE_';
                break;
        }
        return etext;
    };

}
