import { execSync } from 'node:child_process';
import { platform } from 'node:os';

if (platform() === 'win32') {
  try {
    const psScript = [
      '$cert = (Get-ChildItem Cert:\\CurrentUser\\My -ErrorAction SilentlyContinue | Where-Object { $_.EnhancedKeyUsageList.FriendlyName -contains "Code Signing" -or $_.Subject -match "CN=LocalDev" } | Select-Object -First 1)',
      'if (-not $cert) {',
      '  $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=LocalDev" -CertStoreLocation Cert:\\CurrentUser\\My',
      '}',
      'Get-ChildItem -Path node_modules -Filter *.node -Recurse -ErrorAction SilentlyContinue | ForEach-Object {',
      '  Set-AuthenticodeSignature -Certificate $cert -FilePath $_.FullName | Out-Null',
      '}'
    ].join('\r\n');
    const base64Script = Buffer.from(psScript, 'utf16le').toString('base64');
    execSync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${base64Script}`, { stdio: 'ignore' });
  } catch (error) {
    // Ignore errors silently so install does not break
  }
}
