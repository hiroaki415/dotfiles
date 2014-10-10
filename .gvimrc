""setting for my gvim

if has("unix")
    ""
elseif has("mac")
    set transparency=220
elseif has("win32") || has("win32") || ("win32unix")
    set guifont=MS_Gothic:h10:cANSI
endif
