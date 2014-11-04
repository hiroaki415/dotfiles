(if (eq system-type 'windows-nt)
  (load (concat (getenv "HOMEDRIVE") (getenv "HOMEPATH") "/dotfiles/.emacs.d/init"))
)
