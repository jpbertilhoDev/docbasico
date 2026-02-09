/**
 * Serviço de envio de mensagens via WhatsApp usando Baileys
 * 
 * Baileys é uma biblioteca gratuita que conecta ao WhatsApp Web
 * Não precisa de API paga, funciona diretamente com WhatsApp
 * 
 * Vantagens:
 * - TOTALMENTE GRATUITO ✅
 * - Sem limites de envio
 * - Alta taxa de entrega
 * - Funciona com qualquer número WhatsApp
 * 
 * Requisitos:
 * - Precisa manter uma sessão ativa (servidor sempre rodando)
 * - Precisa escanear QR code uma vez para autenticar
 */

import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import NodeCache from 'node-cache';
// @ts-ignore - qrcode-terminal não tem tipos TypeScript
import qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';

interface WhatsAppOptions {
  to: string; // Número no formato: 351912345678 (sem +, sem espaços)
  message: string;
}

interface WhatsAppDocumentOptions {
  to: string;
  document: Buffer; // PDF ou outro documento
  fileName: string;
  mimetype?: string; // Default: application/pdf
  caption?: string; // Mensagem que acompanha o documento
}

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Cache para manter a conexão ativa
let socket: WASocket | null = null;
let isConnecting = false;
const messageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Controle de rate limiting (anti-ban)
let messageCount = 0;
let lastResetTime = Date.now();

// Reset contador a cada 60 segundos
setInterval(() => {
  messageCount = 0;
  lastResetTime = Date.now();
}, 60000);

/**
 * Obtém o socket atual (para uso interno)
 */
export function getSocket(): WASocket | null {
  return socket;
}

// Arquivo para compartilhar status entre processos
const STATUS_FILE = path.join(process.cwd(), 'whatsapp_status.json');

/**
 * Salva status da conexão em arquivo compartilhado
 */
function saveConnectionStatus(connected: boolean, userId?: string, phoneNumber?: string) {
  try {
    const status = {
      connected,
      userId: userId || null,
      phoneNumber: phoneNumber || null,
      lastUpdate: new Date().toISOString(),
    };
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
    console.log(`[WHATSAPP] Status salvo: ${connected ? 'Conectado' : 'Desconectado'}`);
  } catch (error) {
    console.error('[WHATSAPP] Erro ao salvar status:', error);
  }
}

/**
 * Lê status da conexão do arquivo compartilhado
 */
function getConnectionStatusFromFile(): { connected: boolean; userId?: string; phoneNumber?: string } {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf-8');
      const status = JSON.parse(content);
      return {
        connected: status.connected || false,
        userId: status.userId,
        phoneNumber: status.phoneNumber,
      };
    }
  } catch (error) {
    console.error('[WHATSAPP] Erro ao ler status:', error);
  }
  return { connected: false };
}

/**
 * Inicializa conexão com WhatsApp usando Baileys
 * Exportada para uso em scripts externos
 */
export async function initializeWhatsApp(): Promise<WASocket | null> {
  // Se já estiver conectado, retornar
  if (socket && socket.user) {
    console.log('✅ WhatsApp já está conectado!');
    return socket;
  }

  // Se já estiver tentando conectar, aguardar
  if (isConnecting) {
    console.log('⏳ Conexão já em andamento, aguardando...');
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (socket && socket.user) {
          clearInterval(checkInterval);
          resolve(socket);
        } else if (!isConnecting) {
          clearInterval(checkInterval);
          resolve(null);
        }
      }, 1000);
    });
  }

  isConnecting = true;
  console.log('🔄 Iniciando conexão com WhatsApp...');

  try {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp_auth');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    // Verificar se há credenciais válidas
    if (state.creds.registered) {
      console.log('📱 Tentando reconectar com sessão existente...');
    } else {
      console.log('📱 Nenhuma sessão encontrada. Gerando QR code...');
    }
    
    if (!isLatest) {
      console.log(`⚠️  Versão do Baileys: ${version.join('.')} (recomendado atualizar)`);
    }

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }), // Silenciar logs
      // printQRInTerminal foi depreciado - vamos usar connection.update
      browser: Browsers.ubuntu('DocBasico Bot'), // Identificação do browser
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false, // Para receber notificações no app
      syncFullHistory: false, // Não sincronizar histórico completo
      getMessage: async (key: any) => {
        if (key.id && messageCache.has(key.id)) {
          return messageCache.get(key.id);
        }
        return undefined;
      },
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr, isNewLogin, qrCodeTimeout } = update;

      // Exibir QR code no terminal (printQRInTerminal foi depreciado)
      if (qr) {
        console.clear(); // Limpar terminal para melhor visualização
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║   📱 ESCANEIE O QR CODE ABAIXO       ║');
        console.log('╚═══════════════════════════════════════╝\n');
        qrcode.generate(qr, { small: true }); // Usar small: true para QR code menor e mais fácil de escanear
        console.log('\n💡 INSTRUÇÕES:');
        console.log('   1. Abra o WhatsApp no seu celular');
        console.log('   2. Vá em: Configurações → Aparelhos conectados');
        console.log('   3. Toque em: Conectar um aparelho');
        console.log('   4. Escaneie o QR code acima');
        if (qrCodeTimeout) {
          console.log(`\n⏰ Este QR code expira em ~${Math.floor(qrCodeTimeout / 1000)} segundos`);
        }
        console.log('\n⏳ Aguardando escaneamento...\n');
      }

      // Log de status de conexão (apenas para debug)
      if (connection && connection !== 'open' && connection !== 'close') {
        if (connection === 'connecting') {
          console.log('🔄 Conectando ao WhatsApp...');
        }
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        console.log(`\n🔌 Conexão fechada. Status: ${lastDisconnect?.error?.output?.statusCode || 'desconhecido'}`);
        
        // Salvar status como desconectado
        saveConnectionStatus(false);
        
        if (shouldReconnect) {
          console.log('🔄 Tentando reconectar automaticamente...\n');
          setTimeout(() => {
            socket = null;
            isConnecting = false;
            initializeWhatsApp();
          }, 3000);
        } else {
          console.log('\n❌ WhatsApp desconectado. Você precisa escanear o QR code novamente.');
          console.log('\n💡 Para limpar a sessão antiga e gerar novo QR code:');
          console.log('   1. Execute: npx tsx scripts/clear-whatsapp-auth.ts');
          console.log('   2. Depois execute: npx tsx scripts/start-whatsapp.ts\n');
          socket = null;
          isConnecting = false;
        }
      } else if (connection === 'open') {
        console.clear();
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║   ✅ WHATSAPP CONECTADO COM SUCESSO!  ║');
        console.log('╚═══════════════════════════════════════╝\n');
        console.log('💡 Mantenha este processo rodando para receber e enviar mensagens');
        console.log('🛑 Pressione Ctrl+C para desconectar\n');
        socket = sock;
        isConnecting = false;
        
        // Salvar status da conexão em arquivo compartilhado
        const userId = sock.user?.id || '';
        const phoneNumber = userId.split(':')[0] || '';
        saveConnectionStatus(true, userId, phoneNumber);
      } else if (connection === 'connecting') {
        console.log('🔄 Conectando ao WhatsApp...');
      }
    });

    sock.ev.on('messages.upsert', async (m: any) => {
      // Opcional: processar mensagens recebidas
      // Útil para criar um bot que responde automaticamente
    });

    // Não retornar imediatamente - aguardar conexão
    // O socket será retornado quando a conexão for estabelecida
    return sock;
  } catch (error: any) {
    console.error('Erro ao inicializar WhatsApp:', error);
    isConnecting = false;
    return null;
  }
}

/**
 * Envia mensagem via WhatsApp usando Baileys
 * Seguindo a documentação oficial: https://github.com/WhiskeySockets/Baileys
 */
/**
 * Delay aleatório para anti-spam (3-5 segundos)
 */
async function antiSpamDelay(): Promise<void> {
  const delay = 3000 + Math.random() * 2000; // 3-5 segundos
  console.log(`[WHATSAPP] ⏳ Anti-spam delay: ${(delay / 1000).toFixed(1)}s`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Verifica e aplica rate limiting (máximo 10 mensagens por minuto)
 */
async function checkRateLimit(): Promise<void> {
  messageCount++;
  console.log(`[WHATSAPP] 📊 Mensagens enviadas neste minuto: ${messageCount}/10`);
  
  if (messageCount >= 10) {
    console.log(`[WHATSAPP] ⚠️ Rate limit atingido! Aguardando 60 segundos...`);
    await new Promise(resolve => setTimeout(resolve, 60000));
    messageCount = 0;
    lastResetTime = Date.now();
  }
}

export async function sendWhatsApp({ to, message }: WhatsAppOptions): Promise<WhatsAppResult> {
  try {
    console.log(`[WHATSAPP] ========================================`);
    console.log(`[WHATSAPP] Tentando enviar mensagem para: ${to}`);
    console.log(`[WHATSAPP] ========================================`);
    
    // Verificar conexão primeiro - verificar socket local e arquivo compartilhado
    let sock = socket;
    
    // Se não tiver socket local, verificar se está conectado via arquivo
    if (!sock || !sock.user) {
      const statusFromFile = getConnectionStatusFromFile();
      if (!statusFromFile.connected) {
        console.error(`[WHATSAPP] ❌ WhatsApp não está conectado!`);
        console.error(`[WHATSAPP] 💡 Execute 'npx tsx scripts/start-whatsapp-server.ts' ANTES de fazer agendamentos`);
        return {
          success: false,
          error: 'WhatsApp não está conectado. Por favor, execute: npx tsx scripts/start-whatsapp-server.ts',
        };
      }
      
      // Se está conectado via arquivo mas não tem socket local,
      // significa que está em processo separado - usar API HTTP
      console.log(`[WHATSAPP] ⚠️ Socket local não encontrado, mas status indica conectado`);
      console.log(`[WHATSAPP] 💡 WhatsApp está rodando em processo separado - use a API HTTP`);
      
      return {
        success: false,
        error: 'WhatsApp está conectado em outro processo. Use a API HTTP (start-whatsapp-server.ts) para enviar mensagens.',
      };
    }
    
    // Verificar se a conexão está realmente aberta
    // Segundo a documentação do Baileys, precisamos verificar o estado da conexão
    if (!sock.user) {
      console.error(`[WHATSAPP] ❌ Socket não tem usuário autenticado`);
      return {
        success: false,
        error: 'WhatsApp não está autenticado. Por favor, escaneie o QR code novamente.',
      };
    }
    
    console.log(`[WHATSAPP] ✅ Socket conectado (User: ${sock.user.id})`);

    // Normalizar número (formato correto segundo Baileys: número@s.whatsapp.net)
    // Remover todos os caracteres não numéricos, incluindo +
    let normalizedTo = to.replace(/\D/g, ''); // Remove tudo exceto números
    
    // Validar formato do número
    if (!normalizedTo || normalizedTo.length < 7 || normalizedTo.length > 15) {
      console.error(`[WHATSAPP] ❌ Número inválido: ${to} (normalizado: ${normalizedTo})`);
      console.error(`[WHATSAPP] Número deve ter entre 7 e 15 dígitos (formato internacional sem +)`);
      return {
        success: false,
        error: `Número de telefone inválido: ${to}. Use formato internacional sem + (ex: 351912345678)`,
      };
    }
    
    // Formato JID correto segundo documentação Baileys
    const jid = `${normalizedTo}@s.whatsapp.net`;
    console.log(`[WHATSAPP] Enviando para JID: ${jid}`);
    console.log(`[WHATSAPP] Mensagem: ${message.substring(0, 50)}... (${message.length} caracteres)`);

    // Verificar se o número existe no WhatsApp (opcional, mas recomendado)
    // Segundo a documentação do Baileys, podemos usar onWhatsApp se disponível
    try {
      if (typeof sock.onWhatsApp === 'function') {
        const results = await sock.onWhatsApp(jid);
        if (results && results.length > 0) {
          const [result] = results;
          if (result && result.exists) {
            console.log(`[WHATSAPP] ✅ Número confirmado no WhatsApp`);
          } else {
            console.warn(`[WHATSAPP] ⚠️ Número ${normalizedTo} pode não estar no WhatsApp`);
          }
        }
      }
    } catch (checkError) {
      console.warn(`[WHATSAPP] ⚠️ Não foi possível verificar se número está no WhatsApp:`, checkError);
      // Continuar mesmo assim - tentar enviar a mensagem
    }

    // Enviar mensagem seguindo documentação oficial do Baileys
    // sendMessage retorna uma Promise que resolve com a mensagem enviada
    console.log(`[WHATSAPP] Enviando mensagem...`);
    
    const sendPromise = sock.sendMessage(jid, { text: message });
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: Mensagem demorou mais de 15 segundos para ser enviada')), 15000)
    );
    
    const result = await Promise.race([sendPromise, timeoutPromise]);

    // Verificar resultado
    if (!result) {
      console.error(`[WHATSAPP] ❌ Resultado vazio ao enviar mensagem`);
      return {
        success: false,
        error: 'Erro ao enviar mensagem: resultado vazio',
      };
    }

    const messageId = result?.key?.id || result?.key?.remoteJid || 'N/A';
    console.log(`[WHATSAPP] ✅ Mensagem enviada com sucesso!`);
    console.log(`[WHATSAPP] Message ID: ${messageId}`);
    console.log(`[WHATSAPP] Status: ${result?.status || 'sent'}`);

    return {
      success: true,
      messageId: messageId !== 'N/A' ? messageId : undefined,
    };
  } catch (error: any) {
    console.error('[WHATSAPP] ❌ Erro ao enviar mensagem:', error);
    console.error('[WHATSAPP] Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status,
    });
    
    // Tratamento de erros específicos do Baileys
    let errorMessage = error.message || 'Erro ao enviar mensagem WhatsApp';
    
    if (error.message?.includes('not-authorized') || error.message?.includes('401')) {
      errorMessage = 'WhatsApp não está autorizado. Por favor, escaneie o QR code novamente.';
      socket = null;
      saveConnectionStatus(false);
    } else if (error.message?.includes('close') || error.message?.includes('disconnect') || error.message?.includes('Connection closed')) {
      errorMessage = 'Conexão WhatsApp perdida. Reconectando...';
      socket = null;
      saveConnectionStatus(false);
    } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      errorMessage = 'Timeout ao enviar mensagem. Tente novamente.';
    } else if (error.message?.includes('404') || error.message?.includes('not found')) {
      errorMessage = 'Número não encontrado no WhatsApp. Verifique se o número está correto.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Envia documento (PDF, etc.) via WhatsApp usando Baileys
 */
/**
 * Envia documento (PDF, etc.) via WhatsApp usando Baileys
 * Com técnicas anti-ban: delays, rate limiting, verificação de número
 */
export async function sendWhatsAppDocument({ 
  to, 
  document, 
  fileName, 
  mimetype = 'application/pdf',
  caption 
}: WhatsAppDocumentOptions): Promise<WhatsAppResult> {
  try {
    console.log(`[WHATSAPP] ========================================`);
    console.log(`[WHATSAPP] Tentando enviar documento para: ${to}`);
    console.log(`[WHATSAPP] Arquivo: ${fileName} (${(document.length / 1024).toFixed(2)} KB)`);
    console.log(`[WHATSAPP] ========================================`);
    
    // Verificar conexão
    let sock = socket;
    
    if (!sock || !sock.user) {
      const statusFromFile = getConnectionStatusFromFile();
      if (!statusFromFile.connected) {
        console.error(`[WHATSAPP] ❌ WhatsApp não está conectado!`);
        return {
          success: false,
          error: 'WhatsApp não está conectado. Por favor, execute: npx tsx scripts/start-whatsapp-server.ts',
        };
      }
      
      return {
        success: false,
        error: 'WhatsApp está conectado em outro processo. Use a API HTTP (start-whatsapp-server.ts) para enviar documentos.',
      };
    }
    
    if (!sock.user) {
      return {
        success: false,
        error: 'WhatsApp não está autenticado. Por favor, escaneie o QR code novamente.',
      };
    }
    
    console.log(`[WHATSAPP] ✅ Socket conectado (User: ${sock.user.id})`);

    // Normalizar número
    let normalizedTo = to.replace(/\D/g, '');
    
    if (!normalizedTo || normalizedTo.length < 7 || normalizedTo.length > 15) {
      return {
        success: false,
        error: `Número de telefone inválido: ${to}`,
      };
    }
    
    const jid = `${normalizedTo}@s.whatsapp.net`;
    console.log(`[WHATSAPP] Enviando documento para JID: ${jid}`);

    // Verificar se número existe no WhatsApp
    try {
      if (typeof sock.onWhatsApp === 'function') {
        const results = await sock.onWhatsApp(jid);
        if (results && results.length > 0 && !results[0].exists) {
          console.warn(`[WHATSAPP] ⚠️ Número ${normalizedTo} pode não estar no WhatsApp`);
          return {
            success: false,
            error: `Número ${normalizedTo} não existe no WhatsApp`,
          };
        } else {
          console.log(`[WHATSAPP] ✅ Número verificado no WhatsApp`);
        }
      }
    } catch (checkError) {
      console.warn(`[WHATSAPP] ⚠️ Não foi possível verificar número:`, checkError);
      // Continuar mesmo assim
    }

    // Aplicar delay anti-spam antes de enviar PDF
    await antiSpamDelay();

    // Aplicar rate limiting
    await checkRateLimit();

    // Enviar documento usando Baileys
    // O Baileys aceita Buffer diretamente no campo document
    const message: any = {
      document: document, // Buffer do PDF diretamente
      mimetype: mimetype,
      fileName: fileName,
    };

    // Adicionar caption se fornecido
    if (caption) {
      message.caption = caption;
    }

    console.log(`[WHATSAPP] Enviando documento...`);
    console.log(`[WHATSAPP] Tamanho do documento: ${document.length} bytes (${(document.length / 1024).toFixed(2)} KB)`);
    console.log(`[WHATSAPP] Tipo MIME: ${mimetype}`);
    console.log(`[WHATSAPP] Nome do arquivo: ${fileName}`);
    console.log(`[WHATSAPP] Caption: ${caption ? 'Sim' : 'Não'}`);
    
    const sendPromise = sock.sendMessage(jid, message);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: Documento demorou mais de 30 segundos para ser enviado')), 30000)
    );
    
    const result = await Promise.race([sendPromise, timeoutPromise]);

    if (!result) {
      return {
        success: false,
        error: 'Erro ao enviar documento: resultado vazio',
      };
    }

    const messageId = result?.key?.id || result?.key?.remoteJid || 'N/A';
    console.log(`[WHATSAPP] ✅ Documento enviado com sucesso!`);
    console.log(`[WHATSAPP] Message ID: ${messageId}`);

    return {
      success: true,
      messageId: messageId !== 'N/A' ? messageId : undefined,
    };
  } catch (error: any) {
    console.error('[WHATSAPP] ❌ Erro ao enviar documento:', error);
    
    let errorMessage = error.message || 'Erro ao enviar documento WhatsApp';
    
    if (error.message?.includes('not-authorized') || error.message?.includes('401')) {
      errorMessage = 'WhatsApp não está autorizado. Por favor, escaneie o QR code novamente.';
      socket = null;
      saveConnectionStatus(false);
    } else if (error.message?.includes('close') || error.message?.includes('disconnect')) {
      errorMessage = 'Conexão WhatsApp perdida. Reconectando...';
      socket = null;
      saveConnectionStatus(false);
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Timeout ao enviar documento. Tente novamente.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verifica se WhatsApp está conectado
 * Verifica primeiro o socket local, depois o arquivo compartilhado
 */
export async function isWhatsAppConnected(): Promise<boolean> {
  // Primeiro verificar socket local (se estiver no mesmo processo)
  if (socket && socket.user) {
    console.log(`[WHATSAPP] ✅ Status: Conectado (User ID: ${socket.user.id})`);
    return true;
  }
  
  // Se não tiver socket local, verificar arquivo compartilhado
  // (útil quando o WhatsApp está rodando em processo separado)
  const statusFromFile = getConnectionStatusFromFile();
  if (statusFromFile.connected) {
    console.log(`[WHATSAPP] ✅ Status: Conectado (via arquivo) - Phone: ${statusFromFile.phoneNumber || 'N/A'}`);
    return true;
  }
  
  console.log(`[WHATSAPP] ❌ Status: Desconectado`);
  return false;
}

/**
 * Obtém informações detalhadas sobre a conexão WhatsApp
 * Verifica primeiro o socket local, depois o arquivo compartilhado
 */
export function getWhatsAppStatus(): {
  connected: boolean;
  userId?: string;
  phoneNumber?: string;
} {
  // Primeiro verificar socket local (se estiver no mesmo processo)
  if (socket && socket.user) {
    const phoneNumber = socket.user.id.split(':')[0];
    return {
      connected: true,
      userId: socket.user.id,
      phoneNumber,
    };
  }
  
  // Se não tiver socket local, verificar arquivo compartilhado
  // (útil quando o WhatsApp está rodando em processo separado)
  const statusFromFile = getConnectionStatusFromFile();
  return {
    connected: statusFromFile.connected,
    userId: statusFromFile.userId,
    phoneNumber: statusFromFile.phoneNumber,
  };
}

/**
 * Obtém QR code para autenticação (se disponível)
 */
export async function getQRCode(): Promise<string | null> {
  // Em produção, você pode implementar um sistema para salvar e retornar o QR code
  // Por enquanto, o QR code é exibido no terminal
  return null;
}

/**
 * Formata mensagem de confirmação para WhatsApp
 */
export function formatWhatsAppConfirmation(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}): string {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Olá ${appointment.name}! ✅\n\n` +
    `O seu agendamento foi confirmado:\n\n` +
    `📋 *${appointment.serviceName}*\n` +
    `📅 ${formattedDate}\n` +
    `🕐 ${appointment.appointmentTime}\n\n` +
    `Receberá um lembrete 24h antes do agendamento.\n\n` +
    `Obrigado!`;
}

/**
 * Formata mensagem de lembrete para WhatsApp
 */
export function formatWhatsAppReminder(appointment: {
  name: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  documentsReminder?: any;
}): string {
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let message = `Olá ${appointment.name}! 📅\n\n` +
    `*Lembrete:* Tem um agendamento amanhã:\n\n` +
    `📋 *${appointment.serviceName}*\n` +
    `📅 ${formattedDate}\n` +
    `🕐 ${appointment.appointmentTime}\n\n`;

  // Adicionar documentos se disponível
  if (appointment.documentsReminder && Array.isArray(appointment.documentsReminder)) {
    const requiredDocs = appointment.documentsReminder
      .filter((doc: any) => doc.required)
      .slice(0, 5)
      .map((doc: any) => `• ${doc.name}`)
      .join('\n');
    
    if (requiredDocs) {
      message += `📄 *Documentos necessários:*\n${requiredDocs}\n\n`;
    }
  }

  message += `Até breve!`;

  return message;
}

