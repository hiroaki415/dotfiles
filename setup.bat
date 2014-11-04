@echo off
echo === Setup Dotfiles for Windows! ===
pause

NET SESSION > NUL 2>&1
if %ERRORLEVEL% EQU 0 (
    echo making symlink for vim...
    mklink %HOMEDRIVE%%HOMEPATH%\.vimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.vimrc
    mklink %HOMEDRIVE%%HOMEPATH%\.gvimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.gvimrc
    echo symlink making done

    echo setup for vundle...
    git clone https://github.com/gmarik/Vundle.vim.git %HOMEDRIVE%%HOMEPATH%\dotfiles\.vim\bundle\vundle
    echo vundle setup done

    echo making symlink for vim...
    mklink /D %HOMEDRIVE%%HOMEPATH%\AppData\Roaming\.emacs.d %HOMEDRIVE%%HOMEPATH%\dotfiles\.emacs.d
    echo symlink making done
) ELSE (
    color 0c
    echo this script must be run by "Administrator"
    echo please run this as "Administartor"
    echo setup failed...
    pause
)

echo All Done!
exit /b
