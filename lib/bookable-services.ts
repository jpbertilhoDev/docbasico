/**
 * Configuração centralizada de serviços com agendamento disponível
 * 
 * Este arquivo define quais serviços podem ser agendados online
 * e suas características específicas (pagamento prévio, badges, etc)
 */

export interface BookableService {
  slug: string;
  name: string;
  requiresPayment: boolean;
  paymentNote?: string;
  priority: number; // Para ordenação na interface
  badge?: string;
  category: 'empresarial' | 'documentacao' | 'outro';
}

/**
 * Lista de serviços disponíveis para agendamento online
 * 
 * IMPORTANTE: Apenas estes serviços aparecerão na página de agendamento
 */
export const BOOKABLE_SERVICES: BookableService[] = [
  {
    slug: "constituicao-empresa",
    name: "Constituição de Empresa",
    requiresPayment: true,
    paymentNote: "Pagamento prévio obrigatório antes do agendamento",
    priority: 1,
    badge: "EMPRESARIAL",
    category: 'empresarial'
  },
  {
    slug: "consultoria-empresarial",
    name: "Consultoria Empresarial",
    requiresPayment: true,
    paymentNote: "Pagamento prévio obrigatório antes do agendamento",
    priority: 2,
    badge: "EMPRESARIAL",
    category: 'empresarial'
  },
  {
    slug: "nacionalidade",
    name: "Processo de Nacionalidade",
    requiresPayment: true,
    paymentNote: "Pagamento prévio obrigatório antes do agendamento",
    priority: 3,
    badge: "PAGAMENTO PRÉVIO",
    category: 'documentacao'
  },
  {
    slug: "visto-portugal",
    name: "Visto para Portugal",
    requiresPayment: false,
    priority: 4,
    badge: "DISPONÍVEL",
    category: 'documentacao'
  },
];

/**
 * Verifica se um serviço está disponível para agendamento online
 * @param slug - Slug do serviço a verificar
 * @returns true se o serviço pode ser agendado, false caso contrário
 */
export function isServiceBookable(slug: string): boolean {
  return BOOKABLE_SERVICES.some(service => service.slug === slug);
}

/**
 * Obtém informações de um serviço agendável
 * @param slug - Slug do serviço
 * @returns Objeto BookableService ou null se não for agendável
 */
export function getBookableService(slug: string): BookableService | null {
  return BOOKABLE_SERVICES.find(service => service.slug === slug) || null;
}

/**
 * Obtém todos os serviços agendáveis ordenados por prioridade
 * @returns Array de serviços agendáveis
 */
export function getAllBookableServices(): BookableService[] {
  return [...BOOKABLE_SERVICES].sort((a, b) => a.priority - b.priority);
}

/**
 * Obtém serviços agendáveis por categoria
 * @param category - Categoria para filtrar
 * @returns Array de serviços da categoria especificada
 */
export function getBookableServicesByCategory(category: BookableService['category']): BookableService[] {
  return BOOKABLE_SERVICES.filter(service => service.category === category)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Obtém apenas serviços que requerem pagamento prévio
 * @returns Array de serviços com pagamento obrigatório
 */
export function getServicesWithPayment(): BookableService[] {
  return BOOKABLE_SERVICES.filter(service => service.requiresPayment)
    .sort((a, b) => a.priority - b.priority);
}

