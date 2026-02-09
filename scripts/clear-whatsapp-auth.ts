/**
 * Script para limpar autenticação do WhatsApp
 * Use este script se tiver problemas de conexão
 * 
 * Uso:
 *   npx tsx scripts/clear-whatsapp-auth.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const authDir = path.join(process.cwd(), 'whatsapp_auth');

console.log('🧹 Limpando autenticação do WhatsApp...\n');

try {
  if (fs.existsSync(authDir)) {
    // Remover todos os arquivos na pasta
    const files = fs.readdirSync(authDir);
    
    files.forEach((file) => {
      const filePath = path.join(authDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Remover diretório recursivamente
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`   ✅ Removido diretório: ${file}`);
      } else {
        // Remover arquivo
        fs.unlinkSync(filePath);
        console.log(`   ✅ Removido arquivo: ${file}`);
      }
    });
    
    // Remover a pasta principal
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log(`\n✅ Pasta ${authDir} removida com sucesso!`);
  } else {
    console.log(`ℹ️  Pasta ${authDir} não existe. Nada para limpar.`);
  }
  
  console.log('\n💡 Agora você pode executar novamente:');
  console.log('   npx tsx scripts/start-whatsapp.ts');
  console.log('\n📱 Um novo QR code será gerado para você escanear.\n');
} catch (error: any) {
  console.error('❌ Erro ao limpar autenticação:', error.message);
  console.error('\n💡 Tente remover manualmente a pasta:');
  console.error(`   ${authDir}`);
  process.exit(1);
}

