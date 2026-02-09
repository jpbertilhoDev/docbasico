import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function VistoPortugalPage() {
  const steps = [
    {
      number: "1",
      title: "Definir Tipo de Visto",
      description: "Identifique o tipo de visto adequado ao seu caso (trabalho, estudo, investimento, etc.).",
    },
    {
      number: "2",
      title: "Reunir Documentação",
      description: "Prepare todos os documentos necessários conforme o tipo de visto solicitado.",
    },
    {
      number: "3",
      title: "Solicitar Visto",
      description: "Apresente o pedido no consulado português no seu país de origem ou online.",
    },
    {
      number: "4",
      title: "Aguardar Aprovação",
      description: "Aguarde a análise e aprovação do seu pedido de visto.",
    },
    {
      number: "5",
      title: "Entrar em Portugal",
      description: "Com o visto aprovado, entre em Portugal e inicie o processo de residência.",
    },
  ];

  const documents = [
    "Passaporte válido",
    "Formulário de pedido de visto preenchido",
    "Fotografias recentes",
    "Comprovativo de meios de subsistência",
    "Seguro de saúde",
    "Comprovativo de alojamento",
    "Documentos específicos conforme tipo de visto",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Visto para Portugal</h1>
          <p className="text-xl text-gray-600">
            Orientações e suporte completo para obtenção de visto de trabalho e residência em Portugal.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O visto é o primeiro passo para quem deseja viver e trabalhar em Portugal. 
            Existem diferentes tipos de visto conforme sua situação: trabalho, estudo, investimento, 
            reagrupamento familiar, entre outros.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos orientação completa em todo o processo, desde a escolha do tipo de visto 
            adequado até a entrada em Portugal e início do processo de residência.
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
          <p className="mt-6 text-sm text-gray-600">
            * A lista de documentos pode variar conforme o tipo de visto. 
            Entre em contacto para uma avaliação personalizada.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Tipos de Visto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Visto de Trabalho</h3>
              <p className="text-gray-700 text-sm">
                Para profissionais com contrato de trabalho em Portugal.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Visto de Estudo</h3>
              <p className="text-gray-700 text-sm">
                Para estudantes matriculados em instituições portuguesas.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Visto de Investimento</h3>
              <p className="text-gray-700 text-sm">
                Para investidores que desejam residir em Portugal.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Reagrupamento Familiar</h3>
              <p className="text-gray-700 text-sm">
                Para familiares de residentes legais em Portugal.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com seu Visto?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada para o seu caso.
          </p>
          <Link
            href="/contato?service=visto-portugal"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

