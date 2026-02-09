/**
 * Script para iniciar servidor WhatsApp Baileys com API HTTP
 * 
 * Este script mantém a conexão WhatsApp ativa E expõe uma API HTTP
 * para que o Next.js possa enviar mensagens mesmo em processos separados
 * 
 * Uso:
 *   npx tsx scripts/start-whatsapp-server.ts
 */

import { initializeWhatsApp, sendWhatsApp, sendWhatsAppDocument, getWhatsAppStatus } from '../lib/whatsapp-baileys';
import * as http from 'http';

const PORT = 3001; // Porta para a API do WhatsApp

console.log('🚀 Iniciando servidor WhatsApp Baileys com API HTTP...\n');

// Inicializar conexão
initializeWhatsApp()
  .then((socket) => {
    if (!socket) {
      console.error('❌ Falha ao inicializar WhatsApp');
      process.exit(1);
    }
    console.log('✅ WhatsApp inicializado\n');
  })
  .catch((error) => {
    console.error('\n❌ Erro ao iniciar WhatsApp:', error);
    process.exit(1);
  });

// Criar servidor HTTP para receber requisições de envio
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Rota para enviar mensagem
  if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { to, message, document, fileName, mimetype, caption } = data;
        
        console.log(`[API] Dados recebidos:`, {
          to: to || 'não fornecido',
          message: message ? 'sim' : 'não',
          document: document ? `sim (${typeof document === 'string' ? 'base64' : 'buffer'})` : 'não',
          fileName: fileName || 'não fornecido',
        });
        
        // Se tiver documento, enviar documento
        if (document) {
          console.log(`[API] ✅ Detectado envio de documento`);
          
          if (!to || !document || !fileName) {
            console.error(`[API] ❌ Campos obrigatórios faltando`);
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'to, document e fileName são obrigatórios para enviar documento' }));
            return;
          }

          // Converter base64 para Buffer se necessário
          let documentBuffer: Buffer;
          if (typeof document === 'string') {
            // Se for base64
            console.log(`[API] Convertendo base64 para Buffer...`);
            documentBuffer = Buffer.from(document, 'base64');
            console.log(`[API] ✅ Convertido! Tamanho: ${(documentBuffer.length / 1024).toFixed(2)} KB`);
          } else if (Buffer.isBuffer(document)) {
            documentBuffer = document;
            console.log(`[API] ✅ Já é Buffer! Tamanho: ${(documentBuffer.length / 1024).toFixed(2)} KB`);
          } else {
            // Se for array de números (JSON serializado)
            console.log(`[API] Convertendo array para Buffer...`);
            documentBuffer = Buffer.from(document);
            console.log(`[API] ✅ Convertido! Tamanho: ${(documentBuffer.length / 1024).toFixed(2)} KB`);
          }

          console.log(`[API] 📤 Recebida requisição para enviar documento para ${to}`);
          console.log(`[API] Arquivo: ${fileName}`);
          console.log(`[API] Chamando sendWhatsAppDocument...`);
          
          const result = await sendWhatsAppDocument({ 
            to, 
            document: documentBuffer, 
            fileName, 
            mimetype: mimetype || 'application/pdf',
            caption 
          });
          
          console.log(`[API] Resultado:`, result);
          
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          // Enviar mensagem de texto
          console.log(`[API] ✅ Detectado envio de mensagem de texto`);
          
          if (!to || !message) {
            console.error(`[API] ❌ Campos obrigatórios faltando (to ou message)`);
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'to e message são obrigatórios' }));
            return;
          }

          console.log(`[API] 📤 Recebida requisição para enviar mensagem para ${to}`);
          const result = await sendWhatsApp({ to, message });
          
          res.writeHead(200);
          res.end(JSON.stringify(result));
        }
      } catch (error: any) {
        console.error('[API] ❌ Erro ao processar requisição:', error);
        console.error('[API] Stack:', error.stack);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } 
  // Rota para verificar status
  else if (req.method === 'GET' && req.url === '/status') {
    const status = getWhatsAppStatus();
    
    res.writeHead(200);
    res.end(JSON.stringify(status));
  }
  // Rota não encontrada
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🌐 API HTTP do WhatsApp rodando em: http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/send - Enviar mensagem ou documento`);
  console.log(`   GET  http://localhost:${PORT}/status - Verificar status\n`);
});

// Tratar erro de porta em uso
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Erro: A porta ${PORT} já está em uso!`);
    console.error(`\n💡 Soluções:`);
    console.error(`   1. Pare o processo que está usando a porta ${PORT}:`);
    console.error(`      Windows: netstat -ano | findstr :${PORT}`);
    console.error(`      Depois: taskkill /F /PID <PID>`);
    console.error(`   2. Ou altere a porta no arquivo start-whatsapp-server.ts\n`);
    process.exit(1);
  } else {
    console.error(`\n❌ Erro ao iniciar servidor:`, error);
    process.exit(1);
  }
});

// Manter processo vivo
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor WhatsApp...');
  server.close();
  process.exit(0);
});

