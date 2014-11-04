@echo off
echo === Setup Dotfiles for Windows! ===

if %ERRORLEVEL% EQU 0 (
    echo making symlink for vim...
    mklink %HOMEDRIVE%%HOMEPATH%\.vimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.vimrc
    mklink %HOMEDRIVE%%HOMEPATH%\.gvimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.gvimrc
    echo symlink making done

    echo setup for vundle...
    git clone https://github.com/gmarik/Vundle.vim.git %HOMEDRIVE%%HOMEPATH%\dotfiles\.vim\bundle\vundle
    echo vundle setup done
) ELSE (
    echo this script must be run by Administrator
    pause
)

echo All Done!
exit /b
