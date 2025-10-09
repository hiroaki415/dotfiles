function CommandDecorator(func, redrawFlag) {
    if (typeof(redrawFlag) === "undefined") { redrawFlag = true; }
    return function() {

        Editor.AddRefUndoBuffer();
        if (redrawFlag) {
            Editor.SetDrawSwitch(0);
        }

        var result = func.apply(this, arguments);

       if (redrawFlag) {
           Editor.SetDrawSwitch(1);
           Editor.ReDraw(0);
       }
        Editor.SetUndoBuffer();

        return result;
    };
}
