# nano
ln -s $PWD/.nanorc ~/.nanorc


# vim
ln -s $PWD/.vimrc ~/.vimrc
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
vim +PluginInstall +qall
