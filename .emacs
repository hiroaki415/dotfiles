(cond
 ((starting-match "linux" system-configuration)
  (load (expand-file-name (concat (getenv "HOME") "/dotfiles/.emacs.d/init")))
  )
 ((starting-match "ms-dos"|"windows-nt"|"cygwin" system-configuration)
  (losd (expand-file-name (concat (concat (getenv "HOMEDRIVE") (getenv "HOMEPATH")) "/dotfiles/.emacs.d/init")))
  )
 )
