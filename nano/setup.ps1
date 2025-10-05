#Requires -RunAsAdministrator


# nano
Write-Host "setting up nanorc..."
$target = "$HOME\dotfiles\nano\.nanorc"
$path = "$HOME\.nanorc"
if (Test-Path $path) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target
