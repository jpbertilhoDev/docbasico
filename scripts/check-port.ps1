# Script PowerShell para verificar e limpar porta do WhatsApp
# Uso: .\scripts\check-port.ps1 [porta]

param(
    [int]$Port = 3001
)

Write-Host "🔍 Verificando porta $Port..." -ForegroundColor Cyan

# Verificar se a porta está em uso
$connections = netstat -ano | Select-String ":$Port"

if ($connections) {
    Write-Host "⚠️  Porta $Port está em uso!" -ForegroundColor Yellow
    Write-Host ""
    
    # Extrair PIDs únicos
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)\s*$') {
            $matches[1]
        }
    } | Select-Object -Unique
    
    Write-Host "📋 Processos usando a porta $Port:" -ForegroundColor Cyan
    foreach ($pid in $pids) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   PID: $pid - $($process.ProcessName)" -ForegroundColor White
        } else {
            Write-Host "   PID: $pid - (processo não encontrado)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    $response = Read-Host "Deseja encerrar esses processos? (S/N)"
    
    if ($response -eq 'S' -or $response -eq 's') {
        foreach ($pid in $pids) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "✅ Processo $pid encerrado" -ForegroundColor Green
            } catch {
                Write-Host "❌ Erro ao encerrar processo $pid: $_" -ForegroundColor Red
            }
        }
        Write-Host ""
        Write-Host "✅ Porta $Port liberada!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Processos não foram encerrados" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Porta $Port está livre!" -ForegroundColor Green
}

Write-Host ""

