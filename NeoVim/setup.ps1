#Requires -RunAsAdministrator


#NeoVim
if (-! (Test-Path "$ENV:USERPROFILE\AppData\Local\nvim")) {
    git clone https://github.com/NvChad/starter $ENV:USERPROFILE\AppData\Local\nvim && nvim
}

$target = "$HOME\dotfiles\NeoVim\core.lua"
$path = "$HOME\AppData\Local\nvim\lua\plugins\core.lua"
if (Test-Path $path) {
    Remove-Item -Path $dest
}
New-Item -ItemType SymbolicLink -Path $path -Value $target

$target = "$HOME\dotfiles\NeoVim\options.lua"
$path = "$HOME\AppData\Local\nvim\lua\options.lua"
if (Test-Path $path) {
    Remove-Item -Path $dest
}
New-Item -ItemType SymbolicLink -Path $path -Value $target
