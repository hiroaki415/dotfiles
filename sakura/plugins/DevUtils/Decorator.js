function CommandDecorator(func) {
    return function() {

        Editor.AddRefUndoBuffer();
        Editor.SetDrawSwitch(0);

        var result = func.apply(this, arguments);

        Editor.SetDrawSwitch(1);
        Editor.ReDraw(0);
        Editor.SetUndoBuffer();

        return result;
    };
}
