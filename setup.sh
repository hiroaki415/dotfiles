#!/bin/sh

echo "=== Setup Dotfiles for Linux! ==="

if [ "$(id -u)" != "0" ]; then
    echo "\033[1mWARNING: this script must be run by root user\033[0m"
    echo "\033[1mex) >>> sudo ./setup.sh\033[0m"
else

    echo "installing applications..."
    if   [ -e /etc/debian_version ] ||
	 [ -e /etc/debian_release ]; then
	apt-get install vim emacs fcitx-mozc ibus-mozc emacs-mozc emacs-mozc-bin
    elif [ -e /etc/fedora-release ] ||
	 [ -e /etc/redhat-release ]; then
	yum install vim emacs fcitx-mozc ibus-mozc emacs-mozc emacs-mozc-bin
    fi
    echo "install done"
    
    echo "making symlink for vim..."
    ln -sf ~/dotfiles/.vimrc ~/.vimrc
    ln -sf ~/dotfiles/.gvimrc ~/.gvimrc
    echo "symlink making done"

    echo "making symlink for emacs..."
    ln -sf ~/dotfiles/.emacs.d ~/.emacs.d
    echo "symlink making done"

    echo "setup for vundle..."
    git clone https://github.com/gmarik/Vundle.vim.git ~/dotfiles/.vim/bundle/vundle
    vim +BundleInstall +qall
    echo "setup vundle done"

    echo "making symlink for bash..."
    ln -sf ~/dotfiles/.bash_profile ~/.bash_profile
    echo "symlink making done"

    echo "changing permission..."
    find ~/dotfiles -type f | xargs chmod a+w
    echo "permission change done"
fi

echo "All Done!"
