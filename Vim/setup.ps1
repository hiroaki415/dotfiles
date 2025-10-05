#Requires -RunAsAdministrator


# vim
if (-! (Test-Path "$HOME/.vim_runtime")) {
    git clone --depth=1 https://github.com/amix/vimrc.git $HOME/.vim_runtime
}else{
    Write-Host "Awesome Vimrc is already installed."
    $input = Read-Host  "Do you want to update amix/vimrc? (y/N): "
    switch -Wildcard ($input) {
        "[yY]" {
            cd $HOME/.vim_runtime
            git reset --hard
            git clean -d --force
            git pull --rebase
            python update_plugins.py
            cd $HOME/dotfiles/
        }
        "[nN]" {} # do nothing
        default {} # do nothing
    }
}

$target = "$HOME\dotfiles\Vim\awesome_vimrc.vim"
$path = "C:\Program Files\Vim\_vimrc"
if (Test-Path $path) {
    Remove-Item -Path $path
}
New-Item -ItemType SymbolicLink -Path $path -Value $target

$filename = "$HOME\dotfiles\Vim\vim_plugins.txt"
$file = New-Object System.IO.StreamReader($filename, [System.Text.Encoding]::GetEncoding("utf-8"))
while (($plugin = $file.ReadLine()) -ne $null)
{
    $pi_arr = $plugin.split(" ")
    $response=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$($pi_arr[0])/$($pi_arr[1])")
    if ( $response -eq 200 ) {
        git clone "https://github.com/$($pi_arr[0])/$($pi_arr[1])" "$HOME/.vim_runtime/my_plugins/$($pi_arr[1])/"
    } else {
        Write-Host "$plugin repository does not exist in Github.com"
    }
}
$file.Close()


# $target = "$HOME\dotfiles\vimfiles\bundle\Vundle.vim"
# git clone https://github.com/VundleVim/Vundle.vim.git $target

# vim +PluginInstall +qall
