# nano
ln -s $PWD/.nanorc ~/.nanorc
echo 'include "/usr/share/nano/*.nanorc"' >> $PWD/.nanorc

# vim
ln -s $PWD/.vimrc ~/.vimrc
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
vim +PluginInstall +qall
