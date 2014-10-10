""setting for my gvim

if has("unix")
    ""
elseif has("mac")
    set transparency=220
elseif has("win32") || has("win64") || ("win32unix")
    set guifont=Ricty_Diminished:h10:b:cANSI
endif
