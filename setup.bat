@echo off
echo === Setup Dotfiles for Windows! ===

echo making symlink for vim...
mklink %HOMEDRIVE%%HOMEPATH%\.vimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.vimrc
mklink %HOMEDRIVE%%HOMEPATH%\.gvimrc %HOMEDRIVE%%HOMEPATH%\dotfiles\.gvimrc
echo symlink making done

echo setup for vundle...
if exist %HOMEDRIVE%%HOMEPATH%\.vim\bundle\vundle goto SKIPVUNDLE
        mkdir %HOMEDRIVE%%HOMEPATH%\.vim
        mkdir %HOMEDRIVE%%HOMEPATH%\.vim\bundle
        git clone https://github.com/gmarik/Vundle.vim.git %HOMEDRIVE%%HOMEPATH%\.vim\bundle\vundle
        echo vundle setup done
        goto VUNDLEDONE
    :SKIPVUNDLE
        echo vundle is already exist!
        goto VUNDLEDONE
:VUNDLEDONE

echo making symlink for emasc...
mklink %HOMEDRIVE%%HOMEPATH%\.emacs %HOMEDRIVE%%HOMEPATH%\dotfiles\.emacs
echo symlink making done

echo setting env for emacs...
setx HOME "%HOMEDRIVE%%HOMEPATH%"
echo setting env done

echo All Done!
exit /b
