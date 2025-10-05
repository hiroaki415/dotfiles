#Requires -RunAsAdministrator


#SakuraEditor
$target = "$HOME\dotfiles\sakura\"
$path = "$HOME\AppData\Roaming\sakura\"
if (Test-Path $path) {
    Remove-Item -Path $dest
}
New-Item -ItemType SymbolicLink -Path $path -Value $target
