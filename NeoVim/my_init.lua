-- config for each systems
if jit and jit.os == "Windows" then
    vim.o.shell = "pwsh.exe"
elseif jit.os == "Linux" then
    -- do nothing
elseif jit.os == "OSX" then
    -- do nothing
else
    -- do nothing
end


-- key mappings
local ls = require("luasnip")

vim.keymap.set({"i"}, "<C-O>", function() ls.expand() end, {silent = true})
vim.keymap.set({"i", "s"}, "<C-N>", function() ls.jump( 1) end, {silent = true})
vim.keymap.set({"i", "s"}, "<C-P>", function() ls.jump(-1) end, {silent = true})

vim.keymap.set({"i", "s"}, "<C-C>", function()
	if ls.choice_active() then
		ls.change_choice(1)
	end
end, {silent = true})


vim.o.tabstop = 4
vim.o.shiftwidth = 4

vim.cmd [[colorscheme tokyonight]]


if vim.g.neovide == nil then
    vim.cmd [[
        highlight Normal guibg=none
        highlight NonText guibg=none
        highlight Normal ctermbg=none
        highlight NonText ctermbg=none
    ]]

elseif vim.g.neovide then

    -- Display
    vim.o.guifont = "JetBrainsMono Nerd Font Mono:h14" -- text below applies for VimScript
    vim.opt.linespace = 0
    vim.g.neovide_scale_factor = 1.0
    vim.g.neovide_text_gamma = 0.0
    vim.g.neovide_text_contrast = 0.5
    vim.g.neovide_padding_top = 0
    vim.g.neovide_padding_bottom = 0
    vim.g.neovide_padding_right = 0
    vim.g.neovide_padding_left = 0

    vim.g.neovide_title_background_color = string.format(
        "%x",
        vim.api.nvim_get_hl(0, {id=vim.api.nvim_get_hl_id_by_name("Normal")}).bg
    )
    vim.g.neovide_title_text_color = "white"

    vim.g.neovide_window_blurred = true
    vim.g.neovide_floating_blur_amount_x = 2.0
    vim.g.neovide_floating_blur_amount_y = 2.0
    vim.g.neovide_floating_shadow = true
    vim.g.neovide_floating_z_height = 10
    vim.g.neovide_light_angle_degrees = 45
    vim.g.neovide_light_radius = 5
    vim.g.neovide_floating_corner_radius = 0.0
    vim.g.neovide_opacity = 0.5
    vim.g.neovide_normal_opacity = 1.0
    vim.g.neovide_show_border = true
    vim.g.neovide_position_animation_length = 0.15
    vim.g.neovide_scroll_animation_length = 0.3
    vim.g.neovide_scroll_animation_far_lines = 1
    vim.g.neovide_hide_mouse_when_typing = false
    vim.g.neovide_underline_stroke_scale = 1.0
    vim.g.neovide_theme = 'auto'
    vim.g.experimental_layer_grouping = false

    -- Functionality
    vim.g.neovide_refresh_rate = 60
    vim.g.neovide_refresh_rate_idle = 5
    vim.g.neovide_no_idle = true
    vim.g.neovide_confirm_quit = true
    vim.g.neovide_detach_on_quit = 'always_quit'
    vim.g.neovide_fullscreen = false
    vim.g.neovide_macos_simple_fullscreen = false
    vim.g.neovide_remember_window_size = true
    vim.g.neovide_profiler = false
    vim.g.neovide_cursor_hack = true

    -- Input Settings
    vim.g.neovide_input_macos_option_key_is_meta = 'only_left'
    vim.g.neovide_input_ime = true
    vim.g.neovide_touch_deadzone = 6.0
    vim.g.neovide_touch_drag_timeout = 0.17

    -- Cursor Settings
    vim.g.neovide_cursor_animation_length = 0.150
    vim.g.neovide_cursor_short_animation_length = 0.04
    vim.g.neovide_cursor_trail_size = 1.0
    vim.g.neovide_cursor_antialiasing = true
    vim.g.neovide_cursor_animate_in_insert_mode = true
    vim.g.neovide_cursor_animate_command_line = true
    vim.g.neovide_cursor_unfocused_outline_width = 0.125
    vim.g.neovide_cursor_smooth_blink = false

    -- Cursor Particle
    vim.g.neovide_cursor_vfx_mode = {"railgun", "wireframe"}
    vim.g.neovide_cursor_vfx_opacity = 200.0
    vim.g.neovide_cursor_vfx_particle_lifetime = 0.5
    vim.g.neovide_cursor_vfx_particle_highlight_lifetime = 0.2
    vim.g.neovide_cursor_vfx_particle_density = 0.7
    vim.g.neovide_cursor_vfx_particle_speed = 10.0
    vim.g.neovide_cursor_vfx_particle_phase = 1.5
    vim.g.neovide_cursor_vfx_particle_curl = 1.0

end
