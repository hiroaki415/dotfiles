## 概要

EmacsやVimなどのテキストエディタ向け設定ファイルを集めたもの  
基本的にはLinux(Debian系)向けの作り  


## セットアップ
○Linuxの場合  
基本的にはホーム直下にクローンして中にあるセットアップスクリプト打つだけ  
アプリケーションのインストールからシムリンク張りまで全部やってくれるようになってる  
ただしアプリインスコはDebian、Ubuntu、Mint、Fedora、CentOSくらいにしか対応させてない  
他のディストリの場合は適宜頑張ること  
gitやシェルの操作の際にはsudoさんを呼ぶこと  


    $ git clone https://github.com/hiroaki415/dotfiles.git ~/dotfiles  
    $ cd ~/dotfiles  
    $ ./setup.sh  


○Mac(Unix)の場合  
たぶんLinuxと同じ方法でいけるはず(未確認)  
アプリのインスコはもちろん自分でやること  


○Windowsの場合  
これも概ね上のやり方に同じ  
クローン後はsetup.batを管理者権限で打つこと  
ただしVimのプラグインは初回起動時に手動でやる必要がある  
Vim起動後、(たぶんエラーメッセージが出るのでとばして)":BundleInstall"と打てば全部かってに追加される、終わったら再起動  
    $ git clone https://github.com/hiroaki415/dotfiles.git ~/dotfiles  
※EmacsはIMEの関係でgnupack版がｵﾇﾇﾒ  


○Cygwin？そんなものは知らん


## その他
フォントはだいたいRictyかSourceCodeProにしてある、お好みで変更すること  
カラーテーマもSolarizedに統一してある、お好みで(ry  

