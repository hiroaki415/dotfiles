#Requires -RunAsAdministrator


if (-! (Test-Path "$ENV:USERPROFILE\AppData\Local\nvim")) {
    git clone https://github.com/NvChad/starter $ENV:USERPROFILE\AppData\Local\nvim && nvim
}

$source = "$HOME\dotfiles\NeoVim\core.lua"
$dest = "$HOME\AppData\Local\nvim\lua\plugins\core.lua"
if (Test-Path $dest) {
    Remove-Item -Path $dest
}
Copy-Item -Path $source -Destination $dest

$source = "$HOME\dotfiles\NeoVim\options.lua"
$dest = "$HOME\AppData\Local\nvim\lua\options.lua"
if (Test-Path $dest) {
    Remove-Item -Path $dest
}
Copy-Item -Path $source -Destination $dest