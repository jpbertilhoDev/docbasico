/**
 * Script para iniciar servidor WhatsApp Baileys
 * 
 * Execute este script para manter a conexão WhatsApp ativa
 * 
 * Uso:
 *   npx tsx scripts/start-whatsapp.ts
 * 
 * Ou adicione ao package.json:
 *   "whatsapp": "tsx scripts/start-whatsapp.ts"
 */

import { initializeWhatsApp } from '../lib/whatsapp-baileys';

console.log('🚀 Iniciando servidor WhatsApp Baileys...\n');

// Inicializar conexão
initializeWhatsApp()
  .then((socket) => {
    // O socket pode não estar conectado ainda
    // A mensagem de sucesso será exibida pelo evento connection.update
    if (!socket) {
      console.error('❌ Falha ao inicializar WhatsApp');
      process.exit(1);
    }
    // Se já estiver conectado, a mensagem já foi exibida
    // Se não, aguardar o QR code aparecer
  })
  .catch((error) => {
    console.error('\n❌ Erro ao iniciar WhatsApp:', error);
    console.error('\n💡 Certifique-se de que:');
    console.error('   1. As dependências estão instaladas: npm install');
    console.error('   2. O Baileys está na versão correta');
    console.error('   3. Não há outro processo usando o WhatsApp');
    console.error('\n📋 Detalhes do erro:');
    console.error(error);
    process.exit(1);
  });

// Manter processo vivo
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor WhatsApp...');
  process.exit(0);
});

