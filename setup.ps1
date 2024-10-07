#Requires -RunAsAdministrator


# nano
Write-Host "setting up nanorc..."
$target = Join-Path -Path (Get-Location) -ChildPath ".nanorc"
$path = "~/.nanorc"

if (Test-Path $target) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target


# vim
$target = Join-Path -Path (Get-Location) -ChildPath ".vim_runtime"
if (-! (Test-Path "~/.vim_runtime")) {
    git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
}else{
    Write-Host "Awesome Vimrc is already installed."
    $input = Read-Host  "Do you want to update amix/vimrc? (y/N): "
    switch -Wildcard ($input) {
        "[yY]" {
            cd ~/.vim_runtime
            git reset --hard
            git clean -d --force
            git pull --rebase
            python update_plugins.py
            cd ~/dotfiles/
        }
        "[nN]" {} # do nothing
        default {} # do nothing
    }
}

####
# need to write script here to install plugins...
####

$target = Join-Path -Path (Get-Location)  -ChildPath "awesome_vimrc_win.vim"
$path = "~/_vimrc"
if (Test-Path $target) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target


# $target = Get-Item $Env:HOMEPATH
# $target = Join-Path -Path $target -ChildPath "vimfiles\bundle\Vundle.vim"
# git clone https://github.com/VundleVim/Vundle.vim.git $target

# vim +PluginInstall +qall


Write-Host ""
Write-Host "Press Any Key to Finish..."
$host.UI.RawUI.ReadKey()
