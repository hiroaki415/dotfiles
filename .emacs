(if (eq system-type 'windows-nt)
  (load (concat (concat (getenv "HOMEDRIVE") (getenv "HOMEPATH")) "/dotfiles/.emacs.d/init"))
)
