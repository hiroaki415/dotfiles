vim.opt.relativenumber = false
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4

if jit and jit.os == "Windows" then
  LazyVim.terminal.setup("pwsh")
elseif jit.os == "Linux" then
  -- do nothing
elseif jit.os == "OSX" then
  -- do nothing
else
  -- do nothing
end
