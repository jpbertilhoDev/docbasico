# PowerShell Script para Corrigir TODOS os arquivos Supabase
# Uso: .\fix-supabase.ps1

$projectRoot = "c:\Users\jpber\Documents\docbasico"
$appDir = Join-Path $projectRoot "app"

Write-Host "🔧 Corrigindo arquivos Supabase..." -ForegroundColor Cyan
Write-Host ""

# Lista de arquivos para corrigir (todos em app/api)
$filesToFix = @(
    "api\sms\reminders\route.ts",
    "api\notifications\reminders\route.ts",
    "api\posts\[slug]\route.ts",
    "api\posts\route.ts",
    "api\contact\route.ts",
    "api\news\fetch\route.ts",
    "api\categories\route.ts",
    "api\appointments\[id]\cancel\route.ts",
    "api\admin\posts\route.ts",
    "api\admin\posts\[id]\route.ts",
    "api\admin\categories\[id]\route.ts",
    "api\admin\categories\route.ts",
    "api\appointments\route.ts",
    "api\appointments\slots\route.ts",
    "api\appointments\lookup\route.ts"
)

$filesFixed = 0
$filesSkipped = 0

foreach ($relPath in $filesToFix) {
    $fullPath = Join-Path $appDir $relPath
    
    if (!(Test-Path $fullPath)) {
        Write-Host "⚠️  Não encontrado: $relPath" -ForegroundColor Yellow
        $filesSkipped++
        continue
    }
    
    $content = Get-Content $fullPath -Raw -Encoding UTF8
    
    # Checar se já tem "as any"
    if ($content -match "\) as any\)") {
        Write-Host "✓ Já corrigido: $relPath" -ForegroundColor Gray
        $filesSkipped++
        continue
    }
    
    # Checar se tem supabase.from
    if ($content -notmatch "supabase\.from\(") {
        Write-Host "- Sem Supabase: $relPath" -ForegroundColor Gray
        $filesSkipped++
        continue
    }
    
    Write-Host "📝 Corrigindo: $relPath" -ForegroundColor Yellow
    
    # Aplicar substituições
    $newContent = $content
    
    # Padrão com aspas simples
    $newContent = $newContent -replace "supabase\.from\('([^']+)'\)", "(supabase.from('`$1') as any)"
    
    # Padrão com aspas duplas
    $newContent = $newContent -replace 'supabase\.from\("([^"]+)"\)', '(supabase.from("`$1") as any)'
    
    # Salvar
    Set-Content $fullPath $newContent -NoNewline -Encoding UTF8
    
    $filesFixed++
    Write-Host "  ✅ Corrigido!" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Concluído!" -ForegroundColor Green
Write-Host "📊 Arquivos corrigidos: $filesFixed" -ForegroundColor Cyan
Write-Host "⏭️  Arquivos ignorados: $filesSkipped" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Agora execute: npm run build" -ForegroundColor Yellow
