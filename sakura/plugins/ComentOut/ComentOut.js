function CommentOut() {
    
}

function UnCommentOut() {
    
}


(function() {
    var cmd = Plugin.GetCommandNo();
    switch (cmd) {
        case 1:
        CommentOut();
        break;
    case 2:
        UnCommentOut();
        break;
    }
})();
