import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function NIFPage() {
  const steps = [
    {
      number: "1",
      title: "Definir Tipo de NIF",
      description: "Identifique se precisa de NIF de residente ou não residente.",
    },
    {
      number: "2",
      title: "Reunir Documentação",
      description: "Prepare os documentos necessários conforme seu caso.",
    },
    {
      number: "3",
      title: "Solicitar NIF",
      description: "Apresente o pedido presencialmente ou online nos serviços das Finanças.",
    },
    {
      number: "4",
      title: "Receber NIF",
      description: "Aguarde a emissão do seu Número de Identificação Fiscal.",
    },
  ];

  const documents = [
    "Passaporte ou documento de identificação válido",
    "Comprovativo de residência (para residentes)",
    "Formulário preenchido",
    "Fotografia recente",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">NIF (Número de Identificação Fiscal)</h1>
          <p className="text-xl text-gray-600">
            Solicitação de NIF para residentes e não residentes em Portugal.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o NIF</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Número de Identificação Fiscal (NIF) é obrigatório para realizar diversas atividades 
            em Portugal, como abrir conta bancária, assinar contratos, trabalhar, comprar imóveis 
            ou veículos, entre outras.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo na solicitação do NIF, seja residente ou não residente 
            em Portugal.
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
          <h2 className="text-2xl font-semibold mb-6">Tipos de NIF</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">NIF de Residente</h3>
              <p className="text-gray-700 text-sm mb-4">
                Para pessoas que residem em Portugal há mais de 183 dias por ano.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Obrigatório para trabalhar</li>
                <li>• Necessário para abrir conta bancária</li>
                <li>• Requerido para contratos</li>
              </ul>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">NIF de Não Residente</h3>
              <p className="text-gray-700 text-sm mb-4">
                Para pessoas que não residem em Portugal mas precisam do NIF.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Para comprar imóveis</li>
                <li>• Para investimentos</li>
                <li>• Para atividades comerciais</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com seu NIF?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato?service=nif"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

