function BlurryCherry () {

    var pspath = Plugin.GetPluginDir() + '\\SetLayeredWindowAttributes.ps1';
    var process = 'sakura';
    var alpha = Plugin.GetOption('Option', 'alpha');

    var shell = new ActiveXObject("WScript.Shell");
    shell.Run('powershell.exe -ExecutionPolicy Bypass -Command ' + '"' +
        'import-Module ' + pspath + ';' +
        'Set-LayeredWindowAttributes -Process ' + process +' -Alpha ' + alpha + ';' +
    '"', 0, true);
    shell = null;

}


BlurryCherry();
