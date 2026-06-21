#Requires -RunAsAdministrator


#NeoVim
if (-! (Test-Path $env:LOCALAPPDATA\nvim)) {
    git clone https://github.com/LazyVim/starter $env:LOCALAPPDATA\nvim
}

$target = "$HOME\dotfiles\NeoVim\colorscheme.lua"
$path = "$env:LOCALAPPDATA\nvim\lua\plugins\colorscheme.lua"
if (Test-Path $path) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target

$target = "$HOME\dotfiles\NeoVim\options.lua"
$path = "$env:LOCALAPPDATA\nvim\lua\config\options.lua"
if (Test-Path $path) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target
