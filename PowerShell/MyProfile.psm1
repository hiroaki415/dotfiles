$theme = "slimfat.omp.json"
oh-my-posh init pwsh --config $env:POSH_THEMES_PATH$theme | Invoke-Expression

$dll_path = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"
Import-Module $dll_path
Enter-VsDevShell bd50a617


# disable system startup service of nginx
$NGINX_DIR = Get-ChildItem -Path "${env:USERPROFILE}\AppData\Local\Microsoft\WinGet\Packages\nginxinc.nginx_Microsoft.Winget.Source_8wekyb3d8bbwe" -Directory | Where-Object { $_.Name -match "^nginx-\d+\.\d+\.\d+$" }
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

function Start-nginx {
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


$BUNDLETOOL_DIR = "$HOME\AppData\Local\Android\Sdk\platform-tools\bundletool.jar"
function bundletool {
  java -jar $BUNDLETOOL_DIR $args
}