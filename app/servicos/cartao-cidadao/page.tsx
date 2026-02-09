import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function CartaoCidadaoPage() {
  const steps = [
    {
      number: "1",
      title: "Verificar Elegibilidade",
      description: "Confirme se atende os requisitos para solicitar o Cartão Cidadão.",
    },
    {
      number: "2",
      title: "Reunir Documentação",
      description: "Prepare todos os documentos necessários.",
    },
    {
      number: "3",
      title: "Agendar Atendimento",
      description: "Agende atendimento presencial nos serviços competentes.",
    },
    {
      number: "4",
      title: "Apresentar Pedido",
      description: "Apresente o pedido e documentos no atendimento.",
    },
    {
      number: "5",
      title: "Receber Cartão",
      description: "Aguarde a produção e receba seu Cartão Cidadão.",
    },
  ];

  const documents = [
    "Documento de identificação válido",
    "Comprovativo de residência",
    "Fotografia recente",
    "Comprovativo de situação legal em Portugal",
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/servicos"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Serviços
          </Link>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cartão Cidadão</h1>
          <p className="text-xl text-gray-600">
            Solicitação e renovação do Cartão Cidadão português.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Cartão Cidadão</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Cartão Cidadão é o documento de identificação oficial em Portugal, que substitui 
            o antigo Bilhete de Identidade. É obrigatório para cidadãos portugueses e pode ser 
            solicitado por estrangeiros com residência permanente.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo na solicitação e renovação do Cartão Cidadão, 
            garantindo que todo o processo seja realizado corretamente.
          </p>
        </section>

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

        <section className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Documentos Necessários</h2>
          <ul className="space-y-3">
            {documents.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Funcionalidades do Cartão Cidadão</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Identificação</h3>
              <p className="text-gray-700 text-sm">
                Documento oficial de identificação em Portugal e na União Europeia.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Acesso a Serviços</h3>
              <p className="text-gray-700 text-sm">
                Necessário para acessar serviços públicos e privados.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Assinatura Digital</h3>
              <p className="text-gray-700 text-sm">
                Permite assinatura digital de documentos online.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Chip Eletrônico</h3>
              <p className="text-gray-700 text-sm">
                Armazena informações importantes de forma segura.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com o Cartão Cidadão?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato?service=cartao-cidadao"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

