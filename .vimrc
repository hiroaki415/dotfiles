""setting for my vim
"@hiroaki

""primary
set encoding=utf-8
syntax on
set background=dark

set nowritebackup
set nobackup

set clipboard+=unnamed

set whichwrap=b,s,[,],<,>
set backspace=indent,eol,start

set mouse=a

set number
set cursorline
set cursorcolumn

set autoindent
set expandtab
set tabstop=4
set softtabstop=4
set shiftwidth=4


""auto aommand
au BufNewFile,BufRead * set iminsert=0
au BufNewFile,BufRead * set tabstop=4 shiftwidth=4

""setting for search
set ignorecase
set smartcase
set wrapscan
set incsearch
set hlsearch


""setting for Vundle
set nocompatible
filetype off

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

Bundle 'gmarik/vundle'


""vim utility
Bundle 'tpope/vim-fugitive'
Bundle 'msanders/snipmate.vim'
Bundle 'Raimondi/delimitMate'
Bundle 'Lokaltog/vim-easymotion'
Bundle 'scrooloose/syntastic'
Bundle 'scrooloose/nerdtree'
 autocmd vimenter * NERDTree


""lnterface looking
Bundle 'bling/vim-airline'
 let g:airline_enable_branch = 0

Bundle 'altercation/vim-colors-solarized'
let g:solarized_termtrans = 1
colorscheme solarized


""for python
Bundle 'davidhalter/jedi-vim'


""for html
Bundle 'mattn/emmet-vim'


filetype plugin indent on
