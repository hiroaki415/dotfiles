#Requires -RunAsAdministrator


# chocolatey
if (-! (Test-Path "C:\ProgramData\chocolatey\bin\choco.exe")) {
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}
$input = Read-Host  "Do you want to update latest choco packges? (y/N): "
switch -Wildcard ($input) {
    "[yY]" {
        choco install $HOME/dotfiles/choco_packages_latest.config
    }
    "[nN]" {} # do nothing
    default {} # do nothing
}


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

$filename = "$HOME\dotfiles\vim_plugins.txt"
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
