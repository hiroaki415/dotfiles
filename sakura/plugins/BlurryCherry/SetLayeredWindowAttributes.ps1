function Set-LayeredWindowAttributes {
    param(
        [Parameter(Mandatory)]
        [string]
        $Process,
        [int]
        $Alpha = 205
    )
    if ($Alpha -lt 30 -or $Alpha -gt 255) { throw 'Set-LayeredWindowAttributes: Alpha value must be between 30 to 255'}

    $user32 = Add-Type -Name 'user32' -Namespace 'Win32' -PassThru -MemberDefinition @'
        [DllImport("user32.dll")]
        public static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SetLayeredWindowAttributes(IntPtr hWnd, uint crKey, int bAlpha, uint dwFlags);
'@

    Get-Process $Process | ? { $_.MainWindowHandle -ne 0 } | ForEach-Object {
        $h = $_.MainWindowHandle
        $wl = $user32::GetWindowLong($h, -20)
        $user32::SetWindowLong($h, -20, ($wl -bor 0x80000)) | Out-Null
        $user32::SetLayeredWindowAttributes($h, 0, $Alpha, 0x02) | Out-Null
    }
}
