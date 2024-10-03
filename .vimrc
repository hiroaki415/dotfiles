" setting
" filetype off

set ambiwidth=double
" set autoread
set fenc=utf-8
set hidden
" iset nobackup
set nocompatible
set nowritebackup
" set noswapfile
set shellslash
set showcmd


" appearance
" syntax enable
set cursorcolumn
set cursorline
set laststatus=2
set number
" set ruler
" set showmatch
set visualbell


" input
" set backspace=indent,eol,start
set clipboard=unnamed,unnamedplus
" set smartindent
set virtualedit=onemore
set whichwrap=b,s,h,l,<,>,[,],~
" set wildmenu
set wildmode=list:longest
" nnoremap j gj
" nnoremap k gk


" tab
" set expandtab
set list listchars=tab:\▸\-
set tabstop=4
set shiftwidth=4


" search
" set hlsearch
" set incsearch
" set ignorecase
" set smartcase
set wrapscan
" nmap <Esc><Esc> :nohlsearch<CR><Esc>


" split
set splitbelow
set splitright


" auto reload .vimrc
" augroup source-vimrc
"   autocmd!
"   autocmd BufWritePost *vimrc source $MYVIMRC | set foldmethod=marker
"   autocmd BufWritePost *gvimrc if has('gui_running') source $MYGVIMRC
" augroup END


" plugin
" if has("unix")
"     set rtp+=~/.vim/bundle/Vundle.vim
"     call vundle#begin('~/.vim/bundle')
" elseif has("mac")
"     set rtp+=~/.vim/bundle/Vundle.vim
"     call vundle#begin('~/.vim/bundle')
" elseif has("win64")
"     set rtp+=$HOME/vimfiles/bundle/Vundle.vim
"     call vundle#begin('~/vimfiles/bundle')
" elseif has("win32")
"     set rtp+=$HOME/vimfiles/bundle/Vundle.vim
"     call vundle#begin('~/vimfiles/bundle')
" elseif has("win32unix")
"     set rtp+=~/.vim/bundle/Vundle.vim
"     call vundle#begin('~/.vim/bundle')
" endif

" Plugin 'VundleVim/Vundle.vim'
" Plugin 'scrooloose/nerdtree'
" Plugin 'airblade/vim-gitgutter'
" Plugin 'tpope/vim-fugitive'
" Plugin 'tpope/vim-surround'
" Plugin 'tpope/vim-commentary'
" Plugin 'vim-airline/vim-airline'
" Plugin 'vim-airline/vim-airline-themes'
" Plugin 'vim-scripts/peaksea'
" Plugin 'altercation/vim-colors-solarized' 

" call vundle#end()
" filetype plugin indent on


" nnoremap for NERDTree
let g:NERDTreeWinPos = "left"
let NERDTreeShowHidden = 1
" nnoremap <leader>n :NERDTreeFocus<CR>
" nnoremap <C-n> :NERDTree<CR>
" noremap <C-t> :NERDTreeToggle<CR>
" noremap <C-f> :NERDTreeFind<CR>


" colorscheme
" set background = dark
if has("win64")
    colorscheme pablo
    set shell=powershell
elseif has("win32")
    colorscheme pablo
else
    colorscheme peaksea
    hi Normal ctermfg=252 ctermbg=NONE cterm=NONE
    hi NonText ctermfg=69 ctermbg=NONE cterm=NONE
endif


" ayu_dark
" deus
" selenized_black
let g:lightline = {
    \ 'colorscheme': 'ayu_dark',
    \ 'active': {
    \   'left': [ [ 'mode', 'paste' ],
    \             [ 'gitbranch', 'readonly', 'filename', 'modified' ] ],
    \   'right': [ [ 'lineinfo' ],
    \              [ 'percent' ],
    \              [ 'fileformat', 'fileencoding', 'filetype' ] ]
    \ },
    \ 'component_function': {
    \   'gitbranch': 'FugitiveHead'
    \ },
    \ }
