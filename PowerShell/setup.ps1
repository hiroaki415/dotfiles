#Requires -RunAsAdministrator


# PowerShell
Write-Host "setting up PowerShell..."
$target = "$HOME\dotfiles\PowerShell\Microsoft.PowerShell_profile.ps1"
$path = "$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"
if (Test-Path $path) {
    Remove-Item -Path $dest
}
New-Item -ItemType SymbolicLink -Path $path -Value $target
