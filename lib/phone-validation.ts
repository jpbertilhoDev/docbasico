/**
 * Valida e normaliza números de telefone internacionais
 * Aceita números de qualquer país com ou sem código de país
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Normaliza número de telefone removendo caracteres especiais
 * Mantém apenas números e o sinal + no início (se presente)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove espaços, hífens, parênteses, pontos, etc.
  // Mantém apenas números e + no início
  let normalized = phone.trim();
  
  // Se começar com +, manter
  const hasPlus = normalized.startsWith('+');
  if (hasPlus) {
    normalized = '+' + normalized.slice(1).replace(/\D/g, '');
  } else {
    // Remover todos os caracteres não numéricos
    normalized = normalized.replace(/\D/g, '');
  }
  
  return normalized;
}

/**
 * Valida número de telefone internacional
 * Aceita números de 7 a 15 dígitos (padrão E.164)
 * Pode começar com + (código de país) ou não
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      normalized: '',
      error: 'O telefone é obrigatório',
    };
  }

  const normalized = normalizePhoneNumber(phone);
  
  // Contar apenas dígitos (sem o +)
  const digitsOnly = normalized.replace(/\D/g, '');
  const digitCount = digitsOnly.length;

  // Validação básica: deve ter entre 7 e 15 dígitos (padrão E.164)
  if (digitCount < 7) {
    return {
      isValid: false,
      normalized,
      error: 'O telefone deve ter pelo menos 7 dígitos',
    };
  }

  if (digitCount > 15) {
    return {
      isValid: false,
      normalized,
      error: 'O telefone não pode ter mais de 15 dígitos',
    };
  }

  // Validar formato básico (deve conter apenas números e opcionalmente + no início)
  const phoneRegex = /^(\+)?[0-9]{7,15}$/;
  if (!phoneRegex.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'Formato de telefone inválido. Use apenas números e opcionalmente + no início',
    };
  }

  return {
    isValid: true,
    normalized,
  };
}

/**
 * Formata número de telefone para exibição (opcional)
 * Exemplos:
 * +351912345678 -> +351 912 345 678
 * 912345678 -> 912 345 678
 */
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  
  if (!normalized) return '';
  
  const hasPlus = normalized.startsWith('+');
  const digitsOnly = normalized.replace(/\D/g, '');
  
  // Se tiver código de país (começa com +), formatar diferente
  if (hasPlus && digitsOnly.length > 7) {
    // Assumir que os primeiros 1-3 dígitos são código de país
    // Formatar o restante
    if (digitsOnly.length <= 10) {
      // Formato curto: +XXX XXX XXX
      const countryCode = digitsOnly.slice(0, digitsOnly.length - 7);
      const number = digitsOnly.slice(countryCode.length);
      return `+${countryCode} ${number.slice(0, 3)} ${number.slice(3)}`;
    } else {
      // Formato longo: +XXX XXX XXX XXX
      const countryCode = digitsOnly.slice(0, digitsOnly.length - 9);
      const number = digitsOnly.slice(countryCode.length);
      return `+${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
  }
  
  // Formato simples sem código de país
  if (digitsOnly.length === 9) {
    // Formato português: XXX XXX XXX
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
  }
  
  // Formato genérico
  return normalized;
}

