$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'

function Stop-ProcessOnPort([int] $port) {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($connection in $connections) {
    $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
      Write-Host "Stopping existing $($process.ProcessName) process on port $port (PID $($process.Id))"
      Stop-Process -Id $process.Id -Force
    }
  }
}

Stop-ProcessOnPort 8080
Stop-ProcessOnPort 3000

$backendProcess = Start-Process -FilePath (Join-Path $backend 'mvnw.cmd') `
  -ArgumentList 'org.springframework.boot:spring-boot-maven-plugin:3.2.3:run' `
  -WorkingDirectory $backend `
  -PassThru

try {
  Write-Host "Backend starting at http://localhost:8080 (PID $($backendProcess.Id))"
  Write-Host "Frontend starting at http://localhost:3000"
  npm --prefix $root run dev
}
finally {
  if ($backendProcess -and -not $backendProcess.HasExited) {
    Stop-Process -Id $backendProcess.Id -Force
  }
}
