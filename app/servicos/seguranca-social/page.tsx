import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function SegurancaSocialPage() {
  const steps = [
    {
      number: "1",
      title: "Reunir Documentação",
      description: "Prepare todos os documentos necessários para a inscrição.",
    },
    {
      number: "2",
      title: "Solicitar Inscrição",
      description: "Apresente o pedido de inscrição na Segurança Social.",
    },
    {
      number: "3",
      title: "Receber Número de Utente",
      description: "Aguarde a emissão do seu número de utente da Segurança Social.",
    },
    {
      number: "4",
      title: "Ativar Acesso Online",
      description: "Ative o acesso online para gerir a sua conta.",
    },
  ];

  const documents = [
    "NIF (Número de Identificação Fiscal)",
    "Passaporte ou documento de identificação",
    "Comprovativo de residência",
    "Comprovativo de situação profissional",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Segurança Social</h1>
          <p className="text-xl text-gray-600">
            Inscrição e regularização na Segurança Social portuguesa.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A inscrição na Segurança Social é obrigatória para trabalhadores em Portugal. 
            É através dela que tem direito a benefícios como subsídio de desemprego, 
            reforma, subsídio de doença, entre outros.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo na inscrição e regularização junto à Segurança Social, 
            garantindo que todos os seus direitos sejam preservados.
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
          <h2 className="text-2xl font-semibold mb-6">Benefícios da Segurança Social</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Subsídio de Desemprego</h3>
              <p className="text-gray-700 text-sm">
                Apoio financeiro durante período de desemprego.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Reforma</h3>
              <p className="text-gray-700 text-sm">
                Pensão de reforma após anos de contribuições.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Subsídio de Doença</h3>
              <p className="text-gray-700 text-sm">
                Apoio durante períodos de incapacidade temporária.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Subsídio de Maternidade</h3>
              <p className="text-gray-700 text-sm">
                Apoio durante licença de maternidade.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com a Segurança Social?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato?service=seguranca-social"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

