$theme = "slimfat.omp.json"
oh-my-posh init pwsh --config $env:POSH_THEMES_PATH/$theme | Invoke-Expression


# disable system startup service of nginx
$NGINX_DIR = Get-ChildItem -Path "C:\tools" -Directory | Where-Object { $_.Name -match "^nginx-\d+\.\d+\.\d+$" }
function nginx {
    $exePath = "$NGINX_DIR\nginx.exe"
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $exePath
    $startInfo.Arguments = $args
    $startInfo.WorkingDirectory = $NGINX_DIR
    $startInfo.RedirectStandardOutput = $true
    $startInfo.UseShellExecute = $false
    $process = [System.Diagnostics.Process]::Start($startInfo)
    $output = $process.StandardOutput.ReadToEnd()
    Write-Host $output
    $process.WaitForExit()
}

function start-nginx {
    $exePath = "$NGINX_DIR\nginx.exe"
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $exePath
    $startInfo.Arguments = $args
    $startInfo.WorkingDirectory = $NGINX_DIR
    $startInfo.RedirectStandardOutput = $false
    $startInfo.UseShellExecute = $true
    $process = [System.Diagnostics.Process]::Start($startInfo)
    Write-Host "Nginx started in the background with PID: $($process.Id)"
}
