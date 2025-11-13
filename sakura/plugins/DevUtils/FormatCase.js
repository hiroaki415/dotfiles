var FormatCase = {


    isUpCase: function (str) {
        return RegExp('^[A-Z_][A-Z0-9_]+$').test(str);
    },

    isDownCase: function (str) {
        return RegExp('^[a-z_][a-z0-9_]+$').test(str);
    },

    isCapitalized: function (str) {
        return RegExp('^[A-Z][a-zA-Z0-9_]+$').test(str);
    },


    isCamelCase: function (str) {
        return RegExp('^[a-z][a-z0-9]+([A-Z][a-z0-9]+)+$').test(str);
    },

    isPascalCase: function (str) {
        return RegExp('^[A-Z][a-z0-9]+([A-Z][a-z0-9]+)+$').test(str);
    },

    isSnakeCase: function (str) {
        return RegExp('^[a-zA-Z][a-zA-Z0-9]+(_[a-zA-Z][a-zA-Z0-9]+)+$').test(str);
    },

    isKebabCase: function (str) {
        return RegExp('^[a-zA-Z][a-zA-Z0-9]+(\\-[a-zA-Z][a-zA-Z0-9]+)+$').test(str);
    },


    isSplittable: function (str) {
        return FormatCase.isCamelCase(str) || FormatCase.isPascalCase(str) ||
                FormatCase.isSnakeCase(str) || FormatCase.isKebabCase(str);
    },

    splitStringIntoWords: function (str) {

        if (FormatCase.isCamelCase(str)) {
            var words = [];
            var re = new RegExp('[A-Z][a-z0-9]+', 'g');
            var match;
            while ((match = re.exec(str)) !== null) {
                if (words.length === 0) {
                    words.push(str.substring(0, match.index));
                }
                words.push(match[0]);
            }
            return words;
        } else if (FormatCase.isPascalCase(str)) {
            var words = [];
            var re = new RegExp('[A-Z][a-z0-9]+', 'g');
            var match;
            while ((match = re.exec(str)) !== null) {
                words.push(match[0]);
            }
            return words;
        } else if (FormatCase.isSnakeCase(str)) {
            return str.split('_');
        } else if (FormatCase.isKebabCase(str)) {
            return str.split('-');
        }

        return [str];

    },


    toUpCase: function (str) {
        return str.toUpperCase();
    },

    toDownCase: function (str) {
        return str.toLowerCase();
    },

    toCapitalized: function (str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    },


    toCamelCase: function (str) {
        if (FormatCase.isSplittable(str)) {
            var newStr = '';
            var words = FormatCase.splitStringIntoWords(str);
            for (var i = 0; i < words.length; i++) {
                if (i === 0) {
                    newStr += words[i].toLowerCase();
                } else {
                    newStr += FormatCase.toCapitalized(words[i].toLowerCase());
                }
            }
            return newStr;
        } else {
            return str;
        }
    },

    toPascalCase: function (str) {
        if (FormatCase.isSplittable(str)) {
            var newStr = '';
            var words = FormatCase.splitStringIntoWords(str);
            for (var i = 0; i < words.length; i++) {
                newStr += FormatCase.toCapitalized(words[i].toLowerCase());
            }
            return newStr;
        } else {
            return str;
        }
    },


    options: {
        upcase: function (str) { return FormatCase.toUpCase(str) },
        downcase: function (str) { return FormatCase.toDownCase(str) },
        capitalized: function (str) { return FormatCase.toCapitalized(str) }
    },

    toSnakeCase: function (str, opt) {
        if (typeof(opt) === 'undefined') { opt = FormatCase.options.downcase; }
        if (FormatCase.isSplittable(str)) {
            var newStr = '';
            var words = FormatCase.splitStringIntoWords(str);
            for (var i = 0; i < words.length; i++) {
                newStr += ('_' + opt(words[i]));
            }
            return newStr.substring(1);
        } else {
            return str;
        }
    },

    toKebabCase: function (str, opt) {
        if (typeof(opt) === 'undefined') { opt = FormatCase.options.downcase; }
        if (FormatCase.isSplittable(str)) {
            var newStr = '';
            var words = FormatCase.splitStringIntoWords(str);
            for (var i = 0; i < words.length; i++) {
                newStr += ('-' + opt(words[i]));
            }
            return newStr.substring(1);
        } else {
            return str;
        }
    }

};
