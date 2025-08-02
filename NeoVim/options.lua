--  ~/.config/nvim/lua/options.lua
-- $HOME\AppData\Local\nvim\init.lua

require "nvchad.options"

-- add yours here!
local home = os.getenv("USERPROFILE")
package.path = package.path
    .. ";" .. home .. "/dotfiles/NeoVim/?.lua"
    .. ";" .. home .. "" -- any path you wish to add

require "my_init"

-- local o = vim.o
-- o.cursorlineopt ='both' -- to enable cursorline!
