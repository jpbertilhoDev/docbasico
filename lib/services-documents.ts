// Mapeamento de documentos necessários por serviço
export interface ServiceDocument {
  name: string;
  required: boolean;
  description?: string;
}

export interface ServiceInfo {
  slug: string;
  name: string;
  documents: ServiceDocument[];
  estimatedDuration: number; // em minutos
  preparationNotes: string[];
}

export const servicesDocuments: Record<string, ServiceInfo> = {
  "renovacao-residencia": {
    slug: "renovacao-residencia",
    name: "Renovação de Residência",
    documents: [
      { name: "Autorização de Residência atual", required: true },
      { name: "Passaporte válido", required: true },
      { name: "Comprovativo de meios de subsistência", required: true },
      { name: "Comprovativo de alojamento", required: true },
      { name: "Seguro de saúde", required: true },
      { name: "Comprovativo de inscrição na Segurança Social", required: false },
    ],
    estimatedDuration: 60,
    preparationNotes: [
      "Certifique-se de que todos os documentos estão atualizados",
      "Verifique a validade do passaporte (mínimo 6 meses)",
      "Prepare comprovativos dos últimos 3 meses",
    ],
  },
  "visto-portugal": {
    slug: "visto-portugal",
    name: "Visto para Portugal",
    documents: [
      { name: "Passaporte válido", required: true },
      { name: "Formulário de pedido de visto", required: true },
      { name: "Fotografias", required: true },
      { name: "Comprovativo de meios de subsistência", required: true },
      { name: "Seguro de viagem", required: true },
      { name: "Carta de convite ou contrato de trabalho", required: false },
    ],
    estimatedDuration: 45,
    preparationNotes: [
      "Verifique o tipo de visto necessário para a sua situação",
      "Prepare documentos traduzidos e autenticados se necessário",
    ],
  },
  "nacionalidade": {
    slug: "nacionalidade",
    name: "Processo de Nacionalidade",
    documents: [
      { name: "Certidão de nascimento", required: true },
      { name: "Certidão de casamento (se aplicável)", required: false },
      { name: "Comprovativo de residência em Portugal", required: true },
      { name: "Comprovativo de conhecimento da língua portuguesa", required: true },
      { name: "Certidão de registo criminal", required: true },
      { name: "Comprovativo de meios de subsistência", required: true },
    ],
    estimatedDuration: 90,
    preparationNotes: [
      "Processo pode levar vários meses",
      "Certifique-se de ter todos os documentos traduzidos e autenticados",
      "Verifique os requisitos de tempo de residência",
    ],
  },
  "nif": {
    slug: "nif",
    name: "NIF (Número de Identificação Fiscal)",
    documents: [
      { name: "Passaporte ou Cartão de Residência", required: true },
      { name: "Comprovativo de morada", required: true },
      { name: "Formulário preenchido", required: true },
    ],
    estimatedDuration: 30,
    preparationNotes: [
      "Processo relativamente rápido",
      "Pode ser feito online ou presencialmente",
    ],
  },
  "seguranca-social": {
    slug: "seguranca-social",
    name: "Segurança Social",
    documents: [
      { name: "NIF", required: true },
      { name: "Passaporte ou Cartão de Residência", required: true },
      { name: "Comprovativo de morada", required: true },
      { name: "Comprovativo de atividade profissional", required: false },
    ],
    estimatedDuration: 45,
    preparationNotes: [
      "Necessário ter NIF antes de se inscrever",
      "Prepare comprovativos de trabalho se aplicável",
    ],
  },
  "cartao-cidadao": {
    slug: "cartao-cidadao",
    name: "Cartão Cidadão",
    documents: [
      { name: "Certidão de nascimento", required: true },
      { name: "Fotografias", required: true },
      { name: "Comprovativo de morada", required: true },
      { name: "NIF", required: true },
    ],
    estimatedDuration: 60,
    preparationNotes: [
      "Agende com antecedência",
      "Leve fotografias recentes",
    ],
  },
  "reconhecimento-faturas": {
    slug: "reconhecimento-faturas",
    name: "Reconhecimento de Faturas",
    documents: [
      { name: "Faturas originais", required: true },
      { name: "NIF", required: true },
      { name: "Comprovativo de pagamento", required: false },
    ],
    estimatedDuration: 45,
    preparationNotes: [
      "Organize as faturas por categoria",
      "Verifique se as faturas têm NIF",
      "Prepare lista de despesas dedutíveis",
    ],
  },
  "agregado-familiar": {
    slug: "agregado-familiar",
    name: "Agregado Familiar",
    documents: [
      { name: "Certidão de casamento ou união de facto", required: true },
      { name: "NIF de todos os membros", required: true },
      { name: "Comprovativo de morada comum", required: true },
      { name: "IRS do ano anterior", required: false },
    ],
    estimatedDuration: 60,
    preparationNotes: [
      "Verifique os benefícios fiscais disponíveis",
      "Prepare documentos de todos os membros do agregado",
    ],
  },
  "envio-irs": {
    slug: "envio-irs",
    name: "Envio do IRS",
    documents: [
      { name: "IRS do ano anterior", required: false },
      { name: "Faturas do ano fiscal", required: true },
      { name: "Comprovativos de rendimentos", required: true },
      { name: "NIF", required: true },
      { name: "Cartão Cidadão", required: true },
    ],
    estimatedDuration: 90,
    preparationNotes: [
      "Organize todas as faturas do ano",
      "Verifique prazos de entrega",
      "Prepare comprovativos de todas as despesas dedutíveis",
    ],
  },
  "constituicao-empresa": {
    slug: "constituicao-empresa",
    name: "Constituição de Empresa",
    documents: [
      { name: "NIF", required: true },
      { name: "Cartão Cidadão", required: true },
      { name: "Comprovativo de morada", required: true },
      { name: "Nome da empresa (proposta)", required: true },
      { name: "Atividade da empresa", required: true },
      { name: "Capital social", required: true },
    ],
    estimatedDuration: 120,
    preparationNotes: [
      "Pense no nome e atividade da empresa",
      "Defina o capital social inicial",
      "Escolha o tipo de empresa (Lda, Unipessoal, etc.)",
    ],
  },
  "consultoria-empresarial": {
    slug: "consultoria-empresarial",
    name: "Consultoria Empresarial",
    documents: [
      { name: "Documentos da empresa", required: false },
      { name: "Últimas declarações fiscais", required: false },
      { name: "Contratos relevantes", required: false },
    ],
    estimatedDuration: 60,
    preparationNotes: [
      "Prepare uma lista de questões específicas",
      "Traga documentos relevantes da empresa",
      "Pense nos objetivos da consultoria",
    ],
  },
};

export function getServiceInfo(slug: string): ServiceInfo | null {
  return servicesDocuments[slug] || null;
}

export function getDocumentsForService(slug: string): ServiceDocument[] {
  const service = getServiceInfo(slug);
  return service?.documents || [];
}

export function getPreparationNotes(slug: string): string[] {
  const service = getServiceInfo(slug);
  return service?.preparationNotes || [];
}

