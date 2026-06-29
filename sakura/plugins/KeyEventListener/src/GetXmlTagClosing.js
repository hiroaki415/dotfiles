function GetXmlTagClosing (tagOpening) {
    var matches = tagOpening.match(/<([a-zA-Z_][\w:.-]*)(?:\s+[^>]*[^>/])*>$/);
    if (matches) {
        return '</' + matches[1] + '>';
    } else {
        return null;
    }
}