# Script para testar busca de noticias com imagens

Write-Host "`n🤖 Buscando noticias automaticas..." -ForegroundColor Cyan

$url = "http://localhost:3000/api/news/fetch"
$token = "doc_basico_news_2026_secret_xyz123"

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Sucesso!" -ForegroundColor Green
    Write-Host "Salvas: $($result.saved.Count)" -ForegroundColor Green
    Write-Host "Ignoradas: $($result.skipped.Count)" -ForegroundColor Yellow
    
    if ($result.saved.Count -gt 0) {
        Write-Host "`nNoticias salvas:" -ForegroundColor Cyan
        foreach ($article in $result.saved) {
            Write-Host "  • $($article.title)" -ForegroundColor White
            if ($article.imageUrl) {
                Write-Host "    Imagem: $($article.imageUrl)" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "`n💡 Acesse /noticias para ver o novo design!" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

