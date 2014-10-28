(set-language-environment "Japanese")

(set-default-coding-systems 'utf-8)
(setq default-file-name-coding-system 'utf-8)
(setq default-buffer-file-coding-system 'utf-8)
(setq default-terminal-coding-system 'utf-8)
(setq default-keyboard-coding-system 'utf-8)

(setq inhibit-startup-message t)

(setq kill-whole-line t)

(setq scroll-conservatively 1)

(show-paren-mode 1)
(setq show-paren-style 'mixed)

(column-number-mode 1)
(line-number-mode 1)
(global-hl-line-mode)

(transient-mark-mode 1)

(blink-cursor-mode 1)

(global-font-lock-mode t)

(setq indent-line-function 'indent-relative-maybe)
(global-set-key "\C-m" 'newline-and-indent)
(global-set-key "\C-m" 'indent-new-comment-line)

(xterm-mouse-mode t)
(mouse-wheel-mode t)
(global-set-key [mouse-4] '(lambda () (interactive) (scroll-down 1)))
(global-set-key [mouse-5] '(lambda () (interactive) (scroll-up 1)))

(require 'package)
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(package-initialize)

(add-hook 'after-init-hook #'global-flycheck-mode)

(require 'auto-complete)
(require 'auto-complete-config)
(global-auto-complete-mode t)

(require 'smartparens-config)
(smartparens-global-mode t)

(require 'powerline)
(powerline-default-theme)

(load-theme 'solarized-dark t)

(if window-system (progn
    (set-frame-parameter nil 'alpha 80)
    ))

(require 'yasnippet)
(yas-global-mode 1)
