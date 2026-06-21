-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

--  ~/.config/nvim/lua/config/options.lua
-- $env:LOCALAPPDATA\nvim\lua\config\options.lua

local home = os.getenv("USERPROFILE")
package.path = package.path .. ";" .. home .. "/dotfiles/NeoVim/?.lua" .. ";" .. home .. "" -- any path you wish to add

require("my_init")
