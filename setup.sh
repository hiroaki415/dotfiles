#!/bin/sh

echo "=== Setup Dotfiles for Linux! ==="

echo "making symlink for vim..."
ln -sf ~/dotfiles/.vimrc ~/.vimrc
ln -sf ~/dotfiles/.gvimrc ~/.gvimrc
echo "symlink making done"

echo "making symlink for emacs..."
ln -sf ~/dotfiles/.emacs.d ~/.emacs.d
echo "symlink making done"

echo "setup for vundle..."
if [ -e ~/.vim/bundle/vundle ];
then
    echo "vundle is already exist!"
else
    mkdir ~/.vim
    mkdir ~/.vim/bundle
    git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/vundle
    echo "setup vundle done"
fi

echo "making symlink for bash..."
ln -sf ~/dotfiles/.bash_profile ~/.bash_profile
echo "symlink making done"


echo "All Done!"
