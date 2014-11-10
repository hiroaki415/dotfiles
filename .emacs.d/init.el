;;; package --- Summary
;;; Commentary:
;;; this is a setting file for Emacs
;;;
;;; @hiroaki

;; very efficient plugin "helm.el", do check it out

(set-language-environment "Japanese")
;;; Code:
;;; Japanese UTF-8


;;encoding
(set-default-coding-systems 'utf-8)
(setq default-file-name-coding-system 'utf-8)
(setq buffer-file-coding-system 'utf-8)
(setq default-terminal-coding-system 'utf-8)
(setq default-keyboard-coding-system 'utf-8)


;;primary look and feel
(setq inhibit-startup-message t)

(show-paren-mode 1)
(setq show-paren-style 'mixed)

(column-number-mode 1)
(line-number-mode 1)
(global-hl-line-mode)

(transient-mark-mode 1)

(blink-cursor-mode 1)

(global-font-lock-mode t)


;;input control
(setq kill-whole-line t)

(setq indent-line-function 'indent-relative-maybe)
(global-set-key "\C-m" 'newline-and-indent)
(global-set-key "\C-m" 'indent-new-comment-line)

(xterm-mouse-mode t)
(mouse-wheel-mode t)
(setq scroll-conservatively 1)
(global-set-key [mouse-4] '(lambda () (interactive) (scroll-down 1)))
(global-set-key [mouse-5] '(lambda () (interactive) (scroll-up 1)))
(setq x-select-enable-clipboard t)


;;; plugins settings below

;;package.el
(require 'package)
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives '("marmalade" . "https://marmalade-repo.org/packages/"))
(package-initialize)


;;flycheck.el
(add-hook 'after-init-hook #'global-flycheck-mode)


;;auto-complete.el
(require 'auto-complete)
(require 'auto-complete-config)
(global-auto-complete-mode t)


;;smartparens.el
(require 'smartparens)
(smartparens-global-mode t)


;;powerline.el
(require 'powerline)
(powerline-default-theme)


;;solarized colortheme
(load-theme 'solarized-dark t)

(if window-system (progn
    (set-frame-parameter nil 'alpha 90)
    ))


;;yasnippet.el
(require 'yasnippet)
(yas-global-mode 1)


;;popwin.el for direx
(require 'popwin)
(setq display-buffer-function 'popwin:display-buffer)


;;direx.el
(require 'direx)
(push '(direx:direx-mode :position left :width 25 :dedicated t)
      popwin:special-display-config)
(global-set-key (kbd "C-x C-j") 'direx:jump-to-directory-other-window)


;;font setting
;;CAUTION!: you should install RictyFont
(cond ((eq system-type 'gnu/linux)
       (cond (window-system
	      (set-face-attribute 'default nil
				  :family "Source Code Pro"
				  :height 100)
	      (set-fontset-font (frame-parameter nil 'font)
				'japanese-jisx0208
				'("TakaoPGothic" . "unicode-bmp")
				)
	      (set-fontset-font (frame-parameter nil 'font)
				'katakana-jisx0201
				'("TakaoPGothic" . "unicode-bmp")
				)
	      (setq face-font-rescale-alist
		    '(
		      (".*Source Code Pro.*" . 1.0)
		      (".*TakaoPGothic.*"    . 1.1)
		      ))
	      )
	     )
       )
      ((eq system-type 'windows-nt)
       (cond (window-system
	      (set-face-attribute 'default nil
				  :family "Source Code Pro"
				  :height 100)
	      (set-fontset-font (frame-parameter nil 'font)
				'japanese-jisx0208
				'("メイリオ" . "unicode-bmp")
				)
	      (set-fontset-font (frame-parameter nil 'font)
				'katakana-jisx0201
				'("メイリオ" . "unicode-bmp")
				)
	      (setq face-font-rescale-alist
		    '(
		      (".*Source Code Pro.*" . 1.0)
		      (".*メイリオ.*"    . 1.1)
		      ))
	      )
	     )
       )
)


;;input method for mozc
(cond
 ((eq system-type 'gnu/linux)
  (require 'mozc)
  (setq default-input-method "japanese-mozc")
  (setq mozc-candidate-style 'overlay)
  )
 ((eq system-type 'windows-nt)
  ;;CAUTION: this setting requires "gnupack" ver Emacs
  (set-language-info "Japanese" 'input-method "W32-IME")
  (setq w32-ime-buffer-switch-p nil)
  (setq w32-ime-mode-line-state-indicator-list '("-" "[JPN]" "[US]"))
  (setq-default w32-ime-mode-line-state-indicator "[US]")
  (w32-ime-initialize)
  )
)

(provide 'init)
;;; init.el ends here
