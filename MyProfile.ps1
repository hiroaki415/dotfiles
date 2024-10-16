$theme = "slimfat.omp.json"
oh-my-posh init pwsh --config $env:POSH_THEMES_PATH/$theme | Invoke-Expression

$NGINX_DIR = "C:\tools\nginx-1.27.2"
Set-Alias -Name nginx -Value $NGINX_DIR\nginx.lnk
