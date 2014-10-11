(set-language-environment "Japanese")
(prefer-coding-system 'utf-8)

;(setq load-path (cons "~/.emacs.d/elisp" load-path))
;(require 'install-elisp)
;(setq install-elisp-repositry-directory "~/.emacs.d/elisp")

(setq inhibit-startup-message t)

(add-to-list 'default-frame-alist '(foreground-color . "white"))
(add-to-list 'default-frame-alist '(background-color . "black"))

(show-paren-mode 1)

(column-number-mode 1)
(line-number-mode 1)

(transient-mark-mode 1)

(setq cursor-in-non-selected-windows nil)

(global-font-lock-mode t)

(global-set-key "\M-n" 'linum-mode)

;(require 'auto-complete)
;(global-auto-complete-mode t)
;(icomplete-mode 1)
;(partial-complete-mode 1)

(column-number-mode t)
(line-number-mode t)