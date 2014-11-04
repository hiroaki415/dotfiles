;;; package --- Summary
;;; Commentary:
;;; this is a setting file for Emacs
;;;
;;; @hiroaki

;; very efficient plugin "helm.el", do check it out

(set-language-environment "Japanese")
;;; Code:
;;; Japanese UTF-8

(set-default-coding-systems 'utf-8)
(setq default-file-name-coding-system 'utf-8)
(setq buffer-file-coding-system 'utf-8)
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
(setq x-select-enable-clipboard t)

(require 'package)
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(package-initialize)

(add-hook 'after-init-hook #'global-flycheck-mode)

(require 'auto-complete)
(require 'auto-complete-config)
(global-auto-complete-mode t)

(require 'smartparens)
(smartparens-global-mode t)

(require 'powerline)
(powerline-default-theme)

(load-theme 'solarized-dark t)

(if window-system (progn
    (set-frame-parameter nil 'alpha 90)
    ))

(require 'yasnippet)
(yas-global-mode 1)

(require 'popwin)
(setq display-buffer-function 'popwin:display-buffer)

(require 'direx)
(push '(direx:direx-mode :position left :width 25 :dedicated t)
      popwin:special-display-config)
(global-set-key (kbd "C-x C-j") 'direx:jump-to-directory-other-window)

(cond ((eq system-type 'gnu/linux)
       (cond (window-system
	      (set-face-attribute 'default nil
				  :family "Ricty"
				  :height 100)
	      (set-fontset-font (frame-parameter nil 'font)
				'japanese-jisx0208
				'("Ricty" . "unicode-bmp")
				)
	      (set-fontset-font (frame-parameter nil 'font)
				'katakana-jisx0201
				'("Ricty" . "unicode-bmp")
				)
	      (setq face-font-rescale-alist
		    '(
		      (".*Ricty.*" . 1.0)
		      (".*Ricty.*"    . 1.1)
		      ))
	      )
	     )
       )
      ((eq system-type 'windows-nt)
       (cond (window-system
	      (set-face-attribute 'default nil
				  :family "Consolas"
				  :height 100)
	      (set-fontset-font (frame-parameter nil 'font)
				'japanese-jisx0208
				'("Consolas" . "unicode-bmp")
				)
	      (set-fontset-font (frame-parameter nil 'font)
				'katakana-jisx0201
				'("Consolas" . "unicode-bmp")
				)
	      (setq face-font-rescale-alist
		    '(
		      (".*Consolas.*" . 1.0)
		      (".*Consolas.*"    . 1.1)
		      ))
	      )
	     )
       )
)

(cond
 ((eq system-type 'gnu/linux)
  (require 'mozc)
  (setq default-input-method "japanese-mozc")
  (setq mozc-candidate-style 'overlay)
  )
 ((eq system-type 'windows-nt)
  ;;do nothing, under construction
  )
)

(provide 'init)
;;; init.el ends here
