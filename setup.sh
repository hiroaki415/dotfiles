#!/bin/sh

echo "=== Setup Dotfiles for Linux! ==="

echo "making symlink for vim..."
ln -sf ~/dotfiles/.vimrc ~/.vimrc
ln -sf ~/dotfiles/.gvimrc ~/.gvimrc

echo "setup for vundle..."
mkdir ~/.vim
mkdir ~/.vim/bundle
git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/vundle

echo "making symlink for bash..."
ln -sf ~/dotfiles/.bash_profile ~/.bash_profile

echo "Done!"
