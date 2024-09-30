#Requires -RunAsAdministrator



# nano
$target = Get-Location
$target = Join-Path -Path $target -ChildPath ".nanorc"
$path = "~/.nanorc"

New-Item -ItemType SymbolicLink -Path $path -Value $target


# vim
$target = Get-Location
$target = Join-Path -Path $target -ChildPath ".vimrc"
$path = "~/_vimrc"

New-Item -ItemType SymbolicLink -Path $path -Value $target

$target = Get-Item $Env:HOMEPATH
$target = Join-Path -Path $target -ChildPath "vimfiles\bundle\Vundle.vim"
git clone https://github.com/VundleVim/Vundle.vim.git $target

vim +PluginInstall +qall


Write-Host ""
Write-Host "Press Any Key to Continue..."
$host.UI.RawUI.ReadKey()
