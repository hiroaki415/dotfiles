if ! [ -f ~/dotfiles/setup.sh ]; then
    echo "You have placed dotfiles in the wrong directory."
    echo "Please place dotifiles in /home/{username}/dotfiles/"
    exit
fi


# bash
echo "setting bashrc..."
if ! [ -d ~/.bash_it ]; then
    git clone --depth=1 https://github.com/Bash-it/bash-it.git ~/.bash_it
    sh ~/.bash_it/install.sh
else
    echo "Bash-it is already installed."
    read -p "Do you want to update Bash-it? (y/N): " yn
    case "$yn" in
        [yY])
            bash-it update stable;;
        [nN])
            echo "";; # do nothing
        *)
            echo "";; # do nothing
    esac
fi
echo "You have set up bashrc."
echo ""


# nano
echo "setting nanorc..."
if ! [ -L ~/.nanorc ]; then
    ln -s ~/dotfiles/.nanorc ~/.nanorc
else
    ln -nfs ~/dotfiles/.nanorc ~/.nanorc
fi
echo "You have set up nanorc."
echo ""


# vim
echo "setting vimrc..."
. ./vim_plugins.sh
if ! [ -d ~/.vim_runtime ]; then
    git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
    sh ~/.vim_runtime/install_awesome_vimrc.sh
    cp ~/dotfiles/my_configs.vim ~/.vim_runtime/
else
    echo "Awesome Vimrc is already installed."
    read -p "Do you want to update amix/vimrc? (y/N): " yn
    case "$yn" in
        [yY])
            cd ~/.vim_runtime
            git reset --hard
            git clean -d --force
            git pull --rebase
            python3 update_plugins.py
            cd ~/dotfiles/
            ;;
        [nN])
            echo "";; # do nothing
        *)
            echo "";; # do nothing
    esac
fi

for plugin in "${myplugins[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$plugin")
    if [ $response -eq 200 ]; then
        pi_arr=(${plugin//// })
        if ! [ -d ~/.vim_runtime/my_plugins/${pi_arr[0]} ]; then
            ARR=(${//,/ })
            git clone https://github.com/$plugin ~/.vim_runtime/my_plugins/${pi_arr[0]}
        fi
    else
        echo "$plugin repository does not exist in Github.com"
    fi
done
echo "You have set up vimrc."
echo ""
echo "Set up all dotfiles successfully"


# ln -s $PWD/.vimrc ~/.vimrc
#git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
#vim +PluginInstall +qall
