import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import DocumentChecklist from "@/components/DocumentChecklist";

export default function RenovacaoResidenciaPage() {
  const steps = [
    {
      number: "1",
      title: "Verificar Documentos",
      description: "Verifique se possui todos os documentos necessários para a renovação.",
    },
    {
      number: "2",
      title: "Acessar Portal AIMA",
      description: "Acesse o portal de renovações da AIMA ou agende atendimento presencial.",
    },
    {
      number: "3",
      title: "Preencher Formulário",
      description: "Preencha o formulário de renovação com todas as informações solicitadas.",
    },
    {
      number: "4",
      title: "Enviar Documentação",
      description: "Envie todos os documentos comprovativos necessários.",
    },
    {
      number: "5",
      title: "Aguardar Aprovação",
      description: "Aguarde a análise e aprovação do seu pedido pela AIMA.",
    },
  ];

  const documents = [
    "Autorização de Residência atual",
    "Passaporte válido",
    "Comprovativo de residência",
    "Comprovativo de meios de subsistência",
    "Seguro de saúde",
    "Comprovativo de inscrição na Segurança Social (se aplicável)",
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/servicos"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Serviços
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Renovação de Residência</h1>
          <p className="text-xl text-gray-600">
            Processo completo de renovação da sua autorização de residência em Portugal.
          </p>
        </div>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A renovação da autorização de residência é um processo essencial para manter 
            sua situação legal em Portugal. É importante iniciar o processo antes do vencimento 
            da sua autorização atual para evitar problemas.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo em todo o processo, desde a verificação de documentos 
            até o acompanhamento do pedido junto à AIMA (Agência para a Integração, Migrações e Asilo).
          </p>
        </section>

        {/* Process Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Processo Passo a Passo</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist Interativo de Documentos */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Preparação para Consulta</h2>
            <p className="text-gray-600">
              Use o checklist abaixo para se preparar e garantir que tem todos os documentos necessários.
            </p>
          </div>
          <DocumentChecklist serviceSlug="renovacao-residencia" />
          <div className="mt-4 text-center">
            <Link
              href="/agendar?servico=renovacao-residencia"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Agendar Consulta
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Por Que Escolher Nosso Serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Orientação Completa</h3>
              <p className="text-gray-700 text-sm">
                Acompanhamento em todas as etapas do processo.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Verificação de Documentos</h3>
              <p className="text-gray-700 text-sm">
                Revisão completa antes do envio para evitar rejeições.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Atualizações Regulares</h3>
              <p className="text-gray-700 text-sm">
                Mantemo-lo informado sobre o estado do seu pedido.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Suporte Personalizado</h3>
              <p className="text-gray-700 text-sm">
                Atendimento dedicado para suas necessidades específicas.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Pronto para Renovar sua Residência?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada para o seu caso.
          </p>
          <Link
            href="/contato?service=renovacao-residencia"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

